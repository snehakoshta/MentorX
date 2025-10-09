// routes/contact.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Send email to admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const mailOptions = {
      from: `"MentorX Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #fff; background-color: #121212; padding: 20px;">
          <h2 style="color:#00bfff;">New Contact Message</h2>
          <div style="background-color:#1e1e1e; padding:15px; border-radius:8px;">
            <p><strong style="color:#00bfff;">Name:</strong> ${name}</p>
            <p><strong style="color:#00bfff;">Email:</strong> ${email}</p>
            <p><strong style="color:#00bfff;">Phone:</strong> ${phone}</p>
            <p><strong style="color:#00bfff;">Message:</strong></p>
            <p style="background-color:#333; padding:10px; border-radius:5px;">${message}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Contact mail error:", err.message);
    res.status(500).json({ error: "Failed to send message." });
  }
});

export default router;
