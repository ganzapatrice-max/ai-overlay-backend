const User = require("../models/User");
const authRequired = require("./authRequired");

module.exports = [
  authRequired,
  async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.paid) {
      return res.status(403).json({ message: "Payment required" });
    }

    if (!user.active) {
      return res.status(403).json({ message: "Waiting for admin approval" });
    }

    next();
  }
];
