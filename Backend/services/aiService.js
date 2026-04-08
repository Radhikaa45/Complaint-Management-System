const axios = require("axios");

const analyzeComplaint = async (text) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: `
Analyze the complaint and return:
Category (Technical, Service, Billing, Other)
Priority (High, Medium, Low)

Complaint: "${text}"

Format:
Category: <category>
Priority: <priority>
`,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;

    let category = "Other";
    let priority = "Low";

    content.split("\n").forEach((line) => {
      if (line.toLowerCase().includes("category")) {
        category = line.split(":")[1]?.trim();
      }
      if (line.toLowerCase().includes("priority")) {
        priority = line.split(":")[1]?.trim();
      }
    });

    return { category, priority };
  } catch (error) {
    console.error("AI Error:", error.message);
    return { category: "Other", priority: "Low" };
  }
};

module.exports = { analyzeComplaint };   // ✅ IMPORTANT