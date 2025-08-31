// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Context map for each world
const worldContexts = {
  "1": "Python Basics: structure, print(), variables, input(), comments, type casting",
  "2": "Operators and Expressions: arithmetic, comparison, logical operators, precedence",
  "3": "Control Flow: if, elif, else, for loops, while loops, break, continue",
  "4": "Data Structures I: strings, lists, tuples, sets, dictionaries",
  "5": "Functions & Modules: defining functions, parameters, return, scope, importing modules",
  "6": "Advanced Data Handling: file handling, exceptions, list comprehensions, lambdas",
  "7": "OOP & Beyond: classes, objects, inheritance, encapsulation, polymorphism"
};

// Mentor API endpoint
app.post("/api/mentor", async (req, res) => {
  const { question, world } = req.body;
  const context = worldContexts[world] || "General Python programming";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: `You are Rix Mentor, a friendly Python tutor. The learner is currently studying: ${context}. 
Keep answers simple, under 120 words, and structured with:
1. Hint (short guiding clue),
2. Explanation (clear beginner-friendly),
3. Example (tiny code snippet if relevant).`
          },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    const text = data.output?.[0]?.content?.[0]?.text || "Sorry, no response.";

    // Extract simple structure
    const exampleMatch = text.match(/```([\s\S]*?)```/);
    res.json({
      hint: text.split("\n")[0] || "Think carefully.",
      explanation: text,
      example: exampleMatch ? exampleMatch[1] : null
    });
  } catch (err) {
    console.error("Mentor API error:", err);
    res.status(500).json({ error: "Mentor unavailable" });
  }
});

app.listen(PORT, () => {
  console.log(`Rix running at http://localhost:${PORT}`);
});

