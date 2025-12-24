const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// TEMP users (replace later with DB)
const users = [];

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({
    email,
    password,
    approved: false,
    active: false,
    paid: false
  });

  res.status(201).json({ message: "Signup successful, wait for admin approval" });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (!user.approved || !user.active)
    return res.status(403).json({ message: "User not approved or inactive" });

  const token = jwt.sign(
    { email: user.email },
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
  res.json(users);
});

/**
 * @route   POST /api/auth/admin/approve
 * @desc    Approve a user
 */
router.post("/admin/approve", (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.approved = true;
  user.active = true;

  res.json({ message: "User approved successfully", user });
});

/**
 * @route   PUT /api/auth/admin/update
 * @desc    Update user fields (active, paid, approved)
 */
router.put("/admin/update", (req, res) => {
  const { email, active, approved, paid } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (active !== undefined) user.active = active;
  if (approved !== undefined) user.approved = approved;
  if (paid !== undefined) user.paid = paid;

  res.json({ message: "User updated successfully", user });
});

module.exports = router;
