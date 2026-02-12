// /js/scoring.js

const AXES = [
  { key: "UO", left: "U", right: "O" },
  { key: "MC", left: "M", right: "C" },
  { key: "HL", left: "H", right: "L" },
  { key: "DS", left: "D", right: "S" },
  { key: "RX", left: "R", right: "X" },
];

// 1..5 → +2..-2（1が強く当てはまる=その side 方向に寄る）
function likertSigned(v) {
  const x = Number(v);
  if (![1, 2, 3, 4, 5].includes(x)) return 0;
  return 3 - x; // 1:+2, 2:+1, 3:0, 4:-1, 5:-2
}

function otherSide(axisKey, side) {
  const a = AXES.find((x) => x.key === axisKey);
  if (!a) return null;
  return side === a.left ? a.right : a.left;
}

function toPercent(a, b) {
  const total = a + b;
  if (!Number.isFinite(total) || total <= 0) return [50, 50];
  const pA = Math.round((a / total) * 100);
  return [pA, 100 - pA];
}

// answers: [1..5 or null], QUESTIONS: [{axis:"UO", side:"U", text:"..."}, ...]
export function calculateResult(answers, QUESTIONS) {
  const pts = {};
  for (const a of AXES) pts[a.key] = { L: 0, R: 0 };

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const v = answers?.[i];
    if (v == null) continue;

    const signed = likertSigned(v);
    if (signed === 0) continue;

    const axisKey = q.axis;
    const side = q.side; // 例: "U" or "O"
    if (!axisKey || !side) continue;

    const toward = signed > 0 ? side : otherSide(axisKey, side);
    if (!toward) continue;

    const mag = Math.abs(signed);

    const axis = AXES.find((x) => x.key === axisKey);
    if (!axis) continue;

    if (toward === axis.left) pts[axisKey].L += mag;
    if (toward === axis.right) pts[axisKey].R += mag;
  }

  const out = {};
  for (const a of AXES) {
    const L = pts[a.key].L;
    const R = pts[a.key].R;

    const [pL, pR] = toPercent(L, R);

    const main = pL >= pR ? a.left : a.right;
    const alt = main === a.left ? a.right : a.left;

    const pMain = main === a.left ? pL : pR;
    const pAlt = 100 - pMain;

    out[a.key] = {
      left: a.left,
      right: a.right,
      main,
      alt,
      // ✅ index.js から参照しても絶対数値になる
      pL,
      pR,
      pMain,
      pAlt,
    };
  }

  return out;
}

export function buildCode(axis) {
  return (
    axis.UO.main +
    axis.MC.main +
    axis.HL.main +
    axis.DS.main +
    axis.RX.main
  );
}
