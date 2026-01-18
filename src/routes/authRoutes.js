const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authenticate, adminOnly } = require("../middleware/authMiddleware");

// =====================
// POST /api/auth/signup
// =====================
router.post("/signup", async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    // Validate required fields
    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone and password are required ❌",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this phone already exists ❌",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      phone,
      email,
      passwordHash,
      paid: false,
      active: false,
      isAdmin: false,
    });

    res.status(201).json({
      message: "Signup successful. Wait for admin approval ✅",
      user: newUser.toSafe(),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Server error during signup ❌",
      error: error.message,
    });
  }
});

// =====================
// POST /api/auth/login
// =====================
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required ❌" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials ❌" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials ❌" });
    }

    // Check if user is active
    if (!user.active) {
      return res.status(403).json({ message: "User is not active ❌" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, phone: user.phone, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: user.toSafe(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login ❌",
      error: error.message,
    });
  }
});

// =====================
// GET /api/auth/me
// =====================
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found ❌" });
    res.status(200).json({ user: user.toSafe() });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
