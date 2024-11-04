import Stripe from "stripe";
import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/db";
import Order from "../../../../models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing
  },
};

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");
  const payload = await buffer(request.body); // Get raw body

  let event;

  // Verify the event signature
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  // Handle the event types you're interested in
  if (event.type === "checkout.session.completed") {
    const session = event.data.object; // Retrieve session object
    const orderId = session.metadata.orderId;
    console.log(orderId); // Extract orderId from metadata

    if (!orderId) {
      console.error("No orderId found in session metadata.");
      return NextResponse.json({ error: "No orderId found." }, { status: 400 });
    }

    try {
      await dbConnect(); // Connect to the database
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId }, // Use orderId to find the correct order
        { status: "Paid", paymentInfo: "Payment successful" },
        { new: true } // Return the updated document
      );

      if (!updatedOrder) {
        console.error(`Order with ID ${orderId} not found.`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      console.log(`Order ${orderId} marked as paid.`);
    } catch (error) {
      console.error("Database update failed:", error);
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
