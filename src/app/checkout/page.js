"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Checkout = () => {
  const { cart, subTotal, addToCart, removeFromCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [disabled, setDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to fetch city and state based on pincode
  const fetchCityState = async (pincode) => {
    try {
      const response = await fetch(`/api/pincode?pincode=${pincode}`);
      const data = await response.json();

      if (data.available) {
        setFormData((prevData) => ({
          ...prevData,
          city: data.location,
          state: data.state,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          city: "",
          state: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching city and state:", error);
      setFormData((prevData) => ({
        ...prevData,
        city: "",
        state: "",
      }));
    }
  };

  // Effect to validate all fields and enable/disable the Pay button
  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    setDisabled(!allFieldsFilled);
  }, [formData]);

  // Effect to fetch city and state when pincode is a valid 6-digit number
  useEffect(() => {
    const isValidPincode = /^[0-9]{6}$/.test(formData.pincode);
    if (isValidPincode) {
      fetchCityState(formData.pincode);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        city: "",
        state: "",
      }));
    }
  }, [formData.pincode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const orderId = `order_${new Date().getTime()}`;

      const { data } = await axios.post("/api/stripe", {
        cart: Object.values(cart),
        subTotal,
        orderId,
        email: formData.email,
        name: formData.name,
        address: formData.address,
        pincode: formData.pincode,
        phone: formData.phone,
      });

      if (data.id) {
        const result = await stripe.redirectToCheckout({ sessionId: data.id });

        if (result.error) {
          setErrorMessage(result.error.message);
          console.error("Stripe checkout error:", result.error.message);
        }
      } else {
        setErrorMessage("Failed to create Stripe session.");
        console.error("Stripe session ID missing in response");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.error === "Cart data has been tampered with."
      ) {
        // Clear cart if tampering is detected
        localStorage.removeItem("cart");
        localStorage.removeItem("subTotal");
        localStorage.removeItem("cartHash");
        alert(
          "Your cart data seems to be tampered with. Please try adding items again."
        );
        router.push("/"); // Redirect user back to homepage
      } else {
        setErrorMessage("Payment initiation failed. Please try again.");
        console.error("Payment initiation failed:", error);
      }
    }
  };

  return (
    <div className="container m-auto px-2">
      <h1 className="my-6 text-xl font-bold text-center">Checkout</h1>

      <h2 className="font-semibold text-xl">1. Delivery Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {["name", "email", "phone", "address", "pincode", "city", "state"].map(
          (field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="text-sm text-gray-600 capitalize"
              >
                {field}
              </label>
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "phone" || field === "pincode"
                    ? "tel"
                    : "text"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border rounded py-2 px-3"
                required
              />
            </div>
          )
        )}
      </div>

      <h2 className="font-semibold text-xl mt-6">2. Review Cart Items & Pay</h2>
      <div className="p-8 py-10 bg-pink-200 mt-4">
        <h2 className="font-bold text-xl">Shopping Cart</h2>
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length === 0 && <div>No items in the cart</div>}
          {Object.entries(cart).map(([key, item]) => (
            <li key={key}>
              <div className="flex my-5 items-center">
                <div className="w-1/2">
                  {item.name} - ₹{item.price} each
                </div>
                <div className="ml-auto flex items-center space-x-4">
                  <FaCircleMinus
                    className="cursor-pointer text-pink-500"
                    onClick={() => removeFromCart(key, 1)}
                  />
                  <span>{item.qty}</span>
                  <FaCirclePlus
                    className="cursor-pointer text-pink-500"
                    onClick={() =>
                      addToCart(
                        key,
                        1,
                        item.price,
                        item.name,
                        item.size,
                        item.variant
                      )
                    }
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="font-bold my-2">SubTotal: ₹{subTotal}</div>
        <button
          onClick={handlePayment}
          className="bg-pink-500 text-white px-4 py-2 rounded disabled:bg-pink-400"
          disabled={disabled}
        >
          Pay
        </button>
        {errorMessage && (
          <div className="text-red-500 mt-4">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
