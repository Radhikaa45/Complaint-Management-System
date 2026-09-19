const mongoose = require("mongoose");

const STATUSES = ["Submitted", "In Process", "Resolved", "Rejected"];
const PRIORITIES = ["High", "Medium", "Low"];
const CATEGORIES = ["IT", "Facilities", "HR", "Security", "Housekeeping", "General"];

const HistorySchema = new mongoose.Schema({
  status: { type: String, enum: STATUSES, required: true },
  note: { type: String, trim: true, maxlength: 1000 },
  at: { type: Date, default: Date.now }
}, { _id: false });

const ComplaintSchema = new mongoose.Schema({

  complaintId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },

  userType: {
    type: String,
    enum: ["Employee", "Visitor", "Client"],
    required: true
  },

  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  file: String,

  category: { type: String, enum: CATEGORIES, default: "General" },
  priority: { type: String, enum: PRIORITIES, default: "Medium" },

  status: {
    type: String,
    enum: STATUSES,
    default: "Submitted"
  },

  history: [HistorySchema],

  resolvedAt: {
    type: Date
  },

  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 500 },
    at: Date
  }

}, {
  timestamps: true
});

ComplaintSchema.statics.STATUSES = STATUSES;
ComplaintSchema.statics.PRIORITIES = PRIORITIES;
ComplaintSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model("Complaint", ComplaintSchema);
