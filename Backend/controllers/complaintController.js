const Complaint = require("../models/Complaint");
const { v4: uuidv4 } = require("uuid");
const sendComplaintEmail = require("../utils/sendEmail");

/* ======================================
   Submit Complaint
====================================== */
exports.createComplaint = async (req, res) => {

  try {

    const { name, email, userType, title, description } = req.body;

    /* EMAIL FORMAT VALIDATION */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    /* GENERATE COMPLAINT ID */

    const complaintId = uuidv4().slice(0, 8);

    const complaint = new Complaint({

      complaintId,
      name,
      email,
      userType,
      title,
      description,

      file: req.file ? req.file.filename : null,

      status: "Submitted"

    });

    /* SAVE COMPLAINT */

    await complaint.save();

    /* SEND EMAIL WITH COMPLAINT ID */

    try {

      console.log("Sending email to:", email);
      console.log("Complaint ID:", complaintId);

      await sendComplaintEmail(email, complaintId);

    } catch (emailError) {

      console.log("Email sending failed:", emailError.message);

    }

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaintId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error submitting complaint",
      error: error.message
    });

  }

};


/* ======================================
   Get All Complaints (Admin Dashboard)
====================================== */
exports.getComplaints = async (req, res) => {

  try {

    const complaints = await Complaint
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error fetching complaints",
      error: error.message
    });

  }

};


/* ======================================
   Track Complaint by complaintId
====================================== */
exports.trackComplaint = async (req, res) => {

  try {

    const complaint = await Complaint.findOne({
      complaintId: req.params.id
    });

    if (!complaint) {

      return res.status(404).json({
        message: "Complaint not found"
      });

    }

    res.status(200).json(complaint);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error tracking complaint",
      error: error.message
    });

  }

};


/* ======================================
   Update Complaint Status
====================================== */
exports.updateStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const updateData = { status };

    // If complaint is resolved, store resolved time
    if (status === "Resolved") {
      updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    // Send email when complaint is resolved
    if (status === "Resolved") {

      await sendComplaintEmail(
        complaint.email,
        complaint.complaintId,
        "resolved"
      );

    }

    res.status(200).json({
      message: "Complaint status updated successfully",
      complaint
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error updating complaint status",
      error: error.message
    });

  }

};

