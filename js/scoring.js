const OPP = {
  U:"O", O:"U",
  M:"C", C:"M",
  H:"L", L:"H",
  D:"S", S:"D",
  R:"X", X:"R"
};

// 1..5 → +2,+1,0,-1,-2
function weight(v){
  if(v===1) return +2;
  if(v===2) return +1;
  if(v===3) return 0;
  if(v===4) return -1;
  return -2; // 5
}

export function createScores(){
  return {
    U:0,O:0,
    M:0,C:0,
    H:0,L:0,
    D:0,S:0,
    R:0,X:0
  };
}

export function scoreAnswer(scores, axis, value){
  const w = weight(value);
  if(w === 0) return;

  if(w > 0){
    scores[axis] += w;
  }else{
    const opp = OPP[axis];
    scores[opp] += (-w);
  }
}

export function getResultType(scores){
  const pick = (a,b)=> (scores[a] >= scores[b] ? a : b);

  return [
    pick("U","O"),
    pick("M","C"),
    pick("H","L"),
    pick("D","S"),
    pick("R","X")
  ].join("");
}
