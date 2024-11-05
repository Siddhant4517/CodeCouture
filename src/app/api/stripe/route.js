import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "../../../../utils/db";
import Product from "../../../../models/Product";
import Order from "../../../../models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    await dbConnect();

    const { cart, subTotal, email, address, orderId, pincode, phone } =
      await request.json();

    console.log("Received Request Data:", {
      cart,
      subTotal,
      email,
      address,
      orderId,
    });

    // Calculate the backend subtotal by fetching each product based on its title and variants
    let backendSubTotal = 0;

    for (const item of cart) {
      // Fetch product from database using title, size, and color
      const dbProduct = await Product.findOne({
        title: item.name,
        "variants.color": item.variant,
        "variants.sizes": item.size, // Ensure the size is included in the array of sizes
      });

      if (!dbProduct) {
        throw new Error(
          `Product not found in database: ${item.name}, Size: ${item.size}, Variant: ${item.variant}`
        );
      }

      // Get the price of the found product
      const itemTotalPrice = dbProduct.price * item.qty;
      backendSubTotal += itemTotalPrice;
    }

    // Compare frontend subtotal with backend-calculated subtotal
    if (backendSubTotal !== subTotal) {
      console.error("Cart subtotal mismatch:", {
        frontendSubTotal: subTotal,
        backendSubTotal,
      });
      throw new Error("Cart data has been tampered with.");
    }

    // Prepare Stripe line items from cart data
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          description: `${item.size || ""} / ${item.variant || ""}`,
        },
        unit_amount: item.price * 100,
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
      metadata: { orderId },
    });

    // Save the order details in MongoDB
    const newOrder = new Order({
      email,
      orderId,
      paymentInfo: "Payment initiated",
      products: cart.map((item) => ({
        name: item.name,
        quantity: item.qty,
        size: item.size,
        variant: item.variant,
        price: item.price, // Store the price from the database
      })),
      address: `${address}, ${pincode}`,
      amount: backendSubTotal,
      phone,
      status: "Pending",
    });

    // Save order document to the database
    await newOrder.save();

    // Return the session ID to the client
    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Error in checkout processing:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
