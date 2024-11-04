"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query parameters
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const paymentStatus = searchParams.get("payment"); // Get 'payment' query param

    if (paymentStatus !== "success") {
      // Redirect if the 'payment' query param is not valid
      router.push("/");
    } else {
      // Stop loading once validated
      setIsLoading(false);
    }
  }, [router, searchParams]);

  // Prevent rendering until loading is complete
  if (isLoading) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50">
      <div className="text-center bg-white p-10 rounded shadow-lg">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for your purchase! Your order is on its way.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
