// js/storage.js
const KEY = "mental_test_v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { answers: Array(60).fill(null), current: 0 };
    const data = JSON.parse(raw);
    const answers = Array.isArray(data.answers) ? data.answers : Array(60).fill(null);
    const current = Number.isFinite(data.current) ? data.current : 0;
    // 60問に整形
    const fixed = Array(60).fill(null).map((_, i) => (answers[i] ?? null));
    return { answers: fixed, current: Math.max(0, Math.min(59, current)) };
  } catch {
    return { answers: Array(60).fill(null), current: 0 };
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
}
