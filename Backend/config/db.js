const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set in Backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected ✅ (${mongoose.connection.name})`);
  } catch (error) {
    console.error("Mongo Error ❌:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
