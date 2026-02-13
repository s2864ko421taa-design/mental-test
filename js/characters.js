// js/characters.js

// ===== 32タイプ一覧 =====
export const allTypes = [
  "OMHSX","OMHSR","OMHCX","OMHCR",
  "OMDSX","OMDSR","OMDCX","OMDCR",
  "UMHSX","UMHSR","UMHCX","UMHCR",
  "UMDSX","UMDSR","UMDCX","UMDCR",

  "OMHSY","OMHSZ","OMHCY","OMHCZ",
  "OMDSY","OMDSZ","OMDCY","OMDCZ",
  "UMHSY","UMHSZ","UMHCY","UMHCZ",
  "UMDSY","UMDSZ","UMDCY","UMDCZ"
];


// ===== キャラデータ本体 =====
const TYPE_MAP = {

  OMHSX: {
    code: "OMHSX",
    name: "適応する外交調整者",
    shortLabel: "環境順応バランサー",
    group: "外側処理型",
    color: "#6EC1E4",

    axesText: "Outer / Morph / Harmony / Save / X-face",

    description:
      "外側で感情を処理し、場に合わせて柔軟に変形できる調整型。人間関係の温度管理が非常に上手く、衝突を回避しながら全体最適を探す。自分の本音は見せすぎない。",

    strengths: [
      "空気を読みながら場を整える",
      "感情の回復が速い",
      "対人トラブルを最小化できる",
      "持久戦に強い",
      "交渉・立ち回りが上手い"
    ],

    cautions: [
      "本音を抑えすぎて疲労が溜まる",
      "優柔不断に見られることがある",
      "演技が続くと自己不一致が起きる"
    ],

    tips: [
      "本音を出せる安全地帯を持つ",
      "定期的に一人時間を確保する",
      "無理な調整役を引き受けすぎない"
    ]
  },


  OMHCR: {
    code: "OMHCR",
    name: "協調設計者",
    shortLabel: "共感型構築者",
    group: "外側処理型",
    color: "#8BC34A",

    axesText: "Outer / Morph / Control / Reserve",

    description:
      "外側で処理しつつも内面はかなり計算的。対人では協調を見せながら、実は構造を組み立てているタイプ。",

    strengths: [
      "状況設計が得意",
      "感情と論理の両立ができる",
      "周囲を安心させながら主導できる"
    ],

    cautions: [
      "裏で考えすぎる",
      "信頼されにくい場合がある"
    ],

    tips: [
      "意図を少しだけ言語化する",
      "一人で抱えすぎない"
    ]
  },

  // 他の30タイプもここに追加
};



// ===== 取得関数 =====
export function getTypeInfo(code) {
  return TYPE_MAP[code] || null;
}
