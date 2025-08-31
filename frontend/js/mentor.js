const mentorToggle = document.getElementById("mentor-toggle");
const mentorChat = document.getElementById("mentor-chat");
const mentorSend = document.getElementById("mentor-send");
const mentorInput = document.getElementById("mentor-input");
const chatBody = document.getElementById("chat-body");

mentorToggle.addEventListener("click", () => {
  mentorChat.classList.toggle("open");
});

mentorSend.addEventListener("click", async () => {
  const question = mentorInput.value.trim();
  if (!question) return;

  chatBody.innerHTML += `<p><b>You:</b> ${question}</p>`;
  mentorInput.value = "";

  try {
    const res = await fetch("http://localhost:10000/mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    chatBody.innerHTML += `<p><b>Mentor:</b> ${data.answer}</p>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  } catch {
    chatBody.innerHTML += `<p><b>Mentor:</b> (No response)</p>`;
  }
});

