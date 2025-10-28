"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams?.get("orderId");
    if (id) setOrderId(id);
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <Confetti numberOfPieces={200} recycle={false} />
      <h1 className="text-3xl font-bold text-green-600 mb-4">Order Successful!</h1>
      <p className="text-gray-700 mb-6">
        Your order has been placed successfully.
      </p>
      {orderId && (
        <p className="text-gray-500 mb-8">Order ID: <strong>{orderId}</strong></p>
      )}
      <button
        onClick={() => router.push("/")}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
      >
        Back to Home
      </button>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
