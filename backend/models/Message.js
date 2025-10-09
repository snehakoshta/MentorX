// backend/models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      enum: ["student", "mentor"],
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Check if model already exists (prevents OverwriteModelError)
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
