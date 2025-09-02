function saveThemePreference() {
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

function loadThemePreference() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") document.body.classList.add("dark");
}

document.addEventListener("DOMContentLoaded", () => {
  loadThemePreference();
  const btn = document.getElementById("toggle-theme");
  if (btn) {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      saveThemePreference();
    });
  }
});

