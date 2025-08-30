async function askMentor() {
  const input = document.getElementById("mentor-input").value;
  const replyBox = document.getElementById("mentor-reply");

  replyBox.innerHTML = "Thinking... ⏳";

  try {
    const res = await fetch("https://your-railway-url.up.railway.app/mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input })
    });

    const data = await res.json();
    replyBox.innerHTML = data.reply;
  } catch (e) {
    replyBox.innerHTML = "⚠️ Mentor unavailable.";
  }
}

