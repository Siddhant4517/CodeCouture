"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState(0); // Used to force re-renders
  const router = useRouter();

  // Initialize cart and user data on mount
  useEffect(() => {
    const initializeCart = () => {
      try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart && storedCart !== "undefined") {
          const parsedCart = JSON.parse(storedCart);
          setCart(parsedCart);
          saveCart(parsedCart); // Re-calculate subtotal
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        localStorage.removeItem("cart"); // Handle corrupted data
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      setUser({ value: token });
      setKey(1); // Trigger re-render for token-based changes
    }

    initializeCart();
  }, []);

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));

    // Calculate subtotal
    const subtotal = Object.keys(myCart).reduce(
      (acc, key) => acc + myCart[key].price * myCart[key].qty,
      0
    );
    setSubTotal(subtotal);
  };

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
    localStorage.setItem("token", token); // Store token locally
    setUser({ value: token });
    setKey((prev) => prev + 1); // Force a re-render
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser({ value: null });
    setKey((prev) => prev + 1); // Force a re-render
    router.push("/login"); // Redirect to login page
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
