// js/scoring.js

export function calculateResult(answers) {
  const axes = {
    UO: { U: 0, O: 0 },
    MC: { M: 0, C: 0 },
    HL: { H: 0, L: 0 },
    DS: { D: 0, S: 0 },
    RX: { R: 0, X: 0 }
  };

  // 各軸12問ずつ
  answers.forEach((val, i) => {
    const score = Number(val);

    // 1,2 = 前側（強） / 4,5 = 後側（強）
    const weight = score === 1 ? 2 :
                   score === 2 ? 1 :
                   score === 4 ? -1 :
                   score === 5 ? -2 : 0;

    if (i < 12) axes.UO.U += weight;
    else if (i < 24) axes.MC.M += weight;
    else if (i < 36) axes.HL.H += weight;
    else if (i < 48) axes.DS.D += weight;
    else axes.RX.R += weight;
  });

  const result = {};

  Object.entries(axes).forEach(([key, obj]) => {
    const mainKey = Object.keys(obj)[0];
    const altKey = Object.keys(obj)[1];

    const raw = obj[mainKey];

    const percentMain = Math.round(((raw + 24) / 48) * 100);
    const percentAlt = 100 - percentMain;

    result[key] = {
      main: percentMain >= percentAlt ? mainKey : altKey,
      percentMain,
      percentAlt
    };
  });

  return result;
}
