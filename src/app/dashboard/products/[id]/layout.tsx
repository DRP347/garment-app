"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";
import { ShoppingCart, User, ArrowLeft } from "lucide-react";

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { cart } = useCart(); // ✅ Updated to match CartContext
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ✅ Safe fallback if cart is not initialized
  const cartItems = cart || [];
  const cartItemCount = cartItems.reduce(
    (count, item) => count + (item.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* --- Sticky Header --- */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        {/* Back Button */}
        <Link
          href="/dashboard/products"
          className="flex items-center gap-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">Back to Products</span>
        </Link>

        {/* User Info + Cart */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <User size={20} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">
              Welcome, {session?.user?.name || "Guest"}
            </span>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:text-[#0A3D79] transition-colors"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

      {/* --- Cart Sidebar --- */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
