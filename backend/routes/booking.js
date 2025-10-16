// ✅ routes/booking.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";

dotenv.config();
const router = express.Router();

// 📧 Setup Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// 🔍 Verify mail setup
transporter.verify((error, success) => {
  if (error) console.error("❌ Mail setup error:", error);
  else console.log("📨 Mail server ready");
});

// 🟩 Booking API
router.post("/book-slot", async (req, res) => {
  try {
    const { name, phone, email, service, date, time } = req.body;

    console.log("📥 Booking request received:", req.body);

    // 🔸 Validate required fields
    if (!name || !phone || !email || !service || !date || !time) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // 🧾 Save booking in MongoDB
    const booking = new Booking({
      name,
      phone,
      email,
      service,
      date,
      time,
    });

    await booking.save();
    console.log("✅ Booking saved to database");

    // ✉️ Send confirmation email
    const mailOptions = {
      from: `"MentorX" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "✅ Booking Confirmation - MentorX",
      html: `
        <h2>Hi ${name},</h2>
        <p>Your booking has been <b>confirmed!</b></p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <br/>
        <p>We look forward to meeting you!</p>
        <hr/>
        <p>— Team MentorX</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📩 Confirmation email sent to:", email);

    // 🟢 Send success response
    res.status(200).json({ message: "Booking successful! Confirmation email sent." });

  } catch (err) {
    console.error("❌ Booking Error:", err);
    res.status(500).json({ message: "Server error while booking slot." });
  }
});

export default router;
