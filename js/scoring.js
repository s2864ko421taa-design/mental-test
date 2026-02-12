// /js/scoring.js

const AXES = [
  { key: "UO", left: "U", right: "O" },
  { key: "MC", left: "M", right: "C" },
  { key: "HL", left: "H", right: "L" },
  { key: "DS", left: "D", right: "S" },
  { key: "RX", left: "R", right: "X" },
];

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

// 1..5 を -2..+2 に変換（1=強く当てはまる→そのside寄り）
function likertToSigned(v) {
  const x = Number(v);
  if (![1, 2, 3, 4, 5].includes(x)) return 0;
  return 3 - x; // 1→+2, 2→+1, 3→0, 4→-1, 5→-2
}

function axisPair(axisKey) {
  const a = AXES.find((x) => x.key === axisKey);
  if (!a) return null;
  return { left: a.left, right: a.right };
}

export function calculateResult(answers, QUESTIONS) {
  const out = {};

  for (const a of AXES) {
    out[a.key] = {
      main: a.left,     // 仮（あとで決める）
      alt: a.right,
      pMain: 50,
      pAlt: 50,
      pL: 50,
      pR: 50,
      left: a.left,
      right: a.right,
    };
  }

  // 各軸：left/right のポイントを積む（ポイント=abs( signed )）
  const pts = {};
  for (const a of AXES) {
    pts[a.key] = { L: 0, R: 0 };
  }

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const v = answers?.[i];
    if (v == null) continue;

    const signed = likertToSigned(v);
    if (signed === 0) continue;

    const pair = axisPair(q.axis);
    if (!pair) continue;

    const magnitude = Math.abs(signed);
    const side = q.side; // "U" or "O" etc

    // signed>0 は q.side 側に寄る、signed<0 は反対側に寄る
    const toward = signed > 0 ? side : (side === pair.left ? pair.right : pair.left);

    const axisKey = q.axis;
    if (toward === pair.left) pts[axisKey].L += magnitude;
    if (toward === pair.right) pts[axisKey].R += magnitude;
  }

  for (const a of AXES) {
    const p = pts[a.key];
    const total = p.L + p.R;

    let pL = 50, pR = 50;
    if (total > 0) {
      pL = Math.round((p.L / total) * 100);
      pR = 100 - pL;
    }

    // main は多い方
    const main = p.L >= p.R ? a.left : a.right;
    const alt = main === a.left ? a.right : a.left;
    const pMain = main === a.left ? pL : pR;
    const pAlt = 100 - pMain;

    out[a.key] = {
      main,
      alt,
      pMain,
      pAlt,
      pL,
      pR,
      left: a.left,
      right: a.right,
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
