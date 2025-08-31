// quiz.js
let quizzes = [];
let currentIndex = 0;

async function loadQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "<p>Loading quiz...</p>";

  const params = new URLSearchParams(window.location.search);
  const world = params.get("world") || "1";

  try {
    const res = await fetch(`worlds/world${world}quiz.json`);
    if (!res.ok) {
      container.innerHTML = "<p>⚠️ Quiz not found.</p>";
      return;
    }

    const data = await res.json();

    // Flatten quizzes (so all sections appear in one list)
    quizzes = [];
    Object.keys(data.quizzes).forEach(section => {
      if (Array.isArray(data.quizzes[section])) {
        quizzes.push(...data.quizzes[section]);
      } else {
        quizzes.push(data.quizzes[section]);
      }
    });

    currentIndex = 0;
    renderQuiz();
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>⚠️ Error loading quiz.</p>";
  }
}

function renderQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex >= quizzes.length) currentIndex = quizzes.length - 1;

  const q = quizzes[currentIndex];
  const card = document.createElement("div");
  card.className = "quiz-card";

  card.innerHTML = `<h3>Q${currentIndex + 1}: ${q.question}</h3>`;

  if (q.type === "mcq" && q.options) {
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "quiz-options";
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(q, opt);
      optionsDiv.appendChild(btn);
    });
    card.appendChild(optionsDiv);
  } else if (q.type === "truefalse") {
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "quiz-options";
    ["True", "False"].forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(q, opt);
      optionsDiv.appendChild(btn);
    });
    card.appendChild(optionsDiv);
  } else if (q.type === "fill") {
    const input = document.createElement("input");
    input.placeholder = "Type your answer...";
    const btn = document.createElement("button");
    btn.textContent = "Submit";
    btn.onclick = () => checkAnswer(q, input.value.trim());
    card.appendChild(input);
    card.appendChild(btn);
  } else if (q.type === "puzzle") {
    card.innerHTML += `<p>${q.description}</p><pre>${q.broken_code}</pre>`;
    const btn = document.createElement("button");
    btn.textContent = "Show Solution";
    btn.onclick = () => {
      card.innerHTML += `<pre><strong>Solution:</strong>\n${q.solution}</pre>`;
    };
    card.appendChild(btn);
  }

  container.appendChild(card);
}

function checkAnswer(q, answer) {
  const correct = q.answer.toString().toLowerCase() === answer.toString().toLowerCase();
  alert(correct ? "✅ Correct!" : `❌ Wrong! Correct answer: ${q.answer}`);
}

// Navigation
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("next-btn").addEventListener("click", () => {
    currentIndex++;
    renderQuiz();
  });
  document.getElementById("prev-btn").addEventListener("click", () => {
    currentIndex--;
    renderQuiz();
  });
  document.getElementById("show-answer").addEventListener("click", () => {
    const q = quizzes[currentIndex];
    alert(`💡 Correct answer: ${q.answer || "See puzzle solution"}`);
  });

  const themeBtn = document.getElementById("toggle-theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });
  }

  loadQuiz();
});

