const express = require("express");
const User = require("../models/User");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (admin only)
 */
router.get("/users", adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users.map(u => u.toSafe()));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PATCH /api/admin/users/:id/paid
 * @desc    Toggle user's paid status
 */
router.patch("/users/:id/paid", adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.paid = !user.paid;
    await user.save();

    res.status(200).json({ message: "Paid status updated", user: user.toSafe() });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PATCH /api/admin/users/:id/active
 * @desc    Toggle user's active status
 */
router.patch("/users/:id/active", adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.active = !user.active;
    await user.save();

    res.status(200).json({ message: "Active status updated", user: user.toSafe() });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 */
router.delete("/users/:id", adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
