// ✅ routes/booking.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";

dotenv.config();
const router = express.Router();

// 📧 Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Test mail transporter
transporter.verify((error, success) => {
  if (error) console.error("❌ Mail setup error:", error);
  else console.log("📨 Mail server ready");
});

// 🟩 Booking API
router.post("/book-slot", async (req, res) => {
  try {
    const { name, phone, email, service, date, time, timeSlot } = req.body;

    if (!name || !phone || !email || !service || !date || !time || !timeSlot) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // Save to DB
    const booking = new Booking({ name, phone, email, service, date, time, timeSlot });
    await booking.save();

    // Send confirmation email
    const mailOptions = {
      from: `"MentorX" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "✅ Booking Confirmation - MentorX",
      html: `
        <h2>Hi ${name},</h2>
        <p>Your booking has been confirmed!</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time Slot:</b> ${timeSlot}</p>
        <p>We look forward to meeting you!</p>
        <br/>
        <p>— Team MentorX</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Booking successful! Confirmation email sent." });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Server error while booking slot." });
  }
});

export default router;
