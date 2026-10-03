'use strict';

/* =========================================================
   단원 · 개념 · 오답 유형 · 배지
   ========================================================= */
const TOPICS = {
  trig: {
    name: '삼각비',
    title: '오늘의 삼각비 학습',
    conceptDesc: '단위원 드래그, 각에 따른 변화 실험<br>특수각의 삼각비',
  },
  circle: {
    name: '원의 성질',
    title: '오늘의 원의 성질 학습',
    conceptDesc: '원주각과 중심각, 접선과 현<br>드래그로 직접 확인',
  },
};

const CONCEPTS = {
  'trig-def': { name: '삼각비의 뜻', page: 'concept-trig', tip: '기준각에서 높이·밑변·빗변을 먼저 찾고, sin = 높이/빗변, cos = 밑변/빗변, tan = 높이/밑변을 적용해요.' },
  'trig-unit': { name: '단위원과 삼각비', page: 'concept-trig', tip: '반지름이 1이면 sin x = 세로 길이, cos x = 가로 길이, tan x = x=1 위의 접선 길이예요.' },
  'trig-special': { name: '특수각의 삼각비', page: 'concept-trig', tip: '30°·45°·60° 표를 직접 그려 보며 외워요. sin 30° = cos 60° = 1/2!' },
  'trig-apply': { name: '삼각비로 변의 길이 구하기', page: 'concept-trig', tip: '빗변을 알면 높이 = 빗변 × sin, 밑변 = 빗변 × cos 로 구해요.' },
  'circle-central': { name: '원주각과 중심각', page: 'concept-circle', tip: '원주각 = 중심각의 1/2, 중심각 = 원주각의 2배! 드래그 도구로 확인해 보세요.' },
  'circle-inscribed': { name: '같은 호에 대한 원주각', page: 'concept-circle', tip: '같은 호에 대한 원주각은 점의 위치와 상관없이 모두 같아요. 점 Q를 추가해서 비교해 보세요.' },
  'circle-semicircle': { name: '반원에 대한 원주각', page: 'concept-circle', tip: '지름에 대한 원주각은 항상 90°예요.' },
  'circle-tangent': { name: '접선과 현이 이루는 각', page: 'concept-circle', tip: '접선과 현이 이루는 각 = 그 각 안에 있는 호에 대한 원주각.' },
  'circle-cyclic': { name: '원에 내접하는 사각형', page: 'concept-circle', tip: '마주 보는 두 각의 합은 180°, 한 외각은 그 내각의 대각과 같아요.' },
  'circle-arc': { name: '원주각과 호의 길이', page: 'concept-circle', tip: '한 원에서 원주각의 크기는 호의 길이에 정비례해요.' },
  'trig-change': { name: '각의 크기에 따른 삼각비 변화', page: 'concept-trig', tip: '0°~90°에서 각이 커지면 sin·tan은 커지고 cos는 작아져요. 실험실에서 재생 버튼을 눌러 보세요.' },
};

const MISCONCEPTIONS = {
  'sin-cos-swap': { name: 'sin·cos 혼동', msg: '혹시 sin과 cos를 바꿔 쓰지 않았나요? sin은 높이, cos는 밑변이에요.' },
  'ratio-mix': { name: '삼각비 정의 혼동', msg: '정의를 다시 떠올려요: sin = 높이/빗변, cos = 밑변/빗변, tan = 높이/밑변.' },
  'reciprocal': { name: '분자·분모 뒤집힘', msg: '분자와 분모를 거꾸로 쓰지 않았나요? sin·cos에서 빗변은 항상 분모예요.' },
  'ref-angle': { name: '기준각 착각', msg: '기준각이 바뀌면 높이와 밑변도 바뀌어요. 그 각과 마주 보는 변을 다시 찾아봐요.' },
  'special-30-60': { name: '30°·60° 값 혼동', msg: '30°와 60°의 값을 바꿔 쓰지 않았나요? sin 30° = 1/2, sin 60° = √3/2 예요.' },
  'special-45': { name: '45° 값 혼동', msg: '45°는 직각이등변삼각형! sin 45° = cos 45° = √2/2, tan 45° = 1 이에요.' },
  'unit-segment': { name: '단위원 선분 혼동', msg: '단위원에서 sin은 세로(PH), cos는 가로(OH), tan은 x=1 위의 접선(AT)이에요.' },
  'calc': { name: '계산 실수', msg: '방향은 맞는 것 같아요. 계산을 한 번 더 확인해 볼까요?' },
  'central-no-half': { name: '중심각 1/2 누락', msg: '혹시 중심각의 1/2을 안 하셨나요? 원주각은 중심각의 절반이에요.' },
  'inscribed-no-double': { name: '원주각 2배 누락', msg: '중심각은 원주각의 2배예요. 2배를 하지 않았나요?' },
  'half-double-swap': { name: '1/2·2배 방향 혼동', msg: '원주각 → 중심각은 ×2, 중심각 → 원주각은 ÷2 예요. 방향을 바꿔 계산하지 않았나요?' },
  'same-arc': { name: '같은 호 원주각 혼동', msg: '같은 호에 대한 원주각은 모두 같아요. 중심각과 헷갈리지 않았나요?' },
  'opposite-arc': { name: '호 선택 착오', msg: '각 안에 들어 있는 호가 어느 쪽인지 확인해요. 반대쪽 호를 보면 180°에서 빼게 돼요.' },
  'semicircle': { name: '반원 원주각 혼동', msg: '지름에 대한 중심각은 180°이니, 원주각은 그 절반인 90°예요.' },
  'tangent-double': { name: '접선-현 각 2배', msg: '접선과 현이 이루는 각은 원주각과 같아요. 2배를 하지 않아요!' },
  'cyclic-equal': { name: '내접사각형 대각 혼동', msg: '원에 내접하는 사각형은 마주 보는 두 각의 합이 180°예요.' },
  'exterior': { name: '외각 성질 혼동', msg: '한 외각의 크기는 그 내각의 대각과 같아요. ∠D의 외각 = ∠B!' },
  'arc-ratio': { name: '호와 원주각 비례 혼동', msg: '원주각의 크기는 호의 길이에 정비례해요. 호가 3배면 원주각도 3배!' },
  'trend': { name: '증가·감소 혼동', msg: '0°~90°에서 각이 커지면 sin은 커지고 cos는 작아져요. 실험실 그래프를 떠올려 보세요.' },
  'tangent-radius': { name: '접선과 반지름 관계 혼동', msg: '원의 접선은 접점을 지나는 반지름과 항상 수직(90°)이에요.' },
};

const BADGES = [
  { id: 'special-streak', icon: '⭐', name: '특수각 달인', desc: '특수각 삼각비 문제 5개 연속 첫 시도 정답' },
  { id: 'inscribed-master', icon: '⭕', name: '원주각 마스터', desc: '원주각 성질 문제 첫 시도 정답 누적 8개' },
  { id: 'tangent-pro', icon: '📐', name: '접선 탐험가', desc: '접선과 현 문제 3개 연속 첫 시도 정답' },
  { id: 'perfect', icon: '💯', name: '만점 다람쥐', desc: '퀴즈 40문제 모두 첫 시도에 정답' },
  { id: 'independent', icon: '🌱', name: '스스로 해결', desc: '힌트 없이 퀴즈 완주 (70% 이상 정답)' },
  { id: 'first-stamp', icon: '🏵️', name: '첫 칭찬 도장', desc: '도토리 10개로 첫 칭찬 도장 받기' },
  { id: 'explorer', icon: '🗺️', name: '숲속 탐험가', desc: '삼각비 · 원의 성질 퀴즈 모두 완주' },
];

/* =========================================================
   문제 은행 (단원별 40문항, 난이도 하 · 중하)
   wrong: [보기 HTML, 오답 유형]   hints: [1단계 개념, 2단계 수식]
   ========================================================= */
const RC = '∠C = 90°인 직각삼각형 ABC에서';
const UNIT = '반지름이 1인 사분원에서 ∠AOP = x일 때,';
const D = (v) => `${+v.toFixed(1)}°`;

/** 각도 정답 + 겹치지 않는 오답 3개 (부족하면 ±10°, +20° 로 채움) */
function degChoices(ans, cands) {
  const all = [...cands, [ans + 10, 'calc'], [ans - 10, 'calc'], [ans + 20, 'calc']]
    .filter(([v]) => v > 0 && v < 360);
  const seen = new Set([ans]);
  const wrong = [];
  for (const [v, mis] of all) {
    if (wrong.length === 3) break;
    if (seen.has(v)) continue;
    seen.add(v);
    wrong.push([D(v), mis]);
  }
  return { answer: D(ans), wrong };
}

/* ---------- 삼각비: 직각삼각형의 변으로 삼각비 구하기 ---------- */
/** a = BC, b = AC, c = AB (∠C = 90°) */
function ratioQ(a, b, c, fn, at = 'A') {
  const opp = at === 'A' ? ['BC', a] : ['AC', b];
  const adj = at === 'A' ? ['AC', b] : ['BC', a];
  const hyp = ['AB', c];
  const f = (p, q) => fr(p[1], q[1]);
  const swap = at === 'A' ? 'sin-cos-swap' : 'ref-angle';
  const t = {
    sin: { ans: [opp, hyp], name: ['높이', '빗변'], need: '마주 보는 변(높이)과 빗변',
      wrong: [[f(adj, hyp), swap], [f(opp, adj), 'ratio-mix'], [f(hyp, opp), 'reciprocal']] },
    cos: { ans: [adj, hyp], name: ['밑변', '빗변'], need: '붙어 있는 변(밑변)과 빗변',
      wrong: [[f(opp, hyp), swap], [f(opp, adj), 'ratio-mix'], [f(hyp, adj), 'reciprocal']] },
    tan: { ans: [opp, adj], name: ['높이', '밑변'], need: '마주 보는 변(높이)과 붙어 있는 변(밑변)',
      wrong: [[f(adj, opp), at === 'A' ? 'reciprocal' : 'ref-angle'], [f(opp, hyp), 'ratio-mix'], [f(adj, hyp), 'ratio-mix']] },
  }[fn];
  const [p, q] = t.ans;
  return {
    concept: 'trig-def', level: at === 'A' ? '하' : '중하',
    fig: { type: 'tri', theta: toDeg(Math.atan2(a, b)), labels: { opp: String(a), adj: String(b), hyp: String(c) } },
    q: `${RC} ${fn} ${at}의 값은?`,
    answer: f(p, q), wrong: t.wrong,
    hints: [
      `∠${at}를 기준으로 ${t.need}을 찾아보세요.${at === 'B' ? ' 기준각이 B인 것에 주의!' : ''}`,
      `${fn} ${at} = ${fr(t.name[0], t.name[1])} = ${fr(p[0], q[0])}`,
    ],
    explain: `${fn} ${at} = ${fr(p[0], q[0])} = ${f(p, q)}`,
  };
}

/* ---------- 삼각비: 특수각 ---------- */
const SV = { h: fr(1, 2), r2: fr('√2', 2), r3: fr('√3', 2), one: '1', s3: '√3', t3: fr('√3', 3) };
const SPECIAL_VAL = {
  sin: { 30: 'h', 45: 'r2', 60: 'r3' },
  cos: { 30: 'r3', 45: 'r2', 60: 'h' },
  tan: { 30: 't3', 45: 'one', 60: 's3' },
};
const SPECIAL_SIDES = { 30: { opp: '1', adj: '√3', hyp: '2' }, 45: { opp: '1', adj: '1', hyp: '√2' }, 60: { opp: '√3', adj: '1', hyp: '2' } };

function specialQ(fn, deg) {
  const ansKey = SPECIAL_VAL[fn][deg];
  const swapDeg = deg === 45 ? 30 : 90 - deg;
  const otherFn = fn === 'sin' ? 'cos' : 'sin';
  const cands = [
    [SPECIAL_VAL[fn][swapDeg], deg === 45 ? 'special-45' : 'special-30-60'],
    [SPECIAL_VAL[otherFn][deg], fn === 'tan' ? 'ratio-mix' : 'sin-cos-swap'],
    ['one', 'special-45'], ['r2', 'special-45'], ['h', 'ratio-mix'], ['s3', 'ratio-mix'], ['t3', 'ratio-mix'],
  ];
  const seen = new Set([ansKey]);
  const wrong = [];
  for (const [k, mis] of cands) {
    if (wrong.length === 3) break;
    if (seen.has(k)) continue;
    seen.add(k);
    wrong.push([SV[k], mis]);
  }
  const part = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'] }[fn];
  const label = { opp: `${deg}°와 마주 보는 변`, adj: `${deg}°에 붙어 있는 변`, hyp: '빗변' };
  const s = SPECIAL_SIDES[deg];
  const raw = fr(s[part[0]], s[part[1]]);
  return {
    concept: 'trig-special', level: '하',
    q: `${fn} ${deg}°의 값은?`,
    answer: SV[ansKey], wrong,
    hints: [
      deg === 45 ? '45°는 직각이등변삼각형! 세 변의 비는 1 : 1 : √2' : '정삼각형을 반으로 자른 30°-60°-90° 삼각형을 떠올려요. 세 변의 비는 1 : √3 : 2',
      `${fn} ${deg}° = ${fr(label[part[0]], label[part[1]])}`,
    ],
    explain: `${fn} ${deg}° = ${raw}${raw === SV[ansKey] ? '' : ` = ${SV[ansKey]}`}`,
  };
}

const TRIG_QUESTIONS = [
  // 삼각비의 뜻 (13)
  ratioQ(3, 4, 5, 'sin'), ratioQ(3, 4, 5, 'cos'), ratioQ(3, 4, 5, 'tan'),
  ratioQ(3, 4, 5, 'sin', 'B'), ratioQ(3, 4, 5, 'cos', 'B'), ratioQ(3, 4, 5, 'tan', 'B'),
  ratioQ(5, 12, 13, 'sin'), ratioQ(5, 12, 13, 'cos'), ratioQ(5, 12, 13, 'tan'), ratioQ(5, 12, 13, 'sin', 'B'),
  ratioQ(8, 15, 17, 'sin'), ratioQ(8, 15, 17, 'cos'), ratioQ(8, 15, 17, 'tan'),

  // 특수각 (9)
  ...['sin', 'cos', 'tan'].flatMap((fn) => [30, 45, 60].map((deg) => specialQ(fn, deg))),

  // 단위원 (3)
  {
    concept: 'trig-unit', level: '하', fig: { type: 'unit', theta: 40 }, q: `${UNIT} sin x의 값과 길이가 같은 선분은?`,
    answer: '선분 PH', wrong: [['선분 OH', 'sin-cos-swap'], ['선분 AT', 'unit-segment'], ['선분 OP', 'unit-segment']],
    hints: ['직각삼각형 OHP에서 빗변 OP = 1이에요.', `sin x = ${fr('PH', 'OP')} = ${fr('PH', 1)}`],
    explain: `sin x = ${fr('PH', 'OP')} = PH (OP = 1)`,
  },
  {
    concept: 'trig-unit', level: '하', fig: { type: 'unit', theta: 40 }, q: `${UNIT} cos x의 값과 길이가 같은 선분은?`,
    answer: '선분 OH', wrong: [['선분 PH', 'sin-cos-swap'], ['선분 AT', 'unit-segment'], ['선분 OA', 'unit-segment']],
    hints: ['직각삼각형 OHP에서 ∠x에 붙어 있는 변은?', `cos x = ${fr('OH', 'OP')} = ${fr('OH', 1)}`],
    explain: `cos x = ${fr('OH', 'OP')} = OH (OP = 1)`,
  },
  {
    concept: 'trig-unit', level: '중하', fig: { type: 'unit', theta: 40 }, q: `${UNIT} tan x의 값과 길이가 같은 선분은?`,
    answer: '선분 AT', wrong: [['선분 PH', 'unit-segment'], ['선분 OH', 'unit-segment'], ['선분 OT', 'unit-segment']],
    hints: ['OA = 1인 직각삼각형 OAT를 보세요.', `tan x = ${fr('AT', 'OA')} = ${fr('AT', 1)}`],
    explain: `tan x = ${fr('AT', 'OA')} = AT (OA = 1)`,
  },

  // 각의 크기에 따른 변화 (4)
  {
    concept: 'trig-change', level: '하', q: 'sin 90°의 값은?',
    answer: '1', wrong: [['0', 'sin-cos-swap'], [fr(1, 2), 'special-30-60'], ['정할 수 없다', 'trend']],
    hints: ['단위원에서 x = 90°이면 점 P는 어디에 있을까요?', 'P가 세로축 위로 오면 높이 PH = 반지름'],
    explain: 'sin 90° = 1 (높이가 반지름 1과 같아요)',
  },
  {
    concept: 'trig-change', level: '하', q: 'cos 0°의 값은?',
    answer: '1', wrong: [['0', 'sin-cos-swap'], [fr('√3', 2), 'special-30-60'], ['정할 수 없다', 'trend']],
    hints: ['단위원에서 x = 0°이면 점 P는 어디에 있을까요?', 'P가 A와 겹치면 밑변 OH = OA'],
    explain: 'cos 0° = 1 (밑변이 반지름 1과 같아요)',
  },
  {
    concept: 'trig-change', level: '중하', q: '다음 중 값이 가장 큰 것은?',
    answer: 'sin 80°', wrong: [['sin 20°', 'trend'], ['sin 40°', 'trend'], ['sin 60°', 'trend']],
    hints: ['실험실 그래프에서 x가 커질 때 sin x는 어떻게 변했나요?', '0° ~ 90°에서는 각이 클수록 sin 값도 커요.'],
    explain: 'sin은 각이 커질수록 커지므로 sin 80°가 가장 커요.',
  },
  {
    concept: 'trig-change', level: '중하', q: '다음 중 값이 가장 큰 것은?',
    answer: 'cos 10°', wrong: [['cos 30°', 'trend'], ['cos 50°', 'trend'], ['cos 70°', 'trend']],
    hints: ['실험실 그래프에서 x가 커질 때 cos x는 어떻게 변했나요?', '0° ~ 90°에서는 각이 클수록 cos 값은 작아져요.'],
    explain: 'cos는 각이 커질수록 작아지므로 각이 가장 작은 cos 10°가 가장 커요.',
  },

  // 특수각 계산 (3)
  {
    concept: 'trig-special', level: '중하', q: 'sin 30° + cos 60°의 값은?',
    answer: '1', wrong: [[fr(1, 2), 'calc'], ['√3', 'special-30-60'], [fr('√3', 2), 'special-30-60']],
    hints: ['sin 30°와 cos 60°의 값을 각각 떠올려 보세요.', `${fr(1, 2)} + ${fr(1, 2)} = ?`],
    explain: `${fr(1, 2)} + ${fr(1, 2)} = 1`,
  },
  {
    concept: 'trig-special', level: '중하', q: 'sin 45° × cos 45°의 값은?',
    answer: fr(1, 2), wrong: [['1', 'calc'], ['√2', 'calc'], [fr('√2', 2), 'calc']],
    hints: ['sin 45° = cos 45° 예요.', `${fr('√2', 2)} × ${fr('√2', 2)} = ?`],
    explain: `${fr('√2', 2)} × ${fr('√2', 2)} = ${fr(2, 4)} = ${fr(1, 2)}`,
  },
  {
    concept: 'trig-special', level: '중하', q: 'tan 30° × tan 60°의 값은?',
    answer: '1', wrong: [['√3', 'calc'], ['3', 'special-30-60'], [fr(1, 3), 'calc']],
    hints: ['tan 30°와 tan 60°의 값을 각각 떠올려 보세요.', `${fr('√3', 3)} × √3 = ?`],
    explain: `${fr('√3', 3)} × √3 = ${fr(3, 3)} = 1`,
  },

  // 삼각비의 값으로 각 찾기 (3)
  {
    concept: 'trig-special', level: '하', q: '0° &lt; A &lt; 90°이고 tan A = 1일 때, ∠A의 크기는?',
    answer: '45°', wrong: [['30°', 'special-45'], ['60°', 'special-30-60'], ['90°', 'special-45']],
    hints: ['높이와 밑변이 같은 직각삼각형을 떠올려 보세요.', 'tan A = 1 ⇔ 높이 = 밑변 ⇔ 직각이등변삼각형'],
    explain: 'tan 45° = 1 이므로 ∠A = 45°',
  },
  {
    concept: 'trig-special', level: '하', q: `0° &lt; A &lt; 90°이고 sin A = ${fr(1, 2)}일 때, ∠A의 크기는?`,
    answer: '30°', wrong: [['60°', 'special-30-60'], ['45°', 'special-45'], ['90°', 'calc']],
    hints: ['특수각의 삼각비 표에서 sin 값이 1/2인 각을 찾아보세요.', `sin 30° = ${fr(1, 2)}, sin 60° = ${fr('√3', 2)}`],
    explain: `sin 30° = ${fr(1, 2)} 이므로 ∠A = 30°`,
  },
  {
    concept: 'trig-special', level: '하', q: `0° &lt; A &lt; 90°이고 cos A = ${fr(1, 2)}일 때, ∠A의 크기는?`,
    answer: '60°', wrong: [['30°', 'special-30-60'], ['45°', 'special-45'], ['90°', 'calc']],
    hints: ['특수각의 삼각비 표에서 cos 값이 1/2인 각을 찾아보세요.', `cos 60° = ${fr(1, 2)}, cos 30° = ${fr('√3', 2)}`],
    explain: `cos 60° = ${fr(1, 2)} 이므로 ∠A = 60°`,
  },

  // 삼각비로 변의 길이 구하기 (5)
  {
    concept: 'trig-apply', level: '중하', q: `${RC} ∠A = 30°, AB = 10일 때, BC의 길이는?`,
    fig: { type: 'tri', theta: 30, labels: { hyp: '10', opp: '?' }, angleText: '30°' },
    answer: '5', wrong: [['5√3', 'sin-cos-swap'], ['10√3', 'calc'], ['20', 'reciprocal']],
    hints: ['BC는 ∠A의 높이, AB는 빗변이에요. 높이와 빗변을 잇는 삼각비는?', 'BC = AB × sin 30°'],
    explain: `BC = AB × sin 30° = 10 × ${fr(1, 2)} = 5`,
  },
  {
    concept: 'trig-apply', level: '중하', q: `${RC} ∠A = 30°, AB = 12일 때, BC의 길이는?`,
    fig: { type: 'tri', theta: 30, labels: { hyp: '12', opp: '?' }, angleText: '30°' },
    answer: '6', wrong: [['6√3', 'sin-cos-swap'], ['12√3', 'calc'], ['24', 'reciprocal']],
    hints: ['BC는 ∠A의 높이, AB는 빗변이에요. 높이와 빗변을 잇는 삼각비는?', 'BC = AB × sin 30°'],
    explain: `BC = AB × sin 30° = 12 × ${fr(1, 2)} = 6`,
  },
  {
    concept: 'trig-apply', level: '중하', q: `${RC} ∠A = 60°, AB = 8일 때, AC의 길이는?`,
    fig: { type: 'tri', theta: 60, labels: { hyp: '8', adj: '?' }, angleText: '60°' },
    answer: '4', wrong: [['4√3', 'sin-cos-swap'], ['8√3', 'calc'], ['16', 'reciprocal']],
    hints: ['AC는 ∠A의 밑변, AB는 빗변이에요. 밑변과 빗변을 잇는 삼각비는?', 'AC = AB × cos 60°'],
    explain: `AC = AB × cos 60° = 8 × ${fr(1, 2)} = 4`,
  },
  {
    concept: 'trig-apply', level: '중하', q: `${RC} ∠A = 45°, AC = 3일 때, BC의 길이는?`,
    fig: { type: 'tri', theta: 45, labels: { adj: '3', opp: '?' }, angleText: '45°' },
    answer: '3', wrong: [['3√2', 'ratio-mix'], ['√3', 'calc'], ['6', 'calc']],
    hints: ['BC는 높이, AC는 밑변이에요. 높이와 밑변을 잇는 삼각비는?', 'BC = AC × tan 45°'],
    explain: 'BC = AC × tan 45° = 3 × 1 = 3',
  },
  {
    concept: 'trig-def', level: '중하', q: `0° &lt; A &lt; 90°이고 sin A = ${fr(3, 5)}일 때, cos A의 값은?`,
    answer: fr(4, 5), wrong: [[fr(3, 4), 'ratio-mix'], [fr(5, 3), 'reciprocal'], [fr(5, 4), 'reciprocal']],
    hints: ['빗변이 5, 높이가 3인 직각삼각형을 그려 보세요.', '밑변 = √(5² − 3²) 을 먼저 구해요.'],
    explain: `밑변 = √(25 − 9) = 4 → cos A = ${fr(4, 5)}`,
  },
];

/* ---------- 원의 성질 ---------- */
function centralQ(c) {   // 중심각 → 원주각
  return {
    concept: 'circle-central', level: '하', q: `원 O에서 ∠AOB = ${c}°일 때, ∠APB의 크기는?`,
    fig: { type: 'circle', pts: { A: 270 - c / 2, B: 270 + c / 2, P: 90 }, segs: ['OA', 'OB', 'PA', 'PB'], highlight: { from: 'A', to: 'B' },
      angles: [{ v: 'O', a: 'A', b: 'B', text: D(c) }, { v: 'P', a: 'A', b: 'B', text: '?' }] },
    ...degChoices(c / 2, [[c, 'central-no-half'], [2 * c, 'half-double-swap'], [180 - c / 2, 'opposite-arc']]),
    hints: ['원주각과 중심각의 관계를 떠올려 보세요.', '∠APB = ½ × ∠AOB'],
    explain: `∠APB = ½ × ${c}° = ${D(c / 2)}`,
  };
}

function inscribedQ(i) {   // 원주각 → 중심각
  return {
    concept: 'circle-central', level: '하', q: `원 O에서 ∠APB = ${i}°일 때, ∠AOB의 크기는?`,
    fig: { type: 'circle', pts: { A: 270 - i, B: 270 + i, P: 90 }, segs: ['OA', 'OB', 'PA', 'PB'], highlight: { from: 'A', to: 'B' },
      angles: [{ v: 'P', a: 'A', b: 'B', text: D(i) }, { v: 'O', a: 'A', b: 'B', text: '?' }] },
    ...degChoices(2 * i, [[i, 'inscribed-no-double'], [i / 2, 'half-double-swap'], [180 - i, 'opposite-arc']]),
    hints: ['같은 호 AB에 대한 중심각과 원주각의 관계는?', '∠AOB = 2 × ∠APB'],
    explain: `∠AOB = 2 × ${i}° = ${D(2 * i)}`,
  };
}

function sameArcQ(i) {   // 같은 호에 대한 원주각
  return {
    concept: 'circle-inscribed', level: '하', q: `원에서 ∠APB = ${i}°일 때, ∠AQB의 크기는?`,
    fig: { type: 'circle', center: false, pts: { A: 270 - i, B: 270 + i, P: 130, Q: 50 }, segs: ['PA', 'PB', 'QA', 'QB'], highlight: { from: 'A', to: 'B' },
      angles: [{ v: 'P', a: 'A', b: 'B', text: D(i) }, { v: 'Q', a: 'A', b: 'B', text: '?' }] },
    ...degChoices(i, [[2 * i, 'same-arc'], [i / 2, 'half-double-swap'], [180 - i, 'opposite-arc']]),
    hints: ['∠APB와 ∠AQB는 모두 노란 호 AB에 대한 원주각이에요.', '한 호에 대한 원주각의 크기는 모두 같아요.'],
    explain: `같은 호 AB에 대한 원주각이므로 ∠AQB = ∠APB = ${D(i)}`,
  };
}

function semiTriQ(x) {   // 지름 위의 삼각형
  return {
    concept: 'circle-semicircle', level: '중하', q: `선분 AB가 원 O의 지름이고 ∠PAB = ${x}°일 때, ∠PBA의 크기는?`,
    fig: { type: 'circle', pts: { A: 180, B: 0, P: 2 * x }, segs: ['AB', 'PA', 'PB'],
      angles: [{ v: 'A', a: 'P', b: 'B', text: D(x) }, { v: 'B', a: 'P', b: 'A', text: '?' }] },
    ...degChoices(90 - x, [[x, 'semicircle'], [180 - x, 'calc'], [90 + x, 'semicircle']]),
    hints: ['∠APB의 크기부터 구해 보세요. AB는 지름이에요.', `∠PBA = 180° − 90° − ${x}°`],
    explain: `∠APB = 90° 이므로 ∠PBA = 180° − 90° − ${x}° = ${D(90 - x)}`,
  };
}

/** 접선 SU, 접점 T(아래). ∠ATU = t 가 되도록 A를, 반대쪽 호 가운데에 P를 둠 */
function tangentPts(t) {
  const A = norm(270 + 2 * t);
  return { T: 270, A, P: norm(A + norm(270 - A) / 2) };
}
function tangentQ(t) {   // ∠ATU → ∠APT
  return {
    concept: 'circle-tangent', level: '하', q: `직선 SU가 점 T에서 원에 접하고 ∠ATU = ${t}°일 때, ∠APT의 크기는?`,
    fig: { type: 'circle', center: false, pts: tangentPts(t), tangent: { at: 'T', ends: ['U', 'S'] }, segs: ['TA', 'PA', 'PT'], highlight: { from: 'T', to: 'A' },
      angles: [{ v: 'T', a: 'U', b: 'A', text: D(t) }, { v: 'P', a: 'T', b: 'A', text: '?' }] },
    ...degChoices(t, [[2 * t, 'tangent-double'], [180 - t, 'opposite-arc'], [t / 2, 'half-double-swap']]),
    hints: ['직선 SU는 원의 접선이에요. 접선과 현이 이루는 각의 성질을 떠올려 보세요.', '∠ATU = (노란 호 TA에 대한 원주각) = ∠APT'],
    explain: `접선과 현이 이루는 각은 그 각 안의 호에 대한 원주각과 같아요. ∠APT = ${D(t)}`,
  };
}
function tangentRevQ(t) {   // ∠TPA → ∠ATU
  return {
    concept: 'circle-tangent', level: '하', q: `직선 SU가 점 T에서 원에 접하고 ∠TPA = ${t}°일 때, ∠ATU의 크기는?`,
    fig: { type: 'circle', center: false, pts: tangentPts(t), tangent: { at: 'T', ends: ['U', 'S'] }, segs: ['TA', 'PA', 'PT'], highlight: { from: 'T', to: 'A' },
      angles: [{ v: 'P', a: 'T', b: 'A', text: D(t) }, { v: 'T', a: 'U', b: 'A', text: '?' }] },
    ...degChoices(t, [[2 * t, 'tangent-double'], [180 - t, 'opposite-arc'], [t / 2, 'half-double-swap']]),
    hints: ['∠TPA는 노란 호 TA에 대한 원주각이에요.', '접선과 현이 이루는 각 ∠ATU = 호 TA에 대한 원주각'],
    explain: `∠ATU = ∠TPA = ${D(t)}`,
  };
}
function tangentCentralQ(t) {   // ∠ATU → ∠AOT
  const { T, A } = tangentPts(t);
  return {
    concept: 'circle-tangent', level: '중하', q: `직선 SU가 점 T에서 원 O에 접하고 ∠ATU = ${t}°일 때, ∠AOT의 크기는?`,
    fig: { type: 'circle', pts: { T, A }, tangent: { at: 'T', ends: ['U', 'S'] }, segs: ['TA', 'OA', 'OT'], highlight: { from: 'T', to: 'A' },
      angles: [{ v: 'T', a: 'U', b: 'A', text: D(t) }, { v: 'O', a: 'A', b: 'T', text: '?' }] },
    ...degChoices(2 * t, [[t, 'inscribed-no-double'], [t / 2, 'half-double-swap'], [180 - t, 'opposite-arc']]),
    hints: ['∠ATU는 호 TA에 대한 원주각과 같아요.', '중심각 ∠AOT = 2 × ∠ATU'],
    explain: `∠AOT = 2 × ${t}° = ${D(2 * t)}`,
  };
}

function cyclicQ(a) {   // 내접사각형의 대각
  return {
    concept: 'circle-cyclic', level: '하', q: `사각형 ABCD가 원에 내접하고 ∠A = ${a}°일 때, ∠C의 크기는?`,
    fig: { type: 'circle', center: false, pts: { A: norm(30 + a), B: 210, C: norm(210 + a), D: norm(210 + 2 * a) }, segs: ['AB', 'BC', 'CD', 'DA'],
      angles: [{ v: 'A', a: 'B', b: 'D', text: D(a) }, { v: 'C', a: 'B', b: 'D', text: '?' }] },
    ...degChoices(180 - a, [[a, 'cyclic-equal'], [360 - a, 'cyclic-equal'], [(180 - a) / 2, 'half-double-swap']]),
    hints: ['사각형 ABCD는 원에 내접해요. 마주 보는 두 각 사이의 관계는?', '∠A + ∠C = 180°'],
    explain: `∠C = 180° − ${a}° = ${D(180 - a)}`,
  };
}
function exteriorQ(b) {   // 내접사각형의 외각
  return {
    concept: 'circle-cyclic', level: '중하', q: `사각형 ABCD가 원에 내접하고 ∠B = ${b}°일 때, ∠D의 외각의 크기는?`,
    ...degChoices(b, [[180 - b, 'exterior'], [180, 'cyclic-equal'], [b / 2, 'half-double-swap']]),
    hints: ['∠D의 크기를 먼저 구하고, 외각은 180°에서 빼요.', `∠D = 180° − ${b}°, 외각 = 180° − ∠D`],
    explain: `∠D = ${D(180 - b)}, 외각 = ${D(b)} = ∠B (외각은 그 내각의 대각과 같아요)`,
  };
}

const CIRCLE_QUESTIONS = [
  // 원주각과 중심각 (12)
  ...[60, 80, 100, 120, 140, 160].map(centralQ),
  ...[25, 30, 35, 40, 50, 65].map(inscribedQ),

  // 같은 호에 대한 원주각 (5)
  ...[30, 35, 45, 50, 70].map(sameArcQ),

  // 반원에 대한 원주각 (5)
  {
    concept: 'circle-semicircle', level: '하', q: '선분 AB가 원 O의 지름일 때, ∠APB의 크기는?',
    fig: { type: 'circle', pts: { A: 180, B: 0, P: 65 }, segs: ['AB', 'PA', 'PB'], angles: [{ v: 'P', a: 'A', b: 'B', text: '?' }] },
    answer: '90°', wrong: [['180°', 'semicircle'], ['45°', 'semicircle'], ['60°', 'calc']],
    hints: ['AB는 지름이에요. 지름에 대한 중심각 ∠AOB는 몇 도일까요?', '∠APB = ½ × 180°'],
    explain: '반원에 대한 원주각은 ½ × 180° = 90°',
  },
  {
    concept: 'circle-semicircle', level: '하', q: '원 위의 세 점 A, B, C에 대해 ∠ACB = 90°일 때, 선분 AB는?',
    answer: '원의 지름', wrong: [['원의 접선', 'semicircle'], ['원의 반지름', 'semicircle'], ['길이를 알 수 없는 현', 'semicircle']],
    hints: ['원주각이 90°이면 같은 호에 대한 중심각은 몇 도일까요?', '중심각 = 2 × 90° = 180° → 호 AB는 반원'],
    explain: '중심각이 180°이므로 A, O, B가 한 직선 위에 있어요. AB는 지름!',
  },
  ...[20, 35, 50].map(semiTriQ),

  // 접선과 현이 이루는 각 (9)
  ...[40, 55, 65, 70].map(tangentQ),
  ...[50, 60].map(tangentRevQ),
  ...[50, 70].map(tangentCentralQ),
  {
    concept: 'circle-tangent', level: '하', q: '원의 접선과 그 접점을 지나는 반지름이 이루는 각의 크기는?',
    answer: '90°', wrong: [['45°', 'tangent-radius'], ['60°', 'tangent-radius'], ['180°', 'tangent-radius']],
    hints: ['접선은 원과 한 점에서만 만나요. 반지름과 어떤 관계일까요?', '접선 ⊥ 반지름 (개념 정리 2번 그림의 점선 OT)'],
    explain: '원의 접선은 접점을 지나는 반지름과 수직이므로 90°',
  },

  // 원에 내접하는 사각형 (6)
  ...[70, 85, 100, 115].map(cyclicQ),
  ...[80, 95].map(exteriorQ),

  // 원주각과 호 (3)
  {
    concept: 'circle-central', level: '하', q: '한 원에서 같은 호에 대한 원주각의 크기는 중심각의 크기의 몇 배일까요?',
    answer: '½배', wrong: [['2배', 'half-double-swap'], ['1배 (같다)', 'central-no-half'], ['3배', 'calc']],
    hints: ['드래그 도구에서 원주각과 중심각의 값을 비교해 보세요.', '중심각 = 2 × 원주각'],
    explain: '원주각 = ½ × 중심각',
  },
  {
    concept: 'circle-arc', level: '중하', q: '한 원에서 호 AB에 대한 원주각이 20°이고, 호 CD의 길이가 호 AB의 3배일 때, 호 CD에 대한 원주각은?',
    answer: '60°', wrong: [['20°', 'arc-ratio'], ['30°', 'arc-ratio'], ['120°', 'half-double-swap']],
    hints: ['한 원에서 원주각의 크기와 호의 길이는 어떤 관계일까요?', '호 CD = 3 × 호 AB → 원주각도 3배'],
    explain: '원주각은 호의 길이에 정비례 → 20° × 3 = 60°',
  },
  {
    concept: 'circle-arc', level: '중하', q: '한 원에서 호 CD에 대한 원주각이 25°이고, 호 AB의 길이가 호 CD의 2배일 때, 호 AB에 대한 원주각은?',
    answer: '50°', wrong: [['25°', 'arc-ratio'], ['12.5°', 'arc-ratio'], ['100°', 'half-double-swap']],
    hints: ['한 원에서 원주각의 크기와 호의 길이는 어떤 관계일까요?', '호 AB = 2 × 호 CD → 원주각도 2배'],
    explain: '원주각은 호의 길이에 정비례 → 25° × 2 = 50°',
  },
];

const QUESTION_BANK = { trig: TRIG_QUESTIONS, circle: CIRCLE_QUESTIONS };

function figureSVG(fig) {
  if (!fig) return '';
  if (fig.type === 'tri') return triangleSVG(fig);
  if (fig.type === 'unit') return unitCircleSVG(fig.theta);
  if (fig.type === 'circle') return circleSVG(fig);
  return '';
}
