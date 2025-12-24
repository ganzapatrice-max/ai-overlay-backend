const User = require("../models/User");

/* -------------------------
   GET ALL USERS
------------------------- */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(u => u.toSafe()));
  } catch (err) {
    next(err);
  }
};

/* -------------------------
   APPROVE USER
------------------------- */
exports.approveUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { active: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User approved",
      user: user.toSafe()
    });
  } catch (err) {
    next(err);
  }
};

/* -------------------------
   SET PAYMENT STATUS
------------------------- */
exports.setPaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paid } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { paid: !!paid },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Payment status updated",
      user: user.toSafe()
    });
  } catch (err) {
    next(err);
  }
};

/* -------------------------
   DEACTIVATE USER
------------------------- */
exports.deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deactivated",
      user: user.toSafe()
    });
  } catch (err) {
    next(err);
  }
};

/* -------------------------
   DELETE USER
------------------------- */
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
