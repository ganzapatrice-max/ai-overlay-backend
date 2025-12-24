const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

// Fail fast if secret is missing
if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in .env");
}

/**
 * Generate JWT for user or admin
 * @param {Object} user
 */
function generateToken(user) {
  if (!user || !user._id) {
    throw new Error("User _id is required to generate token");
  }

  const payload = {
    sub: user._id.toString(),
    email: user.email || null,
    role: user.role || "user",   // user | admin
    paid: !!user.paid,           // payment status
    active: user.active !== false
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "ai-desktop-overlay",
    audience: "desktop-client"
  });
}

module.exports = {
  generateToken
};
