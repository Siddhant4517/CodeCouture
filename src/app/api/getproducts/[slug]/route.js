import connectDb from "../../../../../middleware/mongoose"; // Adjust the path if necessary
import Product from "../../../../../models/Product"; // Adjust the path if necessary

export async function GET(req, { params }) {
  await connectDb(); // Ensure the database is connected

  const { slug } = params; // Extract the slug from the URL parameters

  try {
    // Fetch the product from the database using the slug
    const product = await Product.findOne({ slug });

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ product }), {
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
