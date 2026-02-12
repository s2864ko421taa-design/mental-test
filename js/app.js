import { QUESTIONS } from "./questions.js";
import { scoreAnswer, getResultType } from "./scoring.js";

let current = 0;
let scores = {
  U:0,O:0,
  M:0,C:0,
  H:0,L:0,
  D:0,S:0,
  R:0,X:0
};

const qText = document.getElementById("qText");
const qNumber = document.getElementById("qNumber");
const choices = document.getElementById("choices");
const progress = document.getElementById("progress");
const resultBox = document.getElementById("result");

function render(){
  const q = QUESTIONS[current];

  qText.textContent = q.text;
  qNumber.textContent = "Q" + (current+1);
  progress.textContent = (current+1) + " / 60";

  choices.innerHTML = "";

  const labels = [
    "とても当てはまる",
    "やや当てはまる",
    "どちらとも言えない",
    "あまり当てはまらない",
    "全く当てはまらない"
  ];

  labels.forEach((label,index)=>{
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.onclick = ()=>answer(index+1);
    choices.appendChild(btn);
  });
}

function answer(value){
  const q = QUESTIONS[current];
  scoreAnswer(scores, q.axis, value);
  current++;

  if(current >= QUESTIONS.length){
    finish();
  }else{
    render();
  }
}

function finish(){
  const type = getResultType(scores);
  qText.textContent = "診断終了！";
  qNumber.textContent = "";
  choices.innerHTML = "";
  progress.textContent = "完了";
  resultBox.classList.remove("hidden");
  resultBox.textContent = "あなたのタイプ：" + type;
}

render();
