const express = require("express");
const router = express.Router();
const authRequired = require("../middleware/authRequired");
const OpenAI = require("openai");

// Ensure API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error(
    "ERROR: Missing OpenAI API key. Please set the OPENAI_API_KEY environment variable."
  );
  process.exit(1); // Stop the server if key is missing
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /ask route
router.post("/ask", authRequired, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    // Get the AI's reply
    const reply = completion.choices?.[0]?.message?.content || "";

    res.json({ reply });
  } catch (err) {
    console.error("OpenAI request failed:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

module.exports = router;
