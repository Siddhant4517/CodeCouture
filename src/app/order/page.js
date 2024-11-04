"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Order = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`/api/order/${orderId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch order details");
          }
          const data = await response.json();
          setOrderDetails(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!orderDetails) {
    return <div>No order found</div>;
  }

  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Wear The Code
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                Order Id: #{orderId}
              </h1>
              <div className="flex mb-4">
                <a className="flex-grow border-b-2 text-center py-2 text-lg px-1">
                  Item Description
                </a>
                <a className="flex-grow border-b-2 text-center border-gray-300 py-2 text-lg px-1">
                  Quantity
                </a>
                <a className="flex-grow border-b-2 text-center border-gray-300 py-2 text-lg px-1">
                  Item Total
                </a>
              </div>
              {/* Map through products to display them */}
              {(orderDetails.products || []).map((product) => (
                <div
                  key={product._id}
                  className="flex border-t border-b mb-6 border-gray-200 py-2"
                >
                  <span className="text-gray-500 text-center">
                    {product.name} ({product.variant}) - {product.size}
                  </span>
                  <span className="ml-auto mr-auto text-gray-900 text-center">
                    {product.quantity}
                  </span>
                  <span className="ml-auto mr-auto text-gray-900 text-center">
                    ₹{product.price * product.quantity}
                  </span>
                </div>
              ))}
              <div className="flex flex-col">
                <span className="title-font font-medium text-2xl text-gray-900">
                  SubTotal: ₹{(orderDetails.amount || 0).toFixed(2)}
                </span>

                <div className="my-6">
                  <button className="flex text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src="https://dummyimage.com/400x400"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Order;
