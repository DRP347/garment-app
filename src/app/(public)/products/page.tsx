"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  subCategory?: string;
  description?: string[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      }
    }
    load();
  }, []);

  // 🔥 CATEGORY FILTERS
  const shirts = (products || []).filter((p) =>
    p.category?.toLowerCase().includes("shirt")
  );

  const denim = (products || []).filter((p) =>
    p.category?.toLowerCase().includes("denim")
  );

  const cargo = (products || []).filter((p) =>
    p.category?.toLowerCase().includes("cargo")
  );

  // 🔥 SUBCATEGORY (shirts)
  const shortSleeves = shirts.filter((p) =>
    p.subCategory?.toLowerCase().includes("short")
  );

  const longSleeves = shirts.filter((p) =>
    p.subCategory?.toLowerCase().includes("long")
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center text-[#0A3D79] mb-10">
        Our Collection
      </h1>

      {/* CATEGORY FILTER */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {["All", "Shirts", "Denim", "Cargo"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full border text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-[#0A3D79] text-white"
                : "text-[#0A3D79] border-[#0A3D79] hover:bg-[#0A3D79]/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {!products && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* 🔥 FEATURED */}
      {products && selectedCategory === "All" && (
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {shirts.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
            {denim.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
            {cargo.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ========================= */}
      {/* 🔥 SHIRTS FIRST */}
      {/* ========================= */}
      {products &&
        (selectedCategory === "All" || selectedCategory === "Shirts") && (
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-6 text-[#0A3D79]">
              Shirts
            </h2>

            {shortSleeves.length > 0 && (
              <>
                <h3 className="text-lg mb-4 text-gray-600">
                  Short Sleeve
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
                  {shortSleeves.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              </>
            )}

            {longSleeves.length > 0 && (
              <>
                <h3 className="text-lg mb-4 text-gray-600">
                  Long Sleeve
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {longSleeves.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              </>
            )}

            {shortSleeves.length === 0 &&
              longSleeves.length === 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {shirts.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}
          </section>
        )}

      {/* DENIM */}
      {products &&
        (selectedCategory === "All" || selectedCategory === "Denim") && (
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-6 text-[#0A3D79]">
              Denim
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {denim.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

      {/* CARGO */}
      {products &&
        (selectedCategory === "All" || selectedCategory === "Cargo") && (
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-6 text-[#0A3D79]">
              Cargo
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {cargo.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
    </div>
  );
}