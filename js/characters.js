// js/characters.js
// 32タイプ = U/O, M/C, H/L, D/S, R/X の組み合わせ

const AXES = [
  { key: "UO", left: "U", right: "O", nameL: "外側処理", nameR: "内側処理" },
  { key: "MC", left: "M", right: "C", nameL: "適応", nameR: "非適応" },
  { key: "HL", left: "H", right: "L", nameL: "調和", nameR: "コントロール" },
  { key: "DS", left: "D", right: "S", nameL: "消耗", nameR: "節約" },
  { key: "RX", left: "R", right: "X", nameL: "本音", nameR: "演技" },
];

export const allTypes = buildAllTypes();

/**
 * code 例: "OMHSX"
 * 戻り値: 画面で使う情報一式
 */
export function getTypeInfo(code) {
  if (!code || typeof code !== "string") return null;

  const c = code.toUpperCase().trim();
  if (c.length !== 5) return null;

  // 文字チェック（U/O/M/C/H/L/D/S/R/X 以外なら null）
  for (let i = 0; i < 5; i++) {
    const a = AXES[i];
    const ch = c[i];
    if (ch !== a.left && ch !== a.right) return null;
  }

  const axesText = AXES.map((a, i) => {
    const ch = c[i];
    const label = ch === a.left ? a.nameL : a.nameR;
    return `${ch}:${label}`;
  }).join(" / ");

  const group = buildGroup(c);
  const color = colorFromCode(c);

  const shortLabel = buildShortLabel(c);
  const name = buildCharacterName(c);

  const description = buildDescription(c);

  const strengths = buildStrengths(c);
  const cautions = buildCautions(c);
  const tips = buildTips(c);

  return {
    code: c,
    name,        // ← 日本語キャラ名（追加）
    axesText,
    group,       // { name: "..." }
    color,
    shortLabel,  // 1行キャッチ
    label: shortLabel, // 既存UI互換
    description,
    strengths,
    cautions,
    tips,
  };
}

function buildAllTypes() {
  const types = [];
  // 0..31 のビットで左右を選ぶ（5軸）
  for (let mask = 0; mask < 32; mask++) {
    let code = "";
    for (let i = 0; i < 5; i++) {
      const bit = (mask >> (4 - i)) & 1;
      const a = AXES[i];
      code += bit === 0 ? a.left : a.right;
    }
    types.push(code);
  }
  types.sort();
  return types;
}

// グループ表示（一覧の "GROUP" をやめたいならここを好きに）
function buildGroup(code) {
  const uo = code[0] === "U" ? "外側処理" : "内側処理";
  const mc = code[1] === "M" ? "適応" : "非適応";
  return { name: `${uo}×${mc}` };
}

// 1行キャッチ（カード下の短文）
function buildShortLabel(code) {
  const map = {
    U: "外に出して整える",
    O: "内で噛んで整える",
    M: "場に合わせて変形",
    C: "芯を優先して固定",
    H: "関係の温度を守る",
    L: "正しさで舵を切る",
    D: "短期で燃えやすい",
    S: "省エネで続ける",
    R: "素を出しやすい",
    X: "演じ分けが得意",
  };
  return `${map[code[0]]} / ${map[code[1]]} / ${map[code[2]]}`;
}

// ✅ 日本語の「キャラ名」生成（ここを好きにカスタムしてOK）
function buildCharacterName(code) {
  const map = {
    U: "アウト", O: "イン",
    M: "モーフ", C: "コア",
    H: "ハーモ", L: "ロジック",
    D: "ドレイン", S: "セーブ",
    R: "リアル", X: "アクター",
  };
  // 例: OMHSX → イン×モーフ×ハーモ×セーブ×アクター
  return `${map[code[0]]}×${map[code[1]]}×${map[code[2]]}×${map[code[3]]}×${map[code[4]]}`;
}

function buildDescription(code) {
  const uo =
    code[0] === "U"
      ? "外側処理（Outer processing）寄りで、感情や思考を「出しながら」整理しやすい。"
      : "内側処理（Inner processing）寄りで、感情や思考を「内で噛んで」整理しやすい。";

  const mc =
    code[1] === "M"
      ? "環境への姿勢は適応（Morph）。場に合わせて型を変えられる。"
      : "環境への姿勢は非適応（Core）。自分の軸を崩しにくい。";

  const hl =
    code[2] === "H"
      ? "対人スタンスは調和（Harmony）。関係の温度を一定に保ちやすい。"
      : "対人スタンスはコントロール（Logic/Control）。筋道と境界を優先しやすい。";

  const ds =
    code[3] === "D"
      ? "疲れ方は消耗（Drain）寄り。短期で出力が上がるが、燃え尽きやすい。"
      : "疲れ方は節約（Save）寄り。省エネ設計で、継続に強い。";

  const rx =
    code[4] === "X"
      ? "見せ方は演技（X-face）寄り。場面ごとに表現を使い分けられる。"
      : "見せ方は本音（Real）寄り。素が伝わりやすい。";

  return `${uo} ${mc} ${hl} ${ds} ${rx}`;
}

function buildStrengths(code) {
  const s = [];
  if (code[0] === "U") s.push("外に出して処理できる（回復が速く、抱え込みにくい）");
  else s.push("内で処理できる（感情が深く、ブレにくい）");

  if (code[1] === "M") s.push("場に合わせて変形できる（適応が早い）");
  else s.push("軸が強い（ブレずに信頼を積む）");

  if (code[2] === "H") s.push("関係の温度を守れる（対人摩擦を減らせる）");
  else s.push("判断が速い（迷いを減らして前に進める）");

  if (code[3] === "S") s.push("消耗を抑える設計ができる（継続が強い）");
  else s.push("短期決戦に強い（瞬間最大火力が出る）");

  if (code[4] === "X") s.push("場面対応が上手い（交渉・立ち回りが強い）");
  else s.push("素が伝わる（信頼・親密が育ちやすい）");

  return s;
}

function buildCautions(code) {
  const c = [];
  if (code[0] === "U") c.push("言いながら整理する分、勢いで言い過ぎることがある");
  else c.push("内に溜めすぎて、共有が遅れて誤解されることがある");

  if (code[1] === "M") c.push("合わせすぎて“本音”が見えにくいと言われがち");
  else c.push("こだわりが強すぎて、柔軟性が落ちるときがある");

  if (code[2] === "H") c.push("衝突回避で言うべきことを飲み込むことがある");
  else c.push("正論が強く出て、相手の感情を置き去りにすることがある");

  if (code[3] === "D") c.push("無理して走ると一気に燃え尽きる");
  else c.push("省エネ過ぎてチャンスを逃すことがある");

  if (code[4] === "X") c.push("演じ過ぎると自分の感覚が鈍る");
  else c.push("素が出すぎて、場に合わず損をすることがある");

  return c;
}

function buildTips(code) {
  const t = [];
  if (code[0] === "U") t.push("話す前に「結論→理由→例」の順で短く出す");
  else t.push("内省が長い時は“要点だけ”先に共有する");

  if (code[1] === "M") t.push("合わせた後に「自分の希望」を1つ足す");
  else t.push("譲れない軸と、譲れる部分を分けて言語化する");

  if (code[2] === "H") t.push("衝突回避より“期待値調整”を優先する");
  else t.push("正しさの前に「相手の気持ち」を1行添える");

  if (code[3] === "D") t.push("短期で燃やすなら、回復日（オフ）を先に確保");
  else t.push("省エネでも、週1だけ“攻める日”を作る");

  if (code[4] === "X") t.push("演じる量を決める（何割が素か）");
  else t.push("素を出す前に“場のゴール”を確認する");

  return t;
}

function colorFromCode(code) {
  // 安定色（CSS不要で動く）
  let h = 0;
  for (let i = 0; i < code.length; i++) {
    h = (h * 31 + code.charCodeAt(i)) >>> 0;
  }
  const hue = h % 360;
  return `hsl(${hue} 70% 60%)`;
}
