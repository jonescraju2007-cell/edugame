// lesson.js
// Loads lesson content dynamically and links to quiz

async function loadLesson() {
  const params = new URLSearchParams(window.location.search);
  const world = params.get("world");
  if (!world) return;

  try {
    const res = await fetch(`worlds/world${world}lesson.json`);
    if (!res.ok) throw new Error("Lesson file not found");
    const data = await res.json();

    document.getElementById("lesson-title").innerText = data.meta.title;
    document.getElementById("lesson-intro").innerText = data.meta.intro;

    const contentDiv = document.getElementById("lesson-content");
    contentDiv.innerHTML = "";

    data.lessons.forEach(lesson => {
      const sec = document.createElement("section");
      sec.className = "lesson-section";
      sec.innerHTML = `<h3>${lesson.title}</h3>${lesson.html}`;
      contentDiv.appendChild(sec);
    });

    // Set quiz link dynamically
    const quizLink = document.getElementById("quiz-link");
    if (quizLink) quizLink.href = `quiz.html?world=${world}`;
  } catch (err) {
    console.error("Error loading lesson", err);
    document.getElementById("lesson-content").innerHTML =
      "<p>Lesson not available.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadLesson);

