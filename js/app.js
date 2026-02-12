import { QUESTIONS } from "./questions.js";
import { createScores, scoreAnswer, getResultType } from "./scoring.js";

let current = 0;
let selected = null;     // 1..5
let answers = new Array(QUESTIONS.length).fill(null);
let scores = createScores();

const qText = document.getElementById("qText");
const qNumber = document.getElementById("qNumber");
const choices = document.getElementById("choices");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const statusText = document.getElementById("statusText");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnRestart = document.getElementById("btnRestart");

const resultCard = document.getElementById("resultCard");
const resultTypeEl = document.getElementById("resultType");
const btnDetail = document.getElementById("btnDetail");

const LABELS = [
  "とても当てはまる",
  "やや当てはまる",
  "どちらとも言えない",
  "あまり当てはまらない",
  "全く当てはまらない"
];

function recomputeScores(){
  scores = createScores();
  for(let i=0;i<answers.length;i++){
    const v = answers[i];
    if(v == null) continue;
    scoreAnswer(scores, QUESTIONS[i].axis, v);
  }
}

function render(){
  resultCard.classList.add("hidden");

  const q = QUESTIONS[current];
  qText.textContent = q.text;
  qNumber.textContent = "Q" + (current+1);

  progressText.textContent = "進捗 " + (current) + " / " + QUESTIONS.length;
  progressBar.style.width = ((current) / QUESTIONS.length * 100).toFixed(1) + "%";

  statusText.textContent = "回答してね";
  choices.innerHTML = "";

  selected = answers[current];

  LABELS.forEach((label, idx)=>{
    const v = idx+1;
    const b = document.createElement("button");
    b.className = "choice" + (selected===v ? " choice--selected":"");
    b.type = "button";
    b.textContent = label;
    b.onclick = ()=>{
      selected = v;
      answers[current] = v;
      render();              // ハイライト更新
      btnNext.disabled = false;
      statusText.textContent = "OK！次へどうぞ";
      // 自動で次へ
      setTimeout(()=>goNext(), 120);
    };
    choices.appendChild(b);
  });

  btnPrev.disabled = (current===0);
  btnNext.disabled = (answers[current]==null);
}

function goNext(){
  if(answers[current]==null) return;
  if(current < QUESTIONS.length-1){
    current++;
    render();
  }else{
    finish();
  }
}

function goPrev(){
  if(current===0) return;
  current--;
  render();
}

function finish(){
  recomputeScores();
  const type = getResultType(scores);

  progressText.textContent = "完了 " + QUESTIONS.length + " / " + QUESTIONS.length;
  progressBar.style.width = "100%";
  statusText.textContent = "診断終了";

  qNumber.textContent = "";
  qText.textContent = "診断終了！";
  choices.innerHTML = "";
  btnPrev.disabled = true;
  btnNext.disabled = true;

  resultTypeEl.textContent = type;
  btnDetail.href = "./pages/type.html?t=" + encodeURIComponent(type);
  resultCard.classList.remove("hidden");
}

function restart(){
  current = 0;
  selected = null;
  answers = new Array(QUESTIONS.length).fill(null);
  scores = createScores();
  render();
}

btnPrev.onclick = goPrev;
btnNext.onclick = goNext;
btnRestart.onclick = restart;

render();
