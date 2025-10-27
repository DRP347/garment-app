"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F8FC] to-[#E8EEF6] px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="w-full max-w-md md:max-w-lg flex flex-col items-center"
        >
          {children}

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-8 text-center">
            © {new Date().getFullYear()} The Garment Guy. All rights reserved.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
