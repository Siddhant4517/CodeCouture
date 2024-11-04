// app/api/orders/route.js
import { NextResponse } from "next/server";
import Order from "../../../../models/Order"; // Import your order model
import connectDB from "../../../../utils/db"; // A utility function to connect to MongoDB

export async function POST(request) {
  try {
    await connectDB(); // Connect to MongoDB

    const { items, email, address, amount } = await request.json();

    // Create a new order with 'Pending' status
    const newOrder = new Order({
      email,
      address: JSON.stringify(address),
      amount,
      products: items.map((item) => ({
        productId: item.id,
        quantity: item.qty,
      })),
      status: "Pending",
    });

    const savedOrder = await newOrder.save();
    return NextResponse.json(savedOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
