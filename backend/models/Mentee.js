// models/Mentee.js
import mongoose from "mongoose";

const menteeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    goal: { type: String, required: true },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const Mentee = mongoose.model("Mentee", menteeSchema);
export default Mentee;
