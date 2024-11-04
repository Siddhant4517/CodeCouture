"use client"; // Ensure this is a client-side component
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "next/navigation"; // For handling routing and fetching the slug
import PincodeCheck from "@/app/pincode/page";
import { useCart } from "@/app/context/CartContext";

const ProductDetail = () => {
  const { slug } = useParams(); // Fetch the slug from the dynamic route
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null); // Store the selected color
  const [selectedSize, setSelectedSize] = useState(""); // Store the selected size
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, buyNow } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return; // Prevent fetch until slug is available

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getproducts/${slug}`
        );
        const data = await response.json();

        if (data.product) {
          setProduct(data.product);
          console.log("Fetched product:", data.product); // Log the product object

          // Set the initial selected color to the first variant's color (if category is not sticker or mug)
          if (
            data.product.category.toLowerCase() !== "sticker" &&
            data.product.category.toLowerCase() !== "mug"
          ) {
            setSelectedColor(data.product.variants[0]?.color);
          }
        } else {
          throw new Error("Product not found");
        }

        setLoading(false);
      } catch (error) {
        setError("Error fetching product: " + error.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleColorChange = (newColor) => {
    setSelectedColor(newColor); // Update the selected color
    setSelectedSize(""); // Reset the selected size when color changes
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value); // Update the selected size
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Find the current variant based on the selected color
  const currentVariant = product?.variants?.find(
    (variant) => variant.color === selectedColor
  );

  // Check if the product category is "sticker" or "mug"
  const isStickerOrMug = ["sticker", "mug"].includes(
    product.category.toLowerCase()
  );

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      <div>
        {product && (
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto  ">
              <div className="lg:w-4/5 mx-auto flex flex-wrap justify-center">
                <img
                  alt={product.title}
                  className="lg:w-1/4 w-full lg:h-[60vh] h-64 object-cover object-center rounded"
                  src={product.img}
                />
                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 ">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    {product.category.toUpperCase()}
                  </h2>
                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                    {product.title},{" "}
                    {selectedColor && `${selectedColor} (${selectedSize})`}
                  </h1>
                  <p className="leading-relaxed">{product.desc}</p>
                  <p className="mt-4 text-2xl">₹{product.price}</p>

                  {/* Conditionally render Sizes and Colors if category is NOT sticker or mug */}
                  {!isStickerOrMug && (
                    <>
                      {/* Available Sizes for Selected Color */}
                      <div className="mt-4">
                        <h3 className="text-lg font-medium">
                          Available Sizes for {selectedColor}:
                        </h3>
                        <div className="flex">
                          <select
                            value={selectedSize}
                            onChange={handleSizeChange}
                            className="border border-gray-300 px-2 py-1 rounded"
                          >
                            <option value="" disabled>
                              Select a size
                            </option>
                            {currentVariant?.sizes?.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Available Colors */}
                      <div className="mt-4">
                        <h3 className="text-lg font-medium">
                          Available Colors:
                        </h3>
                        <div className="flex">
                          {product.variants.map((variant) => (
                            <span
                              key={variant.color}
                              className={`inline-block border-2 border-gray-300 w-6 h-6 rounded-full mr-1 cursor-pointer ${
                                variant.color === selectedColor
                                  ? "ring-2 ring-pink-500"
                                  : ""
                              }`}
                              style={{ backgroundColor: variant.color }} // Set the actual color
                              onClick={() => handleColorChange(variant.color)} // Change the color on click
                              title={variant.color} // Show color name on hover
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="p-2 w-full flex flex-row">
                    <button
                      onClick={() =>
                        buyNow(
                          `${slug}-${selectedColor}-${selectedSize}`, // Generate a unique key for the variant
                          1, // Quantity
                          product.price, // Price
                          product.title, // Product Title
                          selectedSize, // Selected Size
                          selectedColor
                        )
                      }
                      className="flex mr-10 text-white bg-pink-500 border-0 py-2 px-8 focus:outline-none hover:bg-pink-600 rounded text-lg"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() =>
                        addToCart(
                          `${slug}-${selectedColor}-${selectedSize}`, // Generate a unique key for the variant
                          1, // Quantity
                          product.price, // Price
                          product.title, // Product Title
                          selectedSize, // Selected Size
                          selectedColor // Selected Color
                        )
                      }
                      className="flex ml-10 text-white bg-pink-500 border-0 py-2 px-8 focus:outline-none hover:bg-pink-600 rounded text-lg"
                    >
                      AddToCart
                    </button>
                  </div>
                  <PincodeCheck />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
