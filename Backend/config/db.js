const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    
    console.log("URI USED:", process.env.MONGO_URI); // 🔥 ADD THIS

    await mongoose.connect(process.env.MONGO_URI, {
  tlsAllowInvalidCertificates: true
});

    console.log("MongoDB Connected ✅");
    console.log("Connected DB:", mongoose.connection.name); // ✅ MOVE INSIDE TRY

  } catch (error) {
    console.error("Mongo Error ❌:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;