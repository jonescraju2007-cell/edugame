// ===========================
// EduGame Worlds (index.html)
// ===========================

const TOTAL_WORLDS = 7; // Update if you add more worlds

async function loadWorlds() {
  const container = document.getElementById("worlds-container");
  container.innerHTML = "<p>Loading worlds...</p>";

  try {
    for (let i = 1; i <= TOTAL_WORLDS; i++) {
      try {
        // Try to fetch each world lesson file
        const res = await fetch(`worlds/world${i}.json`);
        if (!res.ok) {
          console.warn(`World ${i} JSON not found`);
          continue;
        }
        const data = await res.json();

        // Create card
        const card = document.createElement("div");
        card.className = "world-card";
        card.innerHTML = `
          <h3>${data.meta.title}</h3>
          <p>${data.meta.intro}</p>
          <div class="world-buttons">
            <button onclick="window.location.href='lesson.html?world=${i}'">📘 Lesson</button>
            <button onclick="window.location.href='quiz.html?world=${i}'">📝 Quiz</button>
          </div>
        `;
        container.appendChild(card);
      } catch (err) {
        console.error(`Error loading World ${i}:`, err);
      }
    }

    if (container.innerHTML.trim() === "<p>Loading worlds...</p>") {
      container.innerHTML = "<p>⚠️ No worlds available.</p>";
    }
  } catch (err) {
    console.error("Error loading worlds:", err);
    container.innerHTML = "<p>⚠️ Failed to load worlds.</p>";
  }
}

// ===========================
// Theme Toggle
// ===========================
function initThemeToggle() {
  const btn = document.getElementById("toggle-theme");
  if (btn) {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  }

  // Load theme preference
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
}

// ===========================
// Mentor Chat Toggle
// ===========================
function initMentorToggle() {
  const toggle = document.getElementById("mentor-toggle");
  const chat = document.getElementById("mentor-chat");

  if (toggle && chat) {
    toggle.addEventListener("click", () => {
      chat.classList.toggle("open");
    });
  }
}

// ===========================
// Page Init
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMentorToggle();
  loadWorlds();
});

