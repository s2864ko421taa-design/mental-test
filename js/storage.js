// /js/storage.js
const KEY = "mental_test_state_v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // 無視（Safariの容量制限など）
  }
}

export function resetState() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

// type.html から使いたい場合用（answersだけ欲しい時）
export function loadAnswers() {
  const st = loadState();
  return Array.isArray(st?.answers) ? st.answers : null;
}
