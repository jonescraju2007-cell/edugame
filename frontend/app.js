// app.js
document.addEventListener("DOMContentLoaded", () => {
  // ==================== THEME TOGGLE ====================
  const toggleBtn = document.getElementById("toggleThemeBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      document.body.classList.toggle("light-theme");

      // Save preference
      if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }

  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.add(savedTheme + "-theme");

  // ==================== LOAD WORLDS (INDEX PAGE) ====================
  const worldList = document.getElementById("worldList");
  if (worldList) {
    const TOTAL_WORLDS = 5; // 🔥 change this number to how many JSON files you created

    for (let i = 1; i <= TOTAL_WORLDS; i++) {
      fetch(`./worlds/world${i}.json`)
        .then(res => {
          if (!res.ok) throw new Error("World not found");
          return res.json();
        })
        .then(data => {
          const li = document.createElement("li");
          li.classList.add("world-card");
          li.innerHTML = `
            <h3>${data.meta.title}</h3>
            <p>${data.meta.intro}</p>
            <button onclick="startLesson(${i})">📖 Lesson</button>
            <button onclick="startQuiz(${i})">📝 Quiz</button>
          `;
          worldList.appendChild(li);
        })
        .catch(err => console.warn(`World ${i} missing`, err));
    }
  }
});

// ==================== NAVIGATION HELPERS ====================
function startLesson(worldNum) {
  localStorage.setItem("currentWorld", worldNum);
  window.location.href = `lesson.html?world=${worldNum}`;
}

function startQuiz(worldNum) {
  localStorage.setItem("currentWorld", worldNum);
  window.location.href = `quiz.html?world=${worldNum}`;
}

window.startLesson = startLesson;
window.startQuiz = startQuiz;

