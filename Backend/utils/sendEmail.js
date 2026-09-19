const { Resend } = require("resend");
const nodemailer = require("nodemailer");

// 🔐 Transports: Gmail SMTP (can email anyone) first, Resend as fallback.
// Note: Resend without a verified domain can only send to the account owner's address.
let smtp = null;
let resend = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  smtp = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS.replace(/\s/g, "") },
    connectionTimeout: 10000
  });
  console.log("✅ SMTP email initialized");
}

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("✅ Resend initialized");
}

if (!smtp && !resend) {
  console.log("⚠️ No email credentials (EMAIL_USER/EMAIL_PASS or RESEND_API_KEY) - email service disabled");
}

const deliver = async ({ to, subject, html }) => {
  if (smtp) {
    try {
      const info = await smtp.sendMail({ from: `"SmartOffice" <${process.env.EMAIL_USER}>`, to, subject, html });
      console.log("✅ Email sent via SMTP:", info.messageId);
      return;
    } catch (error) {
      console.error("❌ SMTP error:", error.message, resend ? "- trying Resend" : "");
    }
  }

  if (resend) {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev", // ⚠️ must be a verified domain to email other people
      to,
      subject,
      html
    });
    if (response.error) {
      console.error("❌ Resend error:", response.error.message);
    } else {
      console.log("✅ Email sent via Resend:", response.data?.id);
    }
  }
};

const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const TEMPLATES = {
  submitted: {
    subject: "Complaint Registered Successfully",
    color: "#1976d2",
    heading: "Complaint Registered",
    body: "Your complaint has been successfully submitted. Please keep this ID for tracking."
  },
  "In Process": {
    subject: "Your Complaint Is Being Worked On",
    color: "#f59e0b",
    heading: "Complaint In Process",
    body: "Our team has started working on your complaint."
  },
  Resolved: {
    subject: "Your Complaint Has Been Resolved",
    color: "#2e7d32",
    heading: "Complaint Resolved",
    body: "Your complaint has been successfully resolved by our support team. We'd love to hear your feedback on the tracking page."
  },
  Rejected: {
    subject: "Update on Your Complaint",
    color: "#dc2626",
    heading: "Complaint Closed",
    body: "Your complaint has been reviewed and closed by our team."
  }
};

/**
 * @param {string} email
 * @param {string} complaintId
 * @param {"submitted"|"In Process"|"Resolved"|"Rejected"|"resolved"} type
 * @param {string} [note] optional admin note included in the email
 */
const sendComplaintEmail = async (email, complaintId, type = "submitted", note) => {

  // 🛑 Prevent crash if key not available
  if (!smtp && !resend) {
    console.log("❌ Email skipped (no email credentials)");
    return;
  }

  const template = TEMPLATES[type] || (type === "resolved" ? TEMPLATES.Resolved : null);

  if (!template) return; // e.g. status moved back to "Submitted": nothing to announce

  const trackUrl = process.env.CLIENT_URL
    ? `${process.env.CLIENT_URL.split(",")[0].trim().replace(/\/$/, "")}/track?id=${complaintId}`
    : null;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2 style="color:${template.color};">${template.heading}</h2>
      <p>Dear User,</p>
      <p>${template.body}</p>
      <p><strong>Complaint ID:</strong> ${escapeHtml(complaintId)}</p>
      ${note ? `<p><strong>Note from our team:</strong> ${escapeHtml(note)}</p>` : ""}
      ${trackUrl ? `<p><a href="${trackUrl}">Track your complaint</a></p>` : ""}
      <br>
      <p>Regards,<br><strong>SmartOffice Team</strong></p>
    </div>
  `;

  try {
    await deliver({ to: email, subject: template.subject, html });
  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};

module.exports = sendComplaintEmail;
