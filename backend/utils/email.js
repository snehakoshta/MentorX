import nodemailer from "nodemailer";

export const sendEmail = async (mailOptions) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS)
      throw new Error("Missing Gmail credentials in .env");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", mailOptions.to);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};
