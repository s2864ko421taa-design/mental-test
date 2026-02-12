// js/index.js
import { QUESTIONS, CHOICES } from "./questions.js";
import { saveAnswer, loadAnswers, clearAnswers } from "./storage.js";

const $ = (id) => document.getElementById(id);

function ensureLen60(arr) {
  const out = Array.isArray(arr) ? arr.slice(0, 60) : [];
  while (out.length < 60) out.push(null);
  return out;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function setStatus(text) {
  const el = $("statusText");
  if (el) el.textContent = text;
}

function render(state) {
  const i = state.index;

  // progress
  if ($("progressText")) $("progressText").textContent = `進捗 ${i} / 60`;
  if ($("progressBar")) $("progressBar").style.width = `${Math.round((i / 60) * 100)}%`;

  // question
  if ($("qNumber")) $("qNumber").textContent = `Q${i + 1}`;
  if ($("qText")) $("qText").textContent = QUESTIONS[i] || "（質問がありません）";

  // choices
  const area = $("choices");
  area.innerHTML = "";

  const current = state.answers[i];

  CHOICES.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice";
    b.textContent = `${c.value}. ${c.label}`;
    if (current === c.value) b.classList.add("is-selected");

    b.addEventListener("click", () => {
      state.answers[i] = c.value;
      saveAnswer(i, c.value);

      [...area.querySelectorAll(".choice")].forEach((x) => x.classList.remove("is-selected"));
      b.classList.add("is-selected");

      // auto next
      if (i < 59) {
        state.index++;
        render(state);
      } else {
        location.href = "./pages/type.html";
      }
    });

    area.appendChild(b);
  });

  // buttons
  const prev = $("btnPrev");
  const next = $("btnNext");
  if (prev) prev.disabled = i <= 0;
  if (next) next.disabled = state.answers[i] == null;
}

function boot() {
  if (!Array.isArray(QUESTIONS) || QUESTIONS.length !== 60) {
    setStatus("questions.js が 60問になってない");
    return;
  }

  setStatus("準備OK");

  const state = {
    answers: ensureLen60(loadAnswers()),
    index: 0,
  };

  // resume to first unanswered
  const firstNull = state.answers.findIndex((v) => v == null);
  if (firstNull >= 0) state.index = clamp(firstNull, 0, 59);

  // nav wiring
  $("btnPrev")?.addEventListener("click", () => {
    state.index = clamp(state.index - 1, 0, 59);
    render(state);
  });

  $("btnNext")?.addEventListener("click", () => {
    if (state.answers[state.index] == null) return;
    if (state.index < 59) {
      state.index++;
      render(state);
    } else {
      location.href = "./pages/type.html";
    }
  });

  $("btnRestart")?.addEventListener("click", () => {
    if (!confirm("最初からやり直す？")) return;
    clearAnswers();
    state.answers = ensureLen60([]);
    state.index = 0;
    render(state);
  });

  render(state);
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    boot();
  } catch (e) {
    console.error(e);
    setStatus("JSエラー: " + (e?.message || e));
  }
});
