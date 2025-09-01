// quiz.js
// Loads quiz questions dynamically with feedback

let currentQuestion = 0;
let questions = [];

async function loadQuiz() {
  const params = new URLSearchParams(window.location.search);
  const world = params.get("world");
  if (!world) return;

  try {
    const res = await fetch(`worlds/world${world}quiz.json`);
    if (!res.ok) throw new Error("Quiz file not found");
    const data = await res.json();

    questions = data.questions.simple;
    if (!questions || questions.length === 0) {
      document.getElementById("quiz-container").innerHTML =
        "<p>No quiz available.</p>";
      return;
    }

    // Set lesson link dynamically
    const lessonLink = document.getElementById("lesson-link");
    if (lessonLink) lessonLink.href = `lesson.html?world=${world}`;

    showQuestion();
  } catch (err) {
    console.error("Error loading quiz", err);
    document.getElementById("quiz-container").innerHTML =
      "<p>Quiz not available.</p>";
  }
}

function showQuestion() {
  const container = document.getElementById("quiz-container");
  if (currentQuestion >= questions.length) {
    container.innerHTML = "<p>🎉 Quiz completed!</p>";
    return;
  }

  const q = questions[currentQuestion];
  let optionsHtml = "";

  if (q.type === "mcq") {
    optionsHtml = q.options
      .map(
        opt =>
          `<button class="quiz-option" onclick="checkAnswer('${opt}')">${opt}</button>`
      )
      .join("");
  } else if (q.type === "truefalse") {
    optionsHtml = `
      <button class="quiz-option" onclick="checkAnswer('True')">True</button>
      <button class="quiz-option" onclick="checkAnswer('False')">False</button>
    `;
  } else if (q.type === "fill") {
    optionsHtml = `
      <input type="text" id="fill-answer" placeholder="Type your answer" />
      <button onclick="checkAnswer(document.getElementById('fill-answer').value)">Submit</button>
    `;
  }

  container.innerHTML = `
    <h3>${q.question}</h3>
    <div>${optionsHtml}</div>
  `;
}

function checkAnswer(answer) {
  const q = questions[currentQuestion];
  let feedback = "";

  if (q.answer.toLowerCase() === answer.toLowerCase()) {
    feedback = `<p class="quiz-feedback correct">✅ Correct! ${q.feedback.correct || ""}</p>`;
  } else {
    feedback = `<p class="quiz-feedback wrong">❌ Wrong. ${q.feedback.wrong || ""}</p>`;
  }

  document
    .getElementById("quiz-container")
    .insertAdjacentHTML("beforeend", feedback);

  setTimeout(() => {
    currentQuestion++;
    showQuestion();
  }, 1500);
}

document.addEventListener("DOMContentLoaded", loadQuiz);

