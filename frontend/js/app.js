// app.js
// Handles loading worlds and navigation to lessons/quizzes

const TOTAL_WORLDS = 7; // number of worlds available

async function loadWorlds() {
  const container = document.getElementById("worlds-container");
  if (!container) return;
  container.innerHTML = "";

  for (let i = 1; i <= TOTAL_WORLDS; i++) {
    try {
      const res = await fetch(`worlds/world${i}lesson.json`);
      if (!res.ok) continue;
      const data = await res.json();

      const card = document.createElement("div");
      card.className = "world-card";
      card.innerHTML = `
        <h3>${data.meta.title}</h3>
        <p>${data.meta.intro}</p>
        <button onclick="window.location.href='lesson.html?world=${i}'">📘 Lesson</button>
        <button onclick="window.location.href='quiz.html?world=${i}'">📝 Quiz</button>
      `;
      container.appendChild(card);
    } catch (err) {
      console.error("Error loading world " + i, err);
    }
  }
}

document.addEventListener("DOMContentLoaded", loadWorlds);

