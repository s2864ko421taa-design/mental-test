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

// タイプの色：軸の組み合わせから安定して決まるようにする
export function colorFromType(type){
  // 5軸の文字から色を合成っぽく作る（決め打ちでもOK）
  const map = {
    U:[90,120,255],
    O:[255,110,140],
    M:[90,220,180],
    C:[255,200,90],
    H:[120,220,255],
    L:[255,160,90],
    D:[200,120,255],
    S:[120,255,160],
    R:[255,120,120],
    X:[120,120,255]
  };

  let r=120,g=140,b=220, n=0;
  for(const ch of type){
    const v = map[ch];
    if(!v) continue;
    r += v[0]; g += v[1]; b += v[2];
    n++;
  }
  r = Math.round(r/(n+1));
  g = Math.round(g/(n+1));
  b = Math.round(b/(n+1));
  return `rgb(${r},${g},${b})`;
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
