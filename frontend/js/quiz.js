async function loadQuiz() {
  const params = new URLSearchParams(window.location.search);
  const worldId = params.get("world");
  if (!worldId) return;

  const quizBox = document.getElementById("quiz-container");
  const title = document.getElementById("quiz-title");
  const lessonLink = document.getElementById("lesson-link");

  lessonLink.href = `lesson.html?world=${worldId}`;

  try {
    const res = await fetch(`worlds/world${worldId}quiz.json`);
    const data = await res.json();

    title.textContent = `${data.meta.title} - Quiz`;
    quizBox.innerHTML = "";

    data.questions.simple.forEach((q, idx) => {
      const qDiv = document.createElement("div");
      qDiv.className = "quiz-question";
      qDiv.innerHTML = `
        <h3>Q${idx + 1}. ${q.question}</h3>
      `;

      if (q.type === "mcq") {
        q.options.forEach(opt => {
          const btn = document.createElement("button");
          btn.textContent = opt;
          btn.onclick = () => {
            if (opt === q.answer) {
              btn.classList.add("correct");
            } else {
              btn.classList.add("wrong");
            }
          };
          qDiv.appendChild(btn);
        });
      } else if (q.type === "truefalse") {
        ["True", "False"].forEach(opt => {
          const btn = document.createElement("button");
          btn.textContent = opt;
          btn.onclick = () => {
            if (opt === String(q.answer)) {
              btn.classList.add("correct");
            } else {
              btn.classList.add("wrong");
            }
          };
          qDiv.appendChild(btn);
        });
      }

      quizBox.appendChild(qDiv);
    });
  } catch (err) {
    quizBox.textContent = "No quiz available.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggle-theme")?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  loadQuiz();
});

