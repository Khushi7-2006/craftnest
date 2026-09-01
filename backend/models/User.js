const mongoose = require("mongoose");

// Customers log in with their phone number (including country code, e.g. +919876543210).
// The seller account is not stored here — it's a single fixed account checked
// against SELLER_ID / SELLER_PASSWORD environment variables (see authController.js).
const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("User", userSchema);
