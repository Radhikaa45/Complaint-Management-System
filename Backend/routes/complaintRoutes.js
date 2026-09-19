const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createComplaint,
  getComplaints,
  trackComplaint,
  updateStatus,
  deleteComplaint,
  submitFeedback,
  getPublicStats
} = require("../controllers/complaintController");
const { requireAdmin } = require("../middleware/auth");


// 🟢 Ensure uploads folder exists (relative to the backend, not the cwd)
const uploadPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}


// 🟢 Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    // Strip anything odd from the original name so it is safe in URLs and on disk
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});


// 🟢 File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP or PDF files are allowed"), false);
  }
};


// 🟢 Multer Upload Config
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});


// 🟢 PUBLIC ROUTES

router.post("/submit", upload.single("file"), createComplaint);

router.get("/track/:id", trackComplaint);

router.post("/feedback/:id", submitFeedback);

router.get("/public-stats", getPublicStats);


// 🔒 ADMIN ROUTES

router.get("/", requireAdmin, getComplaints);

router.put("/status/:id", requireAdmin, updateStatus);

router.delete("/:id", requireAdmin, deleteComplaint);


// 🛑 Multer / upload error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 5MB)" : err.message;
    return res.status(400).json({ message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});


module.exports = router;
