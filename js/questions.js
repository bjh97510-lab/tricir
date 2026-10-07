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
    conceptDesc: '원주각과 중심각, 접선과 현,<br>원의 접선의 길이를 드래그로 확인',
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
  'circle-tangent-length': { name: '원의 접선의 길이', page: 'concept-circle', tip: '접선은 접점을 지나는 반지름과 수직이고, 원 밖의 한 점에서 그은 두 접선의 길이는 같아요. (PA = PB)' },
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
  'tangent-length': { name: '접선의 길이 혼동', msg: '원 밖의 한 점에서 그은 두 접선의 길이는 항상 같아요. PA = PB!' },
  'tangent-quad': { name: '접선 사각형 각 혼동', msg: '접선은 반지름과 수직(90°)이니 사각형 OAPB에서 ∠APB + ∠AOB = 180°예요.' },
  'circum-quad': { name: '외접사각형 성질 혼동', msg: '원에 외접하는 사각형은 마주 보는 두 변의 길이의 합이 같아요. AB + CD = AD + BC!' },
  'area-half': { name: '넓이의 ½ 누락', msg: '삼각형의 넓이는 ½ × 밑변 × 높이예요. ½을 잊지 않았나요?' },
};

const BADGES = [
  { id: 'special-streak', icon: '⭐', name: '특수각 달인', desc: '특수각 삼각비 문제 5개 연속 첫 시도 정답' },
  { id: 'inscribed-master', icon: '⭕', name: '원주각 마스터', desc: '원주각 성질 문제 첫 시도 정답 누적 8개' },
  { id: 'tangent-pro', icon: '📐', name: '접선 탐험가', desc: '접선과 현 문제 3개 연속 첫 시도 정답' },
  { id: 'perfect', icon: '💯', name: '만점 다람쥐', desc: '퀴즈 문제를 모두 첫 시도에 정답' },
  { id: 'independent', icon: '🌱', name: '스스로 해결', desc: '힌트 없이 퀴즈 완주 (70% 이상 정답)' },
  { id: 'first-stamp', icon: '🏵️', name: '첫 칭찬 도장', desc: '도토리 15개로 첫 칭찬 도장 받기' },
  { id: 'explorer', icon: '🗺️', name: '숲속 탐험가', desc: '삼각비 · 원의 성질 퀴즈 모두 완주' },
  { id: 'challenger', icon: '🔥', name: '도전왕', desc: '도전 심화 퀴즈에서 첫 시도 정답 5개 이상' },
];

/* =========================================================
   문제 은행 (단원별 하 · 중하 40~52문항 + 중상 10~13문항 + 도전 심화 8문항)
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

/* ---------- 원의 접선의 길이 ---------- */
/** 원 밖의 점 P(왼쪽)에서 그은 접선 그림. k = OP ÷ 반지름 */
function outerFig(k, extra = {}) {
  return { type: 'circle', outer: { name: 'P', deg: 180, k: Math.min(2.4, Math.max(1.5, k)) }, ...extra };
}
/** ∠APO = t 가 되는 k (sin t = OA / OP) */
const kFromAngle = (t) => 1 / Math.sin(toRad(t));
const BOTH_RIGHT = [['A', 'O', 'P'], ['B', 'O', 'P']];
/** 접선 하나(PA)만 그리는 outer 설정 */
const oneTangent = (k) => ({ name: 'P', deg: 180, k: Math.min(2.4, Math.max(1.5, k)), touch: ['A'] });

function tanLenQ(len) {   // PA = PB
  return {
    concept: 'circle-tangent-length', level: '하',
    q: `원 O 밖의 점 P에서 원에 그은 두 접선의 접점을 A, B라 할 때, PA = ${len}이면 PB의 길이는?`,
    fig: outerFig(1.95, { segs: ['OA', 'OB'], rights: BOTH_RIGHT, segLabels: [{ seg: 'PA', text: String(len) }, { seg: 'PB', text: '?' }] }),
    answer: String(len), wrong: [[String(len / 2), 'tangent-length'], [String(len * 2), 'tangent-length'], [`${len}√2`, 'calc']],
    hints: ['원 밖의 한 점에서 원에 그은 두 접선의 길이를 비교해 보세요. 드래그 도구에서 PA와 PB를 확인!', '직각삼각형 OAP와 OBP는 합동 (OA = OB, OP는 공통) → PA = PB'],
    explain: `두 접선의 길이는 같으므로 PB = PA = ${len}`,
  };
}
function tanRightQ(t) {   // ∠APO → ∠AOP
  return {
    concept: 'circle-tangent-length', level: '중하',
    q: `점 P에서 원 O에 그은 접선의 접점을 A라 하고 ∠APO = ${t}°일 때, ∠AOP의 크기는?`,
    fig: outerFig(1, { outer: oneTangent(kFromAngle(t)), segs: ['OA', 'OP'], rights: [['A', 'O', 'P']],
      angles: [{ v: 'P', a: 'A', b: 'O', text: D(t) }, { v: 'O', a: 'A', b: 'P', text: '?' }] }),
    ...degChoices(90 - t, [[t, 'calc'], [180 - t, 'tangent-radius'], [2 * t, 'tangent-double']]),
    hints: ['접선 PA와 반지름 OA가 이루는 각은 몇 도일까요?', `∠OAP = 90° → ∠AOP = 180° − 90° − ${t}°`],
    explain: `접선 ⊥ 반지름이므로 ∠OAP = 90°, ∠AOP = 90° − ${t}° = ${D(90 - t)}`,
  };
}
function tanQuadQ(t) {   // ∠APB → ∠AOB
  return {
    concept: 'circle-tangent-length', level: '중하',
    q: `점 P에서 원 O에 그은 두 접선의 접점을 A, B라 하고 ∠APB = ${t}°일 때, ∠AOB의 크기는?`,
    fig: outerFig(kFromAngle(t / 2), { segs: ['OA', 'OB'], rights: BOTH_RIGHT, angles: [{ v: 'P', a: 'A', b: 'B', text: D(t) }, { v: 'O', a: 'A', b: 'B', text: '?' }] }),
    ...degChoices(180 - t, [[t, 'tangent-quad'], [t / 2, 'half-double-swap'], [360 - t, 'calc']]),
    hints: ['사각형 OAPB의 네 각의 합은 360°예요. ∠OAP와 ∠OBP는 몇 도?', `∠AOB = 360° − 90° − 90° − ${t}°`],
    explain: `∠OAP = ∠OBP = 90° → ∠AOB = 180° − ${t}° = ${D(180 - t)}`,
  };
}
function tanQuadRevQ(c) {   // ∠AOB → ∠APB
  return {
    concept: 'circle-tangent-length', level: '중하',
    q: `점 P에서 원 O에 그은 두 접선의 접점을 A, B라 하고 ∠AOB = ${c}°일 때, ∠APB의 크기는?`,
    fig: outerFig(kFromAngle((180 - c) / 2), { segs: ['OA', 'OB'], rights: BOTH_RIGHT, angles: [{ v: 'O', a: 'A', b: 'B', text: D(c) }, { v: 'P', a: 'A', b: 'B', text: '?' }] }),
    ...degChoices(180 - c, [[c, 'tangent-quad'], [c / 2, 'half-double-swap'], [360 - c, 'calc']]),
    hints: ['접선 ⊥ 반지름! 사각형 OAPB에서 ∠OAP = ∠OBP = 90°예요.', `∠APB = 360° − 90° − 90° − ${c}°`],
    explain: `∠APB = 180° − ${c}° = ${D(180 - c)}`,
  };
}
function tanIsoQ(t) {   // PA = PB → 이등변삼각형
  return {
    concept: 'circle-tangent-length', level: '중하',
    q: `점 P에서 원 O에 그은 두 접선의 접점을 A, B라 하고 ∠APB = ${t}°일 때, ∠PAB의 크기는?`,
    fig: outerFig(kFromAngle(t / 2), { segs: ['AB'], angles: [{ v: 'P', a: 'A', b: 'B', text: D(t) }, { v: 'A', a: 'P', b: 'B', text: '?' }] }),
    ...degChoices((180 - t) / 2, [[t, 'calc'], [180 - t, 'tangent-quad'], [90 - t, 'calc']]),
    hints: ['PA = PB이므로 삼각형 PAB는 이등변삼각형이에요.', `∠PAB = (180° − ${t}°) ÷ 2`],
    explain: `PA = PB → ∠PAB = ∠PBA = (180° − ${t}°) ÷ 2 = ${D((180 - t) / 2)}`,
  };
}
/** 원에 외접하는 사각형 ABCD (A 왼쪽 위 → B 왼쪽 아래 → C 오른쪽 아래 → D 오른쪽 위) */
function circumQuadFig(sides) {
  return {
    type: 'circle', circum: { at: [100, 215, 300, 15], names: ['A', 'B', 'C', 'D'] },
    segLabels: Object.entries(sides).map(([seg, text]) => ({ seg, text })),
  };
}

const TANGENT_LENGTH_QUESTIONS = [
  ...[5, 6, 8].map(tanLenQ),
  ...[35, 25].map(tanRightQ),
  ...[60, 50].map(tanQuadQ),
  tanQuadRevQ(110),
  ...[40, 50].map(tanIsoQ),
  {
    concept: 'circle-tangent-length', level: '중하', q: '점 P에서 원 O에 그은 접선의 접점을 A라 하자. OA = 3, PA = 4일 때, OP의 길이는?',
    fig: outerFig(1, { outer: oneTangent(5 / 3), segs: ['OA', 'OP'], rights: [['A', 'O', 'P']],
      segLabels: [{ seg: 'OA', text: '3' }, { seg: 'PA', text: '4' }, { seg: 'OP', text: '?' }] }),
    answer: '5', wrong: [['7', 'calc'], ['√7', 'calc'], ['1', 'calc']],
    hints: ['접선 ⊥ 반지름이니 삼각형 OAP는 ∠A = 90°인 직각삼각형이에요.', 'OP² = OA² + PA² (피타고라스 정리)'],
    explain: 'OP = √(3² + 4²) = √25 = 5',
  },
  {
    concept: 'circle-tangent-length', level: '중하', q: '점 P에서 원 O에 그은 접선의 접점을 A라 하자. OA = 5, OP = 13일 때, PA의 길이는?',
    fig: outerFig(1, { outer: oneTangent(2.4), segs: ['OA', 'OP'], rights: [['A', 'O', 'P']],
      segLabels: [{ seg: 'OA', text: '5' }, { seg: 'OP', text: '13' }, { seg: 'PA', text: '?' }] }),
    answer: '12', wrong: [['8', 'calc'], ['18', 'calc'], ['√194', 'tangent-radius']],
    hints: ['삼각형 OAP는 ∠A = 90°인 직각삼각형이에요. 빗변은 OP!', 'PA² = OP² − OA²'],
    explain: 'PA = √(13² − 5²) = √144 = 12',
  },
  // 중상
  {
    concept: 'circle-tangent-length', level: '중상', q: '원 O에 외접하는 사각형 ABCD에서 AB = 7, BC = 8, CD = 5일 때, AD의 길이는?',
    fig: circumQuadFig({ AB: '7', BC: '8', CD: '5', DA: '?' }),
    answer: '4', wrong: [['6', 'circum-quad'], ['10', 'calc'], ['5', 'circum-quad']],
    hints: ['원에 외접하는 사각형에서 마주 보는 두 변의 길이의 합은 같아요.', 'AB + CD = AD + BC → 7 + 5 = AD + 8'],
    explain: 'AB + CD = AD + BC → 12 = AD + 8 → AD = 4',
  },
  {
    concept: 'circle-tangent-length', level: '중상', q: '점 P에서 원 O에 그은 접선의 접점을 A라 하자. PA = 6, ∠APO = 30°일 때, 원 O의 반지름의 길이는?',
    fig: outerFig(1, { outer: oneTangent(2), segs: ['OA', 'OP'], rights: [['A', 'O', 'P']],
      segLabels: [{ seg: 'PA', text: '6' }, { seg: 'OA', text: '?' }], angles: [{ v: 'P', a: 'A', b: 'O', text: '30°' }] }),
    answer: '2√3', wrong: [['6√3', 'special-30-60'], ['3', 'sin-cos-swap'], ['3√3', 'calc']],
    hints: ['∠OAP = 90°인 직각삼각형 OAP에서 삼각비를 써요.', `tan 30° = ${fr('OA', 'PA')} = ${fr('OA', 6)}`],
    explain: `OA = 6 × tan 30° = 6 × ${fr('√3', 3)} = 2√3`,
  },
  {
    concept: 'circle-tangent-length', level: '중상', q: '원 O의 반지름이 5이고 OP = 13일 때, 점 P에서 원 O에 그은 두 접선의 길이의 합 PA + PB는?',
    fig: outerFig(2.4, { segs: ['OA', 'OB', 'OP'], rights: BOTH_RIGHT, segLabels: [{ seg: 'OA', text: '5' }, { seg: 'OP', text: '13' }] }),
    answer: '24', wrong: [['12', 'tangent-length'], ['18', 'calc'], ['26', 'calc']],
    hints: ['직각삼각형 OAP에서 PA를 먼저 구해요.', 'PA = √(13² − 5²), 그리고 PB = PA'],
    explain: 'PA = √(169 − 25) = 12, PB = PA = 12 → PA + PB = 24',
  },
];

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

  // 원의 접선의 길이 (12 + 중상 3)
  ...TANGENT_LENGTH_QUESTIONS,

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

/* =========================================================
   중상 문제 (단원별 10문항, 두 단계 이상 풀이)
   ========================================================= */
const TRIG_ADVANCED = [
  {
    concept: 'trig-def', level: '중상', q: `0° &lt; A &lt; 90°이고 sin A = ${fr(5, 13)}일 때, tan A의 값은?`,
    answer: fr(5, 12), wrong: [[fr(12, 13), 'sin-cos-swap'], [fr(12, 5), 'reciprocal'], [fr(13, 12), 'ratio-mix']],
    hints: ['빗변이 13, 높이가 5인 직각삼각형을 그리고 밑변을 먼저 구해요.', `밑변 = √(13² − 5²), tan A = ${fr('높이', '밑변')}`],
    explain: `밑변 = √(169 − 25) = 12 → tan A = ${fr(5, 12)}`,
  },
  {
    concept: 'trig-def', level: '중상', q: `0° &lt; A &lt; 90°이고 tan A = ${fr(3, 4)}일 때, sin A + cos A의 값은?`,
    answer: fr(7, 5), wrong: [['1', 'calc'], [fr(7, 4), 'ratio-mix'], [fr(12, 25), 'calc']],
    hints: ['높이가 3, 밑변이 4인 직각삼각형의 빗변부터 구해요.', `빗변 = 5 → sin A = ${fr(3, 5)}, cos A = ${fr(4, 5)}`],
    explain: `빗변 = 5, sin A + cos A = ${fr(3, 5)} + ${fr(4, 5)} = ${fr(7, 5)}`,
  },
  {
    concept: 'trig-def', level: '중상', q: `0° &lt; A &lt; 90°이고 cos A = ${fr(2, 3)}일 때, sin A의 값은?`,
    answer: fr('√5', 3), wrong: [[fr(1, 3), 'calc'], [fr('√5', 2), 'ratio-mix'], [fr(3, 2), 'reciprocal']],
    hints: ['빗변이 3, 밑변이 2인 직각삼각형을 그리고 높이를 구해요.', '높이 = √(3² − 2²)'],
    explain: `높이 = √(9 − 4) = √5 → sin A = ${fr('√5', 3)}`,
  },
  {
    concept: 'trig-unit', level: '중상', fig: { type: 'unit', theta: toDeg(Math.asin(0.6)) },
    q: `${UNIT} sin x = 0.6이면 cos x의 값은?`,
    answer: '0.8', wrong: [['0.4', 'calc'], ['0.75', 'ratio-mix'], ['1.6', 'calc']],
    hints: ['직각삼각형 OHP에서 OP = 1, PH = sin x 예요.', 'OH = √(1² − 0.6²)'],
    explain: 'OH = √(1 − 0.36) = √0.64 = 0.8 → cos x = 0.8',
  },
  {
    concept: 'trig-apply', level: '중상', q: `${RC} ∠A = 30°, BC = 4일 때, AB의 길이는?`,
    fig: { type: 'tri', theta: 30, labels: { opp: '4', hyp: '?' }, angleText: '30°' },
    answer: '8', wrong: [['2', 'reciprocal'], ['4√3', 'ratio-mix'], [`${fr('8√3', 3)}`, 'sin-cos-swap']],
    hints: ['BC는 높이, AB는 빗변이에요. sin 30° = BC / AB 로 식을 세워요.', `${fr(1, 2)} = ${fr(4, 'AB')} → AB = ?`],
    explain: `sin 30° = ${fr(4, 'AB')} = ${fr(1, 2)} → AB = 8`,
  },
  {
    concept: 'trig-apply', level: '중상', q: `${RC} ∠A = 60°, AC = 5일 때, BC의 길이는?`,
    fig: { type: 'tri', theta: 60, labels: { adj: '5', opp: '?' }, angleText: '60°' },
    answer: '5√3', wrong: [[fr('5√3', 3), 'special-30-60'], ['10', 'ratio-mix'], [fr(5, 2), 'sin-cos-swap']],
    hints: ['BC는 높이, AC는 밑변이에요. 높이와 밑변을 잇는 삼각비는?', 'BC = AC × tan 60°'],
    explain: 'BC = 5 × tan 60° = 5√3',
  },
  {
    concept: 'trig-apply', level: '중상', q: '나무에서 30 m 떨어진 곳에서 나무 꼭대기를 올려본각의 크기가 30°일 때, 나무의 높이는? (눈높이는 생각하지 않아요)',
    fig: { type: 'tri', theta: 30, labels: { adj: '30 m', opp: '?' }, angleText: '30°' },
    answer: '10√3 m', wrong: [['30√3 m', 'special-30-60'], ['15 m', 'sin-cos-swap'], ['15√3 m', 'ratio-mix']],
    hints: ['나무의 높이가 "높이", 떨어진 거리가 "밑변"이에요. 높이와 밑변을 잇는 삼각비는?', `높이 = 30 × tan 30° = 30 × ${fr('√3', 3)}`],
    explain: `높이 = 30 × ${fr('√3', 3)} = 10√3 (m)`,
  },
  {
    concept: 'trig-special', level: '중상', q: 'sin 60° × cos 30° − sin 30° × cos 60°의 값은?',
    answer: fr(1, 2), wrong: [['1', 'calc'], ['0', 'special-30-60'], [fr('√3', 2), 'calc']],
    hints: [`값을 먼저 써 보세요: sin 60° = cos 30° = ${fr('√3', 2)}, sin 30° = cos 60° = ${fr(1, 2)}`, `${fr('√3', 2)} × ${fr('√3', 2)} − ${fr(1, 2)} × ${fr(1, 2)}`],
    explain: `${fr(3, 4)} − ${fr(1, 4)} = ${fr(2, 4)} = ${fr(1, 2)}`,
  },
  {
    concept: 'trig-special', level: '중상', q: '2 sin 45° × cos 45° + tan 45°의 값은?',
    answer: '2', wrong: [['1', 'calc'], ['3', 'calc'], ['1 + √2', 'special-45']],
    hints: [`sin 45° = cos 45° = ${fr('√2', 2)}, tan 45° = 1`, `2 × ${fr('√2', 2)} × ${fr('√2', 2)} + 1`],
    explain: `2 × ${fr(2, 4)} + 1 = 1 + 1 = 2`,
  },
  {
    concept: 'trig-change', level: '중상', q: '0° &lt; x &lt; 45°일 때, sin x와 cos x의 크기를 바르게 비교한 것은?',
    answer: 'sin x &lt; cos x', wrong: [['sin x &gt; cos x', 'trend'], ['sin x = cos x', 'trend'], ['알 수 없다', 'trend']],
    hints: ['실험실의 "한눈에 비교"에서 두 곡선이 만나는 각은 몇 도였나요?', '45°에서 같아지고, 그보다 작은 각에서는 cos 곡선이 위에 있어요.'],
    explain: '예) x = 30°: sin 30° = 0.5 &lt; cos 30° ≈ 0.866. 45°보다 작으면 항상 sin x &lt; cos x',
  },
];

const CIRCLE_ADVANCED = [
  {
    concept: 'circle-central', level: '중상', q: '원 O에서 ∠APB = 50°일 때, ∠OAB의 크기는?',
    fig: { type: 'circle', pts: { A: 220, B: 320, P: 90 }, segs: ['OA', 'OB', 'AB', 'PA', 'PB'],
      angles: [{ v: 'P', a: 'A', b: 'B', text: '50°' }, { v: 'A', a: 'O', b: 'B', text: '?' }] },
    ...degChoices(40, [[65, 'inscribed-no-double'], [50, 'calc'], [80, 'calc']]),
    hints: ['먼저 ∠AOB의 크기를 구해 보세요. OA = OB(반지름)이에요.', '∠AOB = 2 × 50° = 100°, 삼각형 OAB는 이등변삼각형'],
    explain: '∠AOB = 100° → ∠OAB = (180° − 100°) ÷ 2 = 40°',
  },
  {
    concept: 'circle-central', level: '중상', q: '원 O에서 ∠OAB = 30°일 때, ∠APB의 크기는?',
    fig: { type: 'circle', pts: { A: 210, B: 330, P: 90 }, segs: ['OA', 'OB', 'AB', 'PA', 'PB'],
      angles: [{ v: 'A', a: 'O', b: 'B', text: '30°' }, { v: 'P', a: 'A', b: 'B', text: '?' }] },
    ...degChoices(60, [[120, 'central-no-half'], [30, 'calc'], [75, 'calc']]),
    hints: ['삼각형 OAB는 이등변삼각형이에요. ∠AOB부터 구해요.', '∠AOB = 180° − 2 × 30° = 120°, ∠APB = ½ × ∠AOB'],
    explain: '∠AOB = 120° → ∠APB = ½ × 120° = 60°',
  },
  {
    concept: 'circle-central', level: '중상', q: '원 O에서 ∠OAB = 25°일 때, ∠APB의 크기는?',
    fig: { type: 'circle', pts: { A: 205, B: 335, P: 90 }, segs: ['OA', 'OB', 'AB', 'PA', 'PB'],
      angles: [{ v: 'A', a: 'O', b: 'B', text: '25°' }, { v: 'P', a: 'A', b: 'B', text: '?' }] },
    ...degChoices(65, [[130, 'central-no-half'], [25, 'calc'], [77.5, 'calc']]),
    hints: ['삼각형 OAB는 이등변삼각형이에요. ∠AOB부터 구해요.', '∠AOB = 180° − 2 × 25° = 130°, ∠APB = ½ × ∠AOB'],
    explain: '∠AOB = 130° → ∠APB = ½ × 130° = 65°',
  },
  {
    concept: 'circle-central', level: '중상', q: '원 O에서 ∠AOB = 100°이고 점 P가 작은 호 AB 위에 있을 때, ∠APB의 크기는?',
    fig: { type: 'circle', pts: { A: 220, B: 320, P: 270 }, segs: ['OA', 'OB', 'PA', 'PB'],
      angles: [{ v: 'O', a: 'A', b: 'B', text: '100°', textR: 32 }, { v: 'P', a: 'A', b: 'B', text: '?', r: 14, textR: 26 }] },
    ...degChoices(130, [[50, 'opposite-arc'], [100, 'central-no-half'], [260, 'half-double-swap']]),
    hints: ['점 P가 작은 호 위에 있으면 ∠APB는 반대쪽 큰 호에 대한 원주각이에요.', '큰 호 AB에 대한 중심각 = 360° − 100° = 260°, ∠APB = ½ × 260°'],
    explain: '∠APB = ½ × (360° − 100°) = 130°',
  },
  {
    concept: 'circle-semicircle', level: '중상', q: '선분 AB가 원 O의 지름이고 ∠CAB = 25°일 때, ∠ADC의 크기는? (점 D는 점 B와 같은 쪽 호 위)',
    fig: { type: 'circle', pts: { A: 180, B: 0, C: 50, D: 300 }, segs: ['AB', 'AC', 'BC', 'DA', 'DC'],
      angles: [{ v: 'A', a: 'C', b: 'B', text: '25°' }, { v: 'D', a: 'A', b: 'C', text: '?' }] },
    ...degChoices(65, [[25, 'same-arc'], [115, 'opposite-arc'], [90, 'semicircle']]),
    hints: ['AB가 지름이니 ∠ACB = 90°예요. ∠ABC부터 구해요.', '∠ABC = 90° − 25°, ∠ADC는 ∠ABC와 같은 호 AC에 대한 원주각'],
    explain: '∠ABC = 65°, ∠ADC = ∠ABC = 65° (같은 호 AC에 대한 원주각)',
  },
  {
    concept: 'circle-tangent', level: '중상', q: '직선 SU가 점 T에서 원에 접하고 ∠ATU = 65°, ∠PTA = 45°일 때, ∠PAT의 크기는?',
    fig: { type: 'circle', center: false, pts: { T: 270, A: 40, P: 130 }, tangent: { at: 'T', ends: ['U', 'S'] }, segs: ['TA', 'PA', 'PT'],
      angles: [{ v: 'T', a: 'U', b: 'A', text: '65°' }, { v: 'T', a: 'P', b: 'A', text: '45°' }, { v: 'A', a: 'P', b: 'T', text: '?' }] },
    ...degChoices(70, [[5, 'tangent-double'], [20, 'opposite-arc'], [45, 'calc']]),
    hints: ['접선과 현이 이루는 각으로 ∠APT부터 구해요.', '∠APT = ∠ATU = 65°, 삼각형 APT의 내각의 합 = 180°'],
    explain: '∠APT = 65° → ∠PAT = 180° − 65° − 45° = 70°',
  },
  {
    concept: 'circle-tangent', level: '중상', q: '직선 SU가 점 T에서 원 O에 접하고 ∠ATU = 70°일 때, ∠OAT의 크기는?',
    fig: { type: 'circle', pts: { T: 270, A: 50 }, tangent: { at: 'T', ends: ['U', 'S'] }, segs: ['TA', 'OA', 'OT'],
      angles: [{ v: 'T', a: 'U', b: 'A', text: '70°' }, { v: 'A', a: 'O', b: 'T', text: '?' }] },
    ...degChoices(20, [[40, 'half-double-swap'], [70, 'calc'], [55, 'inscribed-no-double']]),
    hints: ['∠AOT = 2 × ∠ATU 를 먼저 구해요. OA = OT(반지름)이에요.', '∠AOT = 140°, 삼각형 OAT는 이등변삼각형'],
    explain: '∠AOT = 140° → ∠OAT = (180° − 140°) ÷ 2 = 20°',
  },
  {
    concept: 'circle-cyclic', level: '중상', q: '사각형 ABCD가 원에 내접하고 ∠A = 3x, ∠C = 2x일 때, x의 값은?',
    ...degChoices(36, [[72, 'cyclic-equal'], [108, 'calc'], [54, 'calc']]),
    hints: ['원에 내접하는 사각형에서 ∠A와 ∠C의 관계는?', '3x + 2x = 180°'],
    explain: '5x = 180° → x = 36°',
  },
  {
    concept: 'circle-cyclic', level: '중상', q: '사각형 ABCD가 원에 내접하고 ∠A = 95°, ∠B = 80°일 때, ∠C + ∠D의 크기는?',
    ...degChoices(185, [[175, 'calc'], [180, 'cyclic-equal'], [360, 'cyclic-equal']]),
    hints: ['∠C는 ∠A의 대각, ∠D는 ∠B의 대각이에요.', '∠C = 180° − 95°, ∠D = 180° − 80°'],
    explain: '∠C = 85°, ∠D = 100° → ∠C + ∠D = 185°',
  },
  {
    concept: 'circle-arc', level: '중상', q: '원 위의 세 점 A, B, C에 대해 호 AB : 호 BC : 호 CA = 2 : 3 : 4일 때, ∠ACB의 크기는?',
    ...degChoices(40, [[80, 'central-no-half'], [60, 'arc-ratio'], [30, 'calc']]),
    hints: ['세 호에 대한 중심각의 합은 360°예요.', '호 AB에 대한 중심각 = 360° × 2/9 = 80°'],
    explain: '호 AB의 중심각 = 80° → ∠ACB = ½ × 80° = 40°',
  },
];

/* =========================================================
   도전 심화 문제 (단원별 8문항, 세 단계 이상 풀이 · 첫 시도 정답 시 도토리 2개)
   ========================================================= */
const TRIG_CHALLENGE = [
  {
    concept: 'trig-def', level: '심화', q: `0° &lt; A &lt; 90°이고 sin A = ${fr(3, 5)}일 때, tan A + cos A의 값은?`,
    answer: fr(31, 20), wrong: [[fr(7, 5), 'ratio-mix'], [fr(27, 20), 'calc'], [fr(31, 15), 'calc']],
    hints: ['빗변 5, 높이 3인 직각삼각형을 그리고 밑변을 구해요.', `밑변 = 4 → tan A = ${fr(3, 4)}, cos A = ${fr(4, 5)}`],
    explain: `${fr(3, 4)} + ${fr(4, 5)} = ${fr(15, 20)} + ${fr(16, 20)} = ${fr(31, 20)}`,
  },
  {
    concept: 'trig-apply', level: '심화', q: `${RC} ∠A = 30°, AB = 10일 때, 삼각형 ABC의 넓이는?`,
    fig: { type: 'tri', theta: 30, labels: { hyp: '10' }, angleText: '30°' },
    answer: fr('25√3', 2), wrong: [['25√3', 'area-half'], [fr(25, 2), 'sin-cos-swap'], ['50', 'calc']],
    hints: ['BC = AB × sin 30°, AC = AB × cos 30° 으로 두 변을 먼저 구해요.', 'BC = 5, AC = 5√3 → 넓이 = ½ × BC × AC'],
    explain: `BC = 5, AC = 5√3 → 넓이 = ½ × 5 × 5√3 = ${fr('25√3', 2)}`,
  },
  {
    concept: 'trig-def', level: '심화', q: '0° &lt; A &lt; 90°이고 tan A = 2일 때, sin A × cos A의 값은?',
    answer: fr(2, 5), wrong: [[fr(1, 5), 'calc'], [fr(2, '√5'), 'ratio-mix'], ['2', 'calc']],
    hints: ['높이 2, 밑변 1인 직각삼각형의 빗변을 구해요.', `빗변 = √5 → sin A = ${fr(2, '√5')}, cos A = ${fr(1, '√5')}`],
    explain: `${fr(2, '√5')} × ${fr(1, '√5')} = ${fr(2, 5)}`,
  },
  {
    concept: 'trig-special', level: '심화', q: '(sin 30° + cos 45°)(sin 30° − cos 45°)의 값은?',
    answer: `−${fr(1, 4)}`, wrong: [[fr(1, 4), 'calc'], ['0', 'special-45'], [`−${fr(3, 4)}`, 'calc']],
    hints: ['(a + b)(a − b) = a² − b² 을 이용해요.', `sin²30° − cos²45° = (${fr(1, 2)})² − (${fr('√2', 2)})²`],
    explain: `${fr(1, 4)} − ${fr(2, 4)} = −${fr(1, 4)}`,
  },
  {
    concept: 'trig-special', level: '심화', q: '0° &lt; A &lt; 90°이고 sin A : cos A = 1 : √3일 때, ∠A의 크기는?',
    ...degChoices(30, [[60, 'special-30-60'], [45, 'special-45'], [15, 'calc']]),
    hints: [`${fr('sin A', 'cos A')} = tan A 예요. 비를 분수로 바꿔 보세요.`, `tan A = ${fr(1, '√3')} = ${fr('√3', 3)}`],
    explain: `tan A = ${fr('√3', 3)} 이므로 ∠A = 30°`,
  },
  {
    concept: 'trig-apply', level: '심화', q: '삼각형 ABC에서 AB = 6, AC = 8, ∠A = 60°일 때, 삼각형 ABC의 넓이는?',
    answer: '12√3', wrong: [['24√3', 'area-half'], ['12', 'sin-cos-swap'], ['24', 'calc']],
    hints: ['꼭짓점 C에서 변 AB에 수선을 내려 높이를 삼각비로 구해요.', `높이 = AC × sin 60° = 8 × ${fr('√3', 2)} = 4√3`],
    explain: '높이 = 4√3 → 넓이 = ½ × 6 × 4√3 = 12√3',
  },
  {
    concept: 'trig-apply', level: '심화', q: `${RC} ∠A = 30°, AC = 2√3일 때, AB의 길이는?`,
    fig: { type: 'tri', theta: 30, labels: { adj: '2√3', hyp: '?' }, angleText: '30°' },
    answer: '4', wrong: [['√3', 'sin-cos-swap'], ['6', 'calc'], ['4√3', 'ratio-mix']],
    hints: ['AC는 밑변, AB는 빗변이에요. cos 30° = AC ÷ AB 로 식을 세워요.', `${fr('√3', 2)} = ${fr('2√3', 'AB')} → AB = ?`],
    explain: `AB = 2√3 ÷ ${fr('√3', 2)} = 2√3 × ${fr(2, '√3')} = 4`,
  },
  {
    concept: 'trig-change', level: '심화', q: '45° &lt; x &lt; 90°일 때, sin x, cos x, tan x의 크기를 작은 것부터 바르게 나열한 것은?',
    answer: 'cos x &lt; sin x &lt; tan x',
    wrong: [['sin x &lt; cos x &lt; tan x', 'trend'], ['cos x &lt; tan x &lt; sin x', 'trend'], ['tan x &lt; cos x &lt; sin x', 'trend']],
    hints: ['45°에서 sin x = cos x, tan x = 1이에요. 그보다 큰 각에서는 어떻게 될까요?', '45°를 넘으면 sin x가 cos x보다 커지고, tan x는 1보다 커져요. sin x는 항상 1보다 작아요!'],
    explain: '예) x = 60°: cos 60° = 0.5 &lt; sin 60° ≈ 0.87 &lt; tan 60° ≈ 1.73',
  },
];

const CIRCLE_CHALLENGE = [
  {
    concept: 'circle-central', level: '심화', q: '원 O에서 ∠ABO = 20°, ∠ACO = 30°일 때, ∠BOC의 크기는?',
    fig: { type: 'circle', pts: { A: 90, B: 230, C: 330 }, segs: ['OA', 'OB', 'OC', 'AB', 'AC'],
      angles: [{ v: 'B', a: 'A', b: 'O', text: '20°' }, { v: 'C', a: 'A', b: 'O', text: '30°' }, { v: 'O', a: 'B', b: 'C', text: '?' }] },
    ...degChoices(100, [[50, 'inscribed-no-double'], [25, 'half-double-swap'], [140, 'calc']]),
    hints: ['OA = OB = OC(반지름)이니 삼각형 OAB, OAC는 이등변삼각형이에요. ∠BAC부터 구해요.', '∠BAC = 20° + 30° = 50° → ∠BOC는 호 BC에 대한 중심각'],
    explain: '∠BAC = ∠OAB + ∠OAC = 50° → ∠BOC = 2 × 50° = 100°',
  },
  {
    concept: 'circle-inscribed', level: '심화', q: '원의 두 현 AB, CD가 원 안의 점 P에서 만나고 ∠ACD = 35°, ∠BDC = 40°일 때, ∠APC의 크기는?',
    fig: { type: 'circle', center: false, pts: { A: 110, B: 290, C: 210, D: 40 }, inner: { P: ['AB', 'CD'] }, segs: ['AB', 'CD', 'AC', 'BD'],
      angles: [{ v: 'C', a: 'A', b: 'D', text: '35°' }, { v: 'D', a: 'B', b: 'C', text: '40°' }, { v: 'P', a: 'A', b: 'C', text: '?', r: 18, textR: 34 }] },
    ...degChoices(75, [[105, 'calc'], [37.5, 'half-double-swap'], [150, 'inscribed-no-double']]),
    hints: ['삼각형 PCD에서 ∠PCD = 35°, ∠PDC = 40°예요. ∠CPD부터 구해요.', '∠CPD = 180° − 35° − 40° = 105°, ∠APC와 ∠CPD는 일직선 위의 각'],
    explain: '∠CPD = 105° → ∠APC = 180° − 105° = 75° (= 35° + 40°)',
  },
  {
    concept: 'circle-tangent-length', level: '심화', q: '점 P에서 원 O에 그은 두 접선의 접점을 A, B라 하고 ∠APB = 50°일 때, 큰 호 AB 위의 점 C에 대해 ∠ACB의 크기는?',
    fig: outerFig(kFromAngle(25), { pts: { C: 0 }, segs: ['OA', 'OB', 'CA', 'CB'], rights: BOTH_RIGHT,
      angles: [{ v: 'P', a: 'A', b: 'B', text: '50°' }, { v: 'C', a: 'A', b: 'B', text: '?' }] }),
    ...degChoices(65, [[130, 'central-no-half'], [50, 'tangent-double'], [25, 'half-double-swap']]),
    hints: ['사각형 OAPB에서 ∠AOB부터 구해요. 접선 ⊥ 반지름!', '∠AOB = 180° − 50° = 130°, ∠ACB는 호 AB에 대한 원주각'],
    explain: '∠AOB = 130° → ∠ACB = ½ × 130° = 65°',
  },
  {
    concept: 'circle-tangent-length', level: '심화', q: '원 O에 외접하는 사각형 ABCD의 둘레가 32이고 AB = 7, AD = 6일 때, BC의 길이는?',
    fig: circumQuadFig({ AB: '7', DA: '6', BC: '?' }),
    answer: '10', wrong: [['9', 'calc'], ['12', 'circum-quad'], ['8', 'calc']],
    hints: ['외접사각형은 AB + CD = AD + BC 예요. 둘레는 이 두 합을 더한 것!', '둘레 32 = 2 × (AD + BC) → AD + BC = 16'],
    explain: 'AD + BC = 32 ÷ 2 = 16 → BC = 16 − 6 = 10',
  },
  {
    concept: 'circle-tangent-length', level: '심화', q: '삼각형 ABC의 내접원이 세 변 BC, CA, AB와 각각 점 D, E, F에서 접한다. AB = 9, BC = 10, CA = 7일 때, AF의 길이는?',
    fig: { type: 'circle', r: 55, cy: 150, circum: { at: [265, 25, 150], names: ['C', 'A', 'B'], touch: ['D', 'E', 'F'] },
      segLabels: [{ seg: 'AB', text: '9' }, { seg: 'BC', text: '10' }, { seg: 'CA', text: '7' }] },
    answer: '3', wrong: [['4', 'calc'], ['4.5', 'tangent-length'], ['2', 'calc']],
    hints: ['한 점에서 그은 두 접선의 길이는 같아요: AF = AE, BF = BD, CD = CE', 'AF = x라 하면 BD = BF = 9 − x, CD = CE = 7 − x, BD + CD = 10'],
    explain: '(9 − x) + (7 − x) = 10 → 2x = 6 → x = 3',
  },
  {
    concept: 'circle-tangent', level: '심화', q: '직선 SU가 점 T에서 원에 접하고 ∠ATU = 70°, PT = PA일 때, ∠PAT의 크기는?',
    fig: { type: 'circle', center: false, pts: tangentPts(70), tangent: { at: 'T', ends: ['U', 'S'] }, segs: ['TA', 'PA', 'PT'], highlight: { from: 'T', to: 'A' },
      angles: [{ v: 'T', a: 'U', b: 'A', text: '70°' }, { v: 'A', a: 'P', b: 'T', text: '?' }] },
    ...degChoices(55, [[70, 'calc'], [35, 'half-double-swap'], [110, 'opposite-arc']]),
    hints: ['접선과 현이 이루는 각으로 ∠TPA부터 구해요.', '∠TPA = ∠ATU = 70°, PT = PA이니 삼각형 PTA는 이등변삼각형'],
    explain: '∠TPA = 70° → ∠PAT = (180° − 70°) ÷ 2 = 55°',
  },
  {
    concept: 'circle-tangent', level: '심화', q: '선분 AB가 원 O의 지름이고 직선 AP가 점 A에서 원에 접한다. 원 위의 점 C에 대해 ∠PAC = 35°일 때, ∠CAB의 크기는?',
    fig: { type: 'circle', pts: { A: 180, B: 0, C: 110 }, tangent: { at: 'A', ends: ['Q', 'P'], len: 92 }, segs: ['AB', 'AC', 'BC'],
      angles: [{ v: 'A', a: 'P', b: 'C', text: '35°' }, { v: 'A', a: 'C', b: 'B', text: '?', r: 34, textR: 54 }] },
    ...degChoices(55, [[35, 'calc'], [70, 'tangent-double'], [45, 'calc']]),
    hints: ['접선 AP와 접점을 지나는 지름 AB는 수직이에요. ∠PAB = 90°!', '∠CAB = 90° − 35°'],
    explain: '접선 ⊥ 지름이므로 ∠PAB = 90° → ∠CAB = 90° − 35° = 55°',
  },
  {
    concept: 'circle-cyclic', level: '심화', q: '사각형 ABCD가 원에 내접하고 ∠ABD = 30°, ∠DBC = 45°일 때, ∠ADC의 크기는?',
    fig: { type: 'circle', center: false, pts: { A: 120, B: 220, C: 330, D: 60 }, segs: ['AB', 'BC', 'CD', 'DA', 'BD'],
      angles: [{ v: 'B', a: 'A', b: 'D', text: '30°' }, { v: 'B', a: 'D', b: 'C', text: '45°', r: 36, textR: 56 }, { v: 'D', a: 'A', b: 'C', text: '?' }] },
    ...degChoices(105, [[75, 'cyclic-equal'], [150, 'inscribed-no-double'], [52.5, 'half-double-swap']]),
    hints: ['∠ABC = ∠ABD + ∠DBC 로 ∠B를 먼저 구해요.', '∠ABC = 75°, 내접사각형에서 ∠B + ∠D = 180°'],
    explain: '∠ABC = 75° → ∠ADC = 180° − 75° = 105°',
  },
];

/** 문제마다 변하지 않는 짧은 ID — 도토리를 이미 받은 문제를 기억할 때 써요 (문제가 추가돼도 기존 ID는 그대로) */
function withIds(topic, list) {
  const seen = new Set();
  return list.map((q) => {
    const s = `${q.concept}|${q.q}|${q.answer}`;
    let h = 7;
    for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
    let id = `${topic[0]}${h.toString(36)}`;
    while (seen.has(id)) id += '_';
    seen.add(id);
    return { ...q, id };
  });
}

const QUESTION_BANK = {
  trig: withIds('trig', [...TRIG_QUESTIONS, ...TRIG_ADVANCED, ...TRIG_CHALLENGE]),
  circle: withIds('circle', [...CIRCLE_QUESTIONS, ...CIRCLE_ADVANCED, ...CIRCLE_CHALLENGE]),
};

function figureSVG(fig) {
  if (!fig) return '';
  if (fig.type === 'tri') return triangleSVG(fig);
  if (fig.type === 'unit') return unitCircleSVG(fig.theta);
  if (fig.type === 'circle') return circleSVG(fig);
  return '';
}
