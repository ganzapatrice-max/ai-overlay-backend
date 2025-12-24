const authRequired = require("./authRequired");

module.exports = [
  authRequired,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access only" });
    }
    next();
  }
];
