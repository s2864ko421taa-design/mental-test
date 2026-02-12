// js/scoring.js
import { QUESTIONS } from "./questions.js";

/**
 * 回答(1~5)を軸ごとの割合にする
 * 1=とても当てはまる(賛成) … 5点
 * 5=全く当てはまらない(反対) … 1点
 *
 * ある側(side)の文に賛成 → sideに加点
 * 反対 → 反対側に加点
 */
const PAIRS = {
  UO: ["U", "O"],
  MC: ["M", "C"],
  HL: ["H", "L"],
  DS: ["D", "S"],
  RX: ["R", "X"],
};

function otherSide(axis, side) {
  const [a, b] = PAIRS[axis];
  return side === a ? b : a;
}

export function calculateResult(answers, questions = QUESTIONS) {
  // 軸ごとの点数箱
  const score = {
    UO: { U: 0, O: 0 },
    MC: { M: 0, C: 0 },
    HL: { H: 0, L: 0 },
    DS: { D: 0, S: 0 },
    RX: { R: 0, X: 0 },
  };

  for (let i = 0; i < (answers?.length || 0); i++) {
    const v = answers[i];
    if (v == null) continue;

    const q = questions[i];
    if (!q) continue;

    const axis = q.axis; // "UO" etc
    const side = q.side; // "U" etc
    if (!PAIRS[axis]) continue;

    const opp = otherSide(axis, side);

    // 1~5 をポイントに変換
    const agree = 6 - Number(v);   // 賛成ポイント(1→5, 5→1)
    const disagree = Number(v);    // 反対ポイント(1→1, 5→5)

    // その文(side)に賛成した分はsideへ、反対した分はoppへ
    if (score[axis] && score[axis][side] != null && score[axis][opp] != null) {
      score[axis][side] += agree;
      score[axis][opp] += disagree;
    }
  }

  // index.js が期待してる形に整形（pl/prは固定順）
  const out = {};

  for (const axis of Object.keys(PAIRS)) {
    const [L, R] = PAIRS[axis]; // 固定順（U/O, M/C...）
    const l = score[axis][L];
    const r = score[axis][R];
    const total = l + r || 1;

    const pl = Math.round((l / total) * 100);
    const pr = 100 - pl;

    const main = pl >= pr ? L : R;
    const alt = main === L ? R : L;
    const percentMain = main === L ? pl : pr;
    const percentAlt = 100 - percentMain;

    out[axis] = {
      // 固定順パーセント（←ここを index.js が使う）
      pl, // 左側（例: U, M, H, D, R）
      pr, // 右側（例: O, C, L, S, X）

      // 便利情報（type.html 側で使いたければ使える）
      main,
      alt,
      percentMain,
      percentAlt,
      scoreLeft: l,
      scoreRight: r,
    };
  }

  return out;
}

export function buildCode(axis) {
  // axis.UO.main みたいに main が確実にある前提
  return (
    axis.UO.main +
    axis.MC.main +
    axis.HL.main +
    axis.DS.main +
    axis.RX.main
  );
}
