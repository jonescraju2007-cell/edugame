// lesson.js
async function loadLesson() {
  const container = document.getElementById("lesson-container");
  container.innerHTML = "<p>Loading lesson...</p>";

  // Get world number from URL (?world=2 etc.)
  const params = new URLSearchParams(window.location.search);
  const world = params.get("world") || "1";

  try {
    const res = await fetch(`worlds/world${world}lesson.json`);
    if (!res.ok) {
      container.innerHTML = "<p>⚠️ Lesson not found.</p>";
      return;
    }

    const data = await res.json();
    container.innerHTML = `<h2>${data.meta.title}</h2><p>${data.meta.intro}</p>`;

    data.lessons.forEach(lesson => {
      const card = document.createElement("div");
      card.className = "lesson-card";
      card.innerHTML = `
        <h2>${lesson.title}</h2>
        <div>${lesson.html}</div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>⚠️ Error loading lesson.</p>";
  }
}

// Theme toggle
document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("toggle-theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });
  }
  loadLesson();
});

