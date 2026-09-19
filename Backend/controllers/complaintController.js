const fs = require("fs");
const path = require("path");
const Complaint = require("../models/Complaint");
const { v4: uuidv4 } = require("uuid");
const sendComplaintEmail = require("../utils/sendEmail");
const { analyzeComplaint } = require("../services/aiService");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_TYPES = ["Employee", "Visitor", "Client"];
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const removeUpload = (filename) => {
  if (!filename) return;
  fs.unlink(path.join(UPLOAD_DIR, path.basename(filename)), () => {});
};

/* ======================================
   Submit Complaint
====================================== */
exports.createComplaint = async (req, res) => {

  const { name, email, userType, title, description } = req.body || {};

  /* VALIDATION */

  const missing = ["name", "email", "userType", "title", "description"]
    .filter((field) => !req.body?.[field] || !String(req.body[field]).trim());

  if (missing.length) {
    removeUpload(req.file?.filename);
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
  }

  if (!emailRegex.test(email)) {
    removeUpload(req.file?.filename);
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!USER_TYPES.includes(userType)) {
    removeUpload(req.file?.filename);
    return res.status(400).json({ message: "Invalid user type" });
  }

  try {

    /* AI CLASSIFICATION (falls back to keywords) */

    const { category, priority } = await analyzeComplaint(`${title}\n${description}`);

    const complaint = await Complaint.create({
      complaintId: uuidv4().slice(0, 8),
      name,
      email,
      userType,
      title,
      description,
      file: req.file ? req.file.filename : null,
      category,
      priority,
      status: "Submitted",
      history: [{ status: "Submitted", note: "Complaint received" }]
    });

    /* EMAIL (never blocks the response on failure) */

    sendComplaintEmail(complaint.email, complaint.complaintId).catch((err) =>
      console.log("Email sending failed:", err.message)
    );

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaintId: complaint.complaintId,
      category,
      priority
    });

  } catch (error) {

    removeUpload(req.file?.filename);
    console.error(error);

    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? error.message : "Error submitting complaint"
    });

  }

};


/* ======================================
   Get All Complaints (Admin) - supports filters
   ?status=&priority=&category=&search=
====================================== */
exports.getComplaints = async (req, res) => {

  try {

    const { status, priority, category, search } = req.query;
    const filter = {};

    if (status) filter.status = String(status);
    if (priority) filter.priority = String(priority);
    if (category) filter.category = String(category);

    if (search && String(search).trim()) {
      const rx = new RegExp(escapeRegex(String(search).trim()), "i");
      filter.$or = [{ complaintId: rx }, { name: rx }, { email: rx }, { title: rx }, { description: rx }];
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.status(200).json(complaints);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error fetching complaints" });

  }

};


/* ======================================
   Track Complaint by complaintId (public)
====================================== */
exports.trackComplaint = async (req, res) => {

  try {

    const complaint = await Complaint.findOne({
      complaintId: String(req.params.id).trim().toLowerCase()
    }).lean();

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error tracking complaint" });

  }

};


/* ======================================
   Update Complaint Status (Admin)
   body: { status, note?, priority?, category? }
====================================== */
exports.updateStatus = async (req, res) => {

  try {

    const { status, note, priority, category } = req.body || {};

    if (!Complaint.STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${Complaint.STATUSES.join(", ")}` });
    }

    const previous = await Complaint.findById(req.params.id).select("status").lean();

    if (!previous) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const set = { status };

    if (priority && Complaint.PRIORITIES.includes(priority)) set.priority = priority;
    if (category && Complaint.CATEGORIES.includes(category)) set.category = category;

    const cleanNote = typeof note === "string" && note.trim() ? note.trim().slice(0, 1000) : undefined;

    const update = {
      $set: set,
      $push: { history: { status, note: cleanNote, at: new Date() } }
    };

    // Store resolved time when resolved; clear it if the complaint is reopened
    if (status === "Resolved") {
      if (previous.status !== "Resolved") set.resolvedAt = new Date();
    } else {
      update.$unset = { resolvedAt: "" };
    }

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { returnDocument: "after" });

    // Notify the user whenever the status actually changes
    if (previous.status !== status) {
      sendComplaintEmail(complaint.email, complaint.complaintId, status, cleanNote).catch((err) =>
        console.log("Email sending failed:", err.message)
      );
    }

    res.status(200).json({
      message: "Complaint status updated successfully",
      complaint
    });

  } catch (error) {

    console.error(error);
    const status = error.name === "CastError" ? 400 : 500;
    res.status(status).json({ message: "Error updating complaint status" });

  }

};


/* ======================================
   Delete Complaint (Admin)
====================================== */
exports.deleteComplaint = async (req, res) => {

  try {

    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    removeUpload(complaint.file);

    res.status(200).json({ message: "Complaint deleted" });

  } catch (error) {

    console.error(error);
    const status = error.name === "CastError" ? 400 : 500;
    res.status(status).json({ message: "Error deleting complaint" });

  }

};


/* ======================================
   Submit Feedback on a resolved complaint (public)
====================================== */
exports.submitFeedback = async (req, res) => {

  try {

    const rating = Number(req.body?.rating);
    const comment = typeof req.body?.comment === "string" ? req.body.comment.trim().slice(0, 500) : undefined;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const complaint = await Complaint.findOne({
      complaintId: String(req.params.id).trim().toLowerCase()
    }).lean();

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.status !== "Resolved") {
      return res.status(400).json({ message: "Feedback can only be given once the complaint is resolved" });
    }

    if (complaint.feedback?.rating) {
      return res.status(409).json({ message: "Feedback already submitted" });
    }

    const updated = await Complaint.findByIdAndUpdate(
      complaint._id,
      { $set: { feedback: { rating, comment, at: new Date() } } },
      { returnDocument: "after" }
    ).lean();

    res.status(200).json({ message: "Thank you for your feedback!", complaint: updated });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error saving feedback" });

  }

};


/* ======================================
   Public stats for the landing page
====================================== */
exports.getPublicStats = async (req, res) => {

  try {

    const [total, resolved, avg] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Resolved" }),
      Complaint.aggregate([
        { $match: { status: "Resolved", resolvedAt: { $ne: null } } },
        {
          $group: {
            _id: null,
            avgMs: { $avg: { $subtract: ["$resolvedAt", "$createdAt"] } },
            avgRating: { $avg: "$feedback.rating" }
          }
        }
      ])
    ]);

    res.json({
      total,
      resolved,
      resolutionRate: total ? Math.round((resolved / total) * 100) : 0,
      avgResolutionHours: avg[0]?.avgMs ? Math.round((avg[0].avgMs / 36e5) * 10) / 10 : null,
      avgRating: avg[0]?.avgRating ? Math.round(avg[0].avgRating * 10) / 10 : null
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });

  }

};
