import connectDb from "../../../../middleware/mongoose";
import Product from "../../../../models/Product";

// PUT handler to update a product
export async function PUT(req) {
  await connectDb(); // Ensure the database is connected

  try {
    const body = await req.json(); // Parse the JSON body
    const { _id, ...updateData } = body;

    if (!_id) {
      return new Response(JSON.stringify({ error: "Product ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find the product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });

    if (!updatedProduct) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: "Product updated successfully",
        product: updatedProduct,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("PUT Error:", error.message); // Log the error for debugging
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
