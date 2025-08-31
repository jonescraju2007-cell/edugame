import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// OpenAI setup
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Serve static world files
app.get("/api/world/:id", (req, res) => {
  const filePath = path.join(__dirname, "public", "worlds", `world${req.params.id}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "World not found" });
  }
  res.sendFile(filePath);
});

// ✅ AI Mentor Chat
app.post("/api/mentor", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI mentor helping with Python learning." },
        { role: "user", content: question }
      ],
      max_tokens: 200
    });

    const answer = response.choices[0].message.content;
    res.json({ reply: answer });
  } catch (err) {
    console.error("Mentor error:", err);
    res.status(500).json({ error: "Mentor unavailable" });
  }
});

// ✅ AI-generated Question (Practice More)
app.post("/api/generate-question", async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Generate 1 Python question for topic "${topic}" at ${difficulty} level. 
          Return strict JSON with fields: 
          { "type":"mcq|truefalse|fill", "question":string, "options":string[]|null, "answer":string, "feedback":{ "correct":string, "wrong":string } }`
        }
      ],
      max_tokens: 300
    });

    const text = response.choices[0].message.content;

    let questionJson;
    try {
      questionJson = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid JSON from AI", raw: text });
    }

    res.json(questionJson);
  } catch (err) {
    console.error("Generate-question error:", err);
    res.status(500).json({ error: "Could not generate question" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 EduGame backend running at http://localhost:${PORT}`);
});

