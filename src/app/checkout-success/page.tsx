"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");
  const total = searchParams?.get("total");
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-4">
        Thank You for Your Order!
      </h1>
      <p className="text-gray-600 mb-6">
        Your order has been successfully placed.
      </p>

      <div className="bg-white shadow rounded-xl p-6 inline-block text-left">
        <p className="text-[#0A3D79] font-semibold mb-2">
          Order ID: {orderId || "N/A"}
        </p>
        <p className="text-gray-700 mb-4">
          Total: ₹{total ? Number(total).toFixed(2) : "N/A"}
        </p>
        <button
          onClick={() => router.push("/orders")}
          className="bg-[#0A3D79] text-white px-6 py-2 rounded-lg hover:bg-[#124E9C] transition"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Loading…</div>}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
