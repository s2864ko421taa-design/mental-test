// js/index.js
import { QUESTIONS } from "./questions.js";
import { calculateResult } from "./scoring.js";
import { loadAnswers, saveAnswers, clearAnswers } from "./storage.js";

const $ = (id) => document.getElementById(id);

const CHOICES = [
  { v: 1, label: "① とても当てはまる" },
  { v: 2, label: "② やや当てはまる" },
  { v: 3, label: "③ どちらとも言えない" },
  { v: 4, label: "④ あまり当てはまらない" },
  { v: 5, label: "⑤ 全く当てはまらない" },
];

function typeCodeFromAxis(axis) {
  return axis.UO.main + axis.MC.main + axis.HL.main + axis.DS.main + axis.RX.main;
}

function updateProgress(i, answers) {
  const done = answers.filter(Boolean).length;
  $("progressText").textContent = `進捗 ${done} / ${QUESTIONS.length}`;
  $("statusText").textContent = done === QUESTIONS.length ? "完了" : "準備中…";
  const pct = Math.round((done / QUESTIONS.length) * 100);
  $("progressBar").style.width = `${pct}%`;
  $("qNumber").textContent = `Q${i + 1}`;
}

function renderQuestion(i, answers) {
  const q = QUESTIONS[i];
  $("qText").textContent = q.text;

  const box = $("choices");
  box.innerHTML = "";

  CHOICES.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.textContent = c.label;

    const selected = answers[q.id - 1] === c.v;
    if (selected) btn.classList.add("isSelected");

    btn.addEventListener("click", () => {
      answers[q.id - 1] = c.v;
      saveAnswers(answers);
      // 次へ自動
      if (i < QUESTIONS.length - 1) {
        state.i++;
        mount();
      } else {
        showResult();
      }
    });

    box.appendChild(btn);
  });

  $("btnPrev").disabled = i === 0;
  $("btnNext").disabled = !answers[q.id - 1];
}

function showResult() {
  const answers = state.answers;
  const axis = calculateResult(answers);
  const code = typeCodeFromAxis(axis);

  // 結果カード表示
  $("resultCard").classList.remove("hidden");
  $("resultType").textContent = code;
  $("resultBadge").textContent = "判定完了";
  $("resultDesc").textContent =
    "タイプ詳細ページで、強み・弱点・おすすめ行動が見れます。";

  // 詳細リンク
  $("btnDetail").href = `./pages/type.html?t=${encodeURIComponent(code)}`;

  // 進行UIは見せたままでもいいけど、邪魔ならここで隠してOK
  // 例: document.querySelector(".qbox").style.display="none";
}

function mount() {
  const i = state.i;
  updateProgress(i, state.answers);
  renderQuestion(i, state.answers);
}

const state = {
  i: 0,
  answers: [],
};

export function init() {
  // 初期化
  state.answers = loadAnswers();
  if (state.answers.length < QUESTIONS.length) {
    state.answers.length = QUESTIONS.length;
  }

  $("btnPrev").addEventListener("click", () => {
    if (state.i > 0) {
      state.i--;
      mount();
    }
  });

  $("btnNext").addEventListener("click", () => {
    if (state.i < QUESTIONS.length - 1) {
      state.i++;
      mount();
    } else {
      showResult();
    }
  });

  $("btnRestart").addEventListener("click", () => {
    clearAnswers();
    state.answers = new Array(QUESTIONS.length).fill(undefined);
    state.i = 0;
    $("resultCard").classList.add("hidden");
    mount();
  });

  // 先に最初の画面を描画
  mount();
}
