import Booking from "../models/Booking.js";

export const bookSlot = async (req, res) => {
  try {
    const { name, phone, email, service, date, timeSlot } = req.body;

    if (!name || !phone || !email || !service || !date || !timeSlot) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 Check for duplicate booking
    const existing = await Booking.findOne({ date, timeSlot, service });
    if (existing) {
      return res.status(400).json({ message: "Slot already booked!" });
    }

    // 💾 Save booking
    const booking = new Booking({
      name,
      phone,
      email,
      service,
      date,
      time,
    });
    await booking.save();

    return res.status(201).json({ message: "Booking successful!", booking });
  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
