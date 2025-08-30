// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middlewares
app.use(cors()); // allow frontend → backend requests
app.use(express.json());
app.use(express.static("frontend"));

// ✅ OpenAI setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Root route
app.get("/", (req, res) => {
  res.send("Rix Edugame Backend Running 🚀");
});

// ✅ AI Mentor Route
app.post("/mentor", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a friendly AI mentor. Give clear, simple, and encouraging explanations.",
        },
        { role: "user", content: question },
      ],
    });

    const answer = response.choices[0].message.content;
    res.json({ reply: answer });
  } catch (err) {
    console.error("Mentor error:", err);
    res.status(500).json({ error: "Mentor AI failed. Check logs." });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Rix Edugame backend running at http://localhost:${PORT}`);
});

