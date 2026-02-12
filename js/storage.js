// js/storage.js
const KEY = "mentalTestAnswers_v1";

export function saveAnswers(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function loadAnswers() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function clearAnswers() {
  localStorage.removeItem(KEY);
}
