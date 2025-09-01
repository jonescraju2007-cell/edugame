export function markLessonComplete(world) {
  let progress = JSON.parse(localStorage.getItem("progress")) || {};
  if (!progress[world]) progress[world] = {};
  progress[world].lesson = true;
  localStorage.setItem("progress", JSON.stringify(progress));
}

export function markQuizComplete(world) {
  let progress = JSON.parse(localStorage.getItem("progress")) || {};
  if (!progress[world]) progress[world] = {};
  progress[world].quiz = true;
  localStorage.setItem("progress", JSON.stringify(progress));
}

export function getProgress() {
  return JSON.parse(localStorage.getItem("progress")) || {};
}

export function resetProgress() {
  localStorage.removeItem("progress");
}

