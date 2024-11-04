"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "@/app/context/CartContext";

const Login = () => {
  const { login } = useCart();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/"); // Push to home if logged in
    } else {
      setIsCheckingAuth(false); // Allow rendering login form if not authenticated
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    name === "email" ? setEmail(value) : setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.", {
        position: "bottom-center",
        autoClose: 1000,
        theme: "light",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const response = await res.json();
      if (res.ok) {
        localStorage.setItem("token", response.token);
        login(response.token);
        toast.success("Logged in successfully", {
          position: "bottom-center",
          autoClose: 1000,
          theme: "light",
        });
        setTimeout(() => router.push("/"), 1500);
      } else {
        toast.error(response.error || "Invalid credentials", {
          position: "bottom-center",
          autoClose: 1000,
          theme: "light",
        });
      }
    } catch {
      toast.error("Network error, please try again.", {
        position: "bottom-center",
        autoClose: 1000,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  // If still checking for authentication, don't show the login form
  if (isCheckingAuth) return null;

  return (
    <div>
      <ToastContainer />
      <section className="flex flex-col items-center justify-center px-6 py-8">
        <Link href="/" className="mb-6 text-2xl font-semibold text-gray-900">
          <img className="w-25 h-14 mr-2" src="/logo.png" alt="logo" />
        </Link>
        <div className="w-full max-w-md p-6 bg-pink-300 rounded-lg shadow">
          <h1 className="text-xl font-bold mb-4">Sign in to your account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Your email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg"
                placeholder="••••••••"
                required
              />
            </div>
            <p className="text-sm mt-4">
              <Link href="/forgot" className="text-primary-600 hover:underline">
                Forgot Password?
              </Link>
            </p>
            <button
              type="submit"
              className="w-full bg-primary-600 text-black px-5 py-2.5 rounded-lg border hover:bg-slate-100"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className="text-sm mt-4">
              Don’t have an account yet?{" "}
              <Link href="/signup" className="text-primary-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
