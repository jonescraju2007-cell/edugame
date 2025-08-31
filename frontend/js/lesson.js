async function loadLesson() {
  const params = new URLSearchParams(window.location.search);
  const worldId = params.get("world");
  if (!worldId) return;

  const lessonBox = document.getElementById("lesson-content");
  const title = document.getElementById("lesson-title");

  try {
    const res = await fetch(`worlds/world${worldId}.json`);
    const data = await res.json();

    title.textContent = data.meta.title;
    lessonBox.innerHTML = "";

    for (const key in data.lessons) {
      const lesson = data.lessons[key];
      const section = document.createElement("section");
      section.className = "lesson-section";
      section.innerHTML = `
        <h2>${lesson.title}</h2>
        <div>${lesson.html}</div>
      `;
      lessonBox.appendChild(section);
    }
  } catch (err) {
    lessonBox.textContent = "Error loading lesson.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggle-theme")?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  loadLesson();
});

