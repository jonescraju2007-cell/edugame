// app.js - Worlds page

const TOTAL_WORLDS = 7; // update later when you add more

async function loadWorlds() {
  const container = document.getElementById("worlds-container");
  container.innerHTML = "";

  for (let i = 1; i <= TOTAL_WORLDS; i++) {
    const card = document.createElement("div");
    card.className = "world-card";
    card.innerHTML = `
      <h3>World ${i}</h3>
      <p>Learn step by step with lessons and quizzes.</p>
      <button onclick="window.location.href='lesson.html?world=${i}'">📘 Lessons</button>
      <button onclick="window.location.href='quiz.html?world=${i}'">📝 Quiz</button>
    `;
    container.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadWorlds();

  const themeBtn = document.getElementById("toggle-theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  }
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
});

