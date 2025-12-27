// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true, required: true },
    email: String,
    passwordHash: String,

    paid: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.methods.toSafe = function () {
  return {
    id: this._id,
    phone: this.phone,
    email: this.email,
    paid: this.paid,
    active: this.active,
    isAdmin: this.isAdmin
  };
};

module.exports = mongoose.model("User", userSchema);
