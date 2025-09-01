// progress.js
// Track user progress locally

function saveProgress(world, score) {
  localStorage.setItem(`world${world}_score`, score);
}

function getProgress(world) {
  return localStorage.getItem(`world${world}_score`) || 0;
}

function resetProgress() {
  localStorage.clear();
}

