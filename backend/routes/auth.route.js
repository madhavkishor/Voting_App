const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: "Name is required" });

  try {
    // Find or create user
    let user = await User.findOne({ name });
    if (!user) {
      user = new User({ name });
      await user.save();
    }

    const token = jwt.sign({ _id: user._id, name: user.name }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
