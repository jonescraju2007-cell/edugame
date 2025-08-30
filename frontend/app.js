// app.js
import { BACKEND_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });
  }

  const worldList = document.getElementById("world-list");
  if (worldList) {
    loadWorlds(worldList);
  }
});

async function loadWorlds(container) {
  const TOTAL_WORLDS = 7; // adjust if you add more JSONs
  container.innerHTML = "";

  for (let i = 1; i <= TOTAL_WORLDS; i++) {
    try {
      const res = await fetch(`worlds/world${i}.json`);
      if (!res.ok) continue;
      const data = await res.json();

      const card = document.createElement("div");
      card.className = "world-card";
      card.innerHTML = `
        <h3>${data.meta.title}</h3>
        <p>${data.meta.intro}</p>
        <button onclick="window.location.href='lesson.html?world=${i}'">📖 Lesson</button>
        <button onclick="window.location.href='quiz.html?world=${i}'">📝 Quiz</button>
      `;
      container.appendChild(card);
    } catch (err) {
      console.warn("World not found:", i, err);
    }
  }

  if (!container.innerHTML.trim()) {
    container.innerHTML = "<p>No worlds found.</p>";
  }
}

