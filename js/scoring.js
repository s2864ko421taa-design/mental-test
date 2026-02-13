// js/scoring.js
// value 1..5 => +2..-2
const W = { 1: 2, 2: 1, 3: 0, 4: -1, 5: -2 };

const AXES = [
  { key: "UO", left: "U", right: "O" },
  { key: "MC", left: "M", right: "C" },
  { key: "HL", left: "H", right: "L" },
  { key: "DS", left: "D", right: "S" },
  { key: "RX", left: "R", right: "X" },
];

export function calculateResult(answers, QUESTIONS) {
  const sums = Object.fromEntries(AXES.map(a => [a.key, 0]));
  const counts = Object.fromEntries(AXES.map(a => [a.key, 0]));

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const v = answers[i];
    if (v == null) continue;

    const axisKey = q.axis;
    const axisDef = AXES.find(a => a.key === axisKey);
    if (!axisDef) continue;

    const signed = W[v] ?? 0;
    // q.side が left 側なら +signed、right 側なら -signed
    sums[axisKey] += (q.side === axisDef.left ? signed : -signed);
    counts[axisKey] += 1;
  }

  const out = {};
  for (const a of AXES) {
    const n = counts[a.key] || 0;
    const max = Math.max(1, n * 2); // 0除算防止
    const score = sums[a.key];

    const pLeft = clamp01((score + max) / (2 * max)) * 100;
    const pRight = 100 - pLeft;

    const main = pLeft >= 50 ? a.left : a.right;
    const alt = main === a.left ? a.right : a.left;

    const percentMain = main === a.left ? round1(pLeft) : round1(pRight);
    const percentAlt = round1(100 - percentMain);

    // 既存UI互換（pL/pR）も持たせる
    out[a.key] = {
      left: a.left, right: a.right,
      main, alt,
      score,
      pL: round1(pLeft),  // left %
      pR: round1(pRight), // right %
      percentMain,
      percentAlt,
      answered: n,
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

function clamp01(x){ return Math.max(0, Math.min(1, x)); }
function round1(x){ return Math.round(x * 10) / 10; }
