import { BACKEND_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("mentor-toggle");
  const chatBox = document.getElementById("mentor-chat");
  const sendBtn = document.getElementById("mentor-send");
  const input = document.getElementById("mentor-input");
  const body = document.getElementById("chat-body");

  const params = new URLSearchParams(window.location.search);
  const world = params.get("world") || "general";

  toggleBtn.addEventListener("click", () => {
    chatBox.classList.toggle("open");
  });

  async function sendQuestion() {
    const question = input.value.trim();
    if (!question) return;

    body.innerHTML += `<p><b>You:</b> ${question}</p>`;
    input.value = "";

    try {
      const res = await fetch(`${BACKEND_URL}/api/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, world })
      });

      const data = await res.json();
      body.innerHTML += `<p><b>Mentor:</b> ${data.answer}</p>`;
    } catch {
      body.innerHTML += `<p><b>Mentor:</b> Sorry, I’m not available.</p>`;
    }

    body.scrollTop = body.scrollHeight;
  }

  sendBtn.addEventListener("click", sendQuestion);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendQuestion();
  });
});

