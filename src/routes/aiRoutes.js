const express = require("express");
const router = express.Router();
const authRequired = require("../middleware/authRequired");

router.post("/ask", authRequired, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  // TEMP AI (replace later with OpenAI)
  const reply = `AI RESPONSE: ${prompt}`;

  res.json({ reply });
});

module.exports = router;
