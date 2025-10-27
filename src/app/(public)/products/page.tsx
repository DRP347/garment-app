"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };
    fetchProducts();
  }, []);

  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p: any) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-8 text-center">
        Our Collection
      </h1>

      {/* Filter buttons */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {["All", "Denim", "Cargo"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full border text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-[#0A3D79] text-white shadow-md"
                : "text-[#0A3D79] border-[#0A3D79] hover:bg-[#0A3D79]/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((product: any) => (
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h2 className="font-semibold text-[#0A3D79] text-sm sm:text-lg">
                {product.name}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm truncate mt-1">
                {product.description}
              </p>
              <p className="text-[#0A3D79] font-bold text-sm sm:text-base mt-2">
                ₹{product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No products found in this category.
        </p>
      )}
    </div>
  );
}
