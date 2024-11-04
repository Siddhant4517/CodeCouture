import connectDb from "../../../../middleware/mongoose";
import Product from "../../../../models/Product";

export async function POST(req) {
  await connectDb(); // Ensure the database is connected

  try {
    const body = await req.json(); // Parse the JSON body
    if (!Array.isArray(body)) {
      throw new Error("Invalid request body, expected an array");
    }

    // Iterate over the array of products
    for (let i = 0; i < body.length; i++) {
      const {
        title,
        slug,
        desc,
        img,
        category,
        price,
        availableQty,
        variants, // Now expecting the variants field (array of objects containing color and sizes)
      } = body[i];

      // Validate required fields
      if (!title || !slug || !price || !variants || variants.length === 0) {
        throw new Error(`Missing required fields in item at index ${i}`);
      }

      // Validate each variant
      for (let variant of variants) {
        if (!variant.color || !variant.sizes || variant.sizes.length === 0) {
          throw new Error(`Missing variant data in item at index ${i}`);
        }
      }

      // Create the new Product object
      let newProduct = new Product({
        title,
        slug,
        desc,
        img,
        category,
        price,
        availableQty,
        variants, // Save the variants array directly
      });

      // Save the product to the database
      await newProduct.save();
    }

    return new Response(
      JSON.stringify({ message: "Products added successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("POST Error:", error.message); // Log the error for debugging
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
