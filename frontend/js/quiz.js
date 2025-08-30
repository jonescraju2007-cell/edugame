const params = new URLSearchParams(window.location.search);
const worldId = params.get("world");
let quizData = [];
let currentIndex = 0;

async function loadQuiz() {
  try {
    const res = await fetch(`worlds/world${worldId}.json`);
    if (!res.ok) throw new Error("Quiz not found");
    const data = await res.json();

    document.getElementById("quiz-title").innerText = data.meta.title + " - Quiz";
    quizData = data.quiz || [];

    if (quizData.length === 0) {
      document.getElementById("quiz-container").innerHTML = "<p>No quiz available.</p>";
      return;
    }

    document.getElementById("quiz-controls").style.display = "block";
    renderQuestion();

    document.getElementById("to-lesson").onclick = () => {
      window.location.href = `lesson.html?world=${worldId}`;
    };
  } catch (err) {
    console.error(err);
  }
}

function renderQuestion() {
  const q = quizData[currentIndex];
  document.getElementById("quiz-container").innerHTML = `
    <div class="quiz-card">
      <h2>Q${currentIndex+1}: ${q.question}</h2>
      <ul>
        ${q.options.map((opt, i) => 
          `<li><button onclick="checkAnswer(${i})">${opt}</button></li>`).join("")}
      </ul>
      <p id="feedback"></p>
    </div>
  `;

  document.getElementById("prev-btn").disabled = currentIndex === 0;
  document.getElementById("next-btn").disabled = currentIndex === quizData.length - 1;
}

window.checkAnswer = (selected) => {
  const q = quizData[currentIndex];
  const feedback = document.getElementById("feedback");
  feedback.innerHTML = (selected === q.answer)
    ? "✅ Correct!"
    : `❌ Wrong! Correct answer: <b>${q.options[q.answer]}</b>`;
};

document.getElementById("prev-btn").onclick = () => {
  if (currentIndex > 0) { currentIndex--; renderQuestion(); }
};
document.getElementById("next-btn").onclick = () => {
  if (currentIndex < quizData.length-1) { currentIndex++; renderQuestion(); }
};

document.addEventListener("DOMContentLoaded", loadQuiz);

