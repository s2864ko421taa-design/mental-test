// js/index.js
import { QUESTIONS, CHOICES } from "./questions.js";
import { saveAnswer, loadAnswers, clearAnswers } from "./storage.js";

const $ = (sel) => document.querySelector(sel);

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function ensureLen60(arr) {
  const out = Array.isArray(arr) ? arr.slice(0, 60) : [];
  while (out.length < 60) out.push(null);
  return out;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderQuestion(state) {
  const idx = state.index;

  setText("qNo", `Q${idx + 1}`);
  setText("qText", QUESTIONS[idx] || "（質問が見つかりません）");

  setText("progressText", `進捗 ${idx} / 60`);
  const bar = $("#progressBar");
  if (bar) bar.style.width = `${Math.round((idx / 60) * 100)}%`;

  const area = $("#choices");
  if (!area) return;
  area.innerHTML = "";

  const current = state.answers[idx];

  CHOICES.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.textContent = `${c.value}. ${c.label}`;
    if (current === c.value) btn.classList.add("is-selected");

    btn.addEventListener("click", () => {
      state.answers[idx] = c.value;
      saveAnswer(idx, c.value);

      [...area.querySelectorAll(".choice")].forEach((x) =>
        x.classList.remove("is-selected")
      );
      btn.classList.add("is-selected");

      if (idx < 59) {
        state.index++;
        renderQuestion(state);
      } else {
        location.href = "./pages/type.html";
      }
    });

    area.appendChild(btn);
  });

  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  if (prevBtn) prevBtn.disabled = idx <= 0;
  if (nextBtn) nextBtn.disabled = state.answers[idx] == null;
}

function wireNav(state) {
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const restartBtn = $("#restartBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      state.index = clamp(state.index - 1, 0, 59);
      renderQuestion(state);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (state.answers[state.index] == null) return;
      if (state.index < 59) {
        state.index++;
        renderQuestion(state);
      } else {
        location.href = "./pages/type.html";
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      if (!confirm("最初からやり直しますか？")) return;
      clearAnswers();
      state.answers = ensureLen60([]);
      state.index = 0;
      renderQuestion(state);
    });
  }
}

function boot() {
  // DOMが無いなら動かさない（別ページ対策）
  if (!$("#choices") || !document.getElementById("qText")) return;

  if (!Array.isArray(QUESTIONS) || QUESTIONS.length !== 60) {
    setText("qText", "questions.js が 60問になっていません");
    return;
  }

  const state = {
    answers: ensureLen60(loadAnswers()),
    index: 0,
  };

  // 途中再開（最初の未回答へ）
  const firstNull = state.answers.findIndex((v) => v == null);
  if (firstNull > 0) state.index = clamp(firstNull, 0, 59);

  wireNav(state);
  renderQuestion(state);
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    boot();
  } catch (e) {
    console.error(e);
    alert("index.js でエラー: " + (e?.message || e));
  }
});
