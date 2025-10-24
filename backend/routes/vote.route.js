const express = require("express");
const Vote = require("../models/vote.model");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Cast a vote
router.post("/", verifyToken, async (req, res) => {
  const { option } = req.body;
  if (!option) return res.status(400).json({ msg: "Option is required" });

  try {
    // Check if user already voted
    const existingVote = await Vote.findOne({ userId: req.user._id });
    if (existingVote)
      return res.status(400).json({ msg: "You have already voted" });

    const vote = new Vote({
      userId: req.user._id,
      name: req.user.name,
      option,
    });

    await vote.save();
    
    // Get updated results and emit to all clients
    const io = req.app.get('io');
    const results = await Vote.aggregate([
      { $group: { _id: "$option", count: { $sum: 1 } } }
    ]);
    
    io.emit('voteUpdate', results);
    io.emit('newVote', { 
      voter: req.user.name, 
      option, 
      timestamp: new Date() 
    });
    
    res.json({ msg: "Vote cast successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get vote results
router.get("/results", async (req, res) => {
  try {
    const results = await Vote.aggregate([
      { $group: { _id: "$option", count: { $sum: 1 } } }
    ]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all votes
router.get("/", verifyToken, async (req, res) => {
  try {
    const votes = await Vote.find();
    res.json(votes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get user's vote history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const votes = await Vote.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    const history = votes.map(vote => ({
      option: vote.option,
      timestamp: vote.createdAt
    }));
    
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
