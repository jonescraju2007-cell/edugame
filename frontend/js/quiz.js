let questions = [];
let current = 0;

async function loadWorld() {
  const params = new URLSearchParams(window.location.search);
  const world = params.get("world") || "1";

  const res = await fetch(`worlds/world${world}.json`);
  questions = await res.json();

  document.getElementById("world-title").textContent = `World ${world}`;
  showQuestion();
}

function showQuestion() {
  const q = questions[current];
  const container = document.getElementById("quiz-container");

  container.innerHTML = `
    <p>${q.question}</p>
    ${q.options.map((opt, i) => 
      `<button onclick="checkAnswer('${opt}')">${opt}</button>`).join("")}
  `;
}

function checkAnswer(ans) {
  const correct = questions[current].answer;
  alert(ans === correct ? "✅ Correct!" : "❌ Wrong! Correct: " + correct);
}

function nextQuestion() {
  if (current < questions.length - 1) {
    current++;
    showQuestion();
  }
}

function prevQuestion() {
  if (current > 0) {
    current--;
    showQuestion();
  }
}

loadWorld();

