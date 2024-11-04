// utils/db.js
import mongoose from "mongoose";

let isConnected = false; // Track the connection state

export default async function connectDB() {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1; // Verify connection status
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
