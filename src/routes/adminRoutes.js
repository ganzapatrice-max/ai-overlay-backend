const express = require("express");
const router = express.Router();
const authRequired = require("../middleware/authRequired");
const adminOnly = require("../middleware/adminOnly");
const User = require("../models/User");

// Get all users
router.get("/users", authRequired, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Approve user
router.put("/approve/:id", authRequired, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    paid: true,
    active: true,
  });
  res.json({ message: "User approved" });
});

// Deactivate user
router.put("/deactivate/:id", authRequired, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    active: false,
  });
  res.json({ message: "User deactivated" });
});

// Delete user
router.delete("/delete/:id", authRequired, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;
