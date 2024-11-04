"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Stickers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getproducts`
        );
        const data = await response.json();

        if (data.products) {
          // Filter products to show only "t-shirt" category
          const filteredProducts = data.products.filter(
            (product) => product.category.toLowerCase() === "sticker"
          );
          setProducts(filteredProducts);
        } else {
          throw new Error("No products found in response");
        }

        setLoading(false);
      } catch (error) {
        setError("Error fetching products: " + error.message);
        setLoading(false);
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto items-center">
          {loading ? (
            <p className="flex items-center">Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="flex flex-wrap -m-4 items-center justify-center">
              {products.map((product) => {
                // Extract all available sizes from variants
                const allSizes = new Set(); // To ensure unique sizes
                const allColors = []; // To store available colors

                product.variants.forEach((variant) => {
                  // Add sizes for each variant
                  variant.sizes.forEach((size) => allSizes.add(size));
                  // Store the color of each variant
                  allColors.push(variant.color);
                });

                return (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="lg:w-1/5 md:w-1/2 cursor-pointer p-4 mx-6 my-4 w-full shadow-lg block relative rounded overflow-hidden"
                  >
                    <img
                      alt={product.title}
                      className="m-auto h-[30vh] md:h-[36vh] block"
                      src={product.img}
                    />
                    <div className="mt-4 text-center md:text-left">
                      <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                        {product.category.toUpperCase()}
                      </h3>
                      <h2 className="text-gray-900 title-font text-lg font-medium">
                        {product.title}
                      </h2>
                      <p className="mt-1">₹{product.price}</p>
                      <p className="mt-1">{product.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Stickers;
