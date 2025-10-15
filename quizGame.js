import { quiz } from './quiz.js';

let current = 0;
let score = 0;

const questionEl = document.getElementById("quiz-question");
const optionsEl = document.getElementById("quiz-options");
const resultEl = document.getElementById("quiz-result");
const startBtn = document.getElementById("quiz-start-btn");
const nextBtn = document.getElementById("quiz-next-btn");

function startQuiz() {
  current = 0;
  score = 0;
  startBtn.classList.add("hidden");
  showQuestion();
}

function showQuestion() {
  const q = quiz[current];
  questionEl.innerText = q.question;
  optionsEl.innerHTML = "";
  optionsEl.classList.remove("hidden");

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => selectOption(i + 1);
    optionsEl.appendChild(btn);
  });
}

function selectOption(selected) {
  const q = quiz[current];
  optionsEl.classList.add("hidden");
  resultEl.classList.remove("hidden");

  if (selected === q.correct) {
    score++;
    resultEl.innerHTML = "✅ Correto!";
    resultEl.style.color = "var(--accent)";
  } else {
    resultEl.innerHTML = `❌ Errado! Resposta certa: <b>${q.options[q.correct - 1]}</b>`;
    resultEl.style.color = "var(--danger)";
  }

  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  resultEl.classList.add("hidden");
  nextBtn.classList.add("hidden");

  if (current < quiz.length - 1) {
    current++;
    showQuestion();
  } else {
    questionEl.innerText = `Fim do quiz! 🏁`;
    optionsEl.classList.add("hidden");
    resultEl.innerHTML = `Você acertou ${score} de ${quiz.length} perguntas.`;
    resultEl.classList.remove("hidden");
  }
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
