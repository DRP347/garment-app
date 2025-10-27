"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId") ?? "N/A";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 8000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 px-6">
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🎉 Order Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Your order ID: <span className="font-semibold">{orderId}</span>
        </p>
        <p className="text-gray-500 mb-8">
          You’ll be redirected to the home page shortly.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
