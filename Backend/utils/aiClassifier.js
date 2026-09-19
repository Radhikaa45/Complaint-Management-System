// Offline keyword classifier. Used directly when no GROQ_API_KEY is set,
// and as a fallback when the AI call fails.

const CATEGORY_KEYWORDS = {
  IT: ["wifi", "wi-fi", "internet", "network", "system", "computer", "laptop", "printer", "software", "email", "password", "login", "server", "vpn", "monitor", "keyboard", "mouse"],
  Facilities: ["ac", "air conditioner", "air conditioning", "electricity", "power", "water", "light", "lights", "lift", "elevator", "chair", "desk", "furniture", "leak", "plumbing", "fan", "heating", "parking"],
  HR: ["salary", "leave", "payroll", "harassment", "manager", "promotion", "attendance", "policy", "discrimination", "bonus", "appraisal"],
  Security: ["security", "theft", "stolen", "cctv", "access card", "badge", "intruder", "unsafe", "lock", "guard"],
  Housekeeping: ["clean", "cleaning", "dirty", "washroom", "toilet", "restroom", "garbage", "trash", "smell", "pantry", "dust", "pest"]
};

const HIGH_WORDS = ["urgent", "emergency", "fire", "smoke", "danger", "unsafe", "harassment", "theft", "stolen", "injury", "injured", "shock", "flood", "not working at all", "outage", "immediately", "asap"];
const LOW_WORDS = ["suggestion", "minor", "whenever", "request", "would be nice", "cosmetic", "small"];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasWord = (text, word) => new RegExp(`\\b${escapeRegex(word)}\\b`, "i").test(text);

function classifyComplaint(text = "") {
  const lower = String(text).toLowerCase();

  let category = "General";
  let best = 0;

  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = words.filter((w) => hasWord(lower, w)).length;
    if (score > best) {
      best = score;
      category = cat;
    }
  }

  let priority = "Medium";
  if (HIGH_WORDS.some((w) => hasWord(lower, w))) priority = "High";
  else if (LOW_WORDS.some((w) => hasWord(lower, w))) priority = "Low";

  return { category, priority, source: "keywords" };
}

module.exports = classifyComplaint;
