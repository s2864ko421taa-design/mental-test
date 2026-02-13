// js/characters.js
// 32タイプ：U/O, M/C, H/L, D/S, R/X の組み合わせ
const AXES = [
  { key: "UO", left: "U", right: "O", nameL: "外側処理", nameR: "内側処理" },
  { key: "MC", left: "M", right: "C", nameL: "適応", nameR: "非適応" },
  { key: "HL", left: "H", right: "L", nameL: "調和", nameR: "コントロール" },
  { key: "DS", left: "D", right: "S", nameL: "消耗", nameR: "節約" },
  { key: "RX", left: "R", right: "X", nameL: "本音", nameR: "演技" },
];

export const allTypes = buildAllTypes();

export function getTypeInfo(code) {
  if (!code || typeof code !== "string") return null;
  const c = code.toUpperCase().trim();
  if (c.length !== 5) return null;

  // 文字が想定軸以外ならnull
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
  const description = buildDescription(c);

  const strengths = buildStrengths(c);
  const cautions = buildCautions(c);
  const tips = buildTips(c);

  return {
    code: c,
    axesText,
    group,          // { name: "..."} ← characters.html が info.group.name 参照するので必須
    color,          // 一覧のドット色
    shortLabel,     // 1行タグ用
    label: shortLabel,
    description,
    strengths,
    cautions,
    tips,
  };
}

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
  // 見た目が安定するようソート
  types.sort();
  return types;
}

function buildGroup(code) {
  // グループは「最初の2軸」をざっくりまとめる（例：外側×適応）
  const uo = code[0] === "U" ? "外側処理" : "内側処理";
  const mc = code[1] === "M" ? "適応" : "非適応";
  return { name: `${uo}×${mc}` };
}

function buildShortLabel(code) {
  const map = {
    U: "外に出して整理",
    O: "内で練って整理",
    M: "その場で変形",
    C: "軸で貫く",
    H: "関係を守る",
    L: "結果を取る",
    D: "燃やして進む",
    S: "省エネ継続",
    R: "素で出る",
    X: "演じて出す",
  };
  return `${map[code[0]]} / ${map[code[1]]} / ${map[code[2]]}`;
}

function buildDescription(code) {
  const uo = code[0] === "U"
    ? "外側処理（Outer processing）で感情や思考を“出しながら”整える"
    : "内側処理（Inner processing）で感情や思考を“内で固めて”整える";
  const mc = code[1] === "M"
    ? "環境への姿勢は適応型（Morph）で、場に合わせて形を変えられる"
    : "環境への姿勢は非適応型（Core）で、自分の軸を変えにくい";
  const hl = code[2] === "H"
    ? "対人スタンスは調和重視（Harmony）で、関係温度を崩しにくい"
    : "対人スタンスはコントロール重視（Logic/Control）で、結論と整合性を優先しやすい";
  const ds = code[3] === "D"
    ? "疲れ方は消耗型（Drain）寄りで、短期集中で押し切ると強い"
    : "疲れ方は節約型（Save）寄りで、長期戦の設計が上手い";
  const rx = code[4] === "X"
    ? "見せ方は演技型（X-face）寄りで、役割に応じて表現を調整できる"
    : "見せ方は本音型（Real）寄りで、素の反応が出やすい";

  return `${uo}。${mc}。${hl}。${ds}。${rx}。`;
}

function buildStrengths(code) {
  const s = [];
  if (code[0] === "U") s.push("外に出して処理できる（回復が速く、抱え込みにくい）");
  else s.push("内で処理できる（結論が固く、ブレにくい）");

  if (code[1] === "M") s.push("場に合わせて変形できる（適応が早い）");
  else s.push("軸が強い（ブレずに信頼を積む）");

  if (code[2] === "H") s.push("関係の温度を守れる（対人摩擦を減らせる）");
  else s.push("結論が速い（迷いを減らして前に進める）");

  if (code[3] === "S") s.push("消耗を抑える設計ができる（継続が強い）");
  else s.push("短期決戦に強い（勝ち筋を押し切れる）");

  if (code[4] === "X") s.push("場面対応が上手い（交渉・立ち回りが強い）");
  else s.push("素が伝わる（信頼・熱量が乗りやすい）");

  return s;
}

function buildCautions(code) {
  const c = [];
  if (code[0] === "U") c.push("言いながら整理する分、発言が荒く見えることがある");
  else c.push("内で固めすぎて、共有が遅れて誤解されることがある");

  if (code[1] === "M") c.push("場に合わせすぎて“本音が見えない”と言われがち");
  else c.push("軸にこだわりすぎて融通が効かないと思われがち");

  if (code[2] === "H") c.push("衝突回避で我慢が溜まり、後で爆発しやすい");
  else c.push("正論が強く、温度差で相手が萎えることがある");

  if (code[3] === "D") c.push("無理して走ると一気に燃え尽きる");
  else c.push("省エネ優先でチャンスを逃すことがある");

  if (code[4] === "X") c.push("演じすぎると自分の疲労に気づきにくい");
  else c.push("素が出すぎて、場によっては損をする");

  return c;
}

function buildTips(code) {
  const t = [];
  if (code[0] === "U") t.push("話す前に“結論だけ一言”を作ると事故が減る");
  else t.push("内で固める時間を取ったら“途中経過”も共有する");

  if (code[1] === "M") t.push("合わせた後に“自分の基準”を1つ戻すとブレが減る");
  else t.push("軸を守りつつ“相手の前提”を先に確認する");

  if (code[2] === "H") t.push("優しさの前に“境界線”を置く（無理なものは無理と言う）");
  else t.push("結論の前に“相手の感情”を一言だけ拾うと通りが良い");

  if (code[3] === "D") t.push("短期集中の後に休みを固定する（回復を設計）");
  else t.push("省エネでも“勝ち筋だけ”は取りに行く（要所で踏む）");

  if (code[4] === "X") t.push("演じる場と素で出る場を分けて、回復場所を確保");
  else t.push("素の強さを“言い方”で調整する（角を丸める）");

  return t;
}

function colorFromCode(code) {
  // 雑に安定した色を作る（CSS用）
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
  // 0..360
  const hue = h % 360;
  return `hsl(${hue} 70% 60%)`;
}
