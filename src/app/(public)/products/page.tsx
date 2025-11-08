"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      }
    };
    run();
  }, []);

  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-8 text-center">
        Our Collection
      </h1>

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <Link
            key={p._id}
            href={`/products/${p._id}`}
            className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src={p.images?.[0] || "/placeholder.jpg"}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h2 className="font-semibold text-[#0A3D79] text-base truncate">
                {p.name}
              </h2>
              <p className="text-[#0A3D79] font-bold text-sm mt-2">
                ₹{p.price?.toFixed?.(2) ?? p.price}
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
