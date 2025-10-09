import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/payment-success", async (req, res) => {
  try {
    const { email } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "DSA Sheet Payment Successful ✅",
      html: `
        <h3>Hi there!</h3>
        <p>Your payment for the DSA Preparation Sheet was successful.</p>
        <p>🎯 Access all problem sheets <a href="https://yourdomain.com/problems">here</a>.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
});

export default router;
