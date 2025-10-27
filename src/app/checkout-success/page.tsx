"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <Confetti width={windowSize.width} height={windowSize.height} />

      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
        <h1 className="text-3xl font-bold text-[#0A3D79] mb-3">
          Order Confirmed 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for shopping with <span className="font-semibold">The Garment Guy</span>!
        </p>

        <div className="bg-[#F5F8FF] border border-[#0A3D79]/20 text-[#0A3D79] font-semibold py-3 rounded-lg mb-6">
          Order ID: {orderId}
        </div>

        <p className="text-gray-500 mb-6">
          Our team will confirm your order shortly on WhatsApp.
        </p>

        <Link
          href="/"
          className="inline-block bg-[#0A3D79] hover:bg-[#124E9C] text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Back to Home
        </Link>
      </div>

      <button
        onClick={() => router.push("/products")}
        className="mt-5 text-[#0A3D79] underline text-sm hover:text-[#124E9C] transition"
      >
        Continue Shopping
      </button>
    </div>
  );
}
