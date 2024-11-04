import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "../../../../utils/db"; // Adjust path if necessary
import Order from "../../../../models/Order"; // Adjust path if necessary

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract data from the request body
    const { cart, subTotal, orderId, email, address, pincode, phone } =
      await request.json();

    console.log("Request Data:", { cart, subTotal, email, address, orderId });

    // Prepare Stripe line items from the cart data
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          description: `${item.size || ""} / ${item.variant || ""}`, // Optional size and variant
        },
        unit_amount: item.price * 100, // Amount in paise (for INR)
      },
      quantity: item.qty,
    }));

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_HOST}/order?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST}/cancel`,
      customer_email: email,
      metadata: { orderId }, // Pass orderId in metadata
    });

    // Save the order details in MongoDB
    const newOrder = new Order({
      email,
      orderId, // Use the provided orderId
      paymentInfo: "Payment initiated",
      products: cart.map((item) => ({
        productId: item.id,
        quantity: item.qty,
        name: item.name,
        price: item.price,
        size: item.size,
        variant: item.variant,
      })),
      address: `${address}, ${pincode}`, // Combine address and pincode
      amount: subTotal,
      phone,
      status: "Pending", // Initially set to Pending
    });

    // Save the order document to the database
    await newOrder.save();

    // Return the session ID to the client
    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
