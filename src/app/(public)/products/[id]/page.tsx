"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ unwrap async params
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.images?.[0]);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      {/* Product Image Section */}
      <div className="flex flex-col items-center">
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-sm">
          <Image
            src={selectedImage || "/placeholder.jpg"}
            alt={product.name}
            fill
            priority
            className="object-contain md:object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 sm:gap-3 mt-4 overflow-x-auto w-full justify-center pb-2">
          {product.images?.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border rounded-lg overflow-hidden transition ${
                selectedImage === img
                  ? "border-[#0A3D79] ring-2 ring-[#0A3D79]/30"
                  : "border-gray-300 hover:border-[#0A3D79]/60"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-3 text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A3D79] leading-tight">
          {product.name}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">{product.description}</p>
        <p className="text-2xl font-semibold text-[#0A3D79] mt-2">
          ₹{product.price.toFixed(2)}
        </p>
        <p className="text-gray-600 text-sm">
          Stock: <span className="font-medium">{product.stock}</span>
        </p>

        <button
          onClick={() => addToCart(product)}
          className="mt-5 bg-[#0A3D79] hover:bg-[#124E9C] text-white font-semibold py-3 rounded-lg transition text-center"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
