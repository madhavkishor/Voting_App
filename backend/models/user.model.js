const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hasVoted: { type: Boolean, default: false }, // prevent duplicate votes
});

module.exports = mongoose.model("User", userSchema);
