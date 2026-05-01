const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createComplaint,
  getComplaints,
  trackComplaint,
  updateStatus
} = require("../controllers/complaintController");


// 🟢 Ensure uploads folder exists
const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}


// 🟢 Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});


// 🟢 File Filter (optional but recommended)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, PDF files allowed"), false);
  }
};


// 🟢 Multer Upload Config
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});


// 🟢 ROUTES

// Submit Complaint (with file upload)
router.post("/submit", upload.single("file"), (req, res, next) => {
  console.log("Incoming Request Body:", req.body);
  console.log("Incoming File:", req.file);
  next();
}, createComplaint);


// Get All Complaints
router.get("/", async (req, res, next) => {
  try {
    await getComplaints(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});


// Track Complaint by complaintId
router.get("/track/:id", async (req, res, next) => {
  try {
    await trackComplaint(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Tracking failed" });
  }
});


// Update Complaint Status
router.put("/status/:id", async (req, res, next) => {
  try {
    await updateStatus(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});


// 🛑 Global multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});


module.exports = router;