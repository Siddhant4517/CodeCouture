import connectDb from "../../../../middleware/mongoose";
import Product from "../../../../models/Product";

export async function GET(req) {
  await connectDb(); // Ensure the database is connected

  try {
    // Fetch all products from the database
    let products = await Product.find();

    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ error: "No products found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Structure the product data, including variants
    let formattedProducts = products.map((product) => {
      const {
        _id,
        title,
        slug,
        desc,
        img,
        category,
        price,
        availableQty,
        variants,
      } = product.toObject();

      return {
        _id,
        title,
        slug,
        desc,
        img,
        category,
        price,
        availableQty,
        variants: variants.map((variant) => ({
          color: variant.color,
          sizes: variant.sizes,
        })), // Format variants data
      };
    });

    return new Response(JSON.stringify({ products: formattedProducts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET Error:", error.message); // Log the error for debugging
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
