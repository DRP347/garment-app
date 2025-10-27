"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const username = session?.user?.name?.split(" ")[0] || "";

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#0A3D79]">
      {/* ===== NAVBAR ===== */}
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
          {/* Brand */}
          <Link href="/" className="text-xl font-bold tracking-wide">
            The Garment Guy
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="hover:text-[#124E9C]">
              About
            </Link>
            <Link href="/products" className="hover:text-[#124E9C]">
              Products
            </Link>

            {!session ? (
              <Link
                href="/register"
                className="bg-[#0A3D79] text-white px-4 py-2 rounded-md font-medium hover:bg-[#124E9C] transition"
              >
                Start a Brand
              </Link>
            ) : (
              <>
                <span className="font-semibold">Hi, {username}</span>
                <Link href="/cart" className="hover:text-[#124E9C]">
                  <ShoppingCart size={20} />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="ml-2 text-sm text-gray-600 hover:text-[#0A3D79]"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#0A3D79]"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {open && (
          <div className="md:hidden bg-white shadow-md flex flex-col gap-4 p-4">
            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/products" onClick={() => setOpen(false)}>
              Products
            </Link>
            {!session ? (
              <Link href="/register" onClick={() => setOpen(false)}>
                Start a Brand
              </Link>
            ) : (
              <>
                <Link href="/cart" onClick={() => setOpen(false)}>
                  Cart
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="pt-20 flex-grow">{children}</main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0A3D79] text-white pt-12 pb-6 mt-0">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Brand Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">The Garment Guy</h3>
            <p className="text-white/80 text-sm">
              Premium Garment Manufacturing for Modern Brands.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/products" className="hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              {!session && (
                <li>
                  <Link href="/register" className="hover:text-white">
                    Start a Brand
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-white/80 text-sm leading-relaxed">
              Daman, India <br />
              📞 +91 72028 09157 <br />
              ✉️ contact@thegarmentguy.com
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-4 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} The Garment Guy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
