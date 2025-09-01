// mentor.js
// Simple AI Mentor popup (connected to backend API)

const BACKEND_URL = "https://your-backend.onrender.com"; // change to your Render link

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.createElement("div");
  chatBox.id = "mentor-chat";
  chatBox.innerHTML = `
    <div id="mentor-header">🤖 AI Mentor</div>
    <div id="mentor-messages"><p>👋 Hi, I’m your Python mentor!</p></div>
    <div id="mentor-input">
      <input type="text" id="mentor-question" placeholder="Ask me anything...">
      <button id="mentor-send">Send</button>
    </div>
  `;
  document.body.appendChild(chatBox);

  const header = document.getElementById("mentor-header");
  header.addEventListener("click", () => {
    chatBox.classList.toggle("minimized");
  });

  document.getElementById("mentor-send").addEventListener("click", sendQuestion);

  function addMessage(text, from = "mentor") {
    const msg = document.createElement("p");
    msg.textContent = (from === "user" ? "You: " : "Mentor: ") + text;
    document.getElementById("mentor-messages").appendChild(msg);
    document.getElementById("mentor-messages").scrollTop =
      document.getElementById("mentor-messages").scrollHeight;
  }

  async function sendQuestion() {
    const input = document.getElementById("mentor-question");
    const question = input.value.trim();
    if (!question) return;

    addMessage(question, "user");
    input.value = "";

    try {
      const res = await fetch(`${BACKEND_URL}/api/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      addMessage(data.answer || "No response");
    } catch {
      addMessage("⚠️ Mentor is offline.");
    }
  }
});

