// app/api/signup/route.js
import connectDb from "../../../../middleware/mongoose"; // Adjust path if needed
import User from "../../../../models/User"; // Adjust path according to your structure
import bcrypt from "bcryptjs"; // Use bcryptjs instead of bcrypt for compatibility with Next.js

export async function POST(req) {
  await connectDb(); // Connect to the database

  try {
    // Parse the incoming JSON request body
    const { name, email, password } = await req.json();

    // Validate incoming data
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          error: "All fields are required: name, email, password.",
        }),
        {
          status: 400, // Bad Request
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User with this email already exists." }),
        {
          status: 409, // Conflict
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save(); // Save the user to the database

    return new Response(
      JSON.stringify({ message: "User created successfully." }),
      {
        status: 201, // Created
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Signup Error:", error.message);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500, // Internal Server Error
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
