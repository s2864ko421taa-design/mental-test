// js/storage.js
const KEY = "mental_test_state_v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // 何もしない
  }
}

export function resetState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // 何もしない
  }
}
