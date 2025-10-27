"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <CartProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: { fontSize: "0.9rem", borderRadius: "8px" },
          }}
        />
      </CartProvider>
    </SessionProvider>
  );
}
