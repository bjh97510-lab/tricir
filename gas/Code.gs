/**
 * 오늘의 수학 학습 — Google Apps Script 백엔드
 *
 * 시트 2개를 자동으로 만들어 사용합니다.
 *  - 퀴즈기록 : 퀴즈를 끝낼 때마다 한 줄 (디지털 형성평가용 상세 기록)
 *  - 학생현황 : 학번별 최신 도토리 / 칭찬 도장 / 배지 (한 학생당 한 줄)
 *
 * 배포: 배포 > 새 배포 > 유형 '웹 앱'
 *       실행 사용자 '나', 액세스 권한 '모든 사용자'
 *       → 나온 URL을 js/app.js 의 CONFIG.GAS_URL 에 붙여 넣기
 */

const SHEET_LOG = '퀴즈기록';
const SHEET_STATUS = '학생현황';
const LOG_HEADERS = [
  '시간', '학번', '단원', '점수(첫시도)', '문항수', '이해도', '소요시간(초)', '힌트사용',
  '틀린개념', '오답유형', '약한개념', '도토리', '칭찬도장', '누적정답', '배지',
];
const STATUS_HEADERS = [
  '학번', '도토리', '칭찬도장', '누적정답', '배지',
  '최근단원', '최근점수', '최근이해도', '최근약한개념', '최근기록시간',
];

/** 퀴즈 결과 저장 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const id = String(d.studentId || '');
    if (!/^\d{5}$/.test(id)) return json_({ ok: false, error: 'invalid studentId' });

    const now = new Date();
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
      now, id, topic, score, total, understanding, toInt_(d.durationSec), toInt_(d.hintCount),
      text_(d.wrongConcepts), text_(d.misconceptions), weak, acorn, stamp, totalCorrect, badges,
    ]);

    const status = getSheet_(ss, SHEET_STATUS, STATUS_HEADERS);
    const row = findRow_(status, id);
    const values = [id, acorn, stamp, totalCorrect, badges, topic, `${score}/${total}`, understanding, weak, now];
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

/** 로그인 시 학번의 최신 기록 불러오기: ?studentId=30101 */
function doGet(e) {
  const id = String((e && e.parameter && e.parameter.studentId) || '');
  if (!/^\d{5}$/.test(id)) return json_({ ok: false, error: 'invalid studentId' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const status = getSheet_(ss, SHEET_STATUS, STATUS_HEADERS);
  const row = findRow_(status, id);
  if (!row) return json_({ ok: true, found: false });

  const [, acorn, stamp, totalCorrect, badges] = status.getRange(row, 1, 1, 5).getValues()[0];
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
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
    // 학번 열은 글자 형식으로 보관
    const idCol = headers.indexOf('학번') + 1;
    sh.getRange(1, idCol, sh.getMaxRows(), 1).setNumberFormat('@');
  }
  return sh;
}

function findRow_(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) return i + 2;
  }
  return 0;
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
