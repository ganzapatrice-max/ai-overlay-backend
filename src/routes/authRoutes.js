const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({
      email,
      password,
      approved: false,
      active: false,
      paid: false,
      role: "user",
    });

    res.status(201).json({
      message: "Signup successful. Wait for admin approval.",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Server error during signup",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.approved || !user.active) {
      return res.status(403).json({
        message: "User not approved or inactive",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/auth/admin/users
 * @desc    List all users
 */
router.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * @route   PUT /api/auth/admin/approve/:id
 * @desc    Approve a user
 */
router.put("/admin/approve/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true, active: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User approved successfully",
      user,
    });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({ message: "Failed to approve user" });
  }
});

/**
 * @route   PUT /api/auth/admin/update/:id
 * @desc    Update user fields (active, approved, paid)
 */
router.put("/admin/update/:id", async (req, res) => {
  try {
    const { active, approved, paid } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active, approved, paid },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

module.exports = router;
