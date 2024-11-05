"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import CryptoJS from "crypto-js"; // Import hashing library

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState(0); // Used to force re-renders
  const router = useRouter();

  // Hash generation for cart validation
  const generateCartHash = (cart, subtotal) => {
    const cartString = JSON.stringify(cart) + subtotal;
    return CryptoJS.SHA256(cartString).toString();
  };

  // Save cart and generate hash
  const saveCart = (myCart) => {
    const subtotal = Object.keys(myCart).reduce(
      (acc, key) => acc + myCart[key].price * myCart[key].qty,
      0
    );

    // Store cart and subtotal
    localStorage.setItem("cart", JSON.stringify(myCart));
    localStorage.setItem("subTotal", subtotal);

    // Generate and store hash
    const cartHash = generateCartHash(myCart, subtotal);
    localStorage.setItem("cartHash", cartHash);

    setSubTotal(subtotal);
  };

  // Initialize cart and validate hash on mount
  useEffect(() => {
    const initializeCart = () => {
      try {
        const storedCart = localStorage.getItem("cart");
        const storedSubTotal = parseFloat(localStorage.getItem("subTotal"));
        const storedHash = localStorage.getItem("cartHash");

        if (storedCart && storedHash && storedCart !== "undefined") {
          const parsedCart = JSON.parse(storedCart);
          const calculatedHash = generateCartHash(parsedCart, storedSubTotal);

          if (storedHash === calculatedHash) {
            // Hash matches, load cart
            setCart(parsedCart);
            setSubTotal(storedSubTotal);
          } else {
            console.warn("Cart data may have been tampered with.");
            localStorage.removeItem("cart");
            localStorage.removeItem("subTotal");
            localStorage.removeItem("cartHash");
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        localStorage.removeItem("cart");
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      setUser({ value: token });
      setKey(1); // Trigger re-render for token-based changes
    }

    initializeCart();
  }, []);

  const addToCart = (itemCode, qty, price, name, size, variant) => {
    const newCart = { ...cart };
    if (newCart[itemCode]) {
      newCart[itemCode].qty += qty;
    } else {
      newCart[itemCode] = { qty, price, name, size, variant };
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const buyNow = (itemCode, qty, price, name, size, variant) => {
    const newCart = {
      [itemCode]: { qty, price, name, size, variant },
    };
    setCart(newCart);
    saveCart(newCart);
    router.push("/checkout"); // Redirect to checkout
  };

  const removeFromCart = (itemCode, qty) => {
    const newCart = { ...cart };
    if (newCart[itemCode]) {
      newCart[itemCode].qty -= qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ value: token });
    setKey((prev) => prev + 1);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser({ value: null });
    setKey((prev) => prev + 1);
    router.push("/login");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        subTotal,
        addToCart,
        removeFromCart,
        clearCart,
        buyNow,
        key,
        user,
        login,
        logout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
