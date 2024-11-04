// app/api/order/[orderId]/route.js
import { NextResponse } from "next/server";
import Order from "../../../../../models/Order"; // Import your order model
import connectDB from "../../../../../utils/db"; // MongoDB connection function

export async function GET(request, { params }) {
  const { orderId } = params;

  await connectDB(); // Connect to your MongoDB database

  try {
    // Use findOne with orderId to search by your custom order ID field
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
