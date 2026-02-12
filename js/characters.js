// タイプごとに色・名前・説明・強み・注意点・おすすめ行動を持たせる
export const TYPE_INFO = {
  // 基本テンプレ（存在しないタイプでもこれで表示できる）
  __default(type){
    return {
      type,
      color: colorFromType(type),
      name: "ベースタイプ",
      summary: "このタイプの説明はまだ増やせます。まずは動作優先で最低限を表示しています。",
      strengths: ["状況把握ができる", "自分なりの処理ルートがある", "一貫性を作れる"],
      pitfalls: ["偏りが出ると極端になりやすい", "合わない環境でストレスが溜まる"],
      tips: ["しんどい時は軸ごとに原因を分解する", "反対軸の行動を少しだけ試す（10%でOK）"],
      examples: ["（例）自作キャラ / 友達 / 有名人をここに追加できる"]
    };
  }
};
const colorClass = getColorByType(t);
a.classList.add(colorClass);

export function getColorByType(type) {

  if(type.includes("H")) return "blue";
  if(type.includes("L")) return "red";

  if(type.includes("U") && type.includes("S")) return "green";
  if(type.includes("O") && type.includes("M")) return "purple";

  return "blue";
}
// 32タイプ全列挙（U/O * M/C * H/L * D/S * R/X）
export function allTypes(){
  const a1 = ["U","O"];
  const a2 = ["M","C"];
  const a3 = ["H","L"];
  const a4 = ["D","S"];
  const a5 = ["R","X"];

  const out = [];
  for(const x1 of a1)
    for(const x2 of a2)
      for(const x3 of a3)
        for(const x4 of a4)
          for(const x5 of a5)
            out.push(x1+x2+x3+x4+x5);
  return out;
}

export function getTypeInfo(type){
  // もし個別に説明を作りたければ、ここに TYPE_INFO["UMHDR"]=... を追加していけばOK
  const custom = TYPE_INFO[type];
  if(custom) return { ...TYPE_INFO.__default(type), ...custom, type };
  return TYPE_INFO.__default(type);
}
