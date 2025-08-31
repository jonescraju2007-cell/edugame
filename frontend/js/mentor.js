// mentor.js (context-aware)
async function askMentor(question) {
  const messagesDiv = document.getElementById("mentor-messages");
  if (!question.trim()) return;

  // Show user question
  const userMsg = document.createElement("div");
  userMsg.className = "mentor-user";
  userMsg.textContent = "🧑 You: " + question;
  messagesDiv.appendChild(userMsg);

  // Show loading bubble
  const loading = document.createElement("div");
  loading.className = "mentor-bot";
  loading.textContent = "🤖 Thinking...";
  messagesDiv.appendChild(loading);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    // Get current world from URL (lesson.html?world=2 or quiz.html?world=3)
    const params = new URLSearchParams(window.location.search);
    const world = params.get("world") || "1";

    const res = await fetch("/api/mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, world })
    });

    if (!res.ok) throw new Error("Network error");

    const data = await res.json();
    messagesDiv.removeChild(loading);

    // Mentor response
    const botMsg = document.createElement("div");
    botMsg.className = "mentor-bot";

    if (data.hint || data.explanation) {
      botMsg.innerHTML = `
        <p><strong>Hint:</strong> ${data.hint || "Think carefully."}</p>
        <p><strong>Explanation:</strong> ${data.explanation || "No details."}</p>
        ${
          data.example
            ? `<pre><code>${data.example}</code></pre>`
            : ""
        }
      `;
    } else {
      botMsg.textContent = "🤖 Sorry, I couldn't generate a response.";
    }

    messagesDiv.appendChild(botMsg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    console.error("Mentor error:", err);
    messagesDiv.removeChild(loading);

    const botMsg = document.createElement("div");
    botMsg.className = "mentor-bot";
    botMsg.textContent = "⚠️ Mentor not available right now.";
    messagesDiv.appendChild(botMsg);
  }
}

// UI handling
document.addEventListener("DOMContentLoaded", () => {
  const mentorToggle = document.getElementById("mentor-toggle");
  const mentorChat = document.getElementById("mentor-chat");
  const closeMentor = document.getElementById("close-mentor");
  const sendBtn = document.getElementById("mentor-send");
  const input = document.getElementById("mentor-question");

  mentorToggle.addEventListener("click", () => {
    mentorChat.style.display =
      mentorChat.style.display === "flex" ? "none" : "flex";
    mentorChat.style.flexDirection = "column";
  });

  closeMentor.addEventListener("click", () => {
    mentorChat.style.display = "none";
  });

  sendBtn.addEventListener("click", () => {
    askMentor(input.value);
    input.value = "";
  });

  input.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      askMentor(input.value);
      input.value = "";
    }
  });
});

