// mentor.js - AI Mentor popup

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

  document.getElementById("mentor-header").onclick = () =>
    chatBox.classList.toggle("minimized");

  document.getElementById("mentor-send").onclick = async () => {
    const input = document.getElementById("mentor-question");
    const question = input.value.trim();
    if (!question) return;

    addMessage("You: " + question);
    input.value = "";

    try {
      const res = await fetch(`${BACKEND_URL}/api/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, world: getWorldFromURL() })
      });
      const data = await res.json();
      addMessage("Mentor: " + data.answer);
    } catch {
      addMessage("⚠️ Mentor is offline.");
    }
  };
});

function addMessage(text) {
  const div = document.createElement("p");
  div.textContent = text;
  document.getElementById("mentor-messages").appendChild(div);
  document.getElementById("mentor-messages").scrollTop =
    document.getElementById("mentor-messages").scrollHeight;
}

function getWorldFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("world") || "general";
}

