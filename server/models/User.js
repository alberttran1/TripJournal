const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  email: String,
  name: String,
  photoURL: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);