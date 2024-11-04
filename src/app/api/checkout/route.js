import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { customerId, amount, cartItems } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: Object.keys(cartItems).map((key) => ({
        price_data: {
          currency: "inr",
          product_data: { name: cartItems[key].name },
          unit_amount: cartItems[key].price * 100, // Stripe requires amount in paise
        },
        quantity: cartItems[key].qty,
      })),
      customer_email: customerId,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
