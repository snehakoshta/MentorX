// routes/get-started.js
import express from "express";
import Mentee from "../models/Mentee.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

const GMAIL_USER = process.env.GMAIL_USER || process.env.SMTP_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || GMAIL_USER;

router.post("/", async (req, res) => {
  try {
    const { name, email, goal } = req.body;
    if (!name || !email || !goal)
      return res.status(400).json({ error: "All fields are required" });

    const newMentee = new Mentee({ name, email, goal });
    await newMentee.save();

    const userMail = {
  from: `"MentorX" <${GMAIL_USER}>`,
  to: email,
  subject: "🚀 Welcome to MentorX — Your Journey Starts Here!",
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f8f9fb; padding: 25px;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
        <h2 style="color: #007bff;">Hi ${name}, Welcome to MentorX! 👋</h2>
        <p style="font-size: 16px; color: #333;">
          We're thrilled to have you onboard! Your goal is: 
          <b style="color: #007bff;">${goal}</b>.
        </p>
        <p style="font-size: 15px; color: #555;">
          Our expert mentors will guide you through personalized learning plans, resources, and live sessions to help you achieve your goal efficiently. 
          Make sure to regularly check your dashboard for updates and mentor messages.
        </p>
        <ul style="font-size: 15px; color: #555;">
          <li>📌 Access curated resources for your goal</li>
          <li>📌 Track your progress step by step</li>
          <li>📌 Connect with mentors for guidance</li>
        </ul>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://mentorx.com/dashboard" 
             style="background-color: #007bff; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
             Go to Your Dashboard
          </a>
        </div>
        <p style="font-size: 13px; color: #777; margin-top: 20px;">
          We’re excited to support you on this journey!<br/>
          — The MentorX Team 💼
        </p>
      </div>
    </div>
  `,
};


    const adminMail = {
      from: `"MentorX Bot" <${GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `📩 New Join Request from ${name}`,
      html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Goal: ${goal}</p>`,
    };

    await Promise.all([sendEmail(userMail), sendEmail(adminMail)]);

    res.status(201).json({
      message: "✅ Applicarion received! We'll be in touch soon.",
      data: newMentee,
    });
  } catch (err) {
    console.error("❌ Get Started Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const mentees = await Mentee.find().sort({ createdAt: -1 });
    res.status(200).json(mentees);
  } catch (err) {
    console.error("❌ Get Mentees Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
