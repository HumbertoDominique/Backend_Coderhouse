import mongoose, { mongo } from "mongoose";

export const messageSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  message: {
    type: String,
  },
});

export const messageModel = mongoose.model("messages", messageSchema);
