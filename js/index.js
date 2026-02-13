// js/index.js
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
  { value: 5, label: "×× 全く当てはまらない" },
];

function answeredCount(answers) {
  return (answers || []).filter((v) => v != null).length;
}

function ensureState() {
  const saved = loadState?.();
  if (
    saved &&
    Array.isArray(saved.answers) &&
    saved.answers.length === QUESTIONS.length &&
    typeof saved.current === "number"
  ) {
    return saved;
  }

  const fresh = { answers: Array(QUESTIONS.length).fill(null), current: 0 };
  saveState?.(fresh);
  return fresh;
}

function updateProgressUI(state) {
  const done = answeredCount(state.answers);
  const total = QUESTIONS.length;

  const progressText = $("progressText");
  const statusText = $("statusText");
  const progressBar = $("progressBar");

  if (progressText) progressText.textContent = `進捗 ${done} / ${total}`;
  if (statusText) statusText.textContent = done >= total ? "判定完了" : "準備中…";
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

  // 結果カードは質問中は隠す
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
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
        <div><b>${left}</b> (${pLeft}%)</div>
        <div><b>${right}</b> (${pRight}%)</div>
      </div>
      <div style="height:10px;background:rgba(255,255,255,.12);border-radius:999px;overflow:hidden;">
        <div style="height:100%;width:${pLeft}%;background:linear-gradient(90deg, rgba(88,181,242,1), rgba(138,208,255,1));"></div>
      </div>
    </div>
  `;
}

function renderResult(state) {
  const axis = calculateResult(state.answers, QUESTIONS);
  const code = buildCode(axis);

  // ✅ 記録（同じ結果表示で二重記録しない）
  try {
    const onceKey = `recorded:${code}`;
    if (!sessionStorage.getItem(onceKey)) {
      recordResult(code, axis);
      sessionStorage.setItem(onceKey, "1");
    }
  } catch (e) {
    console.error("recordResult failed:", e);
  }

  const resultCard = $("resultCard");
  if (!resultCard) return;

  const resultType = $("resultType");
  const resultBadge = $("resultBadge");
  const resultDesc = $("resultDesc");
  const btnDetail = $("btnDetail");

  if (resultType) resultType.textContent = code;
  if (resultBadge) resultBadge.textContent = "判定完了";
  if (resultDesc) resultDesc.textContent = "タイプ詳細ページで、強み・弱点・おすすめ行動が見れます。";
  if (btnDetail) btnDetail.href = `./pages/type.html?t=${encodeURIComponent(code)}`;

  // 既存ゲージがあれば入れ替え
  const old = document.getElementById("resultGauges");
  if (old) old.remove();

  const wrap = document.createElement("div");
  wrap.id = "resultGauges";
  wrap.className = "card";
  wrap.style.marginTop = "12px";

  // axis のプロパティ名は scoring.js に合わせる（あなたの現状に合わせて UO/MC/HL/DS/RX を採用）
  wrap.innerHTML = `
    <div class="title">バランス（%）</div>
    <div class="muted">あなたの回答から算出した各軸の割合です</div>
    ${gaugeRow("U", axis.UO?.pL ?? 50, "O", axis.UO?.pR ?? 50)}
    ${gaugeRow("M", axis.MC?.pL ?? 50, "C", axis.MC?.pR ?? 50)}
    ${gaugeRow("H", axis.HL?.pL ?? 50, "L", axis.HL?.pR ?? 50)}
    ${gaugeRow("D", axis.DS?.pL ?? 50, "S", axis.DS?.pR ?? 50)}
    ${gaugeRow("R", axis.RX?.pL ?? 50, "X", axis.RX?.pR ?? 50)}
  `;

  resultCard.classList.remove("hidden");
  resultCard.after(wrap);

  // 結果後は次へ無効化
  const btnNext = $("btnNext");
  if (btnNext) btnNext.disabled = true;

  updateProgressUI(state);
  saveState(state);
}

export function init() {
  const state = ensureState();

  // 途中再開：最初の未回答へ
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

      // 次へ有効化
      const btnNext = $("btnNext");
      if (btnNext) btnNext.disabled = false;

      // 自動で次へ（最後は結果）
      if (answeredCount(state.answers) >= QUESTIONS.length) renderResult(state);
      else goNext(state);
    });
  }

  $("btnPrev")?.addEventListener("click", () => goPrev(state));
  $("btnNext")?.addEventListener("click", () => goNext(state));

  $("btnRestart")?.addEventListener("click", () => {
    resetState?.();
    try { sessionStorage.clear(); } catch {}
    location.reload();
  });

  // 初期表示
  if (answeredCount(state.answers) >= QUESTIONS.length) renderResult(state);
  else showQuestion(state);
}
