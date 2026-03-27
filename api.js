// src/api.js
// Apps Script 배포 URL로 교체하세요
const BASE = "https://script.google.com/macros/s/AKfycbzJdlo0W6b6paXvV7bOo8Kbz1aaMw0ULvbAApENfTj4DZc8bGdL4YdcXp8AdiJSd3Ms/exec";

async function get(action, params = {}) {
  const url = new URL(BASE);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

async function post(action, data) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

export const api = {
  // 멤버
  getMembers: () => get("getMembers"),
  login: (name, pw) => get("login", { name, pw }),
  addMember: (data) => post("addMember", data),

  // 기록
  getRecords: () => get("getRecords"),
  addRecord: (data) => post("addRecord", data),
  updateRecord: (data) => post("updateRecord", data),
  deleteRecord: (id) => post("deleteRecord", null, id),

  // 시나리오
  getScenarios: () => get("getScenarios"),
  addScenario: (data) => post("addScenario", data),
  updateScenario: (data) => post("updateScenario", data),

  // 일정
  getSchedules: () => get("getSchedules"),
  addSchedule: (data) => post("addSchedule", data),
  updateSchedule: (data) => post("updateSchedule", data),

  // 모임
  getGroups: () => get("getGroups"),
  addGroup: (data) => post("addGroup", data),
  updateGroup: (data) => post("updateGroup", data),
};
