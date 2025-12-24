const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

/* -------------------------
   VALIDATION HELPERS
------------------------- */
function validateSignup({ phone, password }) {
  if (!phone) return { ok: false, msg: "phone is required" };
  if (!password || password.length < 6)
    return { ok: false, msg: "password must be at least 6 characters" };
  return { ok: true };
}

function validateLogin({ phone, password }) {
  if (!phone) return { ok: false, msg: "phone is required" };
  if (!password) return { ok: false, msg: "password is required" };
  return { ok: true };
}

/* -------------------------
   SIGNUP (USER)
------------------------- */
exports.signup = async (req, res, next) => {
  try {
    const { phone, password, email } = req.body;

    const v = validateSignup({ phone, password });
    if (!v.ok) {
      return res.status(400).json({ message: v.msg });
    }

    const exists = await User.findOne({ phone });
    if (exists) {
      return res.status(409).json({ message: "Phone already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      phone,
      email,
      passwordHash,
      paid: false,     // payment required
      active: false,   // admin approval required
      isAdmin: false
    });

    return res.status(201).json({
      message: "Signup successful. Complete payment and wait for admin approval.",
      user: user.toSafe()
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------------
   LOGIN (USER)
------------------------- */
exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const v = validateLogin({ phone, password });
    if (!v.ok) {
      return res.status(400).json({ message: v.msg });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🚫 payment check
    if (!user.paid) {
      return res.status(403).json({
        message: "Payment required before access"
      });
    }

    // 🚫 admin approval check
    if (!user.active) {
      return res.status(403).json({
        message: "Waiting for admin approval"
      });
    }

    // ✅ STRONG JWT PAYLOAD
    const token = generateToken({
      id: user._id.toString(),
      phone: user.phone,
      role: "user",
      paid: user.paid,
      active: user.active
    });

    return res.json({
      message: "Login successful",
      token,
      user: user.toSafe()
    });

  } catch (err) {
    next(err);
  }
};
