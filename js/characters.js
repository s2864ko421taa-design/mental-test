export const allTypes = () => {
  const UO = ["U","O"];
  const MC = ["M","C"];
  const HL = ["H","L"];
  const DS = ["D","S"];
  const RX = ["R","X"];

  const result = [];

  for(const u of UO)
  for(const m of MC)
  for(const h of HL)
  for(const d of DS)
  for(const r of RX){
    result.push(`${u}${m}${h}${d}${r}`);
  }

  return result;
};

export function getColorByType(type){

  if(type.includes("H")) return "blue";
  if(type.includes("L")) return "red";

  if(type.includes("U") && type.includes("S")) return "green";
  if(type.includes("O") && type.includes("M")) return "purple";

  return "blue";
}

export function getTypeInfo(type){
  return {
    code: type,
    color: getColorByType(type),
    title: `タイプ ${type}`,
    description: `詳細説明はここに入ります。`
  };
}
