const express = require("express");
const { analyzeComplaint } = require("../services/aiService");

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { description } = req.body;

    const result = await analyzeComplaint(description);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "AI processing failed" });
  }
});

module.exports = router;   // ✅ FIX