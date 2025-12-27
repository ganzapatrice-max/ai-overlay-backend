const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (User.findByEmail(email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  User.create({
    email,
    password,
    approved: false,
    active: false,
    paid: false,
    role: "user"
  });

  res.status(201).json({
    message: "Signup successful. Wait for admin approval."
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = User.findByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.approved || !user.active) {
    return res.status(403).json({
      message: "User not approved or inactive"
    });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

/**
 * @route   GET /api/auth/admin/users
 * @desc    List all users
 */
router.get("/admin/users", (req, res) => {
  res.json(User.findAll());
});

/**
 * @route   POST /api/auth/admin/approve
 * @desc    Approve a user
 */
router.post("/admin/approve", (req, res) => {
  const { email } = req.body;

  const user = User.update(email, {
    approved: true,
    active: true
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: "User approved successfully",
    user
  });
});

/**
 * @route   PUT /api/auth/admin/update
 * @desc    Update user fields (active, approved, paid)
 */
router.put("/admin/update", (req, res) => {
  const { email, active, approved, paid } = req.body;

  const user = User.update(email, { active, approved, paid });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: "User updated successfully",
    user
  });
});

module.exports = router;