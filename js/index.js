// js/index.js
import { QUESTIONS } from "./questions.js";
import { loadState, saveState, resetState } from "./storage.js";
import { calculateResult, buildCode } from "./scoring.js";

const $ = (id) => document.getElementById(id);

const el = {
  progressText: $("progressText"),
  statusText: $("statusText"),
  progressBar: $("progressBar"),

  qNumber: $("qNumber"),
  qText: $("qText"),
  choices: $("choices"),

  btnPrev: $("btnPrev"),
  btnNext: $("btnNext"),
  btnRestart: $("btnRestart"),

  resultCard: $("resultCard"),
  resultType: $("resultType"),
  resultBadge: $("resultBadge"),
  resultDesc: $("resultDesc"),
  btnDetail: $("btnDetail"),
};

const CHOICES = [
  { value: 1, label: "① とても当てはまる" },
  { value: 2, label: "② やや当てはまる" },
  { value: 3, label: "③ どちらとも言えない" },
  { value: 4, label: "④ あまり当てはまらない" },
  { value: 5, label: "⑤ 全く当てはまらない" },
];

let state = loadState(); // {answers:Array(60), current:number}

function answeredCount() {
  return state.answers.filter((v) => v !== null).length;
}

function updateProgress() {
  const done = answeredCount();
  const total = QUESTIONS.length;

  el.progressText.textContent = `進捗 ${done} / ${total}`;
  el.statusText.textContent = (done === total) ? "判定完了" : "回答中…";
  el.progressBar.style.width = `${Math.round((done / total) * 100)}%`;
}

function renderChoices(selectedValue) {
  el.choices.innerHTML = "";
  CHOICES.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.dataset.value = String(c.value);
    btn.textContent = c.label;
    if (selectedValue === c.value) btn.classList.add("isSelected");
    el.choices.appendChild(btn);
  });
}

function showQuestion(i) {
  const q = QUESTIONS[i];
  const selected = state.answers[i];

  el.qNumber.textContent = `Q${String(i + 1).padStart(2, "0")}`;
  el.qText.textContent = q.text;

  renderChoices(selected);

  el.btnPrev.disabled = (i <= 0);
  // 次へは「選択済み」なら押せる
  el.btnNext.disabled = (selected === null);

  el.resultCard.classList.add("hidden");
}

function gaugeRow(left, pLeft, right, pRight) {
  return `
  <div style="margin:14px 0;">
    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
      <div><b>${left}</b> (${pLeft}%)</div>
      <div><b>${right}</b> (${pRight}%)</div>
    </div>
    <div style="height:10px; background:rgba(255,255,255,.12); border-radius:999px; overflow:hidden;">
      <div style="height:100%; width:${pLeft}%; background:linear-gradient(90deg, rgba(155,200,255,.95), rgba(90,140,255,.95));"></div>
    </div>
  </div>`;
}

function renderResult() {
  const axis = calculateResult(state.answers);
  const code = buildCode(axis);

  el.resultType.textContent = code;
  el.resultBadge.textContent = "判定完了";
  el.resultDesc.textContent = "タイプ詳細ページで、強み・弱点・おすすめ行動が見れます。";

  // ✅ 詳細リンク
  el.btnDetail.href = `./pages/type.html?t=${encodeURIComponent(code)}`;

  // ✅ 結果カードにパーセントゲージを差し込む
  const wrap = document.createElement("div");
  wrap.className = "card";
  wrap.style.marginTop = "12px";
  wrap.innerHTML = `
    <div class="title">バランス（%）</div>
    <div class="muted">あなたの回答から算出した各軸の割合です</div>
    ${gaugeRow("U", axis.UO.pL, "O", axis.UO.pR)}
    ${gaugeRow("M", axis.MC.pL, "C", axis.MC.pR)}
    ${gaugeRow("H", axis.HL.pL, "L", axis.HL.pR)}
    ${gaugeRow("D", axis.DS.pL, "S", axis.DS.pR)}
    ${gaugeRow("R", axis.RX.pL, "X", axis.RX.pR)}
  `;

  // 既にあれば入れ替え
  const old = document.getElementById("resultGauges");
  if (old) old.remove();
  wrap.id = "resultGauges";

  el.resultCard.classList.remove("hidden");
  el.resultCard.appendChild(wrap);

  el.btnNext.disabled = true;
}

function goNext() {
  // 次の未回答へ（なければ結果）
  const total = QUESTIONS.length;
  for (let i = state.current + 1; i < total; i++) {
    if (state.answers[i] === null) {
      state.current = i;
      saveState(state);
      showQuestion(state.current);
      updateProgress();
      return;
    }
  }
  // 全部回答済みなら結果
  updateProgress();
  renderResult();
  saveState(state);
}

function goPrev() {
  state.current = Math.max(0, state.current - 1);
  saveState(state);
  showQuestion(state.current);
  updateProgress();
}

function selectAnswer(value) {
  state.answers[state.current] = value;
  saveState(state);
  updateProgress();

  // 次へボタン有効化
  el.btnNext.disabled = false;

  // ✅ 自動で次へ（最後なら結果）
  const done = answeredCount();
  if (done >= QUESTIONS.length) {
    renderResult();
  } else {
    goNext();
  }
}

function init() {
  // state補正（長さなど）
  if (!Array.isArray(state.answers) || state.answers.length !== QUESTIONS.length) {
    state = { answers: Array(QUESTIONS.length).fill(null), current: 0 };
    saveState(state);
  }

  updateProgress();

  // 最初に「未回答」へ飛ばす
  const firstUnanswered = state.answers.findIndex((v) => v === null);
  state.current = (firstUnanswered >= 0) ? firstUnanswered : (QUESTIONS.length - 1);
  saveState(state);

  showQuestion(state.current);

  el.choices.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const v = Number(btn.dataset.value);
    if (![1,2,3,4,5].includes(v)) return;
    selectAnswer(v);
  });

  el.btnPrev.addEventListener("click", goPrev);
  el.btnNext.addEventListener("click", goNext);

  el.btnRestart.addEventListener("click", () => {
    resetState();
    state = { answers: Array(QUESTIONS.length).fill(null), current: 0 };
    saveState(state);
    updateProgress();
    showQuestion(0);
  });
}

init();
