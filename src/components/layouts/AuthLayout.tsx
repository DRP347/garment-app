"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT BRAND SECTION */}
      <div className="md:w-1/2 bg-gradient-to-br from-[#0A3D79] to-[#124E9C] text-white flex flex-col items-center justify-center p-10 relative">
        <div className="text-center space-y-6">
          <Image
            src="/image/logo.webp"
            alt="The Garment Guy Logo"
            width={90}
            height={90}
            className="mx-auto rounded-full bg-white/10 p-3"
          />
          <div>
            <h1 className="text-3xl font-bold">The Garment Guy</h1>
            <p className="text-gray-200 mt-2 text-sm max-w-sm mx-auto">
              Empowering brands with quality garment manufacturing — for modern fashion entrepreneurs.
            </p>
          </div>
          <Image
            src="/image/auth-visual.svg"
            alt="Garment factory illustration"
            width={300}
            height={300}
            className="mx-auto opacity-90"
          />
        </div>
        <p className="absolute bottom-6 text-xs text-gray-300">
          © {new Date().getFullYear()} The Garment Guy
        </p>
      </div>

      {/* RIGHT FORM SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex items-center justify-center bg-[#F9FAFB] p-6 sm:p-12"
      >
        {children}
      </motion.div>
    </div>
  );
}
