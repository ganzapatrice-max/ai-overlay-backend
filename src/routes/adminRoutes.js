const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/users", auth, (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  res.json(User.findAll());
});

router.post("/approve", auth, (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);

  const { email } = req.body;
  const user = User.update(email, { paid: true, active: true });

  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User approved" });
});

module.exports = router;
