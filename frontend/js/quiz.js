// quiz.js
import { API_BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const worldId = params.get("world");

    if (!worldId) {
        document.getElementById("quiz-container").innerHTML = "<p>❌ No world selected.</p>";
        return;
    }

    loadQuiz(worldId);
});

let questions = [];
let currentIndex = 0;

async function loadQuiz(worldId) {
    try {
        const res = await fetch(`${API_BASE_URL}/worlds/world${worldId}quiz.json`);
        if (!res.ok) throw new Error("Quiz file not found");

        const data = await res.json();
        questions = data.questions || [];

        if (!questions.length) {
            document.getElementById("quiz-container").innerHTML = "<p>No quiz available for this world.</p>";
            return;
        }

        currentIndex = 0;
        showQuestion();
    } catch (err) {
        console.error("Error loading quiz:", err);
        document.getElementById("quiz-container").innerHTML = "<p>⚠️ Failed to load quiz.</p>";
    }
}

function showQuestion() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    if (currentIndex >= questions.length) {
        container.innerHTML = `<h2>🎉 Quiz Completed!</h2>
            <button onclick="restartQuiz()">🔄 Restart</button>`;
        return;
    }

    const q = questions[currentIndex];
    if (!q || !q.question) {
        container.innerHTML = `<p>⚠️ Invalid question format.</p>`;
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "question-card";

    wrapper.innerHTML = `
        <h3>Q${currentIndex + 1}: ${q.question}</h3>
        <div class="options">
            ${q.options && q.options.length
                ? q.options.map(
                      (opt, i) =>
                          `<button class="option-btn" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}')">${opt}</button>`
                  ).join("")
                : "<p>⚠️ No options provided.</p>"
            }
        </div>
        <button class="show-answer-btn" onclick="showAnswer()">👀 Show Answer</button>
    `;

    container.appendChild(wrapper);
}

window.checkAnswer = function (selected) {
    const q = questions[currentIndex];
    if (!q || !q.answer) {
        alert("⚠️ This question has no correct answer set.");
        return;
    }

    if (selected === q.answer) {
        alert("✅ Correct!");
    } else {
        alert("❌ Wrong! Correct answer: " + q.answer);
    }

    currentIndex++;
    showQuestion();
};

window.showAnswer = function () {
    const q = questions[currentIndex];
    if (!q || !q.answer) {
        alert("⚠️ No answer available.");
        return;
    }
    alert("👉 The correct answer is: " + q.answer);
};

window.restartQuiz = function () {
    currentIndex = 0;
    showQuestion();
};

