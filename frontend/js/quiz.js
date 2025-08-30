// quiz.js
let questions = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", loadQuiz);

async function loadQuiz() {
  const params = new URLSearchParams(window.location.search);
  const worldId = params.get("world") || 1;

  try {
    const res = await fetch(`worlds/world${worldId}.json`);
    if (!res.ok) throw new Error("Quiz not found");
    const data = await res.json();

    questions = data.quiz || [];
    document.getElementById("quiz-title").innerText = data.meta.title + " - Quiz";

    if (questions.length === 0) {
      document.getElementById("quiz-container").innerHTML = "<p>No quiz available.</p>";
      return;
    }
    showQuestion();
  } catch (err) {
    console.error(err);
  }

  document.getElementById("next-btn").onclick = () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      showQuestion();
    }
  };

  document.getElementById("prev-btn").onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      showQuestion();
    }
  };

  document.getElementById("show-btn").onclick = () => {
    const q = questions[currentIndex];
    document.getElementById("feedback").innerHTML =
      `<p>✅ Correct Answer: <strong>${q.options[q.answer]}</strong></p>`;
  };
}

function showQuestion() {
  const q = questions[currentIndex];
  document.getElementById("quiz-container").innerHTML = `
    <h2>${q.question}</h2>
    <ul>
      ${q.options.map((opt, i) => `
        <li><label>
          <input type="radio" name="opt" value="${i}"/> ${opt}
        </label></li>
      `).join("")}
    </ul>
    <div id="feedback"></div>
  `;
}

