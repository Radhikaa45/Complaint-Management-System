const express = require("express");
const { analyzeComplaint } = require("../services/aiService");

const router = express.Router();

// Preview classification while the user types (public, text only)
router.post("/analyze", async (req, res) => {
  const { description } = req.body || {};

  if (!description || description.trim().length < 10) {
    return res.status(400).json({ message: "Description must be at least 10 characters" });
  }

  const result = await analyzeComplaint(description);
  res.json(result);
});

module.exports = router;
