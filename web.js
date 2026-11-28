/**
 * 에이아이고 첫걸음 안내 웹 페이지 (지시서 08, 'B안 · 차분한 안내서' 화면)
 * content.json(빌드 때 엔진에서 뽑은 글)을 읽어 그린다. Node · Electron API는 쓰지 않는다.
 * 진행(고른 비서 · 글씨 크기 · 완료 표시)은 이 브라우저의 localStorage에만 둔다. 서버로 보내는 것은 없다.
 */
(() => {
  const STORE = {
    agent: 'aigo-web.agent',
    font: 'aigo-web.font',
    done: 'aigo-web.done', // { [agentId]: [stepId, ...] }
  };
  const MOBILE_QUERY = window.matchMedia('(max-width: 600px)');
  const esc = (t) => window.GlossaryHelper.escapeHtml(t == null ? '' : String(t));
  const hl = (t) => window.GlossaryHelper.highlightText(t || '');

  const state = {
    content: null,
    agentId: null,
    stepIndex: 0,
    tab: 'setup',
    nextCardClosed: false,
  };

  const $ = (id) => document.getElementById(id);
  const el = {
    agentPicker: $('agent-picker'),
    ollamaNote: $('ollama-note'),
    setupView: $('setup-view'),
    fontSelector: $('font-size-selector'),
    tabs: $('main-tabs'),
    views: {
      setup: $('setup-view'),
      habits: $('habits-view'),
      glossary: $('glossary-view'),
      app: $('app-view'),
    },
    stepList: $('step-list'),
    nextCard: $('next-card'),
    nextCardCloseBtn: $('next-card-close-btn'),
    stepCard: $('step-card'),
    mobileNotice: $('mobile-notice'),
    copyUrlBtn: $('copy-url-btn'),
    stepNumber: $('step-number'),
    stepTitle: $('step-title'),
    stepSummary: $('step-summary'),
    stepDetails: $('step-details'),
    stepDetailsText: $('step-details-text'),
    stepNotice: $('step-notice'),
    prompts: $('prompt-examples-wrap'),
    linkAddress: $('link-address'),
    linkAddressHost: $('link-address-host'),
    linkAddressOwner: $('link-address-owner'),
    linkBtn: $('external-link-btn'),
    reopenBtn: $('reopen-link-btn'),
    doneBtn: $('done-btn'),
    glossaryPageSearch: $('glossary-page-search'),
    glossaryPageList: $('glossary-page-list'),
    drawer: $('glossary-drawer'),
    drawerClose: $('glossary-close-btn'),
    drawerSelCard: $('glossary-selection-card'),
    drawerSelBody: $('glossary-selection-body'),
    drawerSearch: $('glossary-search-input'),
    drawerList: $('glossary-list'),
    tooltip: $('glossary-tooltip'),
    tooltipTitle: $('glossary-tooltip-title'),
    tooltipMeaning: $('glossary-tooltip-meaning'),
    tooltipAnalogy: $('glossary-tooltip-analogy'),
    appVersion: $('app-version'),
  };

  // --- 저장 (localStorage가 막힌 브라우저에서도 화면은 돈다) ---
  function readStore(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* 저장이 안 되면 이번 방문 동안만 기억한다 */
    }
  }

  async function copyText(btn, text, idleLabel, doneLabel = '복사 완료!') {
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = doneLabel;
    } catch {
      btn.textContent = '복사 실패 — 길게 눌러 직접 복사해 주세요';
    }
    setTimeout(() => {
      btn.textContent = idleLabel;
    }, 1800);
  }

  // --- 비서 · 단계 ---
  function agents() {
    return state.content.agents;
  }

  function agentById(id) {
    return agents().find((a) => a.id === id) || null;
  }

  function steps() {
    return (state.agentId && state.content.steps[state.agentId]) || [];
  }

  function doneMap() {
    return readStore(STORE.done, {}) || {};
  }

  function isDone(stepId) {
    const list = doneMap()[state.agentId] || [];
    return list.includes(stepId);
  }

  function setDone(stepId, done) {
    const map = doneMap();
    const list = new Set(map[state.agentId] || []);
    if (done) list.add(stepId);
    else list.delete(stepId);
    map[state.agentId] = Array.from(list);
    writeStore(STORE.done, map);
  }

  function allDone() {
    const list = steps();
    return list.length > 0 && list.every((s) => isDone(s.id));
  }

  // --- 글씨 크기 ---
  function applyFontScale(scale) {
    document.body.classList.remove('font-large', 'font-xlarge');
    if (scale === 'large') document.body.classList.add('font-large');
    if (scale === 'xlarge') document.body.classList.add('font-xlarge');
    el.fontSelector.querySelectorAll('.font-btn').forEach((btn) => {
      const on = btn.getAttribute('data-scale') === scale;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    writeStore(STORE.font, scale);
  }

  function currentFontScale() {
    return readStore(STORE.font, 'normal') || 'normal';
  }

  // --- 탭 ---
  function showTab(tab) {
    state.tab = tab;
    Object.entries(el.views).forEach(([name, view]) => view.classList.toggle('hidden', name !== tab));
    el.tabs.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    if (tab === 'habits') window.LearnTab.render();
    if (tab === 'app') trackEvent('web/get-app');
    hideTooltip();
    window.scrollTo(0, 0);
  }

  // --- 첫걸음 화면 ---
  const OWNER_KO = { Google: '구글' };

  function renderAgentPicker() {
    el.agentPicker.innerHTML = '';
    agents().forEach((agent) => {
      const w = agent.welcome || {};
      const on = agent.id === state.agentId;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `g-pick-item${on ? ' selected' : ''}${agent.webReady ? '' : ' app-only'}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
      btn.innerHTML = `
        <span class="g-radio" aria-hidden="true"></span>
        <span class="g-pick-text">
          <span class="g-pick-name">${esc(agent.webName || agent.name)}</span>
          <span class="g-pick-need">${esc(agent.webReady ? w.needs : '앱에서만 할 수 있어요')}</span>
        </span>
      `;
      btn.addEventListener('click', () => {
        if (!agent.webReady) {
          el.ollamaNote.classList.remove('hidden');
          return;
        }
        el.ollamaNote.classList.add('hidden');
        if (agent.id !== state.agentId) selectAgent(agent.id);
      });
      el.agentPicker.appendChild(btn);
    });
  }

  function renderStepList() {
    el.stepList.innerHTML = '';
    steps().forEach((step, idx) => {
      const done = isDone(step.id);
      const active = idx === state.stepIndex;
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `g-step${active ? ' active' : ''}${done ? ' done' : ''}`;
      if (active) btn.setAttribute('aria-current', 'step');
      const name = String(step.shortTitle || step.title).replace(/^\d+\.\s*/, '');
      btn.innerHTML = `
        <span class="g-step-num" aria-hidden="true">${done ? '✓' : idx + 1}</span>
        <span class="g-step-text">
          <span class="g-step-name">${esc(name)}</span>
          <span class="g-step-state">${active ? '지금 하는 단계' : done ? '했어요' : '아직'}</span>
        </span>
      `;
      btn.addEventListener('click', () => goToStep(idx));
      li.appendChild(btn);
      el.stepList.appendChild(li);
    });
  }

  function renderPrompts(examples) {
    el.prompts.innerHTML = '';
    if (!examples || examples.length === 0) {
      el.prompts.classList.add('hidden');
      return;
    }
    examples.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'g-prompt';
      const text = document.createElement('div');
      text.className = 'g-prompt-text';
      const cat = document.createElement('span');
      cat.className = 'g-prompt-cat';
      cat.textContent = item.category;
      const body = document.createElement('span');
      body.textContent = item.text;
      text.append(cat, body);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'g-btn g-btn-outline g-copy';
      btn.textContent = '복사';
      btn.addEventListener('click', async () => {
        await copyText(btn, item.text, '복사', '복사됐어요');
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1800);
      });
      li.append(text, btn);
      el.prompts.appendChild(li);
    });
    el.prompts.classList.remove('hidden');
  }

  function renderStep() {
    const list = steps();
    const step = list[state.stepIndex];
    if (!step) return;
    const web = step.web || {};
    const done = isDone(step.id);

    // 앱 설치 단계만 컴퓨터가 필요하다 (웹에서 열기 · 첫 질문은 휴대폰에서도 된다)
    el.mobileNotice.classList.toggle('hidden', !(web.gotoTab === 'app' && MOBILE_QUERY.matches));

    el.stepNumber.textContent = `${state.stepIndex + 1}단계 / ${list.length}단계${web.optional ? ' · 원하실 때만' : ''}`;
    el.stepTitle.textContent = step.title;
    el.stepSummary.innerHTML = hl(web.summary || step.summary);

    const details = web.details !== undefined ? web.details : step.details;
    el.stepDetails.classList.toggle('hidden', !details);
    el.stepDetailsText.innerHTML = hl(details);
    el.stepDetails.open = false;

    const notice = web.notice !== undefined ? web.notice : '';
    el.stepNotice.innerHTML = (web.noticeTitle ? `<strong>${esc(web.noticeTitle)}</strong>` : '') + hl(notice);
    el.stepNotice.classList.toggle('warn', Boolean(web.noticeTitle));
    el.stepNotice.classList.toggle('hidden', !notice);

    renderPrompts(step.promptExamples);

    const url = step.externalLink && step.externalLink.url;
    const gotoTab = web.gotoTab && el.views[web.gotoTab] ? web.gotoTab : '';
    delete el.linkBtn.dataset.goto;
    delete el.linkBtn.dataset.track;
    if (web.buttonLabel && gotoTab) {
      // 이 페이지 안의 다른 탭으로 보낸다 (새 창 아님)
      el.linkBtn.href = `#${gotoTab}`;
      el.linkBtn.removeAttribute('target');
      el.linkBtn.dataset.goto = gotoTab;
      el.linkBtn.textContent = web.buttonLabel;
      el.linkBtn.classList.remove('hidden');
    } else if (web.buttonLabel && url && url.startsWith('https://')) {
      // 버튼 이름에 갈 주소를 그대로 적는다 (어디로 가는지 알고 누르게)
      el.linkBtn.href = url;
      el.linkBtn.target = '_blank';
      el.linkBtn.dataset.track = `web/open/${state.agentId}`;
      el.linkBtn.textContent = `${new URL(url).hostname} 새 창으로 열기`;
      el.linkBtn.classList.remove('hidden');
    } else {
      el.linkBtn.removeAttribute('href');
      el.linkBtn.classList.add('hidden');
    }

    const showAddress = !gotoTab && web.buttonLabel && url && url.startsWith('https://');
    el.linkAddress.classList.toggle('hidden', !showAddress);
    if (showAddress) {
      const agent = agentById(state.agentId);
      const owner = agent ? OWNER_KO[agent.provider] || agent.provider : '';
      el.linkAddressHost.textContent = new URL(url).hostname;
      el.linkAddressOwner.textContent = owner ? `(${owner} 공식)` : '';
    }

    if (web.reopenLabel && url && url.startsWith('https://')) {
      el.reopenBtn.href = url;
      el.reopenBtn.textContent = web.reopenLabel;
      el.reopenBtn.classList.remove('hidden');
    } else {
      el.reopenBtn.removeAttribute('href');
      el.reopenBtn.classList.add('hidden');
    }

    const doneLabel = web.doneLabel || '했어요';
    const isLast = state.stepIndex >= list.length - 1;
    el.doneBtn.textContent = done ? `✓ ${doneLabel} (완료 표시 지우기)` : isLast ? doneLabel : `${doneLabel}, 다음 단계로`;
    el.doneBtn.classList.toggle('is-done', done);
    // 링크 버튼이 없는 단계(첫 질문)는 완료 버튼이 주 버튼
    const primary = !done && el.linkBtn.classList.contains('hidden');
    el.doneBtn.classList.toggle('g-btn-primary', primary);
    el.doneBtn.classList.toggle('g-btn-outline', !primary);
  }

  function renderNextCard() {
    el.nextCard.classList.toggle('hidden', !(allDone() && !state.nextCardClosed));
  }

  function renderSetup() {
    renderAgentPicker();
    renderStepList();
    renderStep();
    renderNextCard();
  }

  function goToStep(idx) {
    const list = steps();
    state.stepIndex = Math.max(0, Math.min(idx, list.length - 1));
    renderSetup();
    el.stepCard.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function onDoneClick() {
    const list = steps();
    const step = list[state.stepIndex];
    if (!step) return;
    const nowDone = !isDone(step.id);
    setDone(step.id, nowDone);
    if (nowDone) {
      trackEvent(`web/step/${state.stepIndex + 1}-done`);
      if (allDone()) {
        state.nextCardClosed = false;
        renderSetup();
        el.nextCard.scrollIntoView({ block: 'start', behavior: 'smooth' });
        return;
      }
      if (state.stepIndex < list.length - 1) {
        goToStep(state.stepIndex + 1);
        return;
      }
    }
    renderSetup();
  }

  // --- 사용 통계 (지시서 09): GoatCounter 픽셀 하나만. 외부 스크립트는 쓰지 않는다 ---
  function statsEndpoint() {
    const ep = state.content && state.content.stats && state.content.stats.endpoint;
    if (typeof ep !== 'string' || !/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/.test(ep)) return '';
    const host = window.location.hostname;
    if (window.location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1') return '';
    return ep;
  }

  function sendStat(params) {
    const ep = statsEndpoint();
    if (!ep) return;
    try {
      const q = new URLSearchParams({ ...params, rnd: String(Math.random()).slice(2, 10) });
      new Image().src = `${ep}?${q}`;
    } catch {
      // 조용히 넘어간다
    }
  }

  function trackEvent(label) {
    if (!/^[a-z0-9./-]+$/.test(label)) return;
    sendStat({ p: label, t: label, e: 'true' });
  }

  function trackPageView() {
    const params = { p: '/', t: document.title };
    if (document.referrer) params.r = document.referrer;
    sendStat(params);
  }

  function selectAgent(agentId, { track = true } = {}) {
    if (track) trackEvent(`web/agent/${agentId}`);
    state.agentId = agentId;
    writeStore(STORE.agent, agentId);
    const list = steps();
    const firstOpen = list.findIndex((s) => !isDone(s.id));
    state.stepIndex = firstOpen === -1 ? list.length - 1 : firstOpen;
    state.nextCardClosed = false;
    renderSetup();
    window.LearnTab.render();
  }

  // --- 용어사전 (호버 말풍선 · 클릭하면 서랍 · 검색). 드래그 풀이는 없다 ---
  function glossaryItemHtml(entry) {
    return `<div class="glossary-item-title">${esc(entry.easyTitle)}</div><p class="glossary-item-meaning">${esc(entry.meaning)}</p><p class="glossary-item-analogy">쉬운 비유: ${esc(entry.analogy)}</p>`;
  }

  function askButton(word) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'prompt-copy-btn';
    btn.textContent = 'AI 비서에게 물어볼 질문 복사';
    btn.addEventListener('click', () =>
      copyText(
        btn,
        `"${word}"이(가) 무슨 뜻인지 어른도 이해하기 쉽게 일상 비유를 들어 2줄로 설명해 줘.`,
        'AI 비서에게 물어볼 질문 복사',
        '질문 복사 완료!'
      )
    );
    return btn;
  }

  function renderGlossaryList(container, query, focusedKey) {
    const items = window.GlossaryHelper.search(query);
    container.innerHTML = '';
    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'glossary-item-analogy';
      empty.textContent = '사전에 일치하는 단어가 없습니다. 다른 단어로 검색해 보세요.';
      container.appendChild(empty);
      const word = String(query || '').trim();
      if (word.length >= 2 && word.length <= 40) container.appendChild(askButton(word));
      return;
    }
    items.forEach((entry) => {
      const div = document.createElement('div');
      div.className = `glossary-item${entry.key === focusedKey ? ' focused' : ''}`;
      div.innerHTML = glossaryItemHtml(entry);
      container.appendChild(div);
    });
  }

  function openDrawerFor(key) {
    const entry = window.GlossaryHelper.getByKey(key);
    if (!entry) return;
    el.drawerSelBody.innerHTML = glossaryItemHtml(entry);
    el.drawerSelCard.classList.remove('hidden');
    el.drawerSearch.value = '';
    renderGlossaryList(el.drawerList, '', entry.key);
    el.drawer.classList.remove('hidden');
    const focused = el.drawerList.querySelector('.focused');
    if (focused) focused.scrollIntoView({ block: 'nearest' });
  }

  function showTooltip(target) {
    const entry = window.GlossaryHelper.getByKey(target.getAttribute('data-term-key'));
    if (!entry) return;
    el.tooltipTitle.textContent = entry.easyTitle;
    el.tooltipMeaning.textContent = entry.meaning;
    el.tooltipAnalogy.textContent = `쉬운 비유: ${entry.analogy}`;
    el.tooltip.classList.remove('hidden');
    const rect = target.getBoundingClientRect();
    const tip = el.tooltip.getBoundingClientRect();
    let top = rect.bottom + 10;
    if (top + tip.height > window.innerHeight - 12) top = Math.max(12, rect.top - tip.height - 10);
    let left = rect.left;
    if (left + tip.width > window.innerWidth - 12) left = Math.max(12, window.innerWidth - tip.width - 12);
    el.tooltip.style.top = `${top}px`;
    el.tooltip.style.left = `${left}px`;
  }

  function hideTooltip() {
    el.tooltip.classList.add('hidden');
  }

  function initGlossary() {
    renderGlossaryList(el.glossaryPageList, '');
    renderGlossaryList(el.drawerList, '');
    el.glossaryPageSearch.addEventListener('input', (e) => renderGlossaryList(el.glossaryPageList, e.target.value));
    el.drawerSearch.addEventListener('input', (e) => renderGlossaryList(el.drawerList, e.target.value));
    el.drawerClose.addEventListener('click', () => el.drawer.classList.add('hidden'));

    // 마우스가 있는 화면에서만 말풍선 (휴대폰은 누르면 서랍)
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (canHover) {
      document.addEventListener('mouseover', (e) => {
        const term = e.target.closest('.glossary-term');
        if (term) showTooltip(term);
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.glossary-term')) hideTooltip();
      });
    }
    document.addEventListener('click', (e) => {
      const term = e.target.closest('.glossary-term');
      if (!term) return;
      hideTooltip();
      openDrawerFor(term.getAttribute('data-term-key'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        el.drawer.classList.add('hidden');
        hideTooltip();
      }
      if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('glossary-term')) {
        openDrawerFor(e.target.getAttribute('data-term-key'));
      }
    });
  }

  // --- 앱 받기: 이 컴퓨터에 맞는 설치 파일을 바로 받는다 ---
  function detectComputer() {
    const ua = navigator.userAgent || '';
    const uaPlatform = (navigator.userAgentData && navigator.userAgentData.platform) || '';
    const touch = navigator.maxTouchPoints > 1;
    if (/Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && touch)) return 'phone';
    if (/Windows/i.test(uaPlatform) || /Windows/i.test(ua)) return 'windows';
    if (/macOS/i.test(uaPlatform) || /Macintosh/i.test(ua)) return 'mac';
    return 'other';
  }

  async function detectMacChip() {
    // Chrome · Edge만 알려 준다. Safari는 알 수 없어서 버튼을 둘 다 보여 준다.
    try {
      if (!navigator.userAgentData || !navigator.userAgentData.getHighEntropyValues) return '';
      const v = await navigator.userAgentData.getHighEntropyValues(['architecture']);
      if (v.architecture === 'arm') return 'mac-apple';
      if (v.architecture === 'x86') return 'mac-intel';
    } catch {
      // 모르면 빈 칸
    }
    return '';
  }

  async function renderDownloads() {
    const files = state.content.app.downloads || {};
    const pageUrl = state.content.app.downloadPageUrl;
    const buttons = Array.from(document.querySelectorAll('[data-dl]'));
    buttons.forEach((btn) => {
      const kind = btn.getAttribute('data-dl');
      const url = typeof files[kind] === 'string' && files[kind].startsWith('https://') ? files[kind] : pageUrl;
      btn.href = url;
      if (url === pageUrl) btn.target = '_blank';
      btn.addEventListener('click', () => trackEvent(`web/download/${kind}`));
    });

    const computer = detectComputer();
    const chip = computer === 'mac' ? await detectMacChip() : '';
    const picks = computer === 'windows' ? ['windows'] : computer === 'mac' ? (chip ? [chip] : ['mac-apple', 'mac-intel']) : [];
    const order = [...picks, ...['windows', 'mac-apple', 'mac-intel'].filter((k) => !picks.includes(k))];
    buttons.forEach((btn) => {
      const kind = btn.getAttribute('data-dl');
      const picked = picks.includes(kind);
      btn.style.order = String(order.indexOf(kind));
      btn.classList.toggle('btn-primary', picked);
      btn.classList.toggle('btn-secondary', !picked);
    });

    const hints = {
      windows: '이 컴퓨터는 <strong>Windows</strong>예요. 파란 버튼을 누르세요.',
      'mac-apple': '이 컴퓨터는 <strong>요즘 Mac(Apple 칩)</strong>이에요. 파란 버튼을 누르세요.',
      'mac-intel': '이 컴퓨터는 <strong>예전 Mac(인텔 칩)</strong>이에요. 파란 버튼을 누르세요.',
      mac: '이 컴퓨터는 <strong>Mac</strong>이에요. 칩 종류에 맞는 버튼을 누르세요. 2021년 무렵 이후에 산 Mac이면 대부분 Apple 칩이에요.',
      phone: '휴대폰에는 깔 수 없어요. 이 주소를 <strong>컴퓨터</strong>에서 열어 주세요.',
      other: '내 컴퓨터에 맞는 버튼을 누르세요.',
    };
    $('download-hint').innerHTML = hints[chip || computer] || hints.other;
    $('mac-chip-help').classList.toggle('hidden', computer !== 'mac' || Boolean(chip));
    // 이 컴퓨터의 여는 법을 먼저 보인다
    const guides = $('guide-mac').parentElement;
    if (computer === 'windows') guides.insertBefore($('guide-windows'), $('guide-mac'));
  }

  // --- AI 웹 화면은 안내 창 옆에 따로 새 창으로 띄운다 (탭이 아니라 창이라 Alt+Tab으로 오갈 수 있다) ---
  function openAiWindow(e, url) {
    if (!url || !url.startsWith('https://')) return;
    if (MOBILE_QUERY.matches || detectComputer() === 'phone') return; // 휴대폰은 보통 링크(새 탭)로 둔다
    const sw = window.screen.availWidth || 1280;
    const sh = window.screen.availHeight || 800;
    const width = Math.min(sw, Math.max(480, Math.round(sw * 0.45)));
    const left = (window.screen.availLeft || 0) + sw - width;
    const top = window.screen.availTop || 0;
    const w = window.open(url, '_blank', `popup=yes,width=${width},height=${sh},left=${left},top=${top}`);
    if (!w) return; // 창이 막혔으면 보통 링크(새 탭)로 연다
    e.preventDefault();
    try {
      w.opener = null;
    } catch {
      // 다른 사이트 창이면 못 바꿀 수 있다
    }
  }

  // --- 시작 ---
  function bindEvents() {
    el.tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (btn) showTab(btn.getAttribute('data-tab'));
    });
    el.fontSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('.font-btn');
      if (btn) applyFontScale(btn.getAttribute('data-scale') || 'normal');
    });
    el.doneBtn.addEventListener('click', onDoneClick);
    el.linkBtn.addEventListener('click', (e) => {
      const goto = el.linkBtn.dataset.goto;
      if (goto) {
        e.preventDefault();
        showTab(goto);
        return;
      }
      const label = el.linkBtn.dataset.track;
      if (label) trackEvent(label);
      openAiWindow(e, el.linkBtn.href);
    });
    el.reopenBtn.addEventListener('click', (e) => {
      trackEvent(`web/reopen/${state.agentId}`);
      openAiWindow(e, el.reopenBtn.href);
    });
    el.nextCardCloseBtn.addEventListener('click', () => {
      state.nextCardClosed = true;
      renderNextCard();
    });
    el.setupView.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-goto]');
      if (btn) showTab(btn.getAttribute('data-goto'));
    });
    el.copyUrlBtn.addEventListener('click', () => copyText(el.copyUrlBtn, window.location.href, '주소 복사', '주소 복사 완료! 컴퓨터로 보내 주세요'));
    MOBILE_QUERY.addEventListener('change', renderStep);
  }

  function hideBoot() {
    const box = $('boot-loading');
    if (!box) return;
    box.classList.add('done');
    setTimeout(() => box.remove(), 300);
  }

  function showBootError(err) {
    const box = $('boot-loading');
    const msg = $('boot-message');
    if (box) box.classList.add('failed');
    if (msg) msg.textContent = '페이지를 불러오지 못했어요. 잠시 뒤 새로고침해 주세요.';
    console.error(err);
  }

  async function boot() {
    const res = await fetch('./content.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`content.json ${res.status}`);
    state.content = await res.json();

    const appUrl = state.content.app.downloadPageUrl;
    document.querySelectorAll('.web-app-link').forEach((a) => {
      if (appUrl && appUrl.startsWith('https://')) a.href = appUrl;
      else a.classList.add('hidden');
    });
    el.appVersion.textContent = `지금 버전: v${state.content.app.version}`;

    trackPageView();
    renderDownloads();

    applyFontScale(currentFontScale());
    bindEvents();
    initGlossary();

    window.LearnTab.init({
      getState: () => ({
        lessons: state.content.lessons,
        selectedAgentId: state.agentId || 'gemini',
        running: false,
      }),
      setRunning: () => {},
      getDryRun: () => true,
    });

    // 처음 오신 분은 추천 비서(Gemini)로 시작한다. 위에서 언제든 바꿀 수 있다
    const saved = readStore(STORE.agent, null);
    const savedAgent = saved && agentById(saved);
    const rec = agents().find((a) => a.webReady && a.welcome && a.welcome.recommended) || agents().find((a) => a.webReady);
    selectAgent(savedAgent && savedAgent.webReady ? saved : rec.id, { track: false });
    hideBoot();
  }

  boot().catch(showBootError);
})();
