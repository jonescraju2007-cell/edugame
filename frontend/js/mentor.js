import { BACKEND_URL } from "./config.js";

window.askMentor = async function() {
  const input = document.getElementById("mentor-input");
  const reply = document.getElementById("mentor-reply");
  const question = input.value.trim();

  if (!question) return;
  reply.innerHTML = "🤔 Thinking...";
  input.value = "";

  try {
    const res = await fetch(`${BACKEND_URL}/mentor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    reply.innerHTML = "💡 " + (data.answer || "No response.");
  } catch (err) {
    console.error(err);
    reply.innerHTML = "⚠️ Mentor unavailable.";
  }
};

