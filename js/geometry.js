'use strict';

/* =========================================================
   공통 도우미
   ========================================================= */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const fr = (n, d) => `<span class="frac"><span>${n}</span><span>${d}</span></span>`;
const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;
const norm = (deg) => ((deg % 360) + 360) % 360;
const fmtDeg = (v) => `${+v.toFixed(1)}°`;

const COLOR = {
  ink: '#5A3D28',
  wood: '#9A6A41',
  opp: '#EF7F6E',   // sin · 높이 · 원주각
  adj: '#3FA582',   // cos · 밑변 · 중심각
  hyp: '#E0A11B',   // tan · 빗변 · 호
  q: '#8C7AE6',
  oppText: '#D9604E',
  adjText: '#24705A',
  hypText: '#B07A08',
};

/** 수학 각도(반시계, 도) 방향으로 중심 c에서 r만큼 떨어진 점 (SVG는 y가 아래로 커짐) */
function onCircle(c, r, deg) {
  return { x: c.x + r * Math.cos(toRad(deg)), y: c.y - r * Math.sin(toRad(deg)) };
}
/** from에서 to를 바라보는 수학 각도 */
function dirDeg(from, to) {
  return norm(toDeg(Math.atan2(from.y - to.y, to.x - from.x)));
}
/** ∠P1 V P2 (0~180°) */
function angleBetween(V, P1, P2) {
  const d = Math.abs(dirDeg(V, P1) - dirDeg(V, P2));
  return d > 180 ? 360 - d : d;
}

const svgLine = (p, q, color, w = 4, dash = '') =>
  `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const svgText = (p, s, { size = 18, color = COLOR.ink, anchor = 'middle', dy = 6 } = {}) =>
  `<text x="${p.x}" y="${p.y + dy}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${s}</text>`;
const svgDot = (p, r = 4.5, color = COLOR.ink) => `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${color}"/>`;
const svgHandle = (p, color) =>
  `<circle class="handle-ring" cx="${p.x}" cy="${p.y}" r="15" fill="${color}" opacity=".22"/><circle class="handle" cx="${p.x}" cy="${p.y}" r="8" fill="${color}" stroke="#fff" stroke-width="3"/>`;

/** 중심 V, 시작 각 start에서 반시계로 span만큼 그린 호 (+ 가운데 글자) */
function arcAt(V, start, span, { r = 24, color = COLOR.opp, text = '', textColor, textR, width = 3, size = 16 } = {}) {
  const s = onCircle(V, r, start);
  const e = onCircle(V, r, start + span);
  const large = span > 180 ? 1 : 0;
  let out = `<path d="M${s.x} ${s.y} A${r} ${r} 0 ${large} 0 ${e.x} ${e.y}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  if (text) out += svgText(onCircle(V, textR ?? r + 17, start + span / 2), text, { size, color: textColor ?? color });
  return out;
}
/** 꼭짓점 V에서 두 반직선 VP1, VP2 사이(180° 미만)의 각 표시 */
function angleMark(V, P1, P2, opts = {}) {
  let start = dirDeg(V, P1);
  let span = norm(dirDeg(V, P2) - start);
  if (span > 180) { start = dirDeg(V, P2); span = 360 - span; }
  return arcAt(V, start, span, opts);
}
/** 꼭짓점 V의 직각 표시 */
function rightMark(V, P1, P2, size = 13) {
  const u = (P) => { const l = Math.hypot(P.x - V.x, P.y - V.y); return { x: (P.x - V.x) / l * size, y: (P.y - V.y) / l * size }; };
  const a = u(P1), b = u(P2);
  return `<path d="M${V.x + a.x} ${V.y + a.y} L${V.x + a.x + b.x} ${V.y + a.y + b.y} L${V.x + b.x} ${V.y + b.y}" fill="none" stroke="${COLOR.wood}" stroke-width="2"/>`;
}

/* =========================================================
   정적 그림 1: 직각삼각형 (∠C = 90°)
   ========================================================= */
function triangleSVG({ theta, labels = {}, angleText = '', colored = false }) {
  const t = toRad(theta);
  const maxW = 230, maxH = 185;
  const L = Math.min(maxW / Math.cos(t), maxH / Math.sin(t));
  const A = { x: 100, y: 222 };
  const C = { x: A.x + L * Math.cos(t), y: A.y };
  const B = { x: C.x, y: A.y - L * Math.sin(t) };
  const line = colored ? { opp: COLOR.opp, adj: COLOR.adj, hyp: COLOR.hyp } : { opp: COLOR.wood, adj: COLOR.wood, hyp: COLOR.wood };
  const txt = colored ? { opp: COLOR.oppText, adj: COLOR.adjText, hyp: COLOR.hypText } : { opp: COLOR.ink, adj: COLOR.ink, hyp: COLOR.ink };
  const r = 30;

  // 밑변이 좁으면(각이 크면) 각도 글자를 빗변 바깥쪽으로 옮겨 직각 표시와 겹치지 않게
  const narrow = C.x - A.x < 120;
  const angPos = narrow ? onCircle(A, r + 14, theta + 18) : onCircle(A, r + 24, theta / 2);
  const mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const hypPos = onCircle(mid, 18, theta + 90);

  let out = `<polygon points="${A.x},${A.y} ${C.x},${C.y} ${B.x},${B.y}" fill="#FFF6DD"/>`;
  out += rightMark(C, A, B, 14);
  out += arcAt(A, 0, theta, { r, color: COLOR.opp, width: 3 });
  out += svgLine(A, C, line.adj, 5) + svgLine(C, B, line.opp, 5) + svgLine(A, B, line.hyp, 5);
  out += svgText({ x: A.x - 20, y: A.y + 4 }, 'A', { size: 22 });
  out += svgText({ x: C.x + 16, y: C.y + 16 }, 'C', { size: 22 });
  out += svgText({ x: B.x + 16, y: B.y - 6 }, 'B', { size: 22 });
  if (angleText) out += svgText(angPos, angleText, { size: 17, color: COLOR.oppText, anchor: narrow ? 'end' : 'middle' });
  if (labels.adj) out += svgText({ x: (A.x + C.x) / 2, y: A.y + 24 }, labels.adj, { size: 18, color: txt.adj });
  if (labels.opp) out += svgText({ x: C.x + 12, y: (C.y + B.y) / 2 }, labels.opp, { size: 18, color: txt.opp, anchor: 'start' });
  if (labels.hyp) out += svgText(hypPos, labels.hyp, { size: 18, color: txt.hyp, anchor: 'end' });
  return out;
}

/* =========================================================
   정적 그림 2: 원 (원주각 · 중심각 · 접선 · 내접사각형 · 접선의 길이)
   pts: { 이름: 수학 각도 }, segs: ['PA', 'OB'...], angles: [{ v, a, b, text }]
   tangent: { at: 'T', ends: ['U', 'S'], len }  (ends[0]은 at+90° 방향)
   highlight: { from, to }  from에서 반시계로 to까지의 호 강조
   outer: { name: 'P', deg, k, touch: ['A', 'B'] }  원 밖의 점 P(OP = k × 반지름)와 접선 PA, PB
   inner: { P: ['AB', 'CD'] }  두 현의 교점
   circum: { at: [접점 각도...], names: [꼭짓점...], touch: [접점 이름...] }  원에 외접하는 다각형
   rights: [['A', 'O', 'P']]  꼭짓점 A의 직각 표시,  segLabels: [{ seg: 'PA', text: '6' }]
   cx, cy, r: 원의 위치 · 반지름 바꾸기
   ========================================================= */
/** 두 직선 p1p2, q1q2의 교점 */
function lineInter(p1, p2, q1, q2) {
  const d = (p1.x - p2.x) * (q1.y - q2.y) - (p1.y - p2.y) * (q1.x - q2.x);
  if (Math.abs(d) < 1e-9) return { x: (p1.x + q1.x) / 2, y: (p1.y + q1.y) / 2 };
  const t = ((p1.x - q1.x) * (q1.y - q2.y) - (p1.y - q1.y) * (q1.x - q2.x)) / d;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
}
/** V에 모이는 선들 사이에서 가장 넓은 틈 쪽으로 떨어진 글자 위치 */
function labelAway(V, neighbors, dist = 18) {
  const dirs = neighbors.map((N) => dirDeg(V, N)).sort((a, b) => a - b);
  if (!dirs.length) return { x: V.x + dist, y: V.y - dist };
  let best = 0, bestGap = -1;
  for (let i = 0; i < dirs.length; i++) {
    const next = i + 1 < dirs.length ? dirs[i + 1] : dirs[0] + 360;
    if (next - dirs[i] > bestGap) { bestGap = next - dirs[i]; best = dirs[i] + bestGap / 2; }
  }
  return onCircle(V, dist, best);
}

function circleSVG({ pts = {}, center = true, segs = [], angles = [], tangent = null, highlight = null,
  outer = null, inner = null, circum = null, rights = [], segLabels = [], cx, cy, r }) {
  pts = { ...pts };
  const R = r ?? (circum ? 70 : 92);
  // 원 밖의 점이 그림 안에 들어오도록 원을 반대쪽으로 밀어요
  const shift = outer ? Math.max(0, outer.k * R + 42 - 200) : 0;
  const C = { x: cx ?? 200 - Math.cos(toRad(outer?.deg ?? 0)) * shift, y: cy ?? 120 };
  const P = {};
  const labelPos = {};
  const dots = new Set();
  const addPt = (k, d) => { pts[k] = d; P[k] = onCircle(C, R, d); labelPos[k] = onCircle(C, R + 18, d); dots.add(k); };
  for (const [k, d] of Object.entries(pts)) addPt(k, d);
  if (center) P.O = C;

  let back = '';   // 원 뒤에 그릴 것
  let out = '';
  if (circum) {
    const { at, names, touch = [] } = circum;
    const n = at.length;
    const V = at.map((d, i) => {
      const gap = norm(at[(i + 1) % n] - d) || 360;
      return onCircle(C, R / Math.cos(toRad(gap / 2)), d + gap / 2);
    });
    names.forEach((nm, i) => {
      P[nm] = V[i];
      labelPos[nm] = onCircle(C, Math.hypot(V[i].x - C.x, V[i].y - C.y) + 18, dirDeg(C, V[i]));
      dots.add(nm);
    });
    back += `<polygon points="${V.map((v) => `${v.x},${v.y}`).join(' ')}" fill="#FFF1C9" opacity=".7" stroke="${COLOR.wood}" stroke-width="3" stroke-linejoin="round"/>`;
    at.forEach((d, i) => {
      if (!touch[i]) return;
      addPt(touch[i], d);
      labelPos[touch[i]] = onCircle(C, R - 16, d);
    });
  }

  out += `<circle cx="${C.x}" cy="${C.y}" r="${R}" fill="#FFFBEF" stroke="${COLOR.wood}" stroke-width="3"/>`;
  if (highlight) {
    const s = pts[highlight.from];
    out += arcAt(C, s, norm(pts[highlight.to] - s), { r: R, color: '#F2B937', width: 7 });
  }
  if (tangent) {
    const d = pts[tangent.at];
    const T = P[tangent.at];
    const [e1, e2] = tangent.ends;
    const len = tangent.len ?? 135;
    P[e1] = onCircle(T, len, d + 90);
    P[e2] = onCircle(T, len, d - 90);
    labelPos[e1] = onCircle(T, len + 17, d + 90);
    labelPos[e2] = onCircle(T, len + 17, d - 90);
    out += svgLine(P[e1], P[e2], COLOR.adj, 3.5);
  }
  if (outer) {
    const { name = 'P', deg, k = 1.95, touch = ['A', 'B'] } = outer;
    const phi = toDeg(Math.acos(1 / k));
    P[name] = onCircle(C, R * k, deg);
    labelPos[name] = onCircle(C, R * k + 20, deg);
    dots.add(name);
    touch.forEach((t, i) => {
      addPt(t, deg + (i === 0 ? -phi : phi));
      out += svgLine(P[name], P[t], COLOR.adj, 3.5);
    });
  }
  for (const [nm, [s1, s2]] of Object.entries(inner || {})) {
    P[nm] = lineInter(P[s1[0]], P[s1[1]], P[s2[0]], P[s2[1]]);
    labelPos[nm] = labelAway(P[nm], [P[s1[0]], P[s1[1]], P[s2[0]], P[s2[1]]], 20);
    dots.add(nm);
  }
  for (const s of segs) out += svgLine(P[s[0]], P[s[1]], COLOR.wood, 3);
  for (const { seg, text, dx = 0, dy = 0, size = 17 } of segLabels) {
    const p = P[seg[0]], q = P[seg[1]];
    const M = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
    const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
    let nx = -(q.y - p.y) / len, ny = (q.x - p.x) / len;
    if (nx * (M.x - C.x) + ny * (M.y - C.y) < 0) { nx = -nx; ny = -ny; }   // 원 중심에서 먼 쪽에 글자
    out += svgText({ x: M.x + nx * 15 + dx, y: M.y + ny * 15 + dy }, text, { size, color: COLOR.hypText });
  }
  for (const [v, a, b] of rights) out += rightMark(P[v], P[a], P[b], 11);
  for (const a of angles) {
    const isO = a.v === 'O';
    out += angleMark(P[a.v], P[a.a], P[a.b], {
      r: a.r ?? (isO ? 20 : 24), textR: a.textR ?? (isO ? 38 : 44), text: a.text,
      color: isO ? COLOR.adj : COLOR.opp, textColor: isO ? COLOR.adjText : COLOR.oppText,
    });
  }
  if (center) out += svgDot(C, 4) + svgText({ x: C.x - 13, y: C.y - 10 }, 'O', { size: 17 });
  for (const k of Object.keys(labelPos)) {
    if (dots.has(k)) out += svgDot(P[k]);
    out += svgText(labelPos[k], k, { size: 19 });
  }
  return back + out;
}

/* =========================================================
   정적/동적 그림 3: 단위원 (반지름 1인 사분원)
   ========================================================= */
function unitCircleSVG(theta, { handle = false } = {}) {
  const O = { x: 60, y: 262 }, R = 200;
  const P = onCircle(O, R, theta);
  const H = { x: P.x, y: O.y };
  const A = { x: O.x + R, y: O.y };
  const tanOk = theta < 89.5;
  const T = tanOk ? { x: A.x, y: O.y - R * Math.tan(toRad(theta)) } : null;

  let out = '<defs><clipPath id="uc-clip"><rect x="0" y="0" width="380" height="310"/></clipPath></defs><g clip-path="url(#uc-clip)">';
  out += svgLine({ x: O.x - 25, y: O.y }, { x: A.x + 60, y: O.y }, '#C9AC86', 2);
  out += svgLine({ x: O.x, y: O.y + 22 }, { x: O.x, y: 22 }, '#C9AC86', 2);
  out += `<path d="M${A.x} ${A.y} A${R} ${R} 0 0 0 ${O.x} ${O.y - R}" fill="none" stroke="${COLOR.wood}" stroke-width="3"/>`;
  out += svgLine({ x: A.x, y: O.y + 10 }, { x: A.x, y: 0 }, '#E3CBA5', 2, '6 6');
  out += `<polygon points="${O.x},${O.y} ${H.x},${H.y} ${P.x},${P.y}" fill="#FFF1C9" opacity=".8"/>`;
  if (T) out += svgLine(P, T, COLOR.wood, 2, '5 5');
  out += svgLine(O, P, COLOR.wood, 3.5);
  out += svgLine(O, H, COLOR.adj, 7);
  out += svgLine(H, P, COLOR.opp, 7);
  if (T) out += svgLine(A, T, COLOR.hyp, 7);
  if (theta > 5 && theta < 85) out += rightMark(H, O, P, 12);
  out += arcAt(O, 0, theta, { r: 34, color: COLOR.opp, text: theta > 6 ? 'x' : '', textR: 50 });

  out += svgText({ x: O.x - 16, y: O.y + 16 }, 'O');
  out += svgText({ x: A.x + 14, y: A.y + 16 }, 'A');
  if (theta > 4 && theta < 86) out += svgText({ x: H.x, y: O.y + 18 }, 'H');
  out += svgText(onCircle(O, R + 18, theta), 'P');
  out += svgText(onCircle({ x: (O.x + P.x) / 2, y: (O.y + P.y) / 2 }, 14, theta + 90), '1', { size: 16, color: COLOR.wood });
  if (theta > 6) out += svgText({ x: H.x - 9, y: (O.y + P.y) / 2 }, 'sin x', { size: 15, color: COLOR.oppText, anchor: 'end' });
  out += svgText({ x: (O.x + H.x) / 2, y: O.y + 34 }, 'cos x', { size: 15, color: COLOR.adjText });
  if (T) {
    if (T.y > 24) out += svgText({ x: A.x + 12, y: T.y }, 'T', { anchor: 'start' });
    if (theta > 4) out += svgText({ x: A.x + 12, y: Math.max((O.y + T.y) / 2, 40) + 18 }, 'tan x', { size: 15, color: COLOR.hypText, anchor: 'start' });
  }
  if (handle) out += svgHandle(P, COLOR.opp);
  out += '</g>';
  return out;
}

/* =========================================================
   드래그 도우미: SVG 안의 가장 가까운 손잡이를 잡아 끌기
   ========================================================= */
function makeDraggable(svg, getHandles, onDrag) {
  let active = null;
  const toSvg = (e) => {
    const p = svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  };
  svg.addEventListener('pointerdown', (e) => {
    const p = toSvg(e);
    let best = null, bestD = Infinity;
    for (const [k, h] of Object.entries(getHandles())) {
      const d = Math.hypot(h.x - p.x, h.y - p.y);
      if (d < bestD) { bestD = d; best = k; }
    }
    if (best && bestD < 40) {
      active = best;
      svg.setPointerCapture(e.pointerId);
      svg.classList.add('dragging');
      e.preventDefault();
      onDrag(active, p);
    }
  });
  svg.addEventListener('pointermove', (e) => { if (active) onDrag(active, toSvg(e)); });
  const end = () => { active = null; svg.classList.remove('dragging'); };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);
}

/* =========================================================
   개념 1: 직각삼각형 실험
   ========================================================= */
function drawLab() {
  const theta = Number($('#angle-range').value);
  const t = toRad(theta);
  $('#angle-val').textContent = theta;
  $('#lab-svg').innerHTML = triangleSVG({
    theta, labels: { opp: '높이', adj: '밑변', hyp: '빗변' }, angleText: `${theta}°`, colored: true,
  });
  $('#sin-val').textContent = Math.sin(t).toFixed(3);
  $('#cos-val').textContent = Math.cos(t).toFixed(3);
  $('#tan-val').textContent = Math.tan(t).toFixed(3);
}

/* =========================================================
   개념 2: 단위원 드래그
   ========================================================= */
const unitState = { theta: 35 };
const UNIT_O = { x: 60, y: 262 }, UNIT_R = 200;

function renderUnit() {
  const th = unitState.theta;
  const t = toRad(th);
  $('#unit-svg').innerHTML = unitCircleSVG(th, { handle: true });
  $('#u-angle').textContent = Math.round(th);
  $('#unit-range').value = Math.round(th);
  $('#u-sin').textContent = Math.sin(t).toFixed(3);
  $('#u-cos').textContent = Math.cos(t).toFixed(3);
  $('#u-tan').textContent = th >= 89.5 ? '정할 수 없음' : Math.tan(t).toFixed(3);
}

function initUnit() {
  const svg = $('#unit-svg');
  makeDraggable(svg, () => ({ p: onCircle(UNIT_O, UNIT_R, unitState.theta) }), (_, pt) => {
    const d = toDeg(Math.atan2(UNIT_O.y - pt.y, pt.x - UNIT_O.x));
    unitState.theta = Math.round(Math.min(90, Math.max(0, d)));
    renderUnit();
  });
  $('#unit-range').addEventListener('input', (e) => { unitState.theta = Number(e.target.value); renderUnit(); });
}

/* =========================================================
   개념 3: 각에 따른 sin · cos · tan 변화 실험실
   ========================================================= */
const FN = {
  sin: { label: 'sin x', color: COLOR.opp, text: COLOR.oppText, f: (x) => Math.sin(toRad(x)) },
  cos: { label: 'cos x', color: COLOR.adj, text: COLOR.adjText, f: (x) => Math.cos(toRad(x)) },
  tan: { label: 'tan x', color: COLOR.hyp, text: COLOR.hypText, f: (x) => (x >= 89.5 ? Infinity : Math.tan(toRad(x))) },
};
const EXP_MODES = {
  sin: { fns: ['sin'], ymax: 1.2, ticks: [0, 0.5, 1] },
  cos: { fns: ['cos'], ymax: 1.2, ticks: [0, 0.5, 1] },
  tan: { fns: ['tan'], ymax: 4, ticks: [0, 1, 2, 3, 4] },
  all: { fns: ['sin', 'cos', 'tan'], ymax: 2, ticks: [0, 0.5, 1, 1.5, 2] },
};
const EXP_NOTES = {
  sin: 'x가 커질수록 sin x도 커져요. 0° 에서 0, 90° 에서 1 — 1보다 커지지 않아요.',
  cos: 'x가 커질수록 cos x는 작아져요. 0° 에서 1, 90° 에서 0 — sin과 반대로 움직여요.',
  tan: 'tan 45° = 1 을 지나면 급격히 커지고, 90° 에 가까워질수록 한없이 커져요. tan 90° 는 정할 수 없어요.',
  all: '45° 에서 sin x = cos x! 그리고 sin x = cos(90° − x) — 두 곡선은 45° 를 기준으로 거울처럼 대칭이에요.',
};
const EXP_QUESTIONS = [
  { q: 'x가 0°에서 90°까지 커지면 sin x의 값은?', opts: ['점점 커진다', '점점 작아진다', '변하지 않는다'], a: 0, why: 'sin 0° = 0 → sin 90° = 1, 점점 커져요.' },
  { q: 'x가 0°에서 90°까지 커지면 cos x의 값은?', opts: ['점점 커진다', '점점 작아진다', '변하지 않는다'], a: 1, why: 'cos 0° = 1 → cos 90° = 0, 점점 작아져요.' },
  { q: 'x가 90°에 가까워지면 tan x의 값은?', opts: ['한없이 커진다', '0에 가까워진다', '1을 넘지 않는다'], a: 0, why: 'tan 60° ≈ 1.73, tan 80° ≈ 5.67, tan 89° ≈ 57.3 … 한없이 커져요.' },
  { q: 'sin x와 cos x의 값이 같아지는 x는?', opts: ['30°', '45°', '60°'], a: 1, why: 'sin 45° = cos 45° = √2/2 ≈ 0.707' },
  { q: '0° ≤ x ≤ 90°일 때 sin x, cos x의 값의 범위는?', opts: ['0 이상 1 이하', '0 이상 2 이하', '정해지지 않는다'], a: 0, why: '빗변(반지름 1)보다 높이·밑변이 길 수 없으니 0 ≤ sin x, cos x ≤ 1' },
];

const exp = { mode: 'sin', angle: 30, playing: false, raf: 0, records: [] };
const G = { left: 52, right: 420, top: 22, bottom: 256 };
const gx = (deg) => G.left + (deg / 90) * (G.right - G.left);

function fmtVal(v) {
  return Number.isFinite(v) ? v.toFixed(3) : '없음';
}

function renderExperiment() {
  const { mode, angle } = exp;
  const cfg = EXP_MODES[mode];
  const gy = (v) => G.bottom - (v / cfg.ymax) * (G.bottom - G.top);
  const single = cfg.fns.length === 1;

  let out = `<defs><clipPath id="exp-clip"><rect x="${G.left}" y="${G.top - 4}" width="${G.right - G.left + 8}" height="${G.bottom - G.top + 4}"/></clipPath></defs>`;
  out += `<rect x="${G.left}" y="${G.top}" width="${G.right - G.left}" height="${G.bottom - G.top}" fill="#FFFDF5" rx="6"/>`;

  // 격자 · 눈금
  for (const d of [0, 15, 30, 45, 60, 75, 90]) {
    out += svgLine({ x: gx(d), y: G.top }, { x: gx(d), y: G.bottom }, '#EFE2CC', 1.5);
    out += svgText({ x: gx(d), y: G.bottom + 16 }, `${d}°`, { size: 13, color: '#866650' });
  }
  for (const v of cfg.ticks) {
    out += svgLine({ x: G.left, y: gy(v) }, { x: G.right, y: gy(v) }, v === 1 ? '#E9C77B' : '#EFE2CC', v === 1 ? 2 : 1.5, v === 1 ? '6 5' : '');
    out += svgText({ x: G.left - 8, y: gy(v) - 1 }, String(v), { size: 13, color: '#866650', anchor: 'end' });
  }
  out += svgLine({ x: G.left, y: G.bottom }, { x: G.right + 6, y: G.bottom }, COLOR.wood, 2.5);
  out += svgLine({ x: G.left, y: G.bottom }, { x: G.left, y: G.top - 6 }, COLOR.wood, 2.5);
  out += svgText({ x: G.right + 14, y: G.bottom - 14 }, 'x', { size: 15 });

  // 곡선: 전체(흐리게) + 현재 각도까지(진하게)
  out += '<g clip-path="url(#exp-clip)">';
  for (const k of cfg.fns) {
    const fn = FN[k];
    const path = (to) => {
      let d = '';
      for (let x = 0; x <= to; x += 0.5) {
        const v = fn.f(x);
        if (!Number.isFinite(v) || v > cfg.ymax * 1.6) break;
        d += `${d ? 'L' : 'M'}${gx(x).toFixed(1)} ${gy(v).toFixed(1)} `;
      }
      return d;
    };
    out += `<path d="${path(90)}" fill="none" stroke="${fn.color}" stroke-width="3" opacity=".25" stroke-dasharray="6 6"/>`;
    out += `<path d="${path(angle)}" fill="none" stroke="${fn.color}" stroke-width="4.5" stroke-linecap="round"/>`;
  }
  out += '</g>';

  // 현재 각도 표시
  out += svgLine({ x: gx(angle), y: G.top }, { x: gx(angle), y: G.bottom }, '#C9AC86', 2, '4 4');
  for (const k of cfg.fns) {
    const fn = FN[k];
    const v = fn.f(angle);
    if (!Number.isFinite(v) || v > cfg.ymax) {
      out += svgText({ x: gx(angle) + (angle > 60 ? -10 : 10), y: G.top + 8 }, Number.isFinite(v) ? '↑ 계속 커져요' : '↑ 정할 수 없음', { size: 13, color: fn.text, anchor: angle > 60 ? 'end' : 'start' });
      continue;
    }
    const p = { x: gx(angle), y: gy(v) };
    if (single) out += svgLine({ x: G.left, y: p.y }, p, fn.color, 1.5, '4 4');
    out += `<circle cx="${p.x}" cy="${p.y}" r="7" fill="${fn.color}" stroke="#fff" stroke-width="3"/>`;
    const right = angle < 62;
    out += svgText({ x: p.x + (right ? 12 : -12), y: p.y - 12 }, `${fn.label.replace('x', `${angle}°`)} = ${v.toFixed(3)}`, { size: 13.5, color: fn.text, anchor: right ? 'start' : 'end' });
  }
  if (mode === 'all') {
    const p = { x: gx(45), y: gy(Math.SQRT1_2) };
    out += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="none" stroke="${COLOR.ink}" stroke-width="2"/>`;
  }
  $('#exp-svg').innerHTML = out;

  // 값 카드
  $('#exp-angle').textContent = angle;
  $('#exp-range').value = angle;
  $('#exp-values').innerHTML = cfg.fns.map((k) => {
    const fn = FN[k];
    const v = fn.f(angle);
    const next = angle < 90 ? fn.f(angle + 1) : NaN;
    const diff = Number.isFinite(v) && Number.isFinite(next) ? next - v : NaN;
    const trend = Number.isFinite(diff)
      ? `x가 1° 커지면 ${diff >= 0 ? '▲' : '▼'} ${Math.abs(diff).toFixed(3)}`
      : (k === 'tan' && angle >= 89 ? '90°에서는 정할 수 없어요' : '끝까지 왔어요');
    return `<div class="exp-card" style="--c:${fn.color}">
      <span>${fn.label.replace('x', `${angle}°`)}</span>
      <b>${fmtVal(v)}</b>
      <small>${trend}</small>
    </div>`;
  }).join('');
  $('#exp-note').textContent = `🔬 ${EXP_NOTES[mode]}`;

  $$('.rec-table th, .rec-table td').forEach((el) => el.classList.remove('hl'));
  if (single) {
    const col = { sin: 2, cos: 3, tan: 4 }[mode];
    $$(`.rec-table tr > :nth-child(${col})`).forEach((el) => el.classList.add('hl'));
  }
}

function renderRecords() {
  const body = $('#exp-rec-body');
  body.innerHTML = exp.records.length
    ? exp.records.map((x) => `<tr><td>${x}°</td><td>${fmtVal(FN.sin.f(x))}</td><td>${fmtVal(FN.cos.f(x))}</td><td>${fmtVal(FN.tan.f(x))}</td></tr>`).join('')
    : '<tr><td colspan="4" class="empty">각도를 정하고 "지금 각도 기록"을 눌러 보세요.</td></tr>';
  renderExperiment();
}

function setExpAngle(a) {
  exp.angle = Math.max(0, Math.min(90, Math.round(a)));
  renderExperiment();
}

function stopPlay() {
  exp.playing = false;
  cancelAnimationFrame(exp.raf);
  $('#exp-play').textContent = '▶ 0°부터 재생';
}

function togglePlay() {
  if (exp.playing) { stopPlay(); return; }
  exp.playing = true;
  $('#exp-play').textContent = '⏸ 멈춤';
  const startAt = performance.now();
  const duration = 6000;
  const step = (now) => {
    const k = Math.min(1, (now - startAt) / duration);
    setExpAngle(k * 90);
    if (k < 1 && exp.playing) exp.raf = requestAnimationFrame(step);
    else stopPlay();
  };
  exp.raf = requestAnimationFrame(step);
}

function renderExpQuestions() {
  $('#exp-questions').innerHTML = EXP_QUESTIONS.map((item, i) => `
    <li data-q="${i}">
      <span>${item.q}</span>
      <div class="exp-opts">${item.opts.map((o, j) => `<button type="button" data-opt="${j}">${o}</button>`).join('')}</div>
      <p class="exp-why" hidden></p>
    </li>`).join('');
}

function initExperiment() {
  $$('.exp-tab').forEach((tab) => tab.addEventListener('click', () => {
    exp.mode = tab.dataset.fn;
    $$('.exp-tab').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    renderExperiment();
  }));
  $('#exp-range').addEventListener('input', (e) => { stopPlay(); setExpAngle(Number(e.target.value)); });
  $$('.exp-quick [data-angle]').forEach((b) => b.addEventListener('click', () => { stopPlay(); setExpAngle(Number(b.dataset.angle)); }));
  $('#exp-play').addEventListener('click', togglePlay);
  $('#exp-rec').addEventListener('click', () => {
    if (!exp.records.includes(exp.angle)) {
      exp.records = [...exp.records, exp.angle].sort((a, b) => a - b).slice(-12);
    }
    renderRecords();
  });
  $('#exp-clear').addEventListener('click', () => { exp.records = []; renderRecords(); });

  renderExpQuestions();
  $('#exp-questions').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-opt]');
    if (!btn) return;
    const li = btn.closest('li');
    const item = EXP_QUESTIONS[Number(li.dataset.q)];
    const ok = Number(btn.dataset.opt) === item.a;
    $$('[data-opt]', li).forEach((b) => b.classList.remove('right', 'wrong'));
    btn.classList.add(ok ? 'right' : 'wrong');
    const why = $('.exp-why', li);
    why.hidden = false;
    why.className = `exp-why ${ok ? 'ok' : 'no'}`;
    why.textContent = ok ? `맞아요! ${item.why}` : '그래프를 다시 관찰해 볼까요? 위에서 재생 버튼을 눌러 보세요.';
  });
  renderRecords();
}

/* =========================================================
   원 1: 원주각과 중심각 드래그
   ========================================================= */
const INSC_C = { x: 180, y: 150 }, INSC_R = 112;
const INSC_DEFAULT = { a: 215, b: 325, p: 100, q: 40 };
const insc = { ...INSC_DEFAULT, showQ: false, guide: false };

function renderInscribed() {
  const C = INSC_C, R = INSC_R;
  const A = onCircle(C, R, insc.a), B = onCircle(C, R, insc.b), P = onCircle(C, R, insc.p);
  const s = norm(insc.b - insc.a);
  const pIn = norm(insc.p - insc.a) < s;               // P가 A→B(반시계) 호 위에 있나?
  const arcStart = pIn ? insc.b : insc.a;               // P 반대쪽 호
  const arcSpan = pIn ? 360 - s : s;
  const central = arcSpan;
  const inscribed = angleBetween(P, A, B);

  let out = `<circle cx="${C.x}" cy="${C.y}" r="${R}" fill="#FFFBEF" stroke="${COLOR.wood}" stroke-width="3"/>`;
  out += arcAt(C, arcStart, arcSpan, { r: R, color: '#F2B937', width: 8 });
  if (insc.guide) {
    const D = onCircle(C, R, insc.p + 180);
    out += svgLine(P, D, COLOR.q, 2.5, '7 6') + svgDot(D, 4, COLOR.q) + svgText(onCircle(C, R + 18, insc.p + 180), 'D', { color: COLOR.q });
  }
  out += svgLine(A, B, '#D9C3A0', 2, '5 5');
  out += svgLine(C, A, COLOR.adj, 3.5) + svgLine(C, B, COLOR.adj, 3.5);
  out += svgLine(P, A, COLOR.opp, 3.5) + svgLine(P, B, COLOR.opp, 3.5);
  out += arcAt(C, arcStart, arcSpan, { r: 26, color: COLOR.adj, text: fmtDeg(central), textR: 46, textColor: COLOR.adjText });
  out += angleMark(P, A, B, { r: 30, color: COLOR.opp, text: fmtDeg(inscribed), textR: 52, textColor: COLOR.oppText });

  let qAngle = null, qSame = true;
  if (insc.showQ) {
    const Q = onCircle(C, R, insc.q);
    qAngle = angleBetween(Q, A, B);
    qSame = (norm(insc.q - insc.a) < s) === pIn;
    out += svgLine(Q, A, COLOR.q, 3) + svgLine(Q, B, COLOR.q, 3);
    out += angleMark(Q, A, B, { r: 26, color: COLOR.q, text: fmtDeg(qAngle), textR: 48 });
    out += svgText(onCircle(C, R + 20, insc.q), 'Q', { color: COLOR.q });
  }
  out += svgDot(C, 4) + svgText({ x: C.x + 4, y: C.y - 12 }, 'O', { size: 17 });
  out += svgText(onCircle(C, R + 20, insc.a), 'A') + svgText(onCircle(C, R + 20, insc.b), 'B') + svgText(onCircle(C, R + 20, insc.p), 'P');
  out += svgHandle(A, COLOR.hyp) + svgHandle(B, COLOR.hyp) + svgHandle(P, COLOR.opp);
  if (insc.showQ) out += svgHandle(onCircle(C, R, insc.q), COLOR.q);
  $('#inscribed-svg').innerHTML = out;

  $('#i-insc').textContent = fmtDeg(inscribed);
  $('#i-central').textContent = `${fmtDeg(central)} = 2 × ${fmtDeg(inscribed)}`;
  $('#i-q-row').hidden = !insc.showQ;
  if (insc.showQ) {
    $('#i-q').textContent = qSame ? `${fmtDeg(qAngle)} = ∠APB` : `${fmtDeg(qAngle)} = 180° − ∠APB`;
  }
  let note = `✔ 중심각 ∠AOB(${fmtDeg(central)})는 원주각 ∠APB(${fmtDeg(inscribed)})의 정확히 2배예요.`;
  if (central > 180) note += ' 중심각이 180°보다 커도 이 관계는 그대로!';
  if (insc.showQ && !qSame) note += ' 점 Q는 P와 반대쪽 호 위에 있어서 ∠AQB = 180° − ∠APB 가 돼요.';
  else if (insc.showQ) note += ' P와 Q는 같은 호 위에 있으니 원주각이 같아요.';
  if (insc.guide) note += ' 보조선 PD로 나눈 두 이등변삼각형에서 바깥각 = 2 × 밑각임을 확인해 보세요.';
  $('#i-note').textContent = note;
}

function initInscribed() {
  const svg = $('#inscribed-svg');
  makeDraggable(svg, () => {
    const h = { a: onCircle(INSC_C, INSC_R, insc.a), b: onCircle(INSC_C, INSC_R, insc.b), p: onCircle(INSC_C, INSC_R, insc.p) };
    if (insc.showQ) h.q = onCircle(INSC_C, INSC_R, insc.q);
    return h;
  }, (key, pt) => {
    const d = dirDeg(INSC_C, pt);
    const others = ['a', 'b', 'p', ...(insc.showQ ? ['q'] : [])].filter((k) => k !== key);
    const tooClose = others.some((k) => { const diff = norm(d - insc[k]); return Math.min(diff, 360 - diff) < 10; });
    if (tooClose) return;
    insc[key] = d;
    renderInscribed();
  });
  $('#insc-guide').addEventListener('change', (e) => { insc.guide = e.target.checked; renderInscribed(); });
  $('#insc-q').addEventListener('change', (e) => { insc.showQ = e.target.checked; renderInscribed(); });
  $('#insc-reset').addEventListener('click', () => { Object.assign(insc, INSC_DEFAULT); renderInscribed(); });
}

/* =========================================================
   원 2: 접선과 현이 이루는 각 드래그
   ========================================================= */
const TAN_C = { x: 180, y: 135 }, TAN_R = 105, T_DEG = 270;
const TAN_DEFAULT = { a: 40, p: 150 };
const tg = { ...TAN_DEFAULT };

function renderTangent() {
  const C = TAN_C, R = TAN_R;
  const T = onCircle(C, R, T_DEG);
  const A = onCircle(C, R, tg.a), P = onCircle(C, R, tg.p);
  const U = { x: T.x + 155, y: T.y }, S = { x: T.x - 155, y: T.y };
  const spanIn = norm(tg.a - T_DEG);           // ∠ATU 안쪽 호 TA
  const angleT = spanIn / 2;
  const angleP = angleBetween(P, T, A);

  let out = `<circle cx="${C.x}" cy="${C.y}" r="${R}" fill="#FFFBEF" stroke="${COLOR.wood}" stroke-width="3"/>`;
  out += arcAt(C, T_DEG, spanIn, { r: R, color: '#F2B937', width: 8 });
  out += svgLine(S, U, COLOR.adj, 3.5);
  out += svgLine(C, T, '#D9C3A0', 2, '5 5') + rightMark(T, C, U, 11);
  out += svgLine(T, A, COLOR.wood, 3.5);
  out += svgLine(P, T, COLOR.opp, 3.5) + svgLine(P, A, COLOR.opp, 3.5);
  out += angleMark(T, U, A, { r: 30, color: COLOR.adj, text: fmtDeg(angleT), textR: 52, textColor: COLOR.adjText });
  out += angleMark(P, T, A, { r: 28, color: COLOR.opp, text: fmtDeg(angleP), textR: 50, textColor: COLOR.oppText });
  out += svgDot(C, 4) + svgText({ x: C.x - 14, y: C.y - 8 }, 'O', { size: 17 });
  out += svgText({ x: T.x, y: T.y + 18 }, 'T') + svgText({ x: U.x + 2, y: U.y + 18 }, 'U') + svgText({ x: S.x - 2, y: S.y + 18 }, 'S');
  out += svgText(onCircle(C, R + 20, tg.a), 'A') + svgText(onCircle(C, R + 20, tg.p), 'P');
  out += svgHandle(A, COLOR.hyp) + svgHandle(P, COLOR.opp);
  $('#tangent-svg').innerHTML = out;

  $('#t-tan').textContent = fmtDeg(angleT);
  $('#t-insc').textContent = `${fmtDeg(angleP)} = ∠ATU`;
  $('#t-note').textContent = `✔ 접선 TU와 현 TA가 이루는 각(${fmtDeg(angleT)})은 노란 호 TA에 대한 원주각 ∠APT(${fmtDeg(angleP)})와 같아요. 노란 호에 대한 중심각은 ${fmtDeg(spanIn)}!`;
}

function initTangent() {
  makeDraggable($('#tangent-svg'), () => ({
    a: onCircle(TAN_C, TAN_R, tg.a), p: onCircle(TAN_C, TAN_R, tg.p),
  }), (key, pt) => {
    const d = dirDeg(TAN_C, pt);
    if (key === 'a') {
      const off = norm(d - T_DEG);
      if (off < 14 || off > 346) return;            // T와 너무 가까우면 무시
      tg.a = d;
      const span = norm(T_DEG - tg.a);
      const pOff = norm(tg.p - tg.a);
      if (pOff < 8 || pOff > span - 8) tg.p = norm(tg.a + span / 2); // P는 반대쪽 호에 머물도록
    } else {
      const span = norm(T_DEG - tg.a);
      const off = norm(d - tg.a);
      if (off < 8 || off > span - 8) return;
      tg.p = d;
    }
    renderTangent();
  });
  $('#tan-reset').addEventListener('click', () => { Object.assign(tg, TAN_DEFAULT); renderTangent(); });
}

/* =========================================================
   원 3: 원의 접선의 길이 드래그 (원 밖의 점 P 이동)
   ========================================================= */
const TL_C = { x: 228, y: 150 }, TL_R = 82, TL_UNIT = 4 / TL_R;   // 반지름을 4칸으로
const TL_DEFAULT = { x: 62, y: 150 };
const tl = { ...TL_DEFAULT, tri: false };

function renderTangentLength() {
  const C = TL_C, R = TL_R, Pp = { x: tl.x, y: tl.y };
  const k = Math.hypot(Pp.x - C.x, Pp.y - C.y) / R;
  const dir = dirDeg(C, Pp);
  const phi = toDeg(Math.acos(1 / k));
  const A = onCircle(C, R, dir - phi), B = onCircle(C, R, dir + phi);
  const len = R * Math.sqrt(k * k - 1) * TL_UNIT;
  const angP = angleBetween(Pp, A, B), angO = angleBetween(C, A, B);
  const f1 = (v) => (+v.toFixed(1)).toString();

  let out = '';
  if (tl.tri) {
    out += `<polygon points="${C.x},${C.y} ${A.x},${A.y} ${Pp.x},${Pp.y}" fill="${COLOR.opp}" opacity=".22"/>`;
    out += `<polygon points="${C.x},${C.y} ${B.x},${B.y} ${Pp.x},${Pp.y}" fill="${COLOR.adj}" opacity=".22"/>`;
  }
  out += `<circle cx="${C.x}" cy="${C.y}" r="${R}" fill="#FFFBEF" fill-opacity="${tl.tri ? 0 : 1}" stroke="${COLOR.wood}" stroke-width="3"/>`;
  out += svgLine(C, A, '#D9C3A0', 2, '5 5') + svgLine(C, B, '#D9C3A0', 2, '5 5') + svgLine(C, Pp, '#D9C3A0', 2, '5 5');
  out += rightMark(A, C, Pp, 11) + rightMark(B, C, Pp, 11);
  out += svgLine(Pp, A, COLOR.opp, 4) + svgLine(Pp, B, COLOR.adj, 4);
  out += angleMark(Pp, A, B, { r: 26, color: COLOR.hyp, text: fmtDeg(angP), textR: 48, textColor: COLOR.hypText });
  out += angleMark(C, A, B, { r: 20, color: COLOR.q, text: fmtDeg(angO), textR: 38, textColor: '#6B5BC4' });
  // 길이 글자: 접선 중점에서 원 중심과 먼 쪽으로
  const lab = (Q, color) => {
    const M = { x: (Pp.x + Q.x) / 2, y: (Pp.y + Q.y) / 2 };
    const away = dirDeg(C, M);
    return svgText(onCircle(M, 16, away), f1(len), { size: 16, color });
  };
  out += lab(A, COLOR.oppText) + lab(B, COLOR.adjText);
  out += svgDot(C, 4) + svgText({ x: C.x + 4, y: C.y + 18 }, 'O', { size: 17 });
  out += svgDot(A) + svgText(onCircle(C, R + 18, dir - phi), 'A') + svgDot(B) + svgText(onCircle(C, R + 18, dir + phi), 'B');
  out += svgText(onCircle(Pp, 22, dir), 'P');
  out += svgHandle(Pp, COLOR.hyp);
  $('#tanlen-svg').innerHTML = out;

  $('#l-pa').textContent = f1(len);
  $('#l-pb').textContent = `${f1(len)} = PA`;
  $('#l-apb').textContent = fmtDeg(angP);
  $('#l-aob').textContent = `${fmtDeg(angO)} (합 ${fmtDeg(angP + angO)})`;
  $('#l-note').textContent = tl.tri
    ? `✔ 직각삼각형 OAP와 OBP는 OA = OB(반지름), OP는 공통, ∠A = ∠B = 90°라서 합동이에요. 그래서 PA = PB = ${f1(len)}!`
    : `✔ 점 P를 어디로 옮겨도 PA = PB예요. 접선은 반지름과 수직(∠A = ∠B = 90°)이라 ∠APB + ∠AOB = ${fmtDeg(angP + angO)}예요.`;
}

function initTangentLength() {
  makeDraggable($('#tanlen-svg'), () => ({ p: { x: tl.x, y: tl.y } }), (key, pt) => {
    const C = TL_C, R = TL_R;
    const dir = dirDeg(C, pt);
    const k = Math.min(2.6, Math.max(1.3, Math.hypot(pt.x - C.x, pt.y - C.y) / R));
    let Q = onCircle(C, k * R, dir);
    Q = { x: Math.min(336, Math.max(28, Q.x)), y: Math.min(272, Math.max(28, Q.y)) };   // 그림 밖으로 못 나가게
    if (Math.hypot(Q.x - C.x, Q.y - C.y) < R * 1.25) return;
    tl.x = Q.x; tl.y = Q.y;
    renderTangentLength();
  });
  $('#tl-tri').addEventListener('change', (e) => { tl.tri = e.target.checked; renderTangentLength(); });
  $('#tl-reset').addEventListener('click', () => { Object.assign(tl, TL_DEFAULT); renderTangentLength(); });
}

/* =========================================================
   원 4: 원에 내접하는 사각형 드래그
   ========================================================= */
const CYC_C = { x: 180, y: 150 }, CYC_R = 112;
const CYC_DEFAULT = { a: 150, b: 215, c: 300, d: 40 };
const cyc = { ...CYC_DEFAULT, arcs: false, ext: false };
const CYC_KEYS = ['a', 'b', 'c', 'd'];

/** A → B → C → D 순서(반시계)가 유지되고 점끼리 12° 이상 떨어져 있는지 */
function cyclicOrderOk(s) {
  const offs = CYC_KEYS.map((k) => norm(s[k] - s.a));
  for (let i = 1; i < 4; i++) if (offs[i] - offs[i - 1] < 12) return false;
  return 360 - offs[3] >= 12;
}

function renderCyclic() {
  const C = CYC_C, R = CYC_R;
  const P = Object.fromEntries(CYC_KEYS.map((k) => [k, onCircle(C, R, cyc[k])]));
  const angA = angleBetween(P.a, P.b, P.d), angB = angleBetween(P.b, P.a, P.c);
  const angC = angleBetween(P.c, P.b, P.d), angD = angleBetween(P.d, P.a, P.c);

  let out = `<circle cx="${C.x}" cy="${C.y}" r="${R}" fill="#FFFBEF" stroke="${COLOR.wood}" stroke-width="3"/>`;
  if (cyc.arcs) {
    // ∠A가 바라보는 호 BCD(노랑), ∠C가 바라보는 호 DAB(보라) — 두 호를 합치면 원 한 바퀴 360°
    out += arcAt(C, cyc.b, norm(cyc.d - cyc.b), { r: R, color: '#F2B937', width: 8 });
    out += arcAt(C, cyc.d, norm(cyc.b - cyc.d), { r: R, color: '#B9AEEE', width: 8 });
  }
  out += `<polygon points="${CYC_KEYS.map((k) => `${P[k].x},${P[k].y}`).join(' ')}" fill="#FFF1C9" opacity=".75"/>`;
  out += CYC_KEYS.map((k, i) => svgLine(P[k], P[CYC_KEYS[(i + 1) % 4]], COLOR.wood, 3.5)).join('');
  if (cyc.arcs) out += svgLine(P.b, P.d, '#D9C3A0', 2, '5 5');

  const mark = (V, X, Y, color, textColor, val) => angleMark(V, X, Y, { r: 24, color, textColor, text: fmtDeg(val), textR: 44 });
  out += mark(P.a, P.b, P.d, COLOR.opp, COLOR.oppText, angA) + mark(P.c, P.b, P.d, COLOR.opp, COLOR.oppText, angC);
  out += mark(P.b, P.a, P.c, COLOR.adj, COLOR.adjText, angB) + mark(P.d, P.a, P.c, COLOR.adj, COLOR.adjText, angD);

  let ext = null;
  if (cyc.ext) {
    // 변 CD를 D 바깥으로 늘인 점 E
    const len = Math.hypot(P.d.x - P.c.x, P.d.y - P.c.y);
    const E = { x: P.d.x + (P.d.x - P.c.x) / len * 70, y: P.d.y + (P.d.y - P.c.y) / len * 70 };
    ext = angleBetween(P.d, E, P.a);
    out += svgLine(P.d, E, COLOR.q, 2.5, '6 5') + svgText({ x: E.x + (E.x - P.d.x) * 0.2, y: E.y + (E.y - P.d.y) * 0.2 }, 'E', { size: 16, color: COLOR.q });
    out += angleMark(P.d, E, P.a, { r: 34, color: COLOR.q, text: fmtDeg(ext), textR: 54 });
  }
  for (const k of CYC_KEYS) out += svgText(onCircle(C, R + 20, cyc[k]), k.toUpperCase());
  out += svgHandle(P.a, COLOR.opp) + svgHandle(P.c, COLOR.opp) + svgHandle(P.b, COLOR.adj) + svgHandle(P.d, COLOR.adj);
  $('#cyclic-svg').innerHTML = out;

  $('#c-ac').textContent = `${fmtDeg(angA)} + ${fmtDeg(angC)} = ${fmtDeg(angA + angC)}`;
  $('#c-bd').textContent = `${fmtDeg(angB)} + ${fmtDeg(angD)} = ${fmtDeg(angB + angD)}`;
  $('#c-ext-row').hidden = !cyc.ext;
  if (cyc.ext) $('#c-ext').textContent = `${fmtDeg(ext)} = ∠B`;

  let note = '✔ 어떻게 옮겨도 마주 보는 두 각의 합은 180°예요.';
  if (cyc.arcs) note += ` ∠A는 노란 호 BCD(${fmtDeg(norm(cyc.d - cyc.b))})의 ½, ∠C는 보라 호 DAB(${fmtDeg(norm(cyc.b - cyc.d))})의 ½ — 두 호를 합치면 360°라서 ∠A + ∠C = ½ × 360° = 180°!`;
  if (cyc.ext) note += ` ∠D의 외각(${fmtDeg(ext)})은 180° − ∠D 이니, 마주 보는 ∠B(${fmtDeg(angB)})와 같아요.`;
  $('#c-note').textContent = note;
}

function initCyclic() {
  makeDraggable($('#cyclic-svg'), () => Object.fromEntries(CYC_KEYS.map((k) => [k, onCircle(CYC_C, CYC_R, cyc[k])])), (key, pt) => {
    const next = { ...cyc, [key]: dirDeg(CYC_C, pt) };
    if (!cyclicOrderOk(next)) return;   // 사각형이 꼬이지 않게
    cyc[key] = next[key];
    renderCyclic();
  });
  $('#cyc-arcs').addEventListener('change', (e) => { cyc.arcs = e.target.checked; renderCyclic(); });
  $('#cyc-ext').addEventListener('change', (e) => { cyc.ext = e.target.checked; renderCyclic(); });
  $('#cyc-reset').addEventListener('click', () => { Object.assign(cyc, CYC_DEFAULT); renderCyclic(); });
}
