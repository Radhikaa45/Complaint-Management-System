const Complaint = require("../models/Complaint");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");


// ADMIN LOGIN
exports.loginAdmin = async (req, res) => {
  try {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {

  try {

    const total = await Complaint.countDocuments();

    const submitted = await Complaint.countDocuments({ status: "Submitted" });

    const resolved = await Complaint.countDocuments({ status: "Resolved" });

    const review = await Complaint.countDocuments({ status: "In Review" });

    res.json({
      total,
      submitted,
      resolved,
      review
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


// RECENT COMPLAINTS
exports.getRecentComplaints = async (req, res) => {

  try {

    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(complaints);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};