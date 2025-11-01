"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login", redirect: true });
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* Desktop logo */}
            <div className="hidden md:block">
              <Image
                src="/image/Logo.webp"
                alt="The Garment Guy"
                width={150}
                height={45}
                priority
                className="object-contain"
              />
            </div>
            {/* Mobile icon */}
            <div className="md:hidden">
              <Image
                src="/image/Logo-Icon.webp"
                alt="The Garment Guy"
                width={40}
                height={40}
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#0A3D79] transition font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-[#0A3D79] transition font-medium"
            >
              About
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-[#0A3D79] transition font-medium"
            >
              Products
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative text-[#0A3D79]">
              <ShoppingCart className="w-5 h-5" />
              {Array.isArray(cart) && cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-[#0A3D79] hover:text-[#124E9C] transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-[#0A3D79] text-white px-4 py-1.5 rounded-lg hover:bg-[#124E9C] transition font-medium"
              >
                Start a Brand
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#0A3D79] focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-md"
          >
            <div className="px-6 py-4 space-y-3">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-[#0A3D79] text-base font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-[#0A3D79] text-base font-medium"
              >
                About
              </Link>
              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-[#0A3D79] text-base font-medium"
              >
                Products
              </Link>

              {/* Cart & Auth */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="relative text-[#0A3D79]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {Array.isArray(cart) && cart.length > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>

                {session ? (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-1 text-[#0A3D79] hover:text-[#124E9C] font-medium transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="bg-[#0A3D79] text-white px-4 py-1.5 rounded-lg hover:bg-[#124E9C] transition font-medium"
                  >
                    Start a Brand
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
