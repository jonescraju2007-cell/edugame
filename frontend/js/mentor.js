// mentor.js
import { BACKEND_URL } from "./config.js";

export async function askMentor(question, context = {}) {
  const replyBox = document.getElementById("mentor-reply");
  if (replyBox) replyBox.innerHTML = "Thinking... ⏳";

  try {
    const res = await fetch(`${BACKEND_URL}/api/mentor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, context }),
    });

    if (!res.ok) throw new Error("Mentor API error " + res.status);

    const data = await res.json();
    if (replyBox) replyBox.innerHTML = data.reply || "🤔 No reply from mentor.";
    return data.reply;
  } catch (err) {
    console.error("Mentor error:", err);
    if (replyBox) replyBox.innerHTML = "⚠️ Mentor is offline.";
    return null;
  }
}

