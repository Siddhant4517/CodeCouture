"use client"; // Ensure this is a client-side component

import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const PincodeCheck = () => {
  const [pincode, setPincode] = useState("");
  const [message, setMessage] = useState("");
  const [locationInfo, setLocationInfo] = useState(null); // Holds location and state info
  const [messageColor, setMessageColor] = useState("text-gray-500"); // Default color

  const handlePincodeSubmit = async (e) => {
    e.preventDefault();
    if (!pincode) return;

    try {
      const response = await fetch(`/api/pincode?pincode=${pincode}`);
      const data = await response.json();

      if (data.available) {
        setMessage("Yay! We can deliver to this pincode.");
        setMessageColor("text-green-500");
        setLocationInfo({ location: data.location, state: data.state }); // Set location info

        toast.success("Yes, we can deliver to this pincode", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setMessage("Sorry, we cannot deliver to this pincode.");
        setMessageColor("text-red-500");
        setLocationInfo(null); // Clear location info on failure

        toast.error("Cannot deliver to this pincode!", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      setMessage("An error occurred while checking the pincode.");
      setMessageColor("text-red-500");
      setLocationInfo(null); // Clear location info on error
    }
  };

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
      />
      <div className="p-5">
        <h2 className="text-xl font-bold mb-4">Check Delivery Availability</h2>
        <form onSubmit={handlePincodeSubmit} className="flex items-center">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter your pincode"
            className="border border-gray-300 p-2 rounded mr-2"
          />
          <button type="submit" className="bg-pink-500 text-white p-2 rounded">
            Check
          </button>
        </form>
        {message && <p className={`mt-4 ${messageColor}`}>{message}</p>}
      </div>
    </>
  );
};

export default PincodeCheck;
