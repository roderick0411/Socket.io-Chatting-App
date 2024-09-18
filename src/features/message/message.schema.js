import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const messageModel = mongoose.model("Message", messageSchema);
