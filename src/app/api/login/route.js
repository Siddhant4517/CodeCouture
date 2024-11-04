import connectDb from "../../../../middleware/mongoose";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDb();

  try {
    const { email, password } = await req.json();

    // Validate incoming data
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sign the JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Access JWT secret here
      { expiresIn: "1h" } // Set token expiration time
    );

    // Send token to the client
    return new Response(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Login Error:", error.message);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
