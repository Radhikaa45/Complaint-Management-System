const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendComplaintEmail = async (email, complaintId, type = "submitted") => {

  let subject = "";
  let message = "";

  if (type === "resolved") {

    subject = "Your Complaint Has Been Resolved";

    message = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
    
      <h2 style="color:#2e7d32;">Complaint Resolved</h2>

      <p>Dear User,</p>

      <p>We are pleased to inform you that your complaint has been successfully resolved by our support team.</p>

      <p>
      <strong>Complaint ID:</strong> ${complaintId}
      </p>

      <p>If you still experience any issue, please contact support.</p>

      <br>

      <p>
      Best regards,<br>
      <strong>SmartOffice Support Team</strong>
      </p>

    </div>
    `;

  } else {

    subject = "Complaint Registered Successfully";

    message = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
    
      <h2 style="color:#1976d2;">Complaint Registered</h2>

      <p>Dear User,</p>

      <p>Your complaint has been successfully submitted.</p>

      <p>
      <strong>Complaint ID:</strong> ${complaintId}
      </p>

      <p>Please keep this ID for tracking.</p>

      <br>

      <p>
      Regards,<br>
      <strong>SmartOffice Support Team</strong>
      </p>

    </div>
    `;
  }

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // change later in production
      to: email,
      subject: subject,
      html: message
    });

    console.log("Email sent ✅", response);

  } catch (error) {
    console.error("Error sending email ❌", error);
  }
};

module.exports = sendComplaintEmail;