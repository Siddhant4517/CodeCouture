// app/api/create-order/route.js
import { NextResponse } from "next/server";
import Order from "../../../../models/Order"; // Import your order model
import connectDB from "../../../../utils/db"; // MongoDB connection function

export async function POST(request) {
  await connectDB(); // Connect to your MongoDB database

  const { email, address, cart, amount, status } = await request.json();

  try {
    const newOrder = new Order({
      email,
      address: JSON.stringify(address),
      products: cart.map((item) => ({
        productId: item.id,
        quantity: item.qty,
      })),
      amount,
      status,
    });

    const savedOrder = await newOrder.save();
    return NextResponse.json({ orderId: savedOrder._id });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
