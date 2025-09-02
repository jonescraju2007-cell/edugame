// quiz.js - Loads quiz questions

let currentQuestion = 0;
let questions = [];
let worldId = null;

async function loadQuiz() {
  const params = new URLSearchParams(window.location.search);
  worldId = params.get("world");
  if (!worldId) return;

  try {
    const res = await fetch(`worlds/world${worldId}quiz.json`);
    if (!res.ok) throw new Error("Quiz not found");
    const data = await res.json();

    questions = data.questions.simple;
    if (!questions.length) {
      document.getElementById("quiz-container").innerHTML = "<p>No quiz available.</p>";
      return;
    }

    const lessonLink = document.getElementById("lesson-link");
    if (lessonLink) lessonLink.href = `lesson.html?world=${worldId}`;

    showQuestion();
  } catch (err) {
    document.getElementById("quiz-container").innerHTML = "<p>Quiz not available.</p>";
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
    optionsHtml = q.options.map(opt => `<button onclick="checkAnswer('${opt}')">${opt}</button>`).join("");
  } else if (q.type === "truefalse") {
    optionsHtml = `
      <button onclick="checkAnswer('True')">True</button>
      <button onclick="checkAnswer('False')">False</button>
    `;
  } else if (q.type === "fill") {
    optionsHtml = `
      <input type="text" id="fill-answer" placeholder="Type your answer">
      <button onclick="checkAnswer(document.getElementById('fill-answer').value)">Submit</button>
    `;
  }

  container.innerHTML = `
    <h3>${q.question}</h3>
    <div class="quiz-options">${optionsHtml}</div>
    <div id="feedback"></div>
  `;
}

function checkAnswer(answer) {
  const q = questions[currentQuestion];
  const feedbackDiv = document.getElementById("feedback");

  if (q.answer.toLowerCase() === answer.toLowerCase()) {
    feedbackDiv.innerHTML = `<p class="correct">✅ Correct! ${q.feedback.correct || ""}</p>`;
  } else {
    feedbackDiv.innerHTML = `<p class="wrong">❌ Wrong. ${q.feedback.wrong || ""}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuiz();

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      showQuestion();
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      showQuestion();
    }
  });

  document.getElementById("show-answer-btn").addEventListener("click", () => {
    const q = questions[currentQuestion];
    const feedbackDiv = document.getElementById("feedback");
    feedbackDiv.innerHTML = `<p class="correct">✅ Correct Answer: ${q.answer}</p><p>${q.feedback.correct || ""}</p>`;
  });
});

