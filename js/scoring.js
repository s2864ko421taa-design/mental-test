// js/scoring.js
import { QUESTIONS } from "./questions.js";

/**
 * answer: 1..5
 * 1: とても当てはまる
 * 2: やや当てはまる
 * 3: どちらとも言えない
 * 4: あまり当てはまらない
 * 5: 全く当てはまらない
 *
 * side: 質問文が「どっち側」を表すか (例: 'U' or 'O')
 * 1,2 は side を強める / 4,5 は反対側を強める
 */
function scoreToSide(answer) {
  // +2,+1,0,-1,-2
  if (answer === 1) return 2;
  if (answer === 2) return 1;
  if (answer === 3) return 0;
  if (answer === 4) return -1;
  if (answer === 5) return -2;
  return 0;
}

const AXES = {
  UO: ["U", "O"],
  MC: ["M", "C"],
  HL: ["H", "L"],
  DS: ["D", "S"],
  RX: ["R", "X"],
};

export function calculateResult(answers) {
  // answers: length 60 (1..5 or null)
  const axisSum = { UO: 0, MC: 0, HL: 0, DS: 0, RX: 0 };
  const axisMax = { UO: 0, MC: 0, HL: 0, DS: 0, RX: 0 };

  QUESTIONS.forEach((q, idx) => {
    const a = answers[idx];
    if (!a) return;

    const axis = q.axis;          // 'UO'|'MC'|'HL'|'DS'|'RX'
    const side = q.side;          // 'U'|'O' etc
    const [L, R] = AXES[axis];

    const s = scoreToSide(a);
    // side が左側なら sum += s, 右側なら sum -= s
    const signed = (side === L) ? s : -s;

    axisSum[axis] += signed;
    axisMax[axis] += 2; // 1問あたり最大2点
  });

  // 軸ごとに main/alt と % を作る
  const out = {};
  for (const axis of Object.keys(AXES)) {
    const [L, R] = AXES[axis];
    const sum = axisSum[axis];
    const max = axisMax[axis] || 24; // 12問想定(=24) / 念のため
    // 0..100 (L側の割合)
    const pL = Math.round(((sum / max) * 50) + 50);
    const pR = 100 - pL;

    const main = (pL >= pR) ? L : R;
    const alt  = (main === L) ? R : L;
    const percentMain = Math.max(pL, pR);
    const percentAlt  = 100 - percentMain;

    out[axis] = {
      axis,
      sum,
      main,
      alt,
      percentMain,
      percentAlt,
      pL,
      pR,
    };
  }
  return out;
}

export function buildCode(axis) {
  return axis.UO.main + axis.MC.main + axis.HL.main + axis.DS.main + axis.RX.main;
}
