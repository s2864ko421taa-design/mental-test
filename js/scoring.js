export function scoreAnswer(scores, axis, value){
  if(value <= 2) return;
  scores[axis] += value - 2;
}

export function getResultType(scores){
  return [
    scores.U >= scores.O ? "U" : "O",
    scores.M >= scores.C ? "M" : "C",
    scores.H >= scores.L ? "H" : "L",
    scores.D >= scores.S ? "D" : "S",
    scores.R >= scores.X ? "R" : "X"
  ].join("");
}
