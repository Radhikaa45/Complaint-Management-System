require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes"); // ✅ FIXED

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/complaintsDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req,res)=>{
  res.send("Smart Complaint System API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});