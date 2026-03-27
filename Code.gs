// ============================================================
// Mystery Club — Google Apps Script REST API
// 배포: 확장 프로그램 > Apps Script > 배포 > 웹 앱
// 실행 계정: 나, 액세스: 모든 사용자
// ============================================================

const SHEET_ID = "YOUR_GOOGLE_SHEET_ID"; // ← 시트 ID로 교체
const SHEETS = {
  members: "members",
  records: "records",
  scenarios: "scenarios",
  schedules: "schedules",
  groups: "groups",
};

// ── CORS 헬퍼 ─────────────────────────────────────
function cors(output) {
  return output
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader("Access-Control-Allow-Origin", "*")
    .addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .addHeader("Access-Control-Allow-Headers", "Content-Type");
}

function ok(data) {
  return cors(ContentService.createTextOutput(JSON.stringify({ ok: true, data })));
}

function err(msg) {
  return cors(ContentService.createTextOutput(JSON.stringify({ ok: false, error: msg })));
}

// ── GET 라우터 ────────────────────────────────────
function doGet(e) {
  const p = e.parameter;
  try {
    switch (p.action) {
      case "getMembers":    return ok(getRows("members"));
      case "getRecords":    return ok(getRows("records"));
      case "getScenarios":  return ok(getRows("scenarios"));
      case "getSchedules":  return ok(getRows("schedules"));
      case "getGroups":     return ok(getRows("groups"));
      case "login":         return handleLogin(p.name, p.pw);
      default:              return err("Unknown action: " + p.action);
    }
  } catch (ex) {
    return err(ex.message);
  }
}

// ── POST 라우터 ───────────────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    switch (body.action) {
      case "addMember":    return ok(addRow("members", body.data));
      case "addRecord":    return ok(addRow("records", body.data));
      case "updateRecord": return ok(updateRow("records", body.data));
      case "deleteRecord": return ok(deleteRow("records", body.id));
      case "addScenario":  return ok(addRow("scenarios", body.data));
      case "updateScenario": return ok(updateRow("scenarios", body.data));
      case "deleteScenario": return ok(deleteRow("scenarios", body.id));
      case "addSchedule":  return ok(addRow("schedules", body.data));
      case "updateSchedule": return ok(updateRow("schedules", body.data));
      case "addGroup":     return ok(addRow("groups", body.data));
      case "updateGroup":  return ok(updateRow("groups", body.data));
      default:             return err("Unknown action: " + body.action);
    }
  } catch (ex) {
    return err(ex.message);
  }
}

// ── 로그인 ────────────────────────────────────────
function handleLogin(name, pw) {
  const rows = getRows("members");
  const member = rows.find(r => r.name === name && r.pw === pw);
  if (!member) return err("이름 또는 비밀번호가 틀렸습니다.");
  const { pw: _, ...safe } = member; // 비밀번호 제거
  return ok(safe);
}

// ── 시트 CRUD ─────────────────────────────────────
function getSheet(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name); // 없으면 생성
  return sheet;
}

function getRows(sheetName) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      let v = row[i];
      // JSON 파싱 시도 (배열, 객체 필드)
      if (typeof v === "string" && (v.startsWith("{") || v.startsWith("["))) {
        try { v = JSON.parse(v); } catch (_) {}
      }
      if (v === "TRUE") v = true;
      if (v === "FALSE") v = false;
      obj[h] = v;
    });
    return obj;
  });
}

function addRow(sheetName, data) {
  const sheet = getSheet(sheetName);
  const all = sheet.getDataRange().getValues();
  const headers = all.length > 0 ? all[0] : Object.keys(data);

  // 헤더가 없으면 초기화
  if (all.length === 0) {
    sheet.appendRow(headers);
  }

  // 새 ID 부여
  if (!data.id) {
    const ids = all.slice(1).map(r => Number(r[headers.indexOf("id")])).filter(Boolean);
    data.id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  const row = headers.map(h => {
    const v = data[h];
    if (v === undefined || v === null) return "";
    if (typeof v === "object") return JSON.stringify(v);
    return v;
  });

  sheet.appendRow(row);
  return { ...data };
}

function updateRow(sheetName, data) {
  const sheet = getSheet(sheetName);
  const all = sheet.getDataRange().getValues();
  const headers = all[0];
  const idIdx = headers.indexOf("id");

  for (let i = 1; i < all.length; i++) {
    if (String(all[i][idIdx]) === String(data.id)) {
      const row = headers.map(h => {
        const v = data[h];
        if (v === undefined || v === null) return "";
        if (typeof v === "object") return JSON.stringify(v);
        return v;
      });
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
      return data;
    }
  }
  throw new Error("Row not found: " + data.id);
}

function deleteRow(sheetName, id) {
  const sheet = getSheet(sheetName);
  const all = sheet.getDataRange().getValues();
  const headers = all[0];
  const idIdx = headers.indexOf("id");

  for (let i = 1; i < all.length; i++) {
    if (String(all[i][idIdx]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { deleted: id };
    }
  }
  throw new Error("Row not found: " + id);
}

// ── 초기 시트 헤더 설정 ────────────────────────────
function initSheets() {
  const headers = {
    members:   ["id","name","av","role","style","style2","pw","friends"],
    records:   ["id","scId","date","mbs","res","mvp","charNames","roleTypes","rats","rev","sp"],
    scenarios: ["id","title","theme","pl","time","diff","rating","ok","tags","characters","sub","subAt","note","st"],
    schedules: ["id","scId","title","date","time","host","max","att","loc","gId"],
    groups:    ["id","name","owner","members","desc"],
  };
  Object.entries(headers).forEach(([name, cols]) => {
    const sheet = getSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(cols);
    }
  });
  return "Sheets initialized!";
}
