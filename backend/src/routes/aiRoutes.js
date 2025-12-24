const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/ask", (req, res) => {
  const { question } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user.active) {
      return res.status(403).json({ error: "User not approved or inactive" });
    }

    res.status(200).json({
      answer: "AI RESPONSE: " + question
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
