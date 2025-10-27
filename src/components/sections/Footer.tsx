"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A3D79] text-white py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Brand Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-oswald font-semibold mb-3">
            The Garment Guy
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Premium garment manufacturing partner helping brands achieve
            global-quality standards through craftsmanship, innovation, and
            reliability.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className="text-lg font-semibold mb-3 text-white/90">
            Quick Links
          </h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            {["Home", "About", "Products", "Contact"].map((link) => (
              <li key={link}>
                <Link
                  href={`/${link === "Home" ? "" : link.toLowerCase()}`}
                  className="hover:text-white transition"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className="text-lg font-semibold mb-3 text-white/90">Contact</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Email: info@thegarmentguy.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Location: Mumbai, India</li>
          </ul>
        </motion.div>
      </div>

      <div className="border-t border-white/20 mt-10 pt-6 text-center text-gray-400 text-sm">
        © {year} The Garment Guy. All rights reserved.
      </div>
    </footer>
  );
}
