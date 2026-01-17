const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// =====================
// Signup Route
// =====================
router.post("/signup", async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check if phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      phone,
      email,
      passwordHash,
      active: false,
      paid: false,
      isAdmin: false,
    });

    res.status(201).json({
      message: "Signup successful. Wait for admin approval ✅",
      user: newUser.toSafe(),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Server error during signup",
      error: error.message,
    });
  }
});

// =====================
// Login Route
// =====================
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.active) {
      return res.status(403).json({ message: "User is not active" });
    }

    const token = jwt.sign(
      { id: user._id, phone: user.phone, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: user.toSafe(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

// =====================
// Admin Routes (unchanged)
// =====================
router.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.put("/admin/approve/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: true, paid: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User approved successfully ✅", user });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({ message: "Failed to approve user" });
  }
});

router.put("/admin/update/:id", async (req, res) => {
  try {
    const { active, paid, isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active, paid, isAdmin },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully ✅", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

module.exports = router;
