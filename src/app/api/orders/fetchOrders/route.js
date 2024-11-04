// app/api/orders/fetchOrders/route.js
import { NextResponse } from "next/server";
import Order from "../../../../../models/Order"; // Import your order model
import connectDB from "../../../../../utils/db"; // A utility function to connect to MongoDB

export async function GET(request) {
  try {
    await connectDB(); // Connect to MongoDB

    const email = request.headers.get("Authorization"); // Retrieve email from the header

    // Fetch orders based on the email
    const orders = await Order.find({ email });

    if (!orders.length) {
      return NextResponse.json({ message: "No orders found" }, { status: 404 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
