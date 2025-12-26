const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

router.post("/ask", auth, (req, res) => {
  const { prompt } = req.body;
  res.json({ reply: `AI RESPONSE: ${prompt}` });
});

module.exports = router;
