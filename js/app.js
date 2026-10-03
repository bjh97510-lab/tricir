'use strict';

/* =========================================================
   설정
   - GAS_URL: Google Apps Script 웹앱 배포 URL (비워 두면 이 기기에만 저장)
   - IMG: Artigraphy로 만든 PNG로 바꾸려면 경로만 수정 (예: 'assets/acorn.png')
   ========================================================= */
const CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/AKfycbxn-HjrvJr45oHxhshg2MdQE_CmKVCgjzma-VDgfEILJOCl4pXh1bQIwGJRZ74pk1uZ6A/exec',
  ACORN_GOAL: 10,
  QUIZ_BASIC: 20,      // 한 번에 낼 하 · 중하 문항 수
  QUIZ_ADVANCED: 10,   // 한 번에 낼 중상 문항 수
  IMG: {
    acorn: 'assets/acorn.svg',
    stamp: 'assets/stamp.svg',
  },
};

const INSCRIBED_CONCEPTS = ['circle-central', 'circle-inscribed', 'circle-semicircle', 'circle-arc'];

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const fmtTime = (sec) => (sec >= 60 ? `${Math.floor(sec / 60)}분 ${sec % 60}초` : `${sec}초`);

/* =========================================================
   상태 & 저장
   ========================================================= */
const LAST_ID_KEY = 'tricir:lastId';
const LAST_SCHOOL_KEY = 'tricir:lastSchool';
const PENDING_KEY = 'tricir:pending';
// 학교가 다르면 같은 학번도 다른 학생 → 학교 + 학번으로 저장
const storeKey = (school, id) => `tricir:student:${school}:${id}`;
const legacyKey = (id) => `tricir:student:${id}`; // 학교 이름을 넣기 전 기록

/** 학교 이름 정리: 띄어쓰기 · 특수문자 제거 ("숲속 중학교" = "숲속중학교") */
const normalizeSchool = (s) => String(s).replace(/[<>"'`\\]/g, '').replace(/\s+/g, '').slice(0, 30);

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* 저장 불가 환경 */ }
}

function pickProgress(src = {}) {
  const n = (v) => Math.max(0, Number(v) || 0);
  const c = src.counters || {};
  return {
    acornCount: n(src.acornCount),
    stampCount: n(src.stampCount),
    totalCorrect: n(src.totalCorrect),
    badges: Array.isArray(src.badges) ? src.badges.filter((id) => BADGES.some((b) => b.id === id)) : [],
    counters: { specialStreak: n(c.specialStreak), tangentStreak: n(c.tangentStreak), inscribedTotal: n(c.inscribedTotal) },
    best: { trig: src.best?.trig ?? null, circle: src.best?.circle ?? null },
    done: { trig: !!src.done?.trig, circle: !!src.done?.circle },
  };
}
const progressValue = (p) => p.stampCount * CONFIG.ACORN_GOAL + p.acornCount;

const state = { school: '', studentId: null, topic: 'trig', ...pickProgress() };

function save() {
  writeJSON(storeKey(state.school, state.studentId), pickProgress(state));
}

/* =========================================================
   Google Apps Script 연동
   ========================================================= */
async function fetchRemoteProgress(school, id) {
  if (!CONFIG.GAS_URL) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const query = `studentId=${encodeURIComponent(id)}&school=${encodeURIComponent(school)}`;
    const res = await fetch(`${CONFIG.GAS_URL}?${query}`, { signal: ctrl.signal });
    const data = await res.json();
    if (!data.ok || !data.found) return null;
    return { ...data, badges: String(data.badges || '').split(',').filter(Boolean) };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function postToSheet(payload) {
  // text/plain 으로 보내면 CORS 사전요청(preflight)이 생기지 않아 GAS에서 바로 받을 수 있어요.
  return fetch(CONFIG.GAS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
}

function setSync(msg) {
  $$('.sync-status').forEach((el) => { el.textContent = msg; });
}

async function sendResult(payload) {
  if (!CONFIG.GAS_URL) {
    setSync('기록이 이 기기에 저장되었어요. (구글 시트 미연결)');
    return;
  }
  setSync('선생님 구글 시트에 기록을 보내는 중…');
  const queue = [...readJSON(PENDING_KEY, []), payload];
  const failed = [];
  for (const item of queue) {
    try { await postToSheet(item); } catch { failed.push(item); }
  }
  writeJSON(PENDING_KEY, failed);
  setSync(failed.length
    ? `전송 실패 ${failed.length}건 — 인터넷이 연결되면 다음 퀴즈 때 다시 보낼게요.`
    : '선생님 구글 시트에 기록을 저장했어요! ✔');
}

/* =========================================================
   보상 UI (도토리 게이지 · 칭찬 도장)
   ========================================================= */
function buildAcornSlots() {
  const box = $('#acorn-slots');
  box.innerHTML = '';
  for (let i = 0; i < CONFIG.ACORN_GOAL; i++) {
    const img = new Image();
    img.src = CONFIG.IMG.acorn;
    img.alt = '';
    img.className = 'acorn-slot';
    box.appendChild(img);
  }
}

function paintAcorns(count) {
  $$('.acorn-slot').forEach((el, i) => el.classList.toggle('filled', i < count));
  $('#acorn-fill').style.width = `${(count / CONFIG.ACORN_GOAL) * 100}%`;
  $('#acorn-num').textContent = count;
  $('#acorn-gauge').setAttribute('aria-valuenow', count);
}

function renderRewards() {
  paintAcorns(state.acornCount);
  $('#stamp-num').textContent = state.stampCount;
  $('#stamp-slot').classList.toggle('empty', state.stampCount === 0);
  $('#home-total').textContent = state.totalCorrect;
}

function bump(el) {
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

function flyAcorn(fromEl, toEl) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fromEl || !toEl || reduce || !document.body.animate) return Promise.resolve();

  const a = fromEl.getBoundingClientRect();
  const b = toEl.getBoundingClientRect();
  const size = 46;
  const img = new Image();
  img.src = CONFIG.IMG.acorn;
  img.className = 'flying-acorn';
  img.alt = '';
  img.style.left = `${a.left + a.width / 2 - size / 2}px`;
  img.style.top = `${a.top + a.height / 2 - size / 2}px`;
  document.body.appendChild(img);

  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = img.animate([
    { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
    { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 90}px) scale(1.5) rotate(200deg)`, offset: 0.5 },
    { transform: `translate(${dx}px, ${dy}px) scale(.45) rotate(360deg)`, opacity: 0.9 },
  ], { duration: 850, easing: 'ease-in-out' });

  return anim.finished.then(() => img.remove(), () => img.remove());
}

/** 첫 시도 정답 → 도토리 +1, 10개가 모이면 칭찬 도장으로 교환 */
function addAcorn(fromEl) {
  const target = $$('.acorn-slot')[state.acornCount];

  state.acornCount += 1;
  state.totalCorrect += 1;
  let earnedStamp = false;
  if (state.acornCount >= CONFIG.ACORN_GOAL) {
    state.acornCount = 0;
    state.stampCount += 1;
    earnedStamp = true;
  }
  save();

  flyAcorn(fromEl, target).then(() => {
    bump($('#acorn-counter'));
    if (earnedStamp) {
      paintAcorns(CONFIG.ACORN_GOAL);
      setTimeout(() => {
        renderRewards();
        bump($('#stamp-counter'));
        showStampModal();
        award('first-stamp');
      }, 650);
    } else {
      renderRewards();
    }
  });
}

/* =========================================================
   칭찬 도장 모달 · 배지 알림
   ========================================================= */
let lastFocus = null;
function showStampModal() {
  lastFocus = document.activeElement;
  $('#stamp-modal-text').textContent =
    `도토리 ${CONFIG.ACORN_GOAL}개를 모아 ${state.stampCount}번째 칭찬 도장을 받았어요!`;
  const img = $('#modal-stamp-img');
  img.style.animation = 'none';
  void img.offsetWidth;
  img.style.animation = '';
  $('#stamp-modal').hidden = false;
  $('#stamp-modal-close').focus();
}
function closeStampModal() {
  $('#stamp-modal').hidden = true;
  lastFocus?.focus?.();
}

let toastTimer = 0;
function toast(html) {
  const el = $('#toast');
  el.innerHTML = html;
  el.hidden = false;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3600);
}

function award(id) {
  if (state.badges.includes(id)) return;
  const badge = BADGES.find((b) => b.id === id);
  if (!badge) return;
  state.badges.push(id);
  save();
  quiz.newBadges?.push(id);
  toast(`<span class="toast-icon">${badge.icon}</span><span><b>새 배지 획득!</b> ${badge.name}</span>`);
}

function badgeItem(b, owned) {
  return `<li class="badge ${owned ? 'owned' : 'locked'}" title="${b.desc}">
    <span class="badge-icon">${owned ? b.icon : '🔒'}</span>
    <b>${b.name}</b>
    <small>${b.desc}</small>
  </li>`;
}

/* =========================================================
   단원 선택 · 단원 홈
   ========================================================= */
function renderTopics() {
  for (const t of Object.keys(TOPICS)) {
    const best = state.best[t];
    $(`#meta-${t}`).textContent = best == null ? '아직 퀴즈 기록이 없어요' : `최고 이해도 ${best}점`;
  }
  $('#badge-list').innerHTML = BADGES.map((b) => badgeItem(b, state.badges.includes(b.id))).join('');
  $('#badge-count').textContent = `${state.badges.length} / ${BADGES.length}`;
}

function renderTopicHome() {
  const t = TOPICS[state.topic];
  $('#topic-home-title').textContent = t.name;
  $('#concept-desc').innerHTML = t.conceptDesc;
}

/* =========================================================
   퀴즈: 단계별 힌트 + 오답 유형 피드백
   ========================================================= */
const quiz = { topic: 'trig', items: [], index: 0, results: [], cur: null, startedAt: 0, timer: 0, newBadges: [] };

function startQuiz() {
  quiz.topic = state.topic;
  const bank = QUESTION_BANK[quiz.topic];
  const LEVEL_ORDER = { 하: 0, 중하: 1, 중상: 2 };
  quiz.items = [
    ...shuffle(bank.filter((q) => q.level !== '중상')).slice(0, CONFIG.QUIZ_BASIC),
    ...shuffle(bank.filter((q) => q.level === '중상')).slice(0, CONFIG.QUIZ_ADVANCED),
  ]
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]) // 쉬운 문제부터
    .map((q) => ({
      ...q,
      choices: shuffle([{ html: q.answer, correct: true }, ...q.wrong.map(([html, mis]) => ({ html, mis, correct: false }))]),
    }));
  quiz.index = 0;
  quiz.results = [];
  quiz.newBadges = [];
  quiz.startedAt = Date.now();
  clearInterval(quiz.timer);
  quiz.timer = setInterval(updateTimer, 1000);
  updateTimer();

  $('#quiz-title').textContent = `${TOPICS[quiz.topic].name} 퀴즈`;
  $('#quiz-result').hidden = true;
  $('#quiz-box').hidden = false;
  renderQuestion();
}

function updateTimer() {
  const sec = Math.floor((Date.now() - quiz.startedAt) / 1000);
  $('#quiz-timer').textContent = `⏱ ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function firstCount() {
  return quiz.results.filter((r) => r.outcome === 'first').length;
}

function renderQuestion() {
  const q = quiz.items[quiz.index];
  const total = quiz.items.length;
  quiz.cur = { attempts: 0, hints: 0, mis: [], done: false };

  $('#quiz-progress-text').textContent = `${quiz.index + 1} / ${total}`;
  $('#quiz-progress-fill').style.width = `${(quiz.index / total) * 100}%`;
  $('#quiz-score').textContent = firstCount();
  $('#q-concept').textContent = `난이도 ${q.level} · ${CONCEPTS[q.concept].name}`;
  $('#q-text').innerHTML = q.q;

  const fig = $('#q-figure');
  fig.toggleAttribute('hidden', !q.fig); // <svg>에는 .hidden 속성이 없어서 attribute로 처리
  if (q.fig) {
    fig.setAttribute('viewBox', { tri: '0 0 400 260', unit: '0 0 380 310', circle: '0 0 400 250' }[q.fig.type]);
    fig.innerHTML = figureSVG(q.fig);
  } else {
    fig.innerHTML = '';
  }

  const box = $('#q-choices');
  box.innerHTML = '';
  q.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice';
    if (c.correct) btn.dataset.correct = '1';
    btn.innerHTML = `<span class="choice-no">${i + 1}</span><span class="choice-text">${c.html}</span>`;
    btn.addEventListener('click', () => choose(btn, c));
    box.appendChild(btn);
  });

  $('#q-hints').innerHTML = '';
  updateHintButton();
  $('#q-feedback').hidden = true;
  $('#next-btn').hidden = true;
}

function updateHintButton() {
  const btn = $('#hint-btn');
  const used = quiz.cur.hints;
  btn.textContent = used >= 2 ? '💡 힌트를 모두 봤어요' : `💡 힌트 보기 (${used}/2)`;
  btn.disabled = used >= 2 || quiz.cur.done;
}

function showHint() {
  const q = quiz.items[quiz.index];
  if (quiz.cur.hints >= 2 || quiz.cur.done) return;
  const level = quiz.cur.hints;
  quiz.cur.hints += 1;
  const label = ['1단계 · 이 개념을 떠올려요', '2단계 · 수식 힌트'][level];
  const li = document.createElement('li');
  li.className = `hint hint-${level + 1}`;
  li.innerHTML = `<span class="hint-label">${label}</span><span>${q.hints[level]}</span>`;
  $('#q-hints').appendChild(li);
  updateHintButton();
}

function choose(btn, choice) {
  const cur = quiz.cur;
  if (cur.done) return;
  const q = quiz.items[quiz.index];
  const fb = $('#q-feedback');
  fb.hidden = false;

  if (choice.correct) {
    btn.classList.add('correct');
    const first = cur.attempts === 0;
    finishQuestion(first ? 'first' : 'later');
    if (first) addAcorn(btn);
    fb.className = 'feedback ok';
    fb.innerHTML = first
      ? `<strong>정답! 도토리 +1 🌰</strong><span class="explain">${q.explain}</span>`
      : `<strong>정답! 힌트를 따라 해결했어요 👏</strong><span class="explain">${q.explain}</span><small>첫 시도에 맞히면 도토리를 받을 수 있어요.</small>`;
    return;
  }

  // 오답: 정답은 숨기고, 오답 유형별 안내 + 단계별 힌트
  cur.attempts += 1;
  btn.classList.add('wrong');
  btn.disabled = true;
  if (choice.mis) cur.mis.push(choice.mis);
  const misMsg = choice.mis ? MISCONCEPTIONS[choice.mis].msg : '다시 한 번 생각해 볼까요?';

  if (cur.attempts >= 3) {
    $$('.choice').forEach((b) => { if (b.dataset.correct) b.classList.add('correct', 'reveal'); });
    finishQuestion('missed');
    fb.className = 'feedback no';
    fb.innerHTML = `<strong>3단계 · 해설</strong><span class="explain">${q.explain}</span><small>${misMsg}</small>`;
    return;
  }

  while (cur.hints < cur.attempts) showHint();   // 1번 틀리면 1단계, 2번 틀리면 2단계 힌트
  fb.className = 'feedback try';
  fb.innerHTML = `<strong>아쉬워요! 다시 도전 (${3 - cur.attempts}번 남음)</strong><span class="explain">${misMsg}</span>`;
}

function finishQuestion(outcome) {
  const q = quiz.items[quiz.index];
  const cur = quiz.cur;
  cur.done = true;
  $$('.choice').forEach((b) => { b.disabled = true; });
  updateHintButton();
  quiz.results.push({ concept: q.concept, outcome, attempts: cur.attempts, hints: cur.hints, mis: cur.mis });
  $('#quiz-score').textContent = firstCount();
  updateChallenges(q.concept, outcome === 'first');

  const next = $('#next-btn');
  next.textContent = quiz.index === quiz.items.length - 1 ? '리포트 보기 →' : '다음 문제 →';
  next.hidden = false;
  next.focus({ preventScroll: true });
}

/** 도전과제 카운터 */
function updateChallenges(concept, first) {
  const c = state.counters;
  if (concept === 'trig-special') {
    c.specialStreak = first ? c.specialStreak + 1 : 0;
    if (c.specialStreak >= 5) award('special-streak');
  }
  if (concept === 'circle-tangent') {
    c.tangentStreak = first ? c.tangentStreak + 1 : 0;
    if (c.tangentStreak >= 3) award('tangent-pro');
  }
  if (INSCRIBED_CONCEPTS.includes(concept) && first) {
    c.inscribedTotal += 1;
    if (c.inscribedTotal >= 8) award('inscribed-master');
  }
  save();
}

function nextQuestion() {
  if (quiz.index < quiz.items.length - 1) {
    quiz.index += 1;
    renderQuestion();
    $('#quiz-box').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    finishQuiz();
  }
}

/* =========================================================
   결과 리포트
   ========================================================= */
/** 문항 이해도: 첫 시도 1점(힌트 1개당 −0.15), 두 번째 0.5, 세 번째 0.25, 해설 확인 0 */
function questionScore(r) {
  if (r.outcome === 'missed') return 0;
  if (r.attempts === 0) return Math.max(0.6, 1 - 0.15 * r.hints);
  return r.attempts === 1 ? 0.5 : 0.25;
}

function analyze() {
  const total = quiz.items.length;
  const scores = quiz.results.map(questionScore);
  const understanding = Math.round((scores.reduce((a, b) => a + b, 0) / total) * 100);

  const byConcept = {};
  quiz.results.forEach((r, i) => {
    const c = (byConcept[r.concept] ||= { sum: 0, n: 0, wrong: 0 });
    c.sum += scores[i];
    c.n += 1;
    if (r.outcome !== 'first') c.wrong += 1;
  });
  const weakest = Object.entries(byConcept)
    .map(([id, c]) => ({ id, avg: c.sum / c.n, wrong: c.wrong }))
    .filter((c) => c.avg < 0.8)
    .sort((a, b) => a.avg - b.avg || b.wrong - a.wrong)[0] || null;

  const count = (list) => list.reduce((m, k) => (m[k] = (m[k] || 0) + 1, m), {});
  const wrongConcepts = count(quiz.results.filter((r) => r.outcome !== 'first').map((r) => r.concept));
  const misCount = count(quiz.results.flatMap((r) => r.mis));

  return {
    total,
    understanding,
    first: firstCount(),
    hints: quiz.results.reduce((a, r) => a + r.hints, 0),
    durationSec: Math.round((Date.now() - quiz.startedAt) / 1000),
    weakest,
    wrongConcepts,
    misCount,
  };
}

const tally = (obj, names) => Object.entries(obj)
  .sort((a, b) => b[1] - a[1])
  .map(([k, n]) => `${names[k].name}×${n}`)
  .join(', ');

function finishQuiz() {
  clearInterval(quiz.timer);
  const r = analyze();
  const topic = quiz.topic;

  // 단원 완료 · 최고 기록 · 배지
  state.best[topic] = Math.max(state.best[topic] ?? 0, r.understanding);
  state.done[topic] = true;
  save();
  if (r.first === r.total && r.total >= 10) award('perfect');
  if (r.hints === 0 && r.first >= r.total * 0.7) award('independent');
  if (state.done.trig && state.done.circle) award('explorer');

  $('#quiz-progress-fill').style.width = '100%';
  $('#quiz-box').hidden = true;
  $('#quiz-result').hidden = false;

  $('#r-ring').style.setProperty('--p', r.understanding);
  $('#r-understanding').textContent = r.understanding;
  $('#r-correct').textContent = `${r.first} / ${r.total}`;
  $('#r-time').textContent = fmtTime(r.durationSec);
  $('#r-hints').textContent = `${r.hints}회`;
  $('#r-acorns').textContent = `${r.first}개`;
  $('#result-msg').textContent =
    r.understanding >= 90 ? '완벽에 가까워요! 숲속 수학 박사님이에요 🐿️'
      : r.understanding >= 70 ? '아주 잘했어요! 약한 개념만 한 번 더 보면 만점!'
        : r.understanding >= 40 ? '좋아요! 힌트를 잘 활용했어요. 개념 정리로 다지고 다시 도전해요.'
          : '괜찮아요! 개념 정리의 드래그 도구로 차근차근 살펴봐요.';

  if (r.weakest) {
    const c = CONCEPTS[r.weakest.id];
    $('#r-weak').textContent = c.name;
    $('#r-weak-tip').textContent = c.tip;
    $('#r-review').hidden = false;
    $('#r-review').dataset.page = c.page;
  } else {
    $('#r-weak').textContent = '없어요! 모든 개념을 잘 이해했어요 🎉';
    $('#r-weak-tip').textContent = '';
    $('#r-review').hidden = true;
  }

  const misEntries = Object.entries(r.misCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
  $('#r-mis-card').hidden = misEntries.length === 0;
  $('#r-mis').innerHTML = misEntries
    .map(([k, n]) => `<li><b>${MISCONCEPTIONS[k].name}</b> ${n}회 — ${MISCONCEPTIONS[k].msg}</li>`).join('');

  $('#r-badge-card').hidden = quiz.newBadges.length === 0;
  $('#r-badges').innerHTML = quiz.newBadges.map((id) => badgeItem(BADGES.find((b) => b.id === id), true)).join('');

  sendResult({
    school: state.school,
    studentId: state.studentId,
    topic: TOPICS[topic].name,
    score: r.first,
    total: r.total,
    understanding: r.understanding,
    durationSec: r.durationSec,
    hintCount: r.hints,
    wrongConcepts: tally(r.wrongConcepts, CONCEPTS),
    misconceptions: tally(r.misCount, MISCONCEPTIONS),
    weakConcept: r.weakest ? CONCEPTS[r.weakest.id].name : '',
    acornCount: state.acornCount,
    stampCount: state.stampCount,
    totalCorrect: state.totalCorrect,
    badges: state.badges.join(','),
    timestamp: new Date().toISOString(),
  });
}

/* =========================================================
   화면 전환 · 로그인
   ========================================================= */
function showPage(name) {
  if (name === 'concept') name = `concept-${state.topic}`;
  if (name !== 'quiz') clearInterval(quiz.timer);
  if (name !== 'concept-trig' && exp.playing) stopPlay();

  $$('.page').forEach((p) => { p.hidden = p.id !== name; });
  $('#title-text').textContent = name === 'topics' ? '오늘의 수학 학습' : TOPICS[state.topic].title;
  $$('[data-go="topic-home"]').forEach((b) => { b.textContent = `← ${TOPICS[state.topic].name}`; });

  if (name === 'topics') renderTopics();
  if (name === 'topic-home') renderTopicHome();
  if (name === 'quiz') startQuiz();
  if (name === 'concept-trig') { drawLab(); renderUnit(); renderExperiment(); }
  if (name === 'concept-circle') { renderInscribed(); renderTangent(); renderCyclic(); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function login(school, id) {
  const saved = readJSON(storeKey(school, id), null) ?? readJSON(legacyKey(id), {});
  Object.assign(state, { school, studentId: id }, pickProgress(saved));
  save();
  writeJSON(LAST_ID_KEY, id);
  writeJSON(LAST_SCHOOL_KEY, school);

  $('#id-school').textContent = school;
  $('#id-number').textContent = id;
  $('#greet-id').textContent = `${school} ${id} 학생`;
  $('#login-view').hidden = true;
  $('#app-view').hidden = false;
  setSync('');
  renderRewards();
  showPage('topics');

  // 다른 기기에서 공부한 기록이 시트에 더 많이 있으면 그걸로 맞춰요.
  const remote = await fetchRemoteProgress(school, id);
  if (!remote || state.studentId !== id || state.school !== school) return;
  const merged = new Set([...state.badges, ...pickProgress(remote).badges]);
  if (progressValue(pickProgress(remote)) > progressValue(state)) {
    const r = pickProgress(remote);
    Object.assign(state, { acornCount: r.acornCount, stampCount: r.stampCount, totalCorrect: r.totalCorrect });
    setSync('구글 시트에서 지난 기록을 불러왔어요.');
  }
  state.badges = [...merged];
  save();
  renderRewards();
  if (!$('#topics').hidden) renderTopics();
}

function logout() {
  clearInterval(quiz.timer);
  state.studentId = null;
  $('#app-view').hidden = true;
  $('#login-view').hidden = false;
  $('#student-id').value = '';
  $('#student-id').focus();
}

function renderSpecialTable() {
  const rows = [
    ['sin A', fr(1, 2), fr('√2', 2), fr('√3', 2)],
    ['cos A', fr('√3', 2), fr('√2', 2), fr(1, 2)],
    ['tan A', fr('√3', 3), '1', '√3'],
  ];
  $('#special-body').innerHTML = rows
    .map(([name, ...cells]) => `<tr><th>${name}</th>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('');
}

function init() {
  $('#stamp-img').src = CONFIG.IMG.stamp;
  $('#modal-stamp-img').src = CONFIG.IMG.stamp;
  buildAcornSlots();
  renderSpecialTable();
  initUnit();
  initExperiment();
  initInscribed();
  initTangent();
  initCyclic();

  const lastId = readJSON(LAST_ID_KEY, '');
  const lastSchool = readJSON(LAST_SCHOOL_KEY, '');
  if (lastId) $('#student-id').value = lastId;
  if (lastSchool) $('#school-name').value = lastSchool;

  $('#student-id').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    $('#login-error').textContent = '';
  });
  $('#school-name').addEventListener('input', () => { $('#login-error').textContent = ''; });

  $('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const school = normalizeSchool($('#school-name').value);
    const id = $('#student-id').value.trim();
    if (school.length < 2) {
      $('#login-error').textContent = '학교 이름을 입력해 주세요. (예: 숲속중학교)';
      $('#school-name').focus();
      return;
    }
    if (!/^\d{5}$/.test(id)) {
      $('#login-error').textContent = '학번 5자리를 숫자로 입력해 주세요. (예: 30101)';
      $('#student-id').focus();
      return;
    }
    login(school, id);
  });

  document.addEventListener('click', (e) => {
    const topicBtn = e.target.closest('[data-topic]');
    if (topicBtn) {
      state.topic = topicBtn.dataset.topic;
      showPage('topic-home');
      return;
    }
    const go = e.target.closest('[data-go]');
    if (go) showPage(go.dataset.go);
  });
  $('#home-link').addEventListener('click', () => showPage('topics'));
  $('#logout-btn').addEventListener('click', logout);
  $('#angle-range').addEventListener('input', drawLab);
  $('#hint-btn').addEventListener('click', showHint);
  $('#next-btn').addEventListener('click', nextQuestion);
  $('#retry-btn').addEventListener('click', startQuiz);
  $('#r-review').addEventListener('click', (e) => showPage(e.currentTarget.dataset.page));
  $('#stamp-modal-close').addEventListener('click', closeStampModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#stamp-modal').hidden) closeStampModal();
  });
}

init();
