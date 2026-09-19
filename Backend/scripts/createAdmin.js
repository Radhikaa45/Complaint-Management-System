// Create or update an admin account.
// Usage: npm run create-admin -- admin@example.com "StrongPassword123"
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: npm run create-admin -- <email> "<password>"');
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters");
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { password: hash },
      { upsert: true, returnDocument: "after" }
    );

    console.log(`✅ Admin ready: ${admin.email}`);
  } catch (error) {
    console.error("❌ Failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
