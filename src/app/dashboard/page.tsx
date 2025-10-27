"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const role = "buyer"; // or "seller"

    if (role === "buyer") router.replace("/dashboard/buyer");
    else if (role === "seller") router.replace("/dashboard/seller");
    else router.replace("/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] text-[#0A3D79]">
      <p className="text-lg font-medium animate-pulse">
        Redirecting to your dashboard...
      </p>
    </div>
  );
}
