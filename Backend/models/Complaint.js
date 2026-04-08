const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({

  complaintId: {
    type: String,
    required: true
  },

  name: String,
  email: String,

  userType: {
    type: String,
    enum: ["Employee","Visitor","Client"]
  },

  title: String,
  description: String,
  file: String,

  status: {
    type: String,
    enum: ["Submitted","In Process","Resolved"],
    default: "Submitted"
  },

  resolvedAt: {
    type: Date
  }

},{
timestamps: true
});

module.exports = mongoose.model("Complaint", ComplaintSchema);