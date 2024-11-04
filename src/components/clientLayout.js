"use client";

import { useState, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";
import Navbar from "@/components/navbar";
import Footer from "./footer";
import { CartProvider } from "../app/context/CartContext"; // Adjust the path if needed
import { useRouter, usePathname } from "next/navigation"; // Use both hooks

export default function ClientLayout({ children }) {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const pathname = usePathname(); // Track the current route

  useEffect(() => {
    const handleRouteChangeStart = () => setProgress(40);
    const handleRouteChangeComplete = () => setProgress(100);

    // Trigger the loading bar on path change
    handleRouteChangeStart(); // Start the loading bar immediately

    // Complete the loading bar when the route finishes changing
    const timer = setTimeout(() => handleRouteChangeComplete(), 500); // Delay to simulate loading

    return () => {
      clearTimeout(timer); // Clean up timer on unmount or path change
    };
  }, [pathname]); // Re-run effect every time the path changes

  return (
    <CartProvider>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Navbar />
      {children}
      <Footer />
    </CartProvider>
  );
}
