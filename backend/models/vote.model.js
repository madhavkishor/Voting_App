const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  option: { type: String, required: true }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Vote", voteSchema);
