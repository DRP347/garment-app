"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex items-center justify-center h-screen text-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/image/hero.webp"
          alt="Garment Factory"
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A3D79]/60 to-[#124E9C]/80" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6 text-white"
      >
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-md">
          Crafting Excellence in Every Stitch
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Premium Garment Manufacturing for Modern Brands.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/register"
            className="bg-white text-[#0A3D79] px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Start a Brand
          </Link>
          <Link
            href="/products"
            className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-[#0A3D79] transition"
          >
            Explore Products
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
