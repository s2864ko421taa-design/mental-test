// js/characters.js
// 32タイプ（U/O, M/C, H/L, D/S, R/X の組み合わせ）
// このファイルは type.html / characters.html 両方から使われます

const AXES = [
  { key: "UO", left: "U", right: "O", nameL: "外側処理", nameR: "内側処理" },
  { key: "MC", left: "M", right: "C", nameL: "適応", nameR: "非適応" },
  { key: "HL", left: "H", right: "L", nameL: "調和", nameR: "コントロール" },
  { key: "DS", left: "D", right: "S", nameL: "消耗", nameR: "節約" },
  { key: "RX", left: "R", right: "X", nameL: "本音", nameR: "演技" },
];

export const allTypes = buildAllTypes();

/**
 * code(例: "OMHSX") から表示用情報を作って返す
 */
export function getTypeInfo(code) {
  if (!code || typeof code !== "string") return null;
  const c = code.toUpperCase().trim();
  if (c.length !== 5) return null;

  // 文字チェック（U/O M/C H/L D/S R/X）
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

  const label = buildJapaneseName(c);        // 日本語のキャラ名（短い）
  const longName = buildLongJapaneseName(c); // もう少し説明っぽい日本語名
  const description = buildDescription(c);

  const strengths = buildStrengths(c);
  const cautions = buildCautions(c);
  const tips = buildTips(c);

  return {
    code: c,
    axesText,
    group,       // { name: "U×M" など }
    color,       // カードの点の色
    label,       // 例: 「アウト×モーフ×ハーモニー×セーブ×アクター」
    longName,    // 例: 「外に出して整える / 場に合わせる / 関係温度を守る / 省エネ / 演技で運ぶ」
    description,
    strengths,
    cautions,
    tips,
  };
}

/**
 * 32コード生成
 */
function buildAllTypes() {
  const types = [];
  // 0..31 のビットで左右を選ぶ
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

/**
 * 一覧のGROUPバッジ用（例: U×M / O×C）
 */
function buildGroup(code) {
  const uo = code[0] === "U" ? "外側処理" : "内側処理";
  const mc = code[1] === "M" ? "適応" : "非適応";
  return { name: `${uo}×${mc}` };
}

/**
 * 日本語の短いキャラ名（あなたが言ってた「ローマ字だけ」問題の解決用）
 * ここは自由に改名してOK
 */
function buildJapaneseName(code) {
  const map = {
    U: "アウト",
    O: "イン",
    M: "モーフ",
    C: "コア",
    H: "ハーモニー",
    L: "ロジック",
    D: "ドレイン",
    S: "セーブ",
    R: "リアル",
    X: "アクター",
  };
  return `${map[code[0]]}×${map[code[1]]}×${map[code[2]]}×${map[code[3]]}×${map[code[4]]}`;
}

/**
 * もう少し意味が分かる日本語名（サブで表示したい用）
 */
function buildLongJapaneseName(code) {
  const uo =
    code[0] === "U"
      ? "外に出して整える"
      : "内で噛み砕いて整える";

  const mc =
    code[1] === "M"
      ? "場に合わせて変形する"
      : "自分の軸を守って動く";

  const hl =
    code[2] === "H"
      ? "関係温度を守りやすい"
      : "筋を通して整えやすい";

  const ds =
    code[3] === "D"
      ? "短期で燃えやすい"
      : "省エネで長期向き";

  const rx =
    code[4] === "X"
      ? "演技で運ぶのが得意"
      : "素で勝負しやすい";

  return `${uo} / ${mc} / ${hl} / ${ds} / ${rx}`;
}

/**
 * 説明文（タイプ詳細の上段）
 */
function buildDescription(code) {
  const uo =
    code[0] === "U"
      ? "あなたは「外側処理（Outer processing）」寄り。話す・書く・動くことで感情や考えを整理しやすい。"
      : "あなたは「内側処理（Inner processing）」寄り。頭の中で噛み砕き、納得してから言語化しやすい。";

  const mc =
    code[1] === "M"
      ? "環境への姿勢は「適応型（Morph）」。場の空気・相手のテンポに合わせて形を変えられる。"
      : "環境への姿勢は「非適応型（Core）」。自分の基準を崩しにくく、納得できない変化に抵抗しやすい。";

  const hl =
    code[2] === "H"
      ? "対人スタンスは「調和重視（Harmony）」。関係の摩擦を減らし、温度感を守ろうとする。"
      : "対人スタンスは「コントロール重視（Logic/Control）」。筋・ルール・再現性を優先しやすい。";

  const ds =
    code[3] === "D"
      ? "疲れ方は「消耗（Drain）」寄り。短期で全力を出せるが、燃え尽きやすい。"
      : "疲れ方は「節約（Save）」寄り。回復を前提に設計でき、継続に強い。";

  const rx =
    code[4] === "X"
      ? "見せ方は「演技（X-face）」寄り。場面に合わせて見せ方を調整し、交渉や立ち回りが強い。"
      : "見せ方は「本音（Real）」寄り。飾らずに出せるが、場の要求とズレると浮きやすい。";

  return `${uo} ${mc} ${hl} ${ds} ${rx}`;
}

/**
 * 強み（箇条書き）
 */
function buildStrengths(code) {
  const s = [];

  if (code[0] === "U") s.push("外に出して処理できる（回復が速く、抱え込みにくい）");
  else s.push("内で精密に処理できる（判断が深く、ブレにくい）");

  if (code[1] === "M") s.push("場に合わせて変形できる（適応が早い）");
  else s.push("軸で動ける（芯が強く、ブレにくい）");

  if (code[2] === "H") s.push("関係の温度を守れる（対人摩擦を減らせる）");
  else s.push("筋を通せる（判断が明確で、整理が上手い）");

  if (code[3] === "S") s.push("消耗を抑える設計ができる（継続が強い）");
  else s.push("短期で爆発できる（瞬間火力が高い）");

  if (code[4] === "X") s.push("場面対応が上手い（交渉・立ち回りが強い）");
  else s.push("言葉の純度が高い（信頼が取りやすい）");

  return s;
}

/**
 * 弱点・事故ポイント（箇条書き）
 */
function buildCautions(code) {
  const c = [];

  if (code[0] === "U") c.push("言いながら整える分、勢いが強く見えることがある");
  else c.push("内で抱えすぎて、共有が遅れて誤解されることがある");

  if (code[1] === "M") c.push("合わせすぎて「本音が見えない」と言われがち");
  else c.push("こだわりが強く見えて、融通が利かないと思われがち");

  if (code[2] === "H") c.push("優先順位が関係寄りで、我慢を溜めやすい");
  else c.push("正論が強く、温度差で相手が萎えることがある");

  if (code[3] === "D") c.push("無理して走ると一気に燃え尽きる");
  else c.push("安全運転すぎてチャンスを逃すことがある");

  if (code[4] === "X") c.push("演じすぎると「自分が何者か」見失いやすい");
  else c.push("素が強すぎて、場によっては誤解されやすい");

  return c;
}

/**
 * おすすめ行動（箇条書き）
 */
function buildTips(code) {
  const t = [];

  if (code[0] === "U") t.push("話す/書くで整理する時間を意図的に作る（メモ・独り言・通話）");
  else t.push("内省→要点だけ共有の型を作る（結論→理由→要望の順）");

  if (code[1] === "M") t.push("合わせた後に「自分の希望」を1つ戻す癖をつける");
  else t.push("譲れない軸と、譲っていい軸を先に分けておく");

  if (code[2] === "H") t.push("優しさの前に境界線（NOの言い方テンプレ）を持つ");
  else t.push("正しさの前に共感を1行入れる（相手の感情のラベル付け）");

  if (code[3] === "D") t.push("短期集中→回復をセットにする（休む時間を先に確保）");
  else t.push("省エネでも進むタスクに分解して、毎日少しずつ進める");

  if (code[4] === "X") t.push("演じる場と素を出す場を分ける（回復用コミュニティを作る）");
  else t.push("素の強さを「言い方」で調整する（柔らかい導入→本題）");

  return t;
}

/**
 * コードから安定した色を作る（CSS不要）
 */
function colorFromCode(code) {
  let h = 0;
  for (let i = 0; i < code.length; i++) {
    h = (h * 31 + code.charCodeAt(i)) >>> 0;
  }
  const hue = h % 360;
  return `hsl(${hue} 70% 60%)`;
}
