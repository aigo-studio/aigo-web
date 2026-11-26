/**
 * 에이아이고 첫걸음 웹 페이지 (지시서 08)
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
    agentSummary: $('agent-summary-text'),
    changeAgentBtn: $('change-agent-btn'),
    fontSelector: $('font-size-selector'),
    tabs: $('main-tabs'),
    views: {
      setup: $('setup-view'),
      habits: $('habits-view'),
      glossary: $('glossary-view'),
      app: $('app-view'),
    },
    stepList: $('step-list'),
    progressCount: $('progress-count'),
    progressFill: $('progress-fill'),
    nextCard: $('next-card'),
    nextCardOpenBtn: $('next-card-open-btn'),
    nextCardCloseBtn: $('next-card-close-btn'),
    stepCard: $('step-card'),
    mobileNotice: $('mobile-notice'),
    copyUrlBtn: $('copy-url-btn'),
    stepNumber: $('step-number'),
    statusBadge: $('step-status-badge'),
    stepTitle: $('step-title'),
    stepSummary: $('step-summary'),
    stepDetails: $('step-details'),
    stepDetailsText: $('step-details-text'),
    stepNotice: $('step-notice'),
    prompts: $('prompt-examples-wrap'),
    linkBtn: $('external-link-btn'),
    doneBtn: $('done-btn'),
    prevBtn: $('prev-btn'),
    nextBtn: $('next-btn'),
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
    welcome: {
      view: $('welcome-view'),
      progress: $('welcome-progress'),
      body: $('welcome-body'),
      prevBtn: $('welcome-prev-btn'),
      nextBtn: $('welcome-next-btn'),
      closeBtn: $('welcome-close-btn'),
    },
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
      btn.classList.toggle('active', btn.getAttribute('data-scale') === scale);
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
    hideTooltip();
    window.scrollTo(0, 0);
  }

  // --- 1부 화면 ---
  function renderAgentBar() {
    const agent = agentById(state.agentId);
    el.agentSummary.textContent = agent ? `${agent.name} (${agent.guiAppName})` : '아직 고르지 않았어요';
  }

  function renderSidebar() {
    el.stepList.innerHTML = '';
    const list = steps();
    list.forEach((step, idx) => {
      const done = isDone(step.id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `step-item${idx === state.stepIndex ? ' active' : ''}${done ? ' done' : ''}`;
      btn.title = step.title;
      btn.innerHTML = `
        <span class="step-item-name">${esc(step.shortTitle)}</span>
        <span class="step-dot${done ? ' done' : ''}">${done ? '완료' : '대기'}</span>
      `;
      btn.addEventListener('click', () => goToStep(idx));
      el.stepList.appendChild(btn);
    });

    const doneCount = list.filter((s) => isDone(s.id)).length;
    el.progressCount.textContent = `${doneCount} / ${list.length} 완료`;
    el.progressFill.style.width = list.length ? `${(doneCount / list.length) * 100}%` : '0%';
    el.nextCardOpenBtn.classList.toggle('hidden', !allDone());
  }

  function renderPrompts(examples) {
    el.prompts.innerHTML = '';
    if (!examples || examples.length === 0) {
      el.prompts.classList.add('hidden');
      return;
    }
    examples.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'prompt-card';
      const cat = document.createElement('div');
      cat.className = 'prompt-category';
      cat.textContent = item.category;
      const text = document.createElement('p');
      text.className = 'prompt-text';
      text.textContent = item.text;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'prompt-copy-btn';
      btn.textContent = '질문 복사하기';
      btn.addEventListener('click', () => copyText(btn, item.text, '질문 복사하기'));
      card.append(cat, text, btn);
      el.prompts.appendChild(card);
    });
    el.prompts.classList.remove('hidden');
  }

  function renderStep() {
    const list = steps();
    const step = list[state.stepIndex];
    if (!step) return;
    const web = step.web || {};
    const done = isDone(step.id);

    el.mobileNotice.classList.toggle('hidden', !(state.stepIndex === 0 && MOBILE_QUERY.matches));

    el.stepNumber.textContent = `${state.stepIndex + 1}단계 / ${list.length}단계`;
    el.statusBadge.textContent = done ? '완료됨' : '아직 안 함';
    el.statusBadge.className = `status-badge${done ? ' done' : ''}`;
    el.stepTitle.textContent = step.title;
    el.stepSummary.innerHTML = hl(web.summary || step.summary);

    const details = web.details !== undefined ? web.details : step.details;
    el.stepDetails.classList.toggle('hidden', !details);
    el.stepDetailsText.innerHTML = hl(details);
    el.stepDetails.open = false;

    const notice = web.notice !== undefined ? web.notice : '';
    el.stepNotice.innerHTML = hl(notice);
    el.stepNotice.classList.toggle('hidden', !notice);

    renderPrompts(step.promptExamples);

    const url = step.externalLink && step.externalLink.url;
    if (web.buttonLabel && url && url.startsWith('https://')) {
      el.linkBtn.href = url;
      el.linkBtn.textContent = web.buttonLabel;
      el.linkBtn.classList.remove('hidden');
    } else {
      el.linkBtn.removeAttribute('href');
      el.linkBtn.classList.add('hidden');
    }

    const doneLabel = web.doneLabel || '했어요';
    el.doneBtn.textContent = done ? `✓ ${doneLabel} (완료 표시 지우기)` : `${doneLabel} (완료 표시)`;
    el.doneBtn.classList.toggle('is-done', done);
    // 링크 버튼이 없는 단계(로그인 · 첫 대화)는 완료 버튼이 주 버튼
    el.doneBtn.classList.toggle('btn-primary', !done && el.linkBtn.classList.contains('hidden'));
    el.doneBtn.classList.toggle('btn-secondary', done || !el.linkBtn.classList.contains('hidden'));

    el.prevBtn.disabled = state.stepIndex === 0;
    el.nextBtn.disabled = state.stepIndex >= list.length - 1;
  }

  function renderNextCard() {
    el.nextCard.classList.toggle('hidden', !(allDone() && !state.nextCardClosed));
  }

  function renderSetup() {
    renderAgentBar();
    renderSidebar();
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

  // --- 처음 화면: 환영 → 비서 고르기 ---
  const Welcome = (() => {
    let page = 'hello';
    let choice = null;
    let ollamaNote = false;

    function close() {
      el.welcome.view.classList.add('hidden');
      document.body.classList.remove('welcome-open');
    }

    function card({ name, desc, needs, tag, tagClass, selected, onPick }) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `welcome-card${selected ? ' selected' : ''}`;
      btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
      btn.innerHTML = `
        ${tag ? `<span class="${tagClass}">${esc(tag)}</span>` : ''}
        <span class="welcome-card-name">${esc(name)}</span>
        <span class="welcome-card-desc">${esc(desc)}</span>
        ${needs ? `<span class="welcome-card-needs"><strong>필요한 것:</strong> ${esc(needs)}</span>` : ''}
      `;
      btn.addEventListener('click', onPick);
      return btn;
    }

    function renderHello() {
      el.welcome.body.innerHTML = `
        <img class="web-welcome-logo" src="./assets/icon.png" alt="" aria-hidden="true" />
        <h1 id="welcome-title" class="welcome-title">에이아이고 첫걸음</h1>
        <p class="welcome-text">설치 프로그램 없이, 이 페이지만 보고 AI 비서와 첫 대화까지 해 봐요.</p>
        <p class="welcome-text">글씨가 작으면 아래에서 크게 바꿔 주세요.</p>
      `;
      const group = document.createElement('div');
      group.className = 'welcome-font-group';
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', '글씨 크기');
      const current = currentFontScale();
      [
        ['normal', '보통'],
        ['large', '크게'],
        ['xlarge', '아주 크게'],
      ].forEach(([id, label]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `welcome-font-btn${id === current ? ' selected' : ''}`;
        btn.setAttribute('aria-pressed', id === current ? 'true' : 'false');
        btn.textContent = label;
        btn.addEventListener('click', () => {
          applyFontScale(id);
          render();
        });
        group.appendChild(btn);
      });
      el.welcome.body.appendChild(group);
    }

    function renderAgent() {
      el.welcome.body.innerHTML = `
        <h1 id="welcome-title" class="welcome-title">어떤 AI 비서와 시작할까요?</h1>
        <p class="welcome-text">평소 쓰시는 계정이 있는 쪽을 고르시면 편해요. 나중에 바꿀 수 있어요.</p>
      `;
      const grid = document.createElement('div');
      grid.className = 'welcome-grid';
      agents().forEach((agent) => {
        const w = agent.welcome || {};
        const tag = !agent.webReady ? '앱이 필요해요' : w.recommended ? '처음이시면 추천' : '';
        grid.appendChild(
          card({
            name: agent.name,
            desc: w.desc,
            needs: w.needs,
            tag,
            tagClass: agent.webReady ? 'welcome-rec' : 'welcome-rec web-tag-app',
            selected: agent.id === choice,
            onPick: () => {
              if (!agent.webReady) {
                ollamaNote = true;
                choice = null;
              } else {
                ollamaNote = false;
                choice = agent.id;
              }
              render();
            },
          })
        );
      });
      el.welcome.body.appendChild(grid);

      if (ollamaNote) {
        const note = document.createElement('div');
        note.className = 'welcome-dryrun-note web-ollama-note';
        note.innerHTML = `
          <p>로컬 Ollama는 AI 모델을 내려받을 때 까만 터미널 창이 필요해서, 이 웹 페이지로는 도와드릴 수 없어요.
          에이아이고 앱을 받으시면 버튼 하나로 해 드려요.</p>
        `;
        const link = document.createElement('a');
        link.className = 'btn btn-secondary';
        link.href = state.content.app.downloadPageUrl;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = '에이아이고 앱 받으러 가기';
        note.appendChild(link);
        el.welcome.body.appendChild(note);
      }

      const unsure = document.createElement('button');
      unsure.type = 'button';
      unsure.className = 'welcome-unsure';
      unsure.textContent = '잘 모르겠어요 — 추천으로 할게요';
      unsure.addEventListener('click', () => {
        const rec = agents().find((a) => a.webReady && a.welcome && a.welcome.recommended);
        choice = (rec || agents().find((a) => a.webReady)).id;
        finish();
      });
      el.welcome.body.appendChild(unsure);
    }

    function render() {
      el.welcome.progress.textContent = page === 'hello' ? '1 / 2' : '2 / 2';
      el.welcome.prevBtn.classList.toggle('hidden', page === 'hello');
      el.welcome.nextBtn.textContent = page === 'hello' ? '다음' : '이 비서로 시작하기';
      el.welcome.nextBtn.disabled = page === 'agent' && !choice;
      el.welcome.closeBtn.classList.toggle('hidden', !state.agentId);
      if (page === 'hello') renderHello();
      else renderAgent();
    }

    function finish() {
      close();
      selectAgent(choice);
      showTab('setup');
    }

    function open(startAt) {
      page = startAt;
      choice = state.agentId;
      ollamaNote = false;
      el.welcome.view.classList.remove('hidden');
      document.body.classList.add('welcome-open');
      render();
      el.welcome.view.scrollTop = 0;
    }

    el.welcome.prevBtn.addEventListener('click', () => {
      page = 'hello';
      render();
    });
    el.welcome.nextBtn.addEventListener('click', () => {
      if (page === 'hello') {
        page = 'agent';
        render();
        return;
      }
      if (choice) finish();
    });
    el.welcome.closeBtn.addEventListener('click', close);

    return { open };
  })();

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
    el.changeAgentBtn.addEventListener('click', () => Welcome.open('agent'));
    el.doneBtn.addEventListener('click', onDoneClick);
    el.prevBtn.addEventListener('click', () => goToStep(state.stepIndex - 1));
    el.nextBtn.addEventListener('click', () => goToStep(state.stepIndex + 1));
    el.nextCardCloseBtn.addEventListener('click', () => {
      state.nextCardClosed = true;
      renderNextCard();
    });
    el.nextCardOpenBtn.addEventListener('click', () => {
      state.nextCardClosed = false;
      renderNextCard();
      el.nextCard.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    el.nextCard.addEventListener('click', (e) => {
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
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.href === state.content.app.downloadPageUrl) trackEvent('web/get-app');
    });

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

    const saved = readStore(STORE.agent, null);
    const savedAgent = saved && agentById(saved);
    if (savedAgent && savedAgent.webReady) {
      selectAgent(saved, { track: false });
      hideBoot();
    } else {
      renderAgentBar();
      hideBoot();
      Welcome.open('hello');
    }
  }

  boot().catch(showBootError);
})();
