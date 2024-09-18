import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  fileName: String,
});
