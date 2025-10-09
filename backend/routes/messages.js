// routes/messages.js
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import Message from "../models/Message.js";

dotenv.config();
const router = express.Router();

// ----------------- OpenAI Setup -----------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ----------------- GET Messages -----------------
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const messages = await Message.find(filter).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("❌ Fetch messages error:", err);
    res.status(500).json({ msg: "Error fetching messages" });
  }
});

// ----------------- POST Message -----------------
router.post("/", async (req, res) => {
  const { sender, text, userId } = req.body;

  if (!sender || !text) {
    return res.status(400).json({ msg: "Sender and text required" });
  }

  try {
    // Save incoming message
    const message = new Message({ sender, text, userId: userId || null });
    await message.save();

    // Generate AI response only if sender is a student
    if (sender === "student") {
      try {
        const aiResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: text }],
          max_tokens: 300,
        });

        const answer =
          aiResponse.choices?.[0]?.message?.content ||
          "Sorry, I couldn't generate a response.";

        const mentorMessage = new Message({
          sender: "mentor",
          text: answer,
          userId: userId || null,
        });

        await mentorMessage.save();

        return res.json({ student: message, mentor: mentorMessage });
      } catch (err) {
        console.error("❌ OpenAI Error:", err.response?.data || err.message);
        return res.json({ student: message }); // fallback without mentor reply
      }
    }

    // If sender is not student, return only the saved message
    res.json({ student: message });
  } catch (err) {
    console.error("❌ Message save error:", err);
    res.status(500).json({ msg: "Error saving message" });
  }
});

export default router;
