// mentor.js
import { BACKEND_URL } from "./config.js";

const mentorOutput = document.getElementById("mentor-output");
const mentorInput = document.getElementById("mentor-input");
const mentorSend = document.getElementById("mentor-send");

if (mentorSend) {
  mentorSend.addEventListener("click", () => {
    sendMentor(mentorInput.value.trim());
    mentorInput.value = "";
  });
}

async function sendMentor(question) {
  if (!question) return;
  mentorOutput.textContent = "🤔 Thinking...";
  try {
    const res = await fetch(`${BACKEND_URL}/mentor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    mentorOutput.textContent = "💡 " + (data.answer || "Mentor didn’t reply.");
  } catch (err) {
    mentorOutput.textContent = "⚠️ Mentor unavailable.";
    console.error(err);
  }
}

// Export optional if needed elsewhere
export { sendMentor };

