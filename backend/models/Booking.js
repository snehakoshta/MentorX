import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    service: String,
    date: String,
    timeSlot: String,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
