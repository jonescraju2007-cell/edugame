// theme.js
// Light/Dark mode toggle

function saveThemePreference() {
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

function loadThemePreference() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadThemePreference();
  const themeBtn = document.getElementById("toggle-theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      saveThemePreference();
    });
  }
});

