const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Without JWT_SECRET a random per-process secret is used, so tokens reset on restart.
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.JWT_SECRET) {
  console.log("⚠️ JWT_SECRET missing - using a temporary secret (admins will be logged out on restart)");
}

const signToken = (admin) =>
  jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "1d" });

const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Session expired, please log in again" });
  }
};

module.exports = { signToken, requireAdmin };
