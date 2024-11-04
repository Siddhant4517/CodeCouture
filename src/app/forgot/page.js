"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Forgot = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/"); // Push to home if logged in
    } else {
      setIsCheckingAuth(false); // Allow rendering login form if not authenticated
    }
  }, [router]);

  if (isCheckingAuth) return null;

  return (
    <div>
      <section className="forgot">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto ">
          <Link
            href="/"
            className="flex items-center mb-6 text-2xl font-semibold text-black"
          >
            <img className="w-25 h-14 mr-2" src="logo.png" alt="logo" />
          </Link>
          <div className="w-full p-6 bg-pink-300 rounded-lg shadow dark:border md:mt-0 sm:max-w-md  sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-black md:text-2xl ">
              Change Password
            </h2>
            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="name@company.com"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Confirm password
                </label>
                <input
                  type="confirm-password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  required=""
                />
              </div>
              <div className="flex items-start">
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="newsletter"
                    className=" text-black font-semibold hover:underline"
                  >
                    <Link href="/login">
                      <span>Login Here</span>
                    </Link>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300  rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 font-bold"
              >
                Reset password
              </button>
            </form>
          </div>
        </div>
      </section>
      /
    </div>
  );
};

export default Forgot;
