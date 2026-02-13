// /js/characters.js
// 32タイプ：O/U × M/C × H/L × S/D × R/X
// 使い方：
// import { getTypeInfo, getAllTypes, GROUPS } from "../js/characters.js";

export const GROUPS = {
  BLUE:   { key: "BLUE",   label: "ブルー",   color: "#4aa3ff", summary: "冷静・設計・最適化。状況を整えて勝ち筋を作る。" },
  RED:    { key: "RED",    label: "レッド",   color: "#ff5b7a", summary: "突破・推進・決断。前に進めて結果を取りに行く。" },
  GREEN:  { key: "GREEN",  label: "グリーン", color: "#3be6b8", summary: "共感・調整・関係維持。空気を整えて衝突を減らす。" },
  YELLOW: { key: "YELLOW", label: "イエロー", color: "#ffcc57", summary: "適応・演出・社交。場に合わせて流れを作る。" },
};

// 4色の割り当てルール（シンプル版）
// H=調和→GREEN, L=主導→RED, X=演技→YELLOW, それ以外（R寄り/内向設計）→BLUE
function pickGroup(code) {
  // code例: "OMHSX"
  const H_or_L = code[2]; // H or L
  const R_or_X = code[4]; // R or X
  if (H_or_L === "H") return GROUPS.GREEN;
  if (H_or_L === "L") return GROUPS.RED;
  if (R_or_X === "X") return GROUPS.YELLOW;
  return GROUPS.BLUE;
}

// 軸ラベル（表示用）
function axesText(code) {
  const p1 = code[0] === "O" ? "O=外側処理" : "U=内側処理";
  const p2 = code[1] === "M" ? "M=適応" : "C=芯";
  const p3 = code[2] === "H" ? "H=調和" : "L=主導";
  const p4 = code[3] === "S" ? "S=節約" : "D=消耗";
  const p5 = code[4] === "X" ? "X=演技" : "R=本音";
  return `${p1} / ${p2} / ${p3} / ${p4} / ${p5}`;
}

// 32体の「キャラ名＋説明書」本体
// description/strengths/cautions/tips は type.html でそのまま表示できる構造
export const TYPES = {
  // ===== O系（外側処理） =====
  OMHSX: {
    code: "OMHSX",
    name: "調律ナビゲーター",
    shortLabel: "場を整える交渉人",
    description:
      "外で話しながら整理し、状況に合わせて形を変えつつ、摩擦を最小化して流れを作る。必要な時は演出も使い、消耗せずに場を回すタイプ。",
    strengths: [
      "空気の変化に早い（揉める前に気づく）",
      "相手別に言い方を変えて着地させる",
      "無駄な衝突を避けながら結果を取る",
      "印象設計が上手く、初対面に強い",
    ],
    cautions: [
      "調整しすぎて“自分の本音”が薄くなる",
      "便利屋化して頼られすぎる",
      "演出が続くと自分が何者か分からなくなる",
    ],
    tips: [
      "“本音の主張枠”を週1で作る（小さくでOK）",
      "頼まれたら即OKせず“条件付きOK”にする",
      "疲れる相手には距離を置くルールを明文化",
    ],
  },

  OMHSR: {
    code: "OMHSR",
    name: "素直な仲裁者",
    shortLabel: "自然体のバランサー",
    description:
      "外で整理しつつ、誠実さと調和で場を安定させる。演出ではなく自然体で信頼を積み上げるタイプ。",
    strengths: ["安心感が出る", "誠実で信頼されやすい", "柔らかい調整ができる", "消耗を抑えた対人ができる"],
    cautions: ["優しさで背負いがち", "言うべき所で遠慮する", "“良い人”扱いされやすい"],
    tips: ["断る時は理由より“結論→代案”", "主張は短文で先に出す", "助ける範囲を決める"],
  },

  OMHDX: {
    code: "OMHDX",
    name: "燃焼サポーター",
    shortLabel: "頑張りすぎる場回し",
    description:
      "適応して調和も取れるが、気遣いで消耗しやすい。演出で場を保つ力は強いが、長期戦は休息設計が必須。",
    strengths: ["盛り上げ・場回しが得意", "誰にでも合わせられる", "空気が悪い時に耐えられる", "短期集中で成果が出る"],
    cautions: ["無理して笑う→後で反動", "急にシャットダウン", "疲れが表に出て誤解される"],
    tips: ["休みを予定に入れる（先に確保）", "役割を減らす（司会/調整を毎回やらない）", "疲労サインを自覚する"],
  },

  OMHDR: {
    code: "OMHDR",
    name: "共感ヒーラー",
    shortLabel: "情が深い外処理型",
    description:
      "人の気持ちに深く入り込み、自然体で助ける。消耗しやすいので“助け方の境界線”が鍵。",
    strengths: ["共感の深さ", "困ってる人を放っておけない", "話して整理できる", "対人ケアに強い"],
    cautions: ["背負い込み", "相手の感情に引っ張られる", "断れず疲弊"],
    tips: ["“助ける”を3段階に分ける（軽/中/重）", "重い相談は期限を決める", "休養が仕事の一部"],
  },

  OMLSX: {
    code: "OMLSX",
    name: "戦略オーガナイザー",
    shortLabel: "主導×適応×演出",
    description:
      "場を読みながら主導権を取り、合意形成や交渉で前に進める。節約型なので継続運用も得意。",
    strengths: ["合意形成が速い", "交渉が強い", "場の方向付けがうまい", "消耗せず成果を取りやすい"],
    cautions: ["相手から“操作的”に見られる", "結論急ぎで反感", "演出に頼りすぎる"],
    tips: ["結論前に“相手の目的”を確認", "情報公開の透明性を上げる", "勝ち方を1つに固定しない"],
  },

  OMLSR: {
    code: "OMLSR",
    name: "現場キャプテン",
    shortLabel: "誠実に仕切る",
    description:
      "外で整理し、適応しながら現場を前進させる。主導するが嘘は少なく、信頼で動かす。",
    strengths: ["判断が早い", "段取りがうまい", "誠実に指示できる", "現場改善が得意"],
    cautions: ["周りのペースを置いていく", "任せられず抱える", "説明不足になりがち"],
    tips: ["“理由”を一言添える", "任せる範囲を決める", "週1で棚卸し"],
  },

  OMLDX: {
    code: "OMLDX",
    name: "突破ドライバー",
    shortLabel: "押し切る推進機",
    description:
      "勢いと主導で突破するが、消耗型なので燃え尽きやすい。演出で耐えるが限界管理が重要。",
    strengths: ["火消しが速い", "決断して動ける", "危機対応で強い", "迷いを断てる"],
    cautions: ["言い方が強くなる", "疲れで雑になる", "衝突が増える"],
    tips: ["短期と長期で戦い方を分ける", "睡眠を削らない", "詰める時ほど言葉を柔らかく"],
  },

  OMLDR: {
    code: "OMLDR",
    name: "熱血コンダクター",
    shortLabel: "情で引っ張る",
    description:
      "本音で前に出て、熱量で人を動かす。消耗しやすいので“勝負所だけ全開”が最適。",
    strengths: ["熱で周囲を動かす", "言い切れる", "大きな決断ができる", "勇気を与える"],
    cautions: ["感情爆発", "疲労で不機嫌", "勢いで言い過ぎる"],
    tips: ["勝負所を決めて全開", "感情は一晩寝かせる", "反省会を短くする"],
  },

  OCHSX: {
    code: "OCHSX",
    name: "信念バランサー",
    shortLabel: "芯を守りつつ調和",
    description:
      "ブレない基準を持ちながら、場を壊さず調整できる。演出も使えるので政治も可能。",
    strengths: ["一貫性", "角を立てない主張", "長期の信頼", "文化・品質の守りが強い"],
    cautions: ["譲れない時に硬くなる", "我慢して不満が溜まる", "正しさで詰めがち"],
    tips: ["譲れない条件を先に提示", "対立は“目的の一致”から入る", "譲る所も言語化"],
  },

  OCHSR: {
    code: "OCHSR",
    name: "誠実メディエーター",
    shortLabel: "穏やかな軸持ち",
    description:
      "誠実さで信頼を取る調和型。派手さはないが、長期で強い“安定装置”。",
    strengths: ["信頼が資産", "揉め事を沈める", "落ち着き", "言葉に嘘が少ない"],
    cautions: ["刺激が少なく見える", "譲りすぎる", "自分の欲を後回し"],
    tips: ["欲求を小さくでも言う", "断りのテンプレを作る", "自分優先日を設定"],
  },

  OCHDX: {
    code: "OCHDX",
    name: "我慢の守護者",
    shortLabel: "板挟み耐久型",
    description:
      "信念を守りつつ場も保つが、消耗が強い。重要ポジションほど燃えるが、休息が生命線。",
    strengths: ["粘り強い", "守りの強さ", "空気を壊さない", "責任感が高い"],
    cautions: ["我慢の限界で爆発", "体調に出る", "愚痴が増える"],
    tips: ["休む予定を先に入れる", "相談窓口を固定する", "抱え込み量を制限"],
  },

  OCHDR: {
    code: "OCHDR",
    name: "静熱ヒューマニスト",
    shortLabel: "情で守る理想家",
    description:
      "深い共感と信念で守る。本音で関わるが消耗しやすいので、境界線が鍵。",
    strengths: ["情の深さ", "守る力", "信頼の重さ", "少人数で最強"],
    cautions: ["相手のために無理", "裏切りに弱い", "疲弊すると距離を切る"],
    tips: ["助ける範囲を決める", "裏切り前提の警戒ではなく“ルール”で守る", "回復の儀式を持つ"],
  },

  OCLSX: {
    code: "OCLSX",
    name: "外交ストラテジスト",
    shortLabel: "政治と交渉の人",
    description:
      "芯を持って主導し、必要なら演出も使う。利害調整・交渉・制度づくりで強い。",
    strengths: ["交渉強い", "方針を作れる", "人の利害を読む", "消耗を抑えた勝ち方"],
    cautions: ["冷たく見られる", "正しさで押す", "敵を作るリスク"],
    tips: ["説明責任を増やす", "相手のメリットを明示", "勝ち方を透明化"],
  },

  OCLSR: {
    code: "OCLSR",
    name: "決断エグゼクター",
    shortLabel: "誠実な決断者",
    description:
      "ブレない方針と決断力。外処理で早く進める。信頼で押し切るタイプ。",
    strengths: ["決め切れる", "責任を取れる", "無駄が少ない", "実行が速い"],
    cautions: ["強すぎて圧が出る", "周りの納得を飛ばす", "柔らかさ不足"],
    tips: ["合意形成の時間を先に確保", "反対意見の拾い上げ", "言い方を丸く"],
  },

  OCLDX: {
    code: "OCLDX",
    name: "圧倒リフォーマー",
    shortLabel: "改革強行型",
    description:
      "変革を押し通す。演出で戦えるが消耗型。勝ち筋は作れるが燃え尽き注意。",
    strengths: ["改革推進", "危機対応", "突破力", "指示が明確"],
    cautions: ["敵を作りやすい", "疲れで苛烈", "孤立しやすい"],
    tips: ["味方を先に作る", "短期目標に分割", "休息と相談の仕組み"],
  },

  OCLDR: {
    code: "OCLDR",
    name: "正面突破の王",
    shortLabel: "本音で押す突破者",
    description:
      "本音と信念で押し切る。外処理で勢いが出るが消耗型。勝負所で最強。",
    strengths: ["迫力", "覚悟", "最後の一押し", "人を奮い立たせる"],
    cautions: ["衝突増", "疲れで雑", "強情に見られる"],
    tips: ["勝負所以外は省エネ", "強い言葉の前に一拍", "休息を義務化"],
  },

  // ===== U系（内側処理） =====
  UMHSX: {
    code: "UMHSX",
    name: "裏方プロデューサー",
    shortLabel: "静かな調整設計",
    description:
      "内で整理してから最適解を出し、場では柔らかく調和を取る。演出もできるので“裏で場を作る”のが得意。",
    strengths: ["先読み", "段取り", "根回し", "静かな影響力"],
    cautions: ["溜め込み→突然ゼロになる", "言うのが遅れる", "演出で疲れる"],
    tips: ["結論を短く早めに出す", "相談を外に出す日を作る", "疲れる場は回数を減らす"],
  },

  UMHSR: {
    code: "UMHSR",
    name: "安心アンカー",
    shortLabel: "自然体の土台",
    description:
      "内で整理し、誠実さと調和で安定を作る。派手さはないが“信用される人”として強い。",
    strengths: ["落ち着き", "誠実", "長期安定", "信頼を積む"],
    cautions: ["自己主張が弱くなる", "我慢が増える", "機会を逃す"],
    tips: ["主張は短文で先に出す", "断り文をテンプレ化", "疲れサインを共有する"],
  },

  UMHDX: {
    code: "UMHDX",
    name: "繊細フォロワー",
    shortLabel: "合わせて疲れる",
    description:
      "適応と調和は強いが消耗しやすい。演出で保つ力もあるが、無理の累積に注意。",
    strengths: ["気配り", "丁寧", "対人センサー", "場を壊さない"],
    cautions: ["疲労の蓄積", "断れない", "自己評価が下がる"],
    tips: ["役割を減らす", "休みを先に確保", "相談は早めに出す"],
  },

  UMHDR: {
    code: "UMHDR",
    name: "共鳴ヒーラー",
    shortLabel: "深い共感の人",
    description:
      "内で深く感じ、誠実に寄り添う。消耗型なので“助け方の線引き”が重要。",
    strengths: ["1対1の深い支援", "心の機微に強い", "信頼が深い", "共感の精度"],
    cautions: ["背負い込み", "相手依存のリスク", "疲弊で距離を切る"],
    tips: ["助ける時間の上限を決める", "重い話は第三者/専門へ", "回復ルーティンを固定"],
  },

  UMLSX: {
    code: "UMLSX",
    name: "影の戦略家",
    shortLabel: "静かな参謀",
    description:
      "内で設計してから、場では主導する。演出も使えるので“表に出ないリーダー”になれる。",
    strengths: ["戦略設計", "危機対応", "先読み", "静かな主導"],
    cautions: ["独断に見られる", "説明不足", "溜め込み"],
    tips: ["決定前に“理由”を共有", "反対意見を先に集める", "やる/やらないの基準を明文化"],
  },

  UMLSR: {
    code: "UMLSR",
    name: "静冷リーダー",
    shortLabel: "合理と責任",
    description:
      "内で整理し、誠実に決める。無駄を切って安定運用が得意。",
    strengths: ["運用改善", "判断の安定", "無駄削減", "責任感"],
    cautions: ["冷たく見える", "感情共有が少ない", "周りがついてこれない"],
    tips: ["気持ちの一言を添える", "ペース配分を共有", "任せる範囲を決める"],
  },

  UMLDX: {
    code: "UMLDX",
    name: "溜める突破者",
    shortLabel: "内燃の火消し役",
    description:
      "内で溜めて勝負所で出す。演出で耐えるが消耗型なので、爆発管理が重要。",
    strengths: ["火消し", "勝負強さ", "決断", "短期集中"],
    cautions: ["爆発", "疲れが表に出る", "突然消える"],
    tips: ["限界前に休む", "怒りはメモに書く", "相談先を固定"],
  },

  UMLDR: {
    code: "UMLDR",
    name: "内燃ファイター",
    shortLabel: "静かに決める闘志",
    description:
      "本音と主導で勝負する。内で固めてから一撃。消耗型なので長期は省エネが必要。",
    strengths: ["決断", "突破", "一撃の説得力", "覚悟"],
    cautions: ["衝突", "疲労で雑", "孤立"],
    tips: ["勝負所を選ぶ", "合意形成の時間を確保", "休息を義務化"],
  },

  UCHSX: {
    code: "UCHSX",
    name: "理念バランサー",
    shortLabel: "基準を守る調整役",
    description:
      "芯がありつつ調和を取る。演出もできるので“守りの司令塔”として強い。",
    strengths: ["品質維持", "文化守り", "一貫性", "摩擦の低減"],
    cautions: ["硬くなる", "我慢が増える", "不満が溜まる"],
    tips: ["譲れない条件を先に出す", "譲る所も言語化", "相談を早めに外へ"],
  },

  UCHSR: {
    code: "UCHSR",
    name: "信頼の番人",
    shortLabel: "誠実と安定",
    description:
      "誠実に、静かに、長期で強い。信頼で関係を守るタイプ。",
    strengths: ["信用", "安定", "長期戦", "丁寧さ"],
    cautions: ["遠慮しすぎ", "機会を逃す", "主張が遅い"],
    tips: ["主張は短く先に", "断りテンプレ", "自分優先日を作る"],
  },

  UCHDX: {
    code: "UCHDX",
    name: "耐久ガーディアン",
    shortLabel: "守って燃える",
    description:
      "守りが強いが消耗型。責任を背負いやすい。休息設計が最重要。",
    strengths: ["粘り", "守り", "責任感", "信念"],
    cautions: ["爆発", "体調に出る", "愚痴が増える"],
    tips: ["負荷を見える化", "休む予定を先に入れる", "抱え込みを止める"],
  },

  UCHDR: {
    code: "UCHDR",
    name: "深情守護者",
    shortLabel: "情で守る芯",
    description:
      "深い共感と本音で守る。少人数の濃い関係で真価。消耗管理が鍵。",
    strengths: ["深い信頼", "守り", "共感の精度", "少人数で最強"],
    cautions: ["背負い込み", "裏切りに弱い", "疲弊で遮断"],
    tips: ["境界線を決める", "助け方を段階化", "回復ルーティン固定"],
  },

  UCLSX: {
    code: "UCLSX",
    name: "静謀コンダクター",
    shortLabel: "裏の統治者",
    description:
      "内で設計して主導する。演出もできるので、制度・交渉・戦略で強い。",
    strengths: ["戦略", "制度設計", "交渉", "勝ち筋構築"],
    cautions: ["冷たく見える", "独断に見える", "敵を作る"],
    tips: ["透明性を上げる", "相手メリットを明示", "説明責任を増やす"],
  },

  UCLSR: {
    code: "UCLSR",
    name: "鉄芯リーダー",
    shortLabel: "揺れない決断",
    description:
      "誠実に強い。内で固めてから決め切る。組織の“柱”になれる。",
    strengths: ["決断", "安定運用", "責任感", "信頼"],
    cautions: ["柔らかさ不足", "周りを置く", "感情共有が少ない"],
    tips: ["気持ちの一言を添える", "反対意見の拾い上げ", "ペース配分を共有"],
  },

  UCLDX: {
    code: "UCLDX",
    name: "沈黙リフォーマー",
    shortLabel: "静かに改革",
    description:
      "改革推進力があるが消耗型。演出で戦えるが、味方づくりが重要。",
    strengths: ["改革", "危機対応", "粘り", "勝ち筋構築"],
    cautions: ["孤立", "苛烈化", "燃え尽き"],
    tips: ["味方を先に作る", "短期目標に分割", "休息と相談の仕組み"],
  },

  UCLDR: {
    code: "UCLDR",
    name: "孤高の支配者",
    shortLabel: "本音の決着担当",
    description:
      "内で固め、最後に決める。本音と主導で勝負。消耗型なので長期は省エネ必須。",
    strengths: ["最後の決断", "突破", "覚悟", "説得力"],
    cautions: ["衝突", "疲労で雑", "強情に見える"],
    tips: ["勝負所を選ぶ", "強い言葉の前に一拍", "休息を義務化"],
  },
};

// 不足を自動補完（32が揃ってない時に気づけるように）
const REQUIRED = [];
["O","U"].forEach(a=>{
  ["M","C"].forEach(b=>{
    ["H","L"].forEach(c=>{
      ["S","D"].forEach(d=>{
        ["R","X"].forEach(e=>{
          REQUIRED.push(`${a}${b}${c}${d}${e}`);
        });
      });
    });
  });
});

// 無いタイプは「仮」テンプレで埋める（今すぐ運用できるように）
// ※あなたが後で文章を差し替えればOK
for (const code of REQUIRED) {
  if (!TYPES[code]) {
    TYPES[code] = {
      code,
      name: `未命名タイプ`,
      shortLabel: `説明準備中`,
      description: `このタイプ（${code}）の説明は準備中です。後で文章を追加してください。`,
      strengths: ["（追加してください）"],
      cautions: ["（追加してください）"],
      tips: ["（追加してください）"],
    };
  }
}

// group/axesText を全タイプに付与
for (const code of Object.keys(TYPES)) {
  const g = pickGroup(code);
  TYPES[code].groupKey = g.key;
  TYPES[code].group = g.label;
  TYPES[code].groupColor = g.color;
  TYPES[code].axesText = axesText(code);
}

// --- 公開API ---
export function getTypeInfo(code) {
  if (!code) return null;
  const key = String(code).trim().toUpperCase();
  return TYPES[key] || null;
}

export function getAllTypes() {
  // 一覧表示用に整列して返す
  return REQUIRED.map((c) => TYPES[c]);
}
