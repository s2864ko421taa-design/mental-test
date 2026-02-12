// js/scoring.js

const AXES = {
  UO: { main: "U", alt: "O" },
  MC: { main: "M", alt: "C" },
  HL: { main: "H", alt: "L" },
  DS: { main: "D", alt: "S" },
  RX: { main: "R", alt: "X" },
};

// 1=とても当てはまる, 2=やや, 3=中立, 4=あまり, 5=全く
// 1ほど「その文に賛成」→ side 方向に強く寄る
function agreeStrength(value) {
  // 1->+2, 2->+1, 3->0, 4->-1, 5->-2
  return 3 - Number(value);
}

/**
 * questions.js の各設問はこういう形を想定：
 * { id: 1, axis: "UO", side: "U", text: "..." }
 * side は「その文に賛成したら寄る側の文字」
 */
export function calculateResult(answers, QUESTIONS) {
  const out = {};
  for (const k of Object.keys(AXES)) {
    out[k] = {
      main: AXES[k].main,
      alt: AXES[k].alt,
      pointsMain: 0,
      pointsAlt: 0,
      percentMain: 50,
      percentAlt: 50,
    };
  }

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const v = answers[i];
    if (!v) continue;

    const axisKey = q.axis;
    const axis = out[axisKey];
    if (!axis) continue;

    const s = agreeStrength(v);
    if (s === 0) continue;

    // s>0 は「文に賛成」＝ q.side に寄る
    // s<0 は「文に反対」＝ 反対側に寄る
    const toward = s > 0 ? q.side : (q.side === axis.main ? axis.alt : axis.main);
    const add = Math.abs(s);

    if (toward === axis.main) axis.pointsMain += add;
    else axis.pointsAlt += add;
  }

  for (const k of Object.keys(out)) {
    const a = out[k];
    const total = a.pointsMain + a.pointsAlt;
    if (total <= 0) {
      a.percentMain = 50;
      a.percentAlt = 50;
    } else {
      a.percentMain = Math.round((a.pointsMain / total) * 100);
      a.percentAlt = 100 - a.percentMain;
    }
    // 表示用：どっちが勝ちか
    a.pick = a.pointsMain >= a.pointsAlt ? a.main : a.alt;

    // index.js のゲージ用（左=main, 右=alt）
    a.pl = a.percentMain;
    a.pr = a.percentAlt;
  }

  return out;
}

export function buildCode(axis) {
  return (
    axis.UO.pick +
    axis.MC.pick +
    axis.HL.pick +
    axis.DS.pick +
    axis.RX.pick
  );
}
