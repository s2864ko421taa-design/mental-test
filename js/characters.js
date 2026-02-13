// js/characters.js
// 32タイプ U/O, M/C, H/L, D/S, R/X の組み合わせ

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

  return {
    code: c,
    name: buildCharacterName(c),  // ← ★追加ポイント
    axesText,
    color: colorFromCode(c),
  };
}

function buildAllTypes() {
  const types = [];
  for (let mask = 0; mask < 32; mask++) {
    let code = "";
    for (let i = 0; i < 5; i++) {
      const bit = (mask >> (4 - i)) & 1;
      const a = AXES[i];
      code += bit === 0 ? a.left : a.right;
    }
    types.push(code);
  }
  return types.sort();
}

/* 🔥 ここがキャラ名生成ロジック */

function buildCharacterName(code) {
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

  return map[code[0]] + map[code[2]] + "型";
}

/* 色生成 */

function colorFromCode(code) {
  let h = 0;
  for (let i = 0; i < code.length; i++) {
    h = (h * 31 + code.charCodeAt(i)) >>> 0;
  }
  const hue = h % 360;
  return `hsl(${hue} 70% 60%)`;
}
