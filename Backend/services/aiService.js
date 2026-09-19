const axios = require("axios");
const classifyComplaint = require("../utils/aiClassifier");

const CATEGORIES = ["IT", "Facilities", "HR", "Security", "Housekeeping", "General"];
const PRIORITIES = ["High", "Medium", "Low"];

const pick = (value, allowed) =>
  allowed.find((a) => a.toLowerCase() === String(value || "").trim().toLowerCase());

/**
 * Classify a complaint into { category, priority, source }.
 * Uses Groq when GROQ_API_KEY is set, otherwise (or on failure) the keyword classifier.
 */
const analyzeComplaint = async (text) => {
  const fallback = classifyComplaint(text);

  if (!process.env.GROQ_API_KEY || !text) {
    return fallback;
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              `You classify office complaints. Reply with JSON only: {"category": one of ${JSON.stringify(CATEGORIES)}, "priority": one of ${JSON.stringify(PRIORITIES)}}. ` +
              "High = safety risk, harassment, or work completely blocked. Low = cosmetic or suggestion."
          },
          { role: "user", content: String(text).slice(0, 3000) }
        ],
        temperature: 0,
        response_format: { type: "json_object" }
      },
      {
        timeout: 8000,
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const parsed = JSON.parse(response.data.choices[0].message.content);

    return {
      category: pick(parsed.category, CATEGORIES) || fallback.category,
      priority: pick(parsed.priority, PRIORITIES) || fallback.priority,
      source: "ai"
    };
  } catch (error) {
    console.error("AI Error (using keyword fallback):", error.response?.data?.error?.message || error.message);
    return fallback;
  }
};

module.exports = { analyzeComplaint };
