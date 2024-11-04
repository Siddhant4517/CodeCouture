"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoCartOutline, IoBagCheckOutline } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import { useCart } from "@/app/context/CartContext";
import { FiLogIn } from "react-icons/fi";
const Navbar = () => {
  const { user, cart, addToCart, removeFromCart, clearCart, subTotal, logout } =
    useCart();
  const ref = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleCart = () => {
    ref.current.classList.toggle("translate-x-full");
    ref.current.classList.toggle("translate-x-0");
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky top-0 z-10 bg-white h-[190px] lg:h-[65px]">
      <div className="logo mx-4 my-2 mb-3">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={175} height={75} />
        </Link>
      </div>
      <div className="nav">
        <ul className="flex flex-col md:flex-row items-center font-bold space-x-4 md:text-md">
          <Link href="/tshirts">
            <li>Tshirts</li>
          </Link>
          <Link href="/hoodies">
            <li>Hoodies</li>
          </Link>
          <Link href="/stickers">
            <li>Stickers</li>
          </Link>
          <Link href="/mugs">
            <li>Mugs</li>
          </Link>
        </ul>
      </div>
      <div className="cart flex space-x-4 absolute items-center right-0 top-5 mx-5 md:text-xl cursor-pointer">
        <span
          onMouseOver={() => {
            setDropdownOpen(true);
          }}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          {dropdownOpen && (
            <div
              onMouseOver={() => {
                setDropdownOpen(true);
              }}
              onMouseLeave={() => setDropdownOpen(false)}
              className="absolute right-8 top-3 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-lg z-20"
            >
              <ul className="flex flex-col">
                <Link href="/myaccount">
                  <li className="px-4 py-2 hover:bg-gray-100">Account</li>
                </Link>
                <Link href="/orders">
                  <li className="px-4 py-2 hover:bg-gray-100">Orders</li>
                </Link>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
          {user.value && <FiLogIn />}
        </span>
        {!user.value && (
          <Link href="/login">
            <button className="flex justify-center items-center ml-2 text-white bg-pink-500 border-0 py-1 px-2 focus:outline-none lg:text-lg lg:px-4 hover:bg-pink-600 rounded text-sm ">
              Login
            </button>
          </Link>
        )}

        <IoCartOutline onClick={toggleCart} />
      </div>
      <div
        ref={ref}
        className={`w-82 h-[100vh] sideCart absolute p-8 py-10 bg-pink-200 top-0 right-0 transform transition-transform ${
          Object.keys(cart).length !== 0 ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="font-bold text-xl">Shopping Cart</h2>
        <span
          onClick={toggleCart}
          className="absolute top-4 right-4 text-xl cursor-pointer"
        >
          <IoIosCloseCircle className="text-pink-500" />
        </span>
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length === 0 ? (
            <div className="mt-4 font-normal">No items in the cart</div>
          ) : (
            Object.keys(cart).map((k) => (
              <li key={k}>
                <div className="item flex my-5 items-center">
                  <div className="w-2/3 font-semibold">
                    {cart[k]?.name} ({cart[k].size}/{cart[k].variant})
                  </div>
                  <div className="flex space-x-2 font-semibold items-center justify-center w-1/3 text-md">
                    <FaCircleMinus
                      className="text-pink-500 cursor-pointer"
                      onClick={() => removeFromCart(k, 1)}
                    />
                    <span>{cart[k]?.qty}</span>
                    <FaCirclePlus
                      className="text-pink-500 cursor-pointer"
                      onClick={() =>
                        addToCart(
                          k,
                          1,
                          cart[k]?.price,
                          cart[k]?.name,
                          cart[k]?.size,
                          cart[k]?.variant
                        )
                      }
                    />
                  </div>
                </div>
              </li>
            ))
          )}
        </ol>
        <div className="font-bold my-2">SubTotal: ₹{subTotal}</div>
        <div className="flex">
          <Link href="/checkout">
            <button className="flex justify-center items-center mx-2 mt-6 text-white bg-pink-500 border-0 py-2 px-4 focus:outline-none hover:bg-pink-600 rounded text-md">
              <IoBagCheckOutline className="flex" />
              Checkout
            </button>
          </Link>
          <button
            onClick={clearCart}
            className="flex justify-center items-center mt-6 text-white bg-pink-500 border-0 py-2 px-4 focus:outline-none hover:bg-pink-600 rounded text-md mx-2"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
