const Complaint = require("../models/Complaint");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const { signToken } = require("../middleware/auth");


// ADMIN LOGIN
exports.loginAdmin = async (req, res) => {
  try {

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });

    // Same message for both cases so the response doesn't reveal which emails exist
    if (!admin || !(await bcrypt.compare(String(password), admin.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: signToken(admin),
      admin: { email: admin.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};


// CURRENT ADMIN (validates token)
exports.getMe = (req, res) => {
  res.json({ email: req.admin.email });
};


// DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {

  try {

    const [total, submitted, inProcess, resolved, rejected] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Submitted" }),
      Complaint.countDocuments({ status: "In Process" }),
      Complaint.countDocuments({ status: "Resolved" }),
      Complaint.countDocuments({ status: "Rejected" })
    ]);

    res.json({ total, submitted, inProcess, resolved, rejected });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
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
    console.error(error);
    res.status(500).json({ message: "Error fetching complaints" });
  }

};
