// js/storage.js
const KEY = "mental_test_state_v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
}

// type.html 用（回答だけ欲しい場合）
export function loadAnswers() {
  const s = loadState();
  return Array.isArray(s?.answers) ? s.answers : [];
}
