const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: String,
  // Presence fields
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: null },

 // any other fields you have...
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
