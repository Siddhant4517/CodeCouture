"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MyAccount = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = !localStorage.getItem("token");
    if (token) {
      router.push("/"); // Push to home if logged in
    } else {
      setIsCheckingAuth(false); // Allow rendering login form if not authenticated
    }
  }, [router]);

  if (isCheckingAuth) return null;
  return <div>MyAccount</div>;
};

export default MyAccount;
