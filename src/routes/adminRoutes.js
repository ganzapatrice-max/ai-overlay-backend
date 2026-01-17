const express = require("express");
const router = express.Router();
const authRequired = require("../middleware/authRequired");
const adminOnly = require("../middleware/adminOnly");
const User = require("../models/User");

// =====================
// Get all users
// =====================
router.get("/users", authRequired, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

// =====================
// Approve user (activate + mark as paid)
// =====================
router.put("/approve/:id", authRequired, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        paid: true,
        active: true,
      },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User approved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve user", error: error.message });
  }
});

// =====================
// Deactivate user
// =====================
router.put("/deactivate/:id", authRequired, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deactivated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to deactivate user", error: error.message });
  }
});

// =====================
// Delete user
// =====================
router.delete("/delete/:id", authRequired, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

module.exports = router;
