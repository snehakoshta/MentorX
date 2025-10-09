// ----------------- Imports -----------------
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import OpenAI from "openai";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

// Routes
import bookingRoutes from "./routes/booking.js";
import getStartedRoutes from "./routes/getstart.js";
import paymentRoute from "./routes/payment.js";
import contactRoutes from "./routes/contact.js";


dotenv.config();
const app = express();

// ----------------- Ensure uploads folder exists -----------------
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 'uploads' folder created");
}

// ----------------- Middleware -----------------
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// ----------------- MongoDB Connection -----------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ----------------- OpenAI Setup -----------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ----------------- Attach Routes -----------------
app.use("/api/booking", bookingRoutes);
app.use("/api/get-started", getStartedRoutes);
app.use("/api", paymentRoute);
app.use("/api/contact", contactRoutes); // ✅ Contact route added here

// ----------------- User Schema -----------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  hasPaid: { type: Boolean, default: false },
  profileImage: { type: String, default: "" },
});
const User = mongoose.model("User", userSchema);

// ----------------- JWT Middleware -----------------
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Auth error" });
  }
};

// ----------------- Multer Setup -----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const name = `${req.userId || "anon"}_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PNG/JPEG images are allowed"));
  },
});

// ----------------- Helper: Safe Email Sender -----------------
const sendEmail = async (mailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", mailOptions.to);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};

// ----------------- Register -----------------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasPaid: user.hasPaid,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- Login -----------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasPaid: user.hasPaid,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- Get Current User -----------------
app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("❌ /api/me error:", err);
    res.status(500).json({ error: "Error fetching user" });
  }
});

// ----------------- Profile Image Upload -----------------
app.post(
  "/api/profile/upload",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.profileImage = `/uploads/${req.file.filename}`;
      await user.save();

      console.log("✅ Uploaded file:", req.file.filename);

      res.json({
        message: "Profile image updated",
        profileImage: user.profileImage,
      });
    } catch (err) {
      console.error("❌ Profile upload error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ----------------- Payment APIs -----------------
app.get("/api/payment-status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ hasPaid: user?.hasPaid || false });
  } catch (err) {
    console.error("❌ payment-status error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/payment-success", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.hasPaid = true;
    await user.save();

    res.json({
      message: "Payment recorded",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasPaid: user.hasPaid,
      },
    });
  } catch (err) {
    console.error("❌ Payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- Messages & OpenAI -----------------
const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["student", "mentor"], required: true },
  text: { type: String, required: true },
  userId: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

app.get("/api/messages", async (req, res) => {
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

app.post("/api/messages", async (req, res) => {
  try {
    const { sender, text, userId } = req.body;
    if (!sender || !text)
      return res.status(400).json({ msg: "Sender and text required" });

    const message = new Message({ sender, text, userId: userId || null });
    await message.save();

    if (sender === "student") {
      try {
        const aiResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: text }],
          max_tokens: 300,
        });

        const answer = aiResponse.choices[0].message.content;
        const mentorMessage = new Message({
          sender: "mentor",
          text: answer,
          userId: userId || null,
        });
        await mentorMessage.save();

        return res.json({ student: message, mentor: mentorMessage });
      } catch (err) {
        console.error("❌ OpenAI Error:", err.message);
        return res.json({ student: message });
      }
    }

    res.json({ student: message });
  } catch (err) {
    console.error("❌ Message save error:", err);
    res.status(500).json({ msg: "Error saving message" });
  }
});

app.delete("/api/messages", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    await Message.deleteMany(filter);
    res.status(200).json({ message: "Messages cleared successfully" });
  } catch (err) {
    console.error("❌ Clear messages error:", err);
    res.status(500).json({ message: "Error clearing messages" });
  }
});

// ----------------- Payment Notification -----------------
app.post("/api/notify-payment", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "Name and email are required" });

    // Notify admin
    sendEmail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "New Payment Received",
      text: `${name} (${email}) has completed the payment.`,
    });

    // Confirm to student
    sendEmail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Payment Confirmation",
      text: `Hi ${name},\n\nThank you for your payment! You now have access to the LeetCode DSA sheet.\n\nBest,\nSneha`,
    });

    res.status(200).json({ message: "Emails processing started (server won’t crash if fail)." });
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).json({ message: "Error processing payment notification" });
  }
});

// ----------------- Health Check & 404 -----------------
app.get("/api/health", (req, res) =>
  res.status(200).json({ message: "Server is running ✅" })
);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
