// quiz.js - Load quizzes from worldXquiz.json

let questions = [];
let currentIndex = 0;
let currentPuzzle = null;

async function loadQuiz() {
  const params = new URLSearchParams(window.location.search);
  const worldId = params.get("world") || "1";

  try {
    const res = await fetch(`worlds/world${worldId}quiz.json`);
    if (!res.ok) throw new Error("Quiz file not found");

    const data = await res.json();
    document.getElementById("quiz-title").innerText = data.meta.title;

    Object.keys(data.quizzes).forEach(k => {
      if (k === "puzzle") currentPuzzle = data.quizzes.puzzle;
      else if (Array.isArray(data.quizzes[k])) questions.push(...data.quizzes[k]);
    });

    if (questions.length === 0) {
      document.getElementById("quiz-container").innerHTML = "<p>No quiz available.</p>";
      return;
    }
    renderQuestion();
  } catch (err) {
    document.getElementById("quiz-container").innerHTML = `<p>⚠️ ${err.message}</p>`;
  }
}

function renderQuestion() {
  const q = questions[currentIndex];
  let optionsHtml = "";

  if (q.type === "mcq") {
    optionsHtml = q.options.map(opt =>
      `<button onclick="checkAnswer('${opt}','${q.answer}')">${opt}</button>`
    ).join("");
  } else if (q.type === "truefalse") {
    optionsHtml = `
      <button onclick="checkAnswer('True','${q.answer}')">True</button>
      <button onclick="checkAnswer('False','${q.answer}')">False</button>
    `;
  } else if (q.type === "fill") {
    optionsHtml = `
      <input type="text" id="fill-answer" placeholder="Type your answer...">
      <button onclick="checkAnswer(document.getElementById('fill-answer').value,'${q.answer}')">Submit</button>
    `;
  }

  document.getElementById("quiz-container").innerHTML = `
    <div class="question-card">
      <h3>Q${currentIndex + 1}: ${q.question}</h3>
      <div class="options">${optionsHtml}</div>
      <p id="feedback"></p>
    </div>
  `;
}

function checkAnswer(selected, correct) {
  const fb = document.getElementById("feedback");
  if (selected.trim().toLowerCase() === correct.trim().toLowerCase()) {
    fb.innerHTML = `<span class="correct">✅ Correct!</span>`;
  } else {
    fb.innerHTML = `<span class="wrong">❌ Wrong! Correct Answer: ${correct}</span>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentIndex > 0) { currentIndex--; renderQuestion(); }
  });
  document.getElementById("next-btn").addEventListener("click", () => {
    if (currentIndex < questions.length - 1) { currentIndex++; renderQuestion(); }
    else if (currentPuzzle) {
      document.getElementById("quiz-container").innerHTML = `
        <div class="question-card">
          <h3>🧩 Puzzle: ${currentPuzzle.title}</h3>
          <p>${currentPuzzle.description}</p>
          <pre><code>${currentPuzzle.broken_code}</code></pre>
          <details><summary>Show Solution</summary><pre><code>${currentPuzzle.solution}</code></pre></details>
        </div>
      `;
    }
  });
  document.getElementById("show-answer-btn").addEventListener("click", () => {
    const q = questions[currentIndex];
    document.getElementById("feedback").innerHTML = `💡 Correct Answer: ${q.answer}`;
  });

  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });

  loadQuiz();
});

