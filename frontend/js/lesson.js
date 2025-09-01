import { markLessonComplete } from "./progress.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const world = params.get("world") || 1;

  const title = document.getElementById("lesson-title");
  const container = document.getElementById("lesson-container");

  try {
    const res = await fetch(`worlds/world${world}lesson.json`);
    if (!res.ok) throw new Error("Lesson not found");

    const data = await res.json();
    title.textContent = data.meta.title;

    container.innerHTML = `<p>${data.meta.intro}</p>`;

    data.lessons.forEach(lesson => {
      container.innerHTML += `
        <h3>${lesson.title}</h3>
        <div>${lesson.html}</div>
      `;
    });

    markLessonComplete(world);
  } catch (err) {
    container.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});

