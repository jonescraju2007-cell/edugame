// lesson.js - Load lessons from worldXlesson.json

async function loadLesson() {
  const params = new URLSearchParams(window.location.search);
  const worldId = params.get("world") || "1";

  try {
    const res = await fetch(`worlds/world${worldId}lesson.json`);
    if (!res.ok) throw new Error("Lesson file not found");

    const data = await res.json();
    document.getElementById("lesson-title").innerText = data.meta.title;
    document.getElementById("lesson-intro").innerHTML = `<p>${data.meta.intro}</p>`;

    const container = document.getElementById("lesson-content");
    container.innerHTML = "";

    data.lessons.forEach((lesson, index) => {
      const div = document.createElement("div");
      div.className = "lesson-card";
      div.innerHTML = `
        <h3>${index + 1}. ${lesson.title}</h3>
        <div>${lesson.html}</div>
      `;
      container.appendChild(div);
    });

    const quizBtn = document.createElement("button");
    quizBtn.innerText = "Start Quiz 📝";
    quizBtn.onclick = () => window.location.href = `quiz.html?world=${worldId}`;
    container.appendChild(quizBtn);

  } catch (err) {
    document.getElementById("lesson-content").innerHTML = `<p>⚠️ ${err.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
  loadLesson();
});

