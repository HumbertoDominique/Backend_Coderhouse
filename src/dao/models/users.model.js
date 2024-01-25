import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  roll: {
    type: String,
    default: "usuario",
  },
});

export const userModel = mongoose.model("users", userSchema);
