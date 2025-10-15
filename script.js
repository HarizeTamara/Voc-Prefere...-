import { perguntas } from './perguntas.js'; // importa o array de perguntas
// import { perguntas } from './quiz.js'; 

let current = 0;
let answered = 0;
let timer;
let timeLeft = 10;

const question = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const optionA = document.getElementById("optionA");
const optionB = document.getElementById("optionB");
const result = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const startBtn = document.getElementById("start-btn");
const timerBar = document.getElementById("timer-progress");
const progressText = document.getElementById("progress-text");

function showQuestion() {
  result.classList.add("hidden");
  nextBtn.classList.add("hidden");
  optionsDiv.classList.remove("hidden");

  const pergunta = perguntas[current];
  question.innerText = "Você prefere...";
  optionA.innerText = pergunta.a;
  optionB.innerText = pergunta.b;

  optionA.disabled = false;
  optionB.disabled = false;
  // progressText.innerText = `Pergunta ${current + 1} de ${perguntas.length}`;
  resetTimer();
  startTimer();
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timerBar.style.width = "100%";
  timerBar.style.background = "var(--accent)";
}

// Funções de controle do jogo
function startGame() {
  current = 0;
  answered = 0;
  result.innerHTML = "";
  shuffle(perguntas); // embaralha as perguntas
  startBtn.classList.add("hidden");
  showQuestion();
}

function nextQuestion() {
  if (current < perguntas.length - 1) {
    current++;
    showQuestion();
  } else {
    question.innerText = "Fim do jogo 🎉";
    optionsDiv.classList.add("hidden");
    result.innerHTML = `Você respondeu ${answered} de ${perguntas.length} perguntas.`;
    nextBtn.classList.add("hidden");
  }
}

// Função que chama o window.votar exposto no index.html
async function selectOption(option) {
  try {
    clearInterval(timer);
    optionA.disabled = true;
    optionB.disabled = true;
    answered++;

    // Chama a função global votarr (injetada pelo script Firebase)
    if (typeof window.votar !== "function") {
      // fallback para estatísticas locais aleatórias (debug)
      const percentageA = Math.floor(Math.random() * 100);
      const percentageB = 100 - percentageA;
      const userPercent = option === "A" ? percentageA : percentageB;
      const escolha = option === "A" ? perguntas[current].a : perguntas[current].b;
      showResult(`✅ Você escolheu: <b>${escolha}</b><br>${userPercent}% das pessoas escolheram o mesmo. (simulado)`);
      return;
    }

    // Atualiza no Firestore (votar retorna {percentA, percentB})
    const questionId = perguntas[current].id;
    const stats = await window.votar(questionId, option);
    const escolha = option === "A" ? perguntas[current].a : perguntas[current].b;
    const userPercent = option === "A" ? stats.percentA : stats.percentB;

    showResult(`✅ Você escolheu: <b>${escolha}</b><br>${userPercent}% das pessoas escolheram o mesmo.`);
  } catch (err) {
    console.error("Erro ao votar:", err);
    showResult("❌ Erro ao salvar sua resposta. Tente novamente.");
  }
}

function showResult(text) {
  result.innerHTML = text;
  result.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
}

optionA.addEventListener("click", () => selectOption("A"));
optionB.addEventListener("click", () => selectOption("B"));

nextBtn.addEventListener("click", () => {
  if (current < perguntas.length - 1) {
    current++;
    showQuestion();
  } else {
    question.innerText = "Fim do jogo 🎉";
    optionsDiv.classList.add("hidden");
    result.innerHTML = `Você respondeu ${answered} de ${perguntas.length} perguntas.`;
    nextBtn.classList.add("hidden");
  }
});

startBtn.addEventListener("click", startGame);

function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timerBar.style.width = "100%";
  timerBar.style.background = "var(--accent)";

  timer = setInterval(() => {
    timeLeft--;
    const percent = (timeLeft / 10) * 100;
    timerBar.style.width = percent + "%";

    if (timeLeft <= 3) {
      timerBar.style.background = "var(--danger)";
    } else {
      timerBar.style.background = "var(--accent)";
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 1000);
};

// Embaralha as perguntas ao iniciar o jogo
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Modifique handleTimeout para ir para a próxima pergunta automaticamente
function handleTimeout() {
  optionA.disabled = true;
  optionB.disabled = true;
  showResult(`⏰ Tempo esgotado!`);
  setTimeout(() => {
    nextQuestion();
  }, 1200); // espera 1.2s antes de ir para a próxima
}