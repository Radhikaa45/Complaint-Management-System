const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createComplaint,
  getComplaints,
  trackComplaint,
  updateStatus
} = require("../controllers/complaintController");


// Multer Storage Config
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }

});

const upload = multer({ storage });


// Submit Complaint (with file upload)
router.post("/submit", upload.single("file"), createComplaint);


// Get All Complaints
router.get("/", getComplaints);


// Track Complaint by complaintId
router.get("/track/:id", trackComplaint);


// Update Complaint Status
router.put("/status/:id", updateStatus);


module.exports = router;