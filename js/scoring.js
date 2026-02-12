// js/scoring.js

export function calculateResult(answers = []) {

  // 60問前提
  const axisMap = [
    "UO","UO","UO","UO","UO","UO","UO","UO","UO","UO","UO","UO",
    "MC","MC","MC","MC","MC","MC","MC","MC","MC","MC","MC","MC",
    "HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",
    "DS","DS","DS","DS","DS","DS","DS","DS","DS","DS","DS","DS",
    "RX","RX","RX","RX","RX","RX","RX","RX","RX","RX","RX","RX"
  ];

  const result = {
    UO: { U:0, O:0 },
    MC: { M:0, C:0 },
    HL: { H:0, L:0 },
    DS: { D:0, S:0 },
    RX: { R:0, X:0 }
  };

  answers.forEach((val, i) => {
    const axis = axisMap[i];
    if (!axis) return;

    const score = Number(val);
    if (!score) return;

    // ①② → 前側
    if (score === 1 || score === 2) {
      const key = Object.keys(result[axis])[0];
      result[axis][key]++;
    }

    // ④⑤ → 後側
    if (score === 4 || score === 5) {
      const key = Object.keys(result[axis])[1];
      result[axis][key]++;
    }
  });

  // ===== 整形 =====
  const formatted = {};

  for (const axis in result) {

    const keys = Object.keys(result[axis]);
    const left = keys[0];
    const right = keys[1];

    const leftScore = result[axis][left];
    const rightScore = result[axis][right];

    const total = leftScore + rightScore || 1;

    const leftPct = Math.round((leftScore / total) * 100);
    const rightPct = 100 - leftPct;

    formatted[axis] = {
      main: leftPct >= rightPct ? left : right,
      percentMain: Math.max(leftPct, rightPct),
      percentAlt: Math.min(leftPct, rightPct)
    };
  }

  return formatted;
}
