const { Resend } = require("resend");

// 🔐 Initialize safely
let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("✅ Resend initialized");
} else {
  console.log("⚠️ RESEND_API_KEY missing - email service disabled");
}

const sendComplaintEmail = async (email, complaintId, type = "submitted") => {

  // 🛑 Prevent crash if key not available
  if (!resend) {
    console.log("❌ Email skipped (no API key)");
    return;
  }

  let subject = "";
  let message = "";

  if (type === "resolved") {

    subject = "Your Complaint Has Been Resolved";

    message = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2 style="color:#2e7d32;">Complaint Resolved</h2>
      <p>Dear User,</p>
      <p>Your complaint has been successfully resolved by our support team.</p>
      <p><strong>Complaint ID:</strong> ${complaintId}</p>
      <p>If you still face issues, contact support.</p>
      <br>
      <p>Best regards,<br><strong>SmartOffice Team</strong></p>
    </div>
    `;

  } else {

    subject = "Complaint Registered Successfully";

    message = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2 style="color:#1976d2;">Complaint Registered</h2>
      <p>Dear User,</p>
      <p>Your complaint has been successfully submitted.</p>
      <p><strong>Complaint ID:</strong> ${complaintId}</p>
      <p>Please keep this ID for tracking.</p>
      <br>
      <p>Regards,<br><strong>SmartOffice Team</strong></p>
    </div>
    `;
  }

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // ⚠️ change to your verified domain later
      to: email,
      subject: subject,
      html: message
    });

    console.log("✅ Email sent:", response);

  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};

module.exports = sendComplaintEmail;