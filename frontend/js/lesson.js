// lesson.js - Loads lesson content

async function loadLesson() {
  const params = new URLSearchParams(window.location.search);
  const world = params.get("world");
  if (!world) return;

  try {
    const res = await fetch(`worlds/world${world}lesson.json`);
    if (!res.ok) throw new Error("Lesson not found");
    const data = await res.json();

    document.getElementById("lesson-title").innerText = data.meta.title;
    document.getElementById("lesson-intro").innerText = data.meta.intro;

    const contentDiv = document.getElementById("lesson-content");
    contentDiv.innerHTML = "";

    data.lessons.forEach(lesson => {
      const sec = document.createElement("section");
      sec.className = "topic";
      sec.innerHTML = `<h3>${lesson.title}</h3>${lesson.html}`;
      contentDiv.appendChild(sec);
    });

    const quizLink = document.getElementById("quiz-link");
    if (quizLink) quizLink.href = `quiz.html?world=${world}`;
  } catch (err) {
    document.getElementById("lesson-content").innerHTML = "<p>Lesson not available.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadLesson);

