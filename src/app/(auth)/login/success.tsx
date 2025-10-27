"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function LoginSuccess({
  role = "buyer",
}: {
  role?: "buyer" | "seller";
}) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(role === "seller" ? "/seller/dashboard" : "/dashboard");
    }, 2500);

    return () => clearTimeout(timer);
  }, [role, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F8FC] to-[#E8EEF6] p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-gray-200 shadow-md rounded-2xl p-8 w-full max-w-sm"
      >
        <LogIn className="mx-auto text-[#0A3D79] w-16 h-16 mb-4" />
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          You have successfully logged in. Redirecting to your dashboard...
        </p>

        <motion.img
          src="/image/logo.webp"
          alt="The Garment Guy Logo"
          className="w-12 h-12 mx-auto rounded-full mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        />
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} The Garment Guy
        </p>
      </motion.div>
    </main>
  );
}
