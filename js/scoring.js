// js/scoring.js

export function calculateResult(answers, QUESTIONS) {
  const result = {
    UO: { U: 0, O: 0 },
    MC: { M: 0, C: 0 },
    HL: { H: 0, L: 0 },
    DS: { D: 0, S: 0 },
    RX: { R: 0, X: 0 },
  };

  for (let i = 0; i < answers.length; i++) {
    const value = answers[i];
    const q = QUESTIONS[i];
    if (!q || value == null) continue;

    const axis = q.axis;
    const side = q.side;

    if (result[axis] && result[axis][side] != null) {
      result[axis][side] += value;
    }
  }

  const final = {};

  for (const key of Object.keys(result)) {
    const leftKey = Object.keys(result[key])[0];
    const rightKey = Object.keys(result[key])[1];

    const leftScore = result[key][leftKey];
    const rightScore = result[key][rightKey];

    const total = leftScore + rightScore || 1;

    const pl = Math.round((leftScore / total) * 100);
    const pr = 100 - pl;

    final[key] = {
      left: leftKey,
      right: rightKey,
      pl,
      pr,
    };
  }

  return final;
}

export function buildCode(axis) {
  return (
    (axis.UO.pl >= axis.UO.pr ? "U" : "O") +
    (axis.MC.pl >= axis.MC.pr ? "M" : "C") +
    (axis.HL.pl >= axis.HL.pr ? "H" : "L") +
    (axis.DS.pl >= axis.DS.pr ? "D" : "S") +
    (axis.RX.pl >= axis.RX.pr ? "R" : "X")
  );
}
