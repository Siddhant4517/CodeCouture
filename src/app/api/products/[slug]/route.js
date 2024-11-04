import connectDb from "../../../../../middleware/mongoose";
import Product from "../../../../../models/Product";

export async function GET(request) {
  await connectDb(); // Ensure the database is connected

  try {
    const products = await Product.find({}); // Fetch all products

    if (!products.length) {
      return new Response(JSON.stringify({ error: "No products found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Format products data to return the variants with their colors and sizes
    const formattedProducts = products.map((product) => ({
      title: product.title,
      slug: product.slug,
      desc: product.desc,
      img: product.img,
      category: product.category,
      price: product.price,
      variants: product.variants.map((variant) => ({
        color: variant.color,
        sizes: variant.sizes.map((sizeObj) => ({
          size: sizeObj.size,
          availableQty: sizeObj.availableQty,
        })),
      })),
    }));

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
