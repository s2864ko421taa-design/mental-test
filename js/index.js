// /js/index.js
import { QUESTIONS } from "./questions.js";
import { loadState, saveState, resetState } from "./storage.js";
import { calculateResult, buildCode } from "./scoring.js";
import { recordResult } from "./stats.js";

const $ = (id) => document.getElementById(id);

const CHOICES = [
  { value: 1, label: "◎ とても当てはまる" },
  { value: 2, label: "○ やや当てはまる" },
  { value: 3, label: "△ どちらとも言えない" },
  { value: 4, label: "× あまり当てはまらない" },
  { value: 5, label: "✕ 全く当てはまらない" },
];

function answeredCount(answers) {
  return answers.filter((v) => v != null).length;
}

function ensureState() {
  const saved = loadState();
  if (
    saved &&
    Array.isArray(saved.answers) &&
    saved.answers.length === QUESTIONS.length &&
    typeof saved.current === "number"
  ) {
    return saved;
  }
  const fresh = { answers: Array(QUESTIONS.length).fill(null), current: 0 };
  saveState(fresh);
  return fresh;
}

function updateProgressUI(state) {
  const done = answeredCount(state.answers);
  const total = QUESTIONS.length;

  const progressText = $("progressText");
  const statusText = $("statusText");
  const progressBar = $("progressBar");

  if (progressText) progressText.textContent = `進捗 ${done} / ${total}`;
  if (statusText) statusText.textContent = done >= total ? "判定完了" : "回答中…";
  if (progressBar) progressBar.style.width = `${Math.round((done / total) * 100)}%`;
}

function renderChoices(selectedValue) {
  const wrap = $("choices");
  if (!wrap) return;

  wrap.innerHTML = "";
  for (const c of CHOICES) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.dataset.value = String(c.value);
    btn.textContent = c.label;
    if (selectedValue === c.value) btn.classList.add("isSelected");
    wrap.appendChild(btn);
  }
}

function showQuestion(state) {
  const i = state.current;
  const q = QUESTIONS[i];

  const qNumber = $("qNumber");
  const qText = $("qText");

  if (qNumber) qNumber.textContent = `Q${String(i + 1).padStart(2, "0")}`;
  if (qText) qText.textContent = q?.text ?? "（質問が見つかりません）";

  renderChoices(state.answers[i]);

  const btnPrev = $("btnPrev");
  const btnNext = $("btnNext");
  if (btnPrev) btnPrev.disabled = i <= 0;
  if (btnNext) btnNext.disabled = state.answers[i] == null;

  const resultCard = $("resultCard");
  if (resultCard) resultCard.classList.add("hidden");
}

function goNext(state) {
  const total = QUESTIONS.length;

  for (let i = state.current + 1; i < total; i++) {
    if (state.answers[i] == null) {
      state.current = i;
      saveState(state);
      updateProgressUI(state);
      showQuestion(state);
      return;
    }
  }
  renderResult(state);
}

function goPrev(state) {
  state.current = Math.max(0, state.current - 1);
  saveState(state);
  updateProgressUI(state);
  showQuestion(state);
}

function gaugeRow(left, pLeft, right, pRight) {
  return `
  <div style="margin:14px 0;">
    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
      <div><b>${left}</b> (${pLeft}%)</div>
      <div><b>${right}</b> (${pRight}%)</div>
    </div>
    <div style="height:10px; background:rgba(255,255,255,.12); border-radius:999px; overflow:hidden;">
      <div style="height:100%; width:${pLeft}%; background:linear-gradient(90deg, rgba(155,200,255,.95), rgba(140,180,255,.95));"></div>
    </div>
  </div>`;
}

function renderResult(state) {
  const axis = calculateResult(state.answers, QUESTIONS);
  const code = buildCode(axis);

  // ✅ ここが「1234コードを入れる場所」：結果確定直後
  recordResult(code, axis);

  const resultCard = $("resultCard");
  if (!resultCard) return;

  const resultType = $("resultType");
  const resultBadge = $("resultBadge");
  const resultDesc = $("resultDesc");

  if (resultType) resultType.textContent = code;
  if (resultBadge) resultBadge.textContent = "判定完了";
  if (resultDesc)
    resultDesc.textContent = "タイプ詳細ページで、強み・弱点・おすすめ行動が見れます。";

  const btnDetail = $("btnDetail");
  if (btnDetail) btnDetail.href = `./pages/type.html?t=${encodeURIComponent(code)}`;

  const old = document.getElementById("resultGauges");
  if (old) old.remove();

  const wrap = document.createElement("div");
  wrap.id = "resultGauges";
  wrap.className = "card";
  wrap.style.marginTop = "12px";

  // axisの%が undefined になるなら、scoring.js の返し方とここがズレてる
  // 今動いてる前提のプロパティ名で組んでる（UO/MC/HL/DS/RX + pL/pR）
  wrap.innerHTML = `
    <div class="title">バランス（%）</div>
    <div class="muted">あなたの回答から算出した各軸の割合です</div>
    ${gaugeRow("U", axis.UO.pL, "O", axis.UO.pR)}
    ${gaugeRow("M", axis.MC.pL, "C", axis.MC.pR)}
    ${gaugeRow("H", axis.HL.pL, "L", axis.HL.pR)}
    ${gaugeRow("D", axis.DS.pL, "S", axis.DS.pR)}
    ${gaugeRow("R", axis.RX.pL, "X", axis.RX.pR)}
  `;

  resultCard.classList.remove("hidden");
  resultCard.appendChild(wrap);

  const btnNext = $("btnNext");
  if (btnNext) btnNext.disabled = true;

  updateProgressUI(state);
  saveState(state);
}

export function init() {
  const state = ensureState();

  const firstUnanswered = state.answers.findIndex((v) => v == null);
  state.current = firstUnanswered >= 0 ? firstUnanswered : QUESTIONS.length - 1;
  saveState(state);

  updateProgressUI(state);

  const choices = $("choices");
  if (choices) {
    choices.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const v = Number(btn.dataset.value);
      if (![1, 2, 3, 4, 5].includes(v)) return;

      state.answers[state.current] = v;
      saveState(state);
      updateProgressUI(state);

      const btnNext = $("btnNext");
      if (btnNext) btnNext.disabled = false;

      if (answeredCount(state.answers) >= QUESTIONS.length) renderResult(state);
      else goNext(state);
    });
  }

  $("btnPrev")?.addEventListener("click", () => goPrev(state));
  $("btnNext")?.addEventListener("click", () => goNext(state));

  $("btnRestart")?.addEventListener("click", () => {
    resetState();
    location.reload();
  });

  if (answeredCount(state.answers) >= QUESTIONS.length) renderResult(state);
  else showQuestion(state);
}
