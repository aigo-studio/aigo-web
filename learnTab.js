/**
 * 4번째 탭: AI와 오래 잘 지내기
 * 수업 내용은 메인(lessons.js)이 내려 준 state.lessons를 그린다.
 * 화면은 lessonId · agentId · dryRun만 넘기고, 파일 경로는 메인이 정한다.
 */
window.LearnTab = (() => {
  const root = document.getElementById('habits-lessons');
  const USAGE_MAX = 20;
  const USAGE_DEFAULT = 5;

  let getStateFn = null;
  let setRunningFn = null;
  let getDryRunFn = null;
  let built = false;

  const agentNotes = []; // { valueEl, texts }
  const actionButtons = [];

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function highlighted(tag, className, text) {
    const node = make(tag, className);
    node.innerHTML = window.GlossaryHelper.highlightText(text);
    return node;
  }

  async function copyText(btn, text, idleLabel) {
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = '복사 완료!';
    } catch {
      btn.textContent = '복사 실패';
    }
    setTimeout(() => {
      btn.textContent = idleLabel;
    }, 1500);
  }

  // --- 블록 그리기 ---

  function renderTextBlock(block) {
    const wrap = make('div', 'lesson-text');
    block.lines.forEach((line) => wrap.appendChild(highlighted('p', '', line)));
    return wrap;
  }

  function renderHeadingBlock(block) {
    return highlighted('h3', 'lesson-subheading', block.text);
  }

  function renderAgentNoteBlock(block) {
    const wrap = make('div', 'lesson-agent-note');
    wrap.appendChild(make('span', 'lesson-agent-label', block.label));
    const valueEl = make('p', 'lesson-agent-text');
    wrap.appendChild(valueEl);
    agentNotes.push({ valueEl, texts: block.texts });
    return wrap;
  }

  function renderChecklistBlock(block) {
    const box = make('fieldset', 'lesson-checklist');
    box.appendChild(make('legend', 'lesson-box-title', block.title));
    block.items.forEach((item) => {
      const label = make('label', 'lesson-check-item');
      const input = document.createElement('input');
      input.type = 'checkbox';
      label.appendChild(input);
      label.appendChild(make('span', '', item));
      box.appendChild(label);
    });
    return box;
  }

  function renderCardsBlock(block) {
    const wrap = make('div', 'lesson-cards-wrap');
    wrap.appendChild(make('div', 'lesson-box-title', block.title));
    const grid = make('div', 'lesson-cards');
    block.items.forEach((item, i) => {
      const card = make('div', 'lesson-habit-card');
      card.appendChild(make('div', 'lesson-habit-num', String(i + 1)));
      card.appendChild(make('div', 'lesson-habit-title', item.title));
      card.appendChild(highlighted('p', 'lesson-habit-text', item.text));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function renderCalloutBlock(block) {
    const box = make('div', 'lesson-callout');
    box.appendChild(make('div', 'lesson-box-title', block.title));
    const list = make('ul', 'lesson-callout-list');
    block.items.forEach((item) => list.appendChild(highlighted('li', '', item)));
    box.appendChild(list);
    return box;
  }

  function renderPromptsBlock(block) {
    const grid = make('div', 'prompt-grid');
    block.items.forEach((item) => {
      const card = make('div', 'prompt-card');
      card.appendChild(make('div', 'prompt-category', item.category));
      card.appendChild(make('p', 'prompt-text', item.text));
      const btn = make('button', 'prompt-copy-btn', '질문 복사하기');
      btn.type = 'button';
      btn.addEventListener('click', () => copyText(btn, item.text, '질문 복사하기'));
      card.appendChild(btn);
      grid.appendChild(card);
    });
    return grid;
  }

  function renderUsageBlock(block) {
    const box = make('div', 'usage-widget');
    box.appendChild(make('p', 'usage-note', block.note));

    const control = make('label', 'usage-control');
    control.appendChild(make('span', '', '주고받은 횟수: '));
    const countEl = make('strong', 'usage-count');
    control.appendChild(countEl);
    control.appendChild(make('span', '', '번'));
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '1';
    slider.max = String(USAGE_MAX);
    slider.value = String(USAGE_DEFAULT);
    slider.className = 'usage-slider';
    slider.setAttribute('aria-label', '주고받은 횟수');
    control.appendChild(slider);
    box.appendChild(control);

    const columns = make('div', 'usage-columns');
    columns.setAttribute('aria-hidden', 'true');
    const columnEls = [];
    for (let i = 1; i <= USAGE_MAX; i += 1) {
      const col = make('div', 'usage-column');
      col.style.height = `${(i / USAGE_MAX) * 100}%`;
      columns.appendChild(col);
      columnEls.push(col);
    }
    box.appendChild(columns);
    box.appendChild(make('p', 'usage-axis', '← 첫 질문 · · · 나중 질문 → (막대 하나 = 질문 한 번에 읽는 양)'));

    function makeRow(labelText) {
      const row = make('div', 'usage-row');
      row.appendChild(make('span', 'usage-row-label', labelText));
      const track = make('div', 'usage-track');
      const fill = make('div', 'usage-fill');
      track.appendChild(fill);
      row.appendChild(track);
      const value = make('span', 'usage-row-value');
      row.appendChild(value);
      box.appendChild(row);
      return { fill, value };
    }

    const perTurn = makeRow('이번 질문에 읽는 양');
    const total = makeRow('지금까지 쓴 양 (모두 더한 값)');
    total.fill.classList.add('usage-fill-total');
    const explain = make('p', 'usage-explain');
    box.appendChild(explain);

    const maxTotal = (USAGE_MAX * (USAGE_MAX + 1)) / 2;
    function update() {
      const n = Number(slider.value);
      const sum = (n * (n + 1)) / 2;
      countEl.textContent = String(n);
      columnEls.forEach((col, i) => col.classList.toggle('active', i < n));
      perTurn.fill.style.width = `${(n / USAGE_MAX) * 100}%`;
      perTurn.value.textContent = `${n}칸`;
      total.fill.style.width = `${(sum / maxTotal) * 100}%`;
      total.value.textContent = `${sum}칸`;
      const parts = n <= 4 ? Array.from({ length: n }, (_, i) => i + 1).join(' + ') : `1 + 2 + … + ${n}`;
      explain.textContent = `${n}번 주고받으면 ${parts} = ${sum}칸을 씁니다. 대화를 새로 열면 다시 1칸부터 시작해요.`;
    }
    slider.addEventListener('input', update);
    update();
    return box;
  }

  const BLOCK_RENDERERS = {
    text: renderTextBlock,
    heading: renderHeadingBlock,
    agentNote: renderAgentNoteBlock,
    checklist: renderChecklistBlock,
    cards: renderCardsBlock,
    callout: renderCalloutBlock,
    prompts: renderPromptsBlock,
    usage: renderUsageBlock,
  };

  // --- 버튼 · 결과 상자 ---

  function setBox(boxEl, type, message, log) {
    boxEl.className = `feedback-box ${type}`;
    boxEl.querySelector('.feedback-message').textContent = message;
    const details = boxEl.querySelector('.log-details');
    const pre = boxEl.querySelector('.log-output');
    if (log) {
      pre.textContent = log;
      details.classList.remove('hidden');
    } else {
      details.classList.add('hidden');
    }
  }

  function renderAction(action) {
    // 웹 첫걸음 페이지(지시서 08)에는 guideAPI가 없다: 실행 버튼 대신 안내 한 줄
    if (!window.guideAPI) {
      return make('p', 'lesson-app-only', '이 실습은 에이아이고 앱에서 할 수 있어요.');
    }
    const wrap = make('div', 'lesson-action');
    const row = make('div', 'action-row');
    const runBtn = make('button', 'btn btn-primary', action.label);
    runBtn.type = 'button';
    const openBtn = make('button', 'btn btn-secondary', action.openLabel);
    openBtn.type = 'button';
    row.appendChild(runBtn);
    row.appendChild(openBtn);
    wrap.appendChild(row);

    const box = make('div', 'feedback-box hidden');
    box.setAttribute('role', 'status');
    box.appendChild(make('p', 'feedback-message'));
    const details = make('details', 'log-details hidden');
    details.appendChild(make('summary', '', '자세한 기록 보기'));
    details.appendChild(make('pre', 'log-output'));
    box.appendChild(details);
    wrap.appendChild(box);

    runBtn.addEventListener('click', async () => {
      const state = getStateFn();
      if (state.running) return;
      if (window.WorkspaceGate && !window.WorkspaceGate.check(row)) return;
      setRunningFn(true);
      render();
      setBox(box, 'info', '확인하고 있습니다...', '');
      let res;
      try {
        res = await window.guideAPI.runLesson(action.lessonId, {
          agentId: state.selectedAgentId,
          dryRun: getDryRunFn(),
        });
      } catch (err) {
        res = { ok: false, message: '요청을 처리하지 못했습니다.', log: String(err) };
      }
      setRunningFn(false);
      setBox(box, res.ok ? 'success' : 'error', res.message, res.log);
      render();
    });

    openBtn.addEventListener('click', async () => {
      const res = await window.guideAPI.openLessonFile(action.lessonId);
      setBox(box, res.ok ? 'success' : 'error', res.message, '');
    });

    actionButtons.push(runBtn, openBtn);
    return wrap;
  }

  function renderLesson(lesson) {
    const section = make('section', 'recipe-detail lesson-card');
    section.id = `lesson-${lesson.id}`;

    const header = make('div', 'step-header');
    header.appendChild(make('span', 'phase-pill', `수업 ${lesson.order}`));
    header.appendChild(highlighted('span', 'step-pill', lesson.tag));
    section.appendChild(header);
    section.appendChild(make('h2', 'integration-title', lesson.title));

    lesson.blocks.forEach((block) => {
      const renderer = BLOCK_RENDERERS[block.type];
      if (renderer) section.appendChild(renderer(block));
    });

    if (lesson.action) section.appendChild(renderAction(lesson.action));
    return section;
  }

  function build(lessons) {
    root.innerHTML = '';
    agentNotes.length = 0;
    actionButtons.length = 0;
    lessons
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((lesson) => root.appendChild(renderLesson(lesson)));
    built = true;
  }

  function render() {
    const state = getStateFn ? getStateFn() : {};
    if (!built && Array.isArray(state.lessons) && state.lessons.length > 0) {
      build(state.lessons);
    }
    const agentId = state.selectedAgentId;
    agentNotes.forEach(({ valueEl, texts }) => {
      const text = (texts && (texts[agentId] || texts.gemini)) || '';
      valueEl.innerHTML = window.GlossaryHelper.highlightText(text);
    });
    actionButtons.forEach((btn) => {
      btn.disabled = Boolean(state.running);
    });
  }

  function init({ getState, setRunning, getDryRun }) {
    getStateFn = getState;
    setRunningFn = setRunning;
    getDryRunFn = getDryRun;
  }

  return { init, render };
})();
