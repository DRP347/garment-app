"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SIZES = [28, 30, 32, 34, 36] as const;
const MIN_QTY = 20;

export default function AddToCartClient({
  product,
}: {
  product: { _id: string; name: string; price: number; image: string };
}) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [size, setSize] = useState<number | null>(null);

  const addCommon = async (goCheckout: boolean) => {
    if (!size) return toast.error("Select a size first");

    await addToCart({
      id: product._id,
      name: `${product.name} (Size ${size})`,
      price: product.price,
      image: product.image,
      quantity: MIN_QTY,
      size,
    });

    if (goCheckout) router.push("/checkout");
    else toast.success("Added to cart");
  };

  return (
    <div>
      {/* Size selector */}
      <div className="mt-6">
        <p className="text-sm text-gray-700 mb-2">Select Size:</p>
        <div className="flex gap-2 flex-wrap">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-4 py-2 rounded-md border text-sm font-medium ${
                size === s
                  ? "bg-[#0A3D79] text-white border-[#0A3D79]"
                  : "border-gray-300 text-[#0A3D79] hover:bg-[#0A3D79]/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => addCommon(false)}
          className="flex-1 bg-[#0A3D79] text-white py-3 rounded-lg font-semibold hover:bg-[#124E9C] transition"
        >
          Add to Cart
        </button>

        <button
          onClick={() => addCommon(true)}
          className="flex-1 border border-[#0A3D79] text-[#0A3D79] py-3 rounded-lg font-semibold hover:bg-[#0A3D79] hover:text-white transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
