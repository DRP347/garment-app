"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  const logout = () => signOut({ callbackUrl: "/login" });

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/products", label: "Products" },
      ...(session ? [{ href: "/orders", label: "Orders" }] : []),
    ],
    [session]
  );

  return (
    <nav className="w-full bg-white fixed top-0 left-0 z-50 shadow-sm backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 bg-[#0A3D79] hover:bg-[#124E9C] text-white px-3 sm:px-4 py-1.5 rounded-full transition-all duration-200 shadow-sm"
        >
          <Image
            src="/image/Logo-Icon.webp"
            alt="The Garment Guy"
            width={28}
            height={28}
            priority
            className="object-contain bg-white rounded-full p-0.5"
          />
          <span className="font-semibold text-sm sm:text-base tracking-wide">
            The Garment Guy
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-700 hover:text-[#0A3D79] font-medium transition"
            >
              {l.label}
            </Link>
          ))}

          <Link href="/cart" className="relative text-[#0A3D79]" aria-label="Cart">
            <ShoppingCart className="w-5 h-5" />
            {Array.isArray(cart) && cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {session ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 text-[#0A3D79] hover:text-[#124E9C] font-medium transition"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-[#0A3D79] text-white px-4 py-1.5 rounded-md hover:bg-[#124E9C] transition font-medium"
            >
              Start a Brand
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#0A3D79] focus:outline-none"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-sm"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-gray-700 hover:text-[#0A3D79] text-base font-medium"
                >
                  {l.label}
                </Link>
              ))}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="relative text-[#0A3D79]"
                  aria-label="Cart"
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
                      setOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-1 text-[#0A3D79] hover:text-[#124E9C] font-medium transition"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="bg-[#0A3D79] text-white px-4 py-1.5 rounded-md hover:bg-[#124E9C] transition font-medium"
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
