import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/clientLayout";
import { CartProvider } from "../app/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Codeswear.com - Wear the code",
  description:
    "Ecommerce website where you can buy every code related products like T-shirts, pants, trousers, shirts, shoes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {" "}
          {/* Wrap your layout with CartProvider */}
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
