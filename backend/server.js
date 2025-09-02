// server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- MIDDLEWARE -----------------
app.use(express.json());

// ✅ Allow CORS only from your frontend (Netlify)
app.use(
  cors({
    origin: "https://neon-phoenix-866e14.netlify.app", // Replace with your Netlify frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ----------------- ROUTES -----------------

// Health check route
app.get("/", (req, res) => {
  res.send("✅ EduGame backend is running!");
});

// Mentor AI route
app.post("/api/mentor", (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === "") {
    return res.status(400).json({
      answer: "⚠️ Please ask a valid question about Python.",
    });
  }

  // ✨ Dummy AI Response (later you can plug in OpenAI or other AI API here)
  let response = "";

  if (question.toLowerCase().includes("print")) {
    response = `In Python, printing is done using: print("Hello, World!")`;
  } else if (question.toLowerCase().includes("variable")) {
    response = `A variable in Python is created when you assign a value to it. Example: x = 10`;
  } else {
    response = `You asked: "${question}". Here's a Python tip: Always keep your code clean and readable!`;
  }

  res.json({ answer: response });
});

// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`🚀 EduGame backend running on port ${PORT}`);
});

