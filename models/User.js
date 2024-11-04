// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Changed 'require' to 'required'
    email: { type: String, required: true }, // Changed 'require' to 'required'
    password: { type: String, required: true }, // Changed 'require' to 'required'
  },
  { timestamps: true }
);

// Prevent model recompilation errors in development
export default mongoose.models.User || mongoose.model("User", UserSchema);
