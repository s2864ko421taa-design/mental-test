// js/scoring.js
// Likert 1..5 を「その設問の side を支持する強さ」に変換
// 1: とても当てはまる  -> +2
// 2: やや当てはまる    -> +1
// 3: どちらとも言えない->  0
// 4: あまり当てはまらない-> -1
// 5: 全く当てはまらない  -> -2
function likertToDelta(v) {
  if (v === 1) return 2;
  if (v === 2) return 1;
  if (v === 3) return 0;
  if (v === 4) return -1;
  if (v === 5) return -2;
  return 0;
}

// 軸ごとの左右ラベル
const AXES = {
  UO: { left: "U", right: "O" },
  MC: { left: "M", right: "C" },
  HL: { left: "H", right: "L" },
  DS: { left: "D", right: "S" },
  RX: { left: "R", right: "X" },
};

// answers: [60]（1..5 or null）
// questions: [{axis:"UO", side:"U", ...}, ...]
export function calculateResult(answers, questions) {
  // 初期化
  const sums = {};
  const counts = {};
  for (const k of Object.keys(AXES)) {
    sums[k] = 0;     // 左優勢:+ / 右優勢:-
    counts[k] = 0;   // 有効回答数
  }

  // 集計
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const v = answers[i];
    if (v == null) continue;

    const axisKey = q.axis;
    if (!AXES[axisKey]) continue;

    const { left, right } = AXES[axisKey];

    // 「この設問は side 側を言っている」ので
    // side が left なら delta をそのまま足す
    // side が right なら delta の符号を反転（右を支持 = 左が減る）
    const delta = likertToDelta(Number(v));
    const signed = (q.side === left) ? delta : -delta;

    sums[axisKey] += signed;
    counts[axisKey] += 1;
  }

  // 割合化して返す
  const out = {};
  for (const axisKey of Object.keys(AXES)) {
    const { left, right } = AXES[axisKey];
    const n = counts[axisKey];

    // 1軸あたりの最大振れ幅（各設問 max2点）
    const maxAbs = Math.max(1, n * 2); // n=0の保険

    // sums は [-maxAbs, +maxAbs]
    // 左% = (sums + maxAbs) / (2*maxAbs) * 100
    let pL = Math.round(((sums[axisKey] + maxAbs) / (2 * maxAbs)) * 100);
    pL = Math.min(100, Math.max(0, pL));
    const pR = 100 - pL;

    const main = (pL >= 50) ? left : right;

    out[axisKey] = { pL, pR, main, n };
  }

  return out;
}

export function buildCode(axis) {
  // 固定順
  return (
    axis.UO.main +
    axis.MC.main +
    axis.HL.main +
    axis.DS.main +
    axis.RX.main
  );
}
