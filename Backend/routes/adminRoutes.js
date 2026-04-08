const express = require("express");

const router = express.Router();

const {
  loginAdmin,
  getDashboardStats,
  getRecentComplaints
} = require("../controllers/adminController");


router.post("/login", loginAdmin);

router.get("/stats", getDashboardStats);

router.get("/recent", getRecentComplaints);


module.exports = router;