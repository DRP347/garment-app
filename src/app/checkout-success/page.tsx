"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "N/A";
  const total = searchParams.get("total") ?? "";
  const items = searchParams.get("items") ?? "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-4">
        Order Successfully Placed 🎉
      </h1>

      <p className="text-gray-600 mb-10">
        Thank you for shopping with <span className="font-semibold text-[#0A3D79]">The Garment Guy</span>.<br />
        Our team will confirm your order on WhatsApp shortly.
      </p>

      <div className="bg-white border rounded-2xl shadow-md p-8 text-left text-gray-700">
        <p className="text-sm text-gray-500">Order ID</p>
        <p className="font-semibold text-[#0A3D79]">{orderId}</p>

        {total && (
          <>
            <p className="mt-4 text-sm text-gray-500">Total</p>
            <p className="font-semibold text-[#0A3D79]">₹{total}</p>
          </>
        )}

        {items && (
          <>
            <p className="mt-4 text-sm text-gray-500">Items</p>
            <p className="font-mono text-xs break-words">{items}</p>
          </>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <Link
          href="/products"
          className="bg-[#0A3D79] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#124E9C] transition"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="border border-[#0A3D79] text-[#0A3D79] px-6 py-3 rounded-lg font-semibold hover:bg-[#0A3D79] hover:text-white transition"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
