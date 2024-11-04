"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken"; // Import jsonwebtoken library

const Orders = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [orders, setOrders] = useState([]);
  const [tokenError, setTokenError] = useState(null); // Separate state for token errors
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Retrieved Token:", token);

    if (!token) {
      setTokenError("No token found. Redirecting to login...");
      setTimeout(() => router.push("/"), 2000);
      return;
    }

    setIsCheckingAuth(false);

    try {
      // Decode token without verifying signature
      const decoded = jwt.decode(token);
      console.log("Decoded Token:", decoded);

      if (!decoded || !decoded.email) {
        throw new Error("Decoded token missing email or invalid format");
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        throw new Error("Token has expired");
      }

      fetchOrders(decoded.email);
    } catch (err) {
      setTokenError(`Token error: ${err.message}`);
    }
  }, [router]);

  const fetchOrders = async (email) => {
    try {
      const response = await fetch("/api/orders/fetchOrders", {
        method: "GET",
        headers: {
          Authorization: email,
        },
      });

      if (!response.ok) {
        // Silently fail and assume no orders if fetch fails
        setOrders([]);
        return;
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      // In case of a fetch error, assume no orders
      setOrders([]);
    }
  };

  const handleRowClick = (orderId) => {
    router.push(`/order?orderId=${orderId}`); // Redirect to the order detail page
  };

  if (isCheckingAuth) return null;

  return (
    <div>
      <h1 className="text-xl p-8 text-center">My Orders</h1>
      {tokenError && (
        <div className="text-red-500 text-center">{tokenError}</div>
      )}

      {!orders.length ? (
        <div className="text-center px-6 py-4">You have no orders.</div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-white-500 light:text-white-400">
            <thead className="text-xs text-white-700 uppercase bg-white-50 light:bg-white-700 light:text-white-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Color
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) =>
                order.products.map((product) => (
                  <tr
                    key={product._id}
                    onClick={() => handleRowClick(order.orderId)} // Add click handler
                    className="bg-white border-b light:bg-white-800 light:border-white-700 cursor-pointer hover:bg-gray-200" // Added hover effect for better UX
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white-900 whitespace-nowrap light:text-white"
                    >
                      {product.name}
                    </th>
                    <td className="px-6 py-4">{product.variant}</td>
                    <td className="px-6 py-4">Clothing</td>
                    <td className="px-6 py-4">₹{product.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
