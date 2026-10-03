/**
 * 오늘의 수학 학습 — Google Apps Script 백엔드
 *
 * 시트 2개를 자동으로 만들어 사용합니다.
 *  - 퀴즈기록 : 퀴즈를 끝낼 때마다 한 줄 (디지털 형성평가용 상세 기록)
 *  - 학생현황 : 학번별 최신 도토리 / 칭찬 도장 / 배지 (한 학생당 한 줄)
 *
 * 설정 순서
 *  1) 구글 시트 → 확장 프로그램 → Apps Script → 이 코드 전체 붙여넣기 → 저장
 *  2) 시트를 새로고침 → 메뉴 [🌰 수학 학습 → 1. 시트 준비하기] (처음 한 번 권한 허용)
 *  3) Apps Script 화면 → 배포 → 새 배포 → 유형 '웹 앱'
 *     실행 사용자 '나', 액세스 권한 '모든 사용자' → 배포 → 웹 앱 URL 복사
 *  4) 그 URL을 js/app.js 의 CONFIG.GAS_URL 에 붙여 넣기
 *  ※ 코드를 고친 뒤에는 [배포 관리 → 수정 → 버전: 새 버전]으로 다시 배포해야 반영돼요.
 */

const SHEET_LOG = '퀴즈기록';
const SHEET_STATUS = '학생현황';
const LOG_HEADERS = [
  '시간', '학번', '학교', '단원', '점수(첫시도)', '문항수', '이해도', '소요시간(초)', '힌트사용',
  '틀린개념', '오답유형', '약한개념', '도토리', '칭찬도장', '누적정답', '배지',
];
const STATUS_HEADERS = [
  '학번', '학교', '도토리', '칭찬도장', '누적정답', '배지',
  '최근단원', '최근점수', '최근이해도', '최근약한개념', '최근기록시간',
];

/* ---------- 시트 메뉴 (처음 설정용) ---------- */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🌰 수학 학습')
    .addItem('1. 시트 준비하기', 'setup')
    .addItem('2. 테스트 기록 넣어 보기', 'testRecord')
    .addToUi();
}

/** 기록용 시트 2개를 만들고 머리글 · 열 너비를 정리해요. (여러 번 실행해도 안전) */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const log = getSheet_(ss, SHEET_LOG, LOG_HEADERS);
  const status = getSheet_(ss, SHEET_STATUS, STATUS_HEADERS);
  [log, status].forEach((sh) => {
    sh.getRange(1, 1, 1, sh.getLastColumn()).setBackground('#CDEFE0').setFontWeight('bold');
    sh.autoResizeColumns(1, sh.getLastColumn());
  });
  log.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
  status.getRange('K:K').setNumberFormat('yyyy-mm-dd hh:mm');
  ss.toast('시트 준비 완료! 이제 [배포 → 새 배포 → 웹 앱]으로 배포하세요.', '🌰 수학 학습', 8);
}

/** 웹 앱 없이도 기록이 잘 들어가는지 확인하는 테스트 (학번 99999로 한 줄 기록) */
function testRecord() {
  const res = doPost({ postData: { contents: JSON.stringify({
    school: '테스트중학교', studentId: '99999', topic: '테스트', score: 25, total: 30, understanding: 83, durationSec: 600, hintCount: 3,
    wrongConcepts: '원주각과 중심각×2', misconceptions: '중심각 1/2 누락×1', weakConcept: '원주각과 중심각',
    acornCount: 5, stampCount: 2, totalCorrect: 25, badges: 'first-stamp',
  }) } });
  SpreadsheetApp.getActiveSpreadsheet().toast(res.getContent(), '테스트 결과 (학번 99999 줄은 지워도 돼요)', 8);
}

/** 퀴즈 결과 저장 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const id = String(d.studentId || '');
    if (!/^\d{5}$/.test(id)) return json_({ ok: false, error: 'invalid studentId' });

    const now = new Date();
    const school = school_(d.school);
    const topic = text_(d.topic);
    const score = toInt_(d.score);
    const total = toInt_(d.total);
    const understanding = toInt_(d.understanding);
    const acorn = toInt_(d.acornCount);
    const stamp = toInt_(d.stampCount);
    const totalCorrect = toInt_(d.totalCorrect);
    const badges = text_(d.badges);
    const weak = text_(d.weakConcept);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    getSheet_(ss, SHEET_LOG, LOG_HEADERS).appendRow([
      now, id, school, topic, score, total, understanding, toInt_(d.durationSec), toInt_(d.hintCount),
      text_(d.wrongConcepts), text_(d.misconceptions), weak, acorn, stamp, totalCorrect, badges,
    ]);

    const status = getSheet_(ss, SHEET_STATUS, STATUS_HEADERS);
    const row = findRow_(status, id, school);
    const values = [id, school, acorn, stamp, totalCorrect, badges, topic, `${score}/${total}`, understanding, weak, now];
    if (row) {
      status.getRange(row, 1, 1, values.length).setValues([values]);
    } else {
      status.appendRow(values);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** 로그인 시 학생의 최신 기록 불러오기: ?studentId=30101&school=숲속중학교 */
function doGet(e) {
  const p = (e && e.parameter) || {};
  // 연결 확인: 웹 앱 주소 뒤에 ?ping=1 을 붙여 브라우저로 열면 {"ok":true,...} 가 보여요.
  if (p.ping) {
    return json_({ ok: true, sheet: SpreadsheetApp.getActiveSpreadsheet().getName() });
  }
  const id = String(p.studentId || '');
  if (!/^\d{5}$/.test(id)) return json_({ ok: false, error: 'invalid studentId' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const status = getSheet_(ss, SHEET_STATUS, STATUS_HEADERS);
  const row = findRow_(status, id, school_(p.school));
  if (!row) return json_({ ok: true, found: false });

  const [, , acorn, stamp, totalCorrect, badges] = status.getRange(row, 1, 1, 6).getValues()[0];
  return json_({
    ok: true,
    found: true,
    acornCount: toInt_(acorn),
    stampCount: toInt_(stamp),
    totalCorrect: toInt_(totalCorrect),
    badges: String(badges || ''),
  });
}

/* ---------- 도우미 ---------- */
function getSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  const idCol = headers.indexOf('학번') + 1;
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
    // 학번 열은 글자 형식으로 보관
    sh.getRange(1, idCol, sh.getMaxRows(), 1).setNumberFormat('@');
    return sh;
  }
  // 학교 열이 없던 예전 시트라면 학번 바로 오른쪽에 '학교' 열을 끼워 넣어요.
  const current = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
  if (current.indexOf('학교') === -1 && current.indexOf('학번') !== -1) {
    const col = current.indexOf('학번') + 1;
    sh.insertColumnAfter(col);
    sh.getRange(1, col + 1).setValue('학교').setFontWeight('bold');
  }
  return sh;
}

/** 학생현황에서 (학번, 학교)가 같은 줄 찾기 — A열 학번, B열 학교 */
function findRow_(sheet, id, school) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const rows = sheet.getRange(2, 1, last - 1, 2).getValues();
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === id && school_(rows[i][1]) === school) return i + 2;
  }
  return 0;
}

/** 학교 이름 정리: 띄어쓰기 · 특수문자 제거 (앱과 같은 규칙) */
function school_(v) {
  return text_(String(v == null ? '' : v).replace(/[<>"'`\\]/g, '').replace(/\s+/g, '').slice(0, 30));
}

function toInt_(v) {
  const n = parseInt(v, 10);
  return isNaN(n) || n < 0 ? 0 : n;
}

/** 시트 수식 주입 방지 + 길이 제한 */
function text_(v) {
  const s = String(v == null ? '' : v).slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
