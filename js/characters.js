// js/characters.js
// 32タイプ（U/O × M/C × H/L × D/S × R/X）
// 4色グループ： U-H / U-L / O-H / O-L

export const AXES = {
  UO: { U: "内側処理（Under processing）", O: "外側処理（Outer processing）" },
  MC: { M: "適応型（Morph）", C: "芯型（Core）" },
  HL: { H: "調和重視（Harmony）", L: "主導重視（Lead）" },
  DS: { D: "消耗（Drain）", S: "節約（Save）" },
  RX: { R: "本音型（Real）", X: "演技型（X-face）" },
};

export const COLOR_GROUPS = {
  "UH": { key: "UH", name: "内処理 × 調和", color: "#4aa3ff" },   // blue
  "UL": { key: "UL", name: "内処理 × 主導", color: "#ff5b7a" },   // red
  "OH": { key: "OH", name: "外処理 × 調和", color: "#3be6b8" },   // green
  "OL": { key: "OL", name: "外処理 × 主導", color: "#6c7cff" },   // purple
};

export function getGroupKey(type){
  const uo = type[0];           // U/O
  const hl = type[2];           // H/L  (U M H D R の3文字目)
  return `${uo}${hl}`;
}

export function getColorByType(type){
  const g = COLOR_GROUPS[getGroupKey(type)];
  return g ? g.color : "#6c7cff";
}

export function allTypes(){
  const UO = ["U","O"];
  const MC = ["M","C"];
  const HL = ["H","L"];
  const DS = ["D","S"];
  const RX = ["R","X"];
  const out = [];
  for(const u of UO)
  for(const m of MC)
  for(const h of HL)
  for(const d of DS)
  for(const r of RX){
    out.push(`${u}${m}${h}${d}${r}`);
  }
  return out;
}

function baseDescription(type){
  const [uo, mc, hl, ds, rx] = type.split("");

  const lines = [];
  lines.push(`あなたは「${AXES.UO[uo]}」で感情を処理しやすいタイプ。`);
  lines.push(`環境への姿勢は「${AXES.MC[mc]}」。対人スタンスは「${AXES.HL[hl]}」。`);
  lines.push(`疲れ方は「${AXES.DS[ds]}」寄りで、見せ方は「${AXES.RX[rx]}」傾向。`);
  return lines.join(" ");
}

function baseStrengths(type){
  const [uo, mc, hl, ds, rx] = type.split("");
  const s = [];

  if(uo==="U") s.push("感情を内側で整理してから動ける（衝動で崩れにくい）");
  if(uo==="O") s.push("外に出して処理できる（回復が速く、抱え込みにくい）");

  if(mc==="M") s.push("場に合わせて変形できる（適応が早い）");
  if(mc==="C") s.push("芯がブレにくい（信頼・一貫性が武器）");

  if(hl==="H") s.push("関係の温度を守れる（対人摩擦を減らせる）");
  if(hl==="L") s.push("流れを作れる（決断・推進力が強い）");

  if(ds==="D") s.push("無理のサインに気づける（限界前に調整しやすい）");
  if(ds==="S") s.push("消耗を抑える設計ができる（継続が強い）");

  if(rx==="R") s.push("本音が軸になる（誠実で説得力が出る）");
  if(rx==="X") s.push("場面対応が上手い（交渉・立ち回りが強い）");

  return s;
}

function baseCautions(type){
  const [uo, mc, hl, ds, rx] = type.split("");
  const c = [];

  if(uo==="U") c.push("内側で溜めすぎると爆発しやすい（言語化の出口が必要）");
  if(uo==="O") c.push("勢いで言いすぎる時がある（時間差で後悔しやすい）");

  if(mc==="M") c.push("合わせすぎると自分が薄くなる（軸の確認が必須）");
  if(mc==="C") c.push("合わない環境で硬直しやすい（逃げ道の設計が必要）");

  if(hl==="H") c.push("我慢しすぎて不満が溜まる（小出しの調整が吉）");
  if(hl==="L") c.push("強く出ると反発を生む（温度管理が鍵）");

  if(ds==="D") c.push("疲労が溜まると性能が落ちやすい（休む前提で勝つ）");
  if(ds==="S") c.push("無理は少ないが、感情の棚卸しを先送りしやすい");

  if(rx==="R") c.push("表情に出て誤解されることがある（言葉で補強）");
  if(rx==="X") c.push("演じすぎると本音が分からなくなる（素の時間が必要）");

  return c;
}

function baseTips(type){
  const [uo, mc, hl, ds, rx] = type.split("");
  const t = [];

  if(uo==="U") t.push("書く/メモで内側処理を可視化すると最強");
  if(uo==="O") t.push("信頼できる相手に“短く”吐くと回復が速い");

  if(mc==="M") t.push("“合わせる理由”を決めてから合わせる（迷子防止）");
  if(mc==="C") t.push("譲れない軸を3つに絞る（対立を減らす）");

  if(hl==="H") t.push("衝突回避より“修復”を選ぶと関係が強くなる");
  if(hl==="L") t.push("主導は“提案→合意”の順でやると通る");

  if(ds==="D") t.push("休息は“予定”に入れる（気合いは通用しない）");
  if(ds==="S") t.push("省エネでも“感情の換気”は定期的にやる");

  if(rx==="R") t.push("本音を出す前に“目的”を一言で決める");
  if(rx==="X") t.push("演技の後に“本音メモ”を書くと迷子にならない");

  return t;
}

// タイプ別に文章を上書きしたい場合はここへ追加
// 例： TYPE_OVERRIDES["UMHDR"] = { title:"〜", description:"〜", strengths:[...], cautions:[...], tips:[...] }
const TYPE_OVERRIDES = {};

export function getTypeInfo(type){
  const t = String(type || "").toUpperCase().trim();

  if(!/^[UO][MC][HL][DS][RX]$/.test(t)){
    return {
      code: t || "?????",
      title: "タイプが不明です",
      group: { key: "??", name: "Unknown", color: "#6c7cff" },
      color: "#6c7cff",
      description: "URLの ?t=XXXXX が壊れてる可能性があります。",
      strengths: [],
      cautions: [],
      tips: [],
      axesText: "",
    };
  }

  const gKey = getGroupKey(t);
  const group = COLOR_GROUPS[gKey] || { key: gKey, name: "Group", color: "#6c7cff" };

  const [uo, mc, hl, ds, rx] = t.split("");

  const base = {
    code: t,
    title: `タイプ ${t}`,
    group,
    color: group.color,
    description: baseDescription(t),
    strengths: baseStrengths(t),
    cautions: baseCautions(t),
    tips: baseTips(t),
    axesText: `${AXES.UO[uo]} / ${AXES.MC[mc]} / ${AXES.HL[hl]} / ${AXES.DS[ds]} / ${AXES.RX[rx]}`,
  };

  const over = TYPE_OVERRIDES[t];
  if(!over) return base;

  return {
    ...base,
    ...over,
    strengths: over.strengths ?? base.strengths,
    cautions: over.cautions ?? base.cautions,
    tips: over.tips ?? base.tips,
  };
}
