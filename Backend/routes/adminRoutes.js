const express = require("express");

const router = express.Router();

const {
  loginAdmin,
  getMe,
  getDashboardStats,
  getRecentComplaints
} = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");


router.post("/login", loginAdmin);

router.get("/me", requireAdmin, getMe);

router.get("/stats", requireAdmin, getDashboardStats);

router.get("/recent", requireAdmin, getRecentComplaints);


module.exports = router;
