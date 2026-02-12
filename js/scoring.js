// js/scoring.js
import { QUESTIONS } from "./questions.js";

// 1=とても当てはまる → agreement=5
// 5=全く当てはまらない → agreement=1
const agreement = (choice1to5) => 6 - choice1to5;

const AXES = {
  UO: ["U", "O"],
  MC: ["M", "C"],
  HL: ["H", "L"],
  DS: ["D", "S"],
  RX: ["R", "X"],
};

export function calculateResult(answers) {
  // answers: index 0..59 => 1..5 (未回答は null/undefined)
  const axis = {};

  for (const [axisKey, [left, right]] of Object.entries(AXES)) {
    let leftSum = 0;
    let rightSum = 0;

    QUESTIONS.filter(q => q.axis === axisKey).forEach((q, idx) => {
      const a = answers[q.id - 1];
      if (!a) return;
      const pts = agreement(a);

      if (q.side === left) leftSum += pts;
      else rightSum += pts;
    });

    const total = leftSum + rightSum || 1;
    const leftPct = Math.round((leftSum / total) * 100);
    const rightPct = 100 - leftPct;

    const main = leftSum >= rightSum ? left : right;
    const alt  = main === left ? right : left;
    const percentMain = main === left ? leftPct : rightPct;
    const percentAlt  = 100 - percentMain;

    axis[axisKey] = { main, alt, percentMain, percentAlt };
  }

  return axis;
}
