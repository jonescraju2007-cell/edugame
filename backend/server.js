import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Health check
app.get("/", (req, res) => {
  res.send("EduGame backend is running ✅");
});

// Mentor endpoint
app.post("/mentor", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Rix Mentor, a friendly Python tutor." },
        { role: "user", content: question }
      ],
      max_tokens: 200
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error("Mentor error:", error.message);
    res.status(500).json({ error: "Mentor unavailable" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend running at http://localhost:${port}`);
});

