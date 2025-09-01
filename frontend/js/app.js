import { getProgress, resetProgress } from "./progress.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("worlds-container");
  const resetBtn = document.getElementById("reset-progress");
  const TOTAL_WORLDS = 7;

  const progress = getProgress();
  container.innerHTML = "";

  for (let i = 1; i <= TOTAL_WORLDS; i++) {
    try {
      const res = await fetch(`worlds/world${i}lesson.json`);
      if (!res.ok) continue;

      const data = await res.json();

      const card = document.createElement("div");
      card.className = "world-card";

      const lessonDone = progress[i]?.lesson ? "✅" : "📘";
      const quizDone = progress[i]?.quiz ? "✅" : "📝";

      card.innerHTML = `
        <h3>${data.meta.title}</h3>
        <p>${data.meta.intro}</p>
        <button onclick="window.location.href='lesson.html?world=${i}'">${lessonDone} Lesson</button>
        <button onclick="window.location.href='quiz.html?world=${i}'">${quizDone} Quiz</button>
      `;

      container.appendChild(card);
    } catch (err) {
      console.error("Error loading world", i, err);
    }
  }

  resetBtn.addEventListener("click", () => {
    if (confirm("Reset your progress?")) {
      resetProgress();
      location.reload();
    }
  });
});

