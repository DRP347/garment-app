"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PackagePlus } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  images?: string[];
  price?: number;
  stock?: number;
  category?: string;
};

// Utility to ensure all image paths are valid for Next/Image
function getValidImageSrc(src: string | undefined): string {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http") || src.startsWith("/")) return src;

  // Clean quotes, Windows paths, and "public/" prefix
  return (
    "/" +
    src
      .replace(/^["']|["']$/g, "")
      .replace(/\\/g, "/")
      .replace(/^public\//, "")
      .replace(/^\/+/, "")
  );
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Error fetching products");
      }
    };
    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#EEF2FF] to-[#EAF1FF] px-6 py-10">
      {/* ---------- Header ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-10"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#0A3D79]">
            Product Management
          </h1>
          <p className="text-gray-500">
            Manage, edit, and update your product catalog
          </p>
        </div>
        <Link
          href="/dashboard/admin/products/new"
          className="flex items-center gap-2 bg-[#0A3D79] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#124E9C] transition"
        >
          <PackagePlus size={18} />
          Add Product
        </Link>
      </motion.div>

      {/* ---------- Product Table ---------- */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F0F4FF]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#0A3D79] uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#0A3D79] uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#0A3D79] uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#0A3D79] uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#0A3D79] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {products.length > 0 ? (
              products.map((product) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative h-12 w-12">
                        <Image
                          src={getValidImageSrc(product.images?.[0])}
                          alt={product.name || "Product image"}
                          fill
                          sizes="48px"
                          className="rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ₹{(product.price || 0).toLocaleString()}
                  </td>

                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      product.stock && product.stock > 10
                        ? "text-green-600"
                        : product.stock && product.stock > 0
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock ?? 0}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.category || "Uncategorized"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/admin/products/${product._id}`}
                      className="text-[#0A3D79] hover:text-[#124E9C]"
                    >
                      Edit
                    </Link>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-8 text-sm"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
