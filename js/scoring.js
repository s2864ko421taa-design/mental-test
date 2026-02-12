// js/scoring.js
import { QUESTIONS } from "./questions.js";

const AXES = ["UO", "MC", "HL", "DS", "RX"];

const PAIRS = {
  UO: ["U", "O"],
  MC: ["M", "C"],
  HL: ["H", "L"],
  DS: ["D", "S"],
  RX: ["R", "X"],
};

function other(axis, side) {
  const [a, b] = PAIRS[axis];
  return side === a ? b : a;
}

export function calculateResult(answers) {

  const score = {
    UO: { U: 0, O: 0 },
    MC: { M: 0, C: 0 },
    HL: { H: 0, L: 0 },
    DS: { D: 0, S: 0 },
    RX: { R: 0, X: 0 },
  };

  answers.forEach((v, i) => {
    if (v == null) return;

    const q = QUESTIONS[i];
    if (!q) return;

    const axis = q.axis;
    const side = q.side;
    const opp = other(axis, side);

    const agree = 6 - Number(v);
    const disagree = Number(v);

    score[axis][side] += agree;
    score[axis][opp] += disagree;
  });

  const result = {};

  AXES.forEach(axis => {
    const [L, R] = PAIRS[axis];
    const left = score[axis][L];
    const right = score[axis][R];

    const total = left + right || 1;

    const pl = Math.round((left / total) * 100);
    const pr = 100 - pl;

    result[axis] = {
      pl,
      pr,
      main: pl >= pr ? L : R
    };
  });

  return result;
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
