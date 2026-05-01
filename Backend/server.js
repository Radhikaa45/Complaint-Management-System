require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error:", err));

// routes
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API Running ✅");
});

// server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});