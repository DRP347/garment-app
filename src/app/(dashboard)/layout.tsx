"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { BuyerSidebar } from "@/components/ui/BuyerSidebar";
import { SellerSidebar } from "@/components/ui/SellerSidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isBuyer = pathname.startsWith("/buyer");
  const isSeller = pathname.startsWith("/seller");

  return (
    <html lang="en">
      <body className="font-inter bg-[#F9FAFB] text-[#111827] antialiased">
        <SessionProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside
              className={`fixed md:relative z-40 h-screen transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
              }`}
            >
              {isBuyer && <BuyerSidebar onClose={() => setSidebarOpen(false)} />}
              {isSeller && <SellerSidebar onClose={() => setSidebarOpen(false)} />}
            </aside>

            {/* Main Section */}
            <div className="flex-1 flex flex-col min-h-screen">
              {/* Top Header */}
              <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden text-[#0A3D79] text-lg"
                >
                  ☰
                </button>
                <h1 className="text-lg font-semibold text-[#0A3D79]">
                  {isBuyer ? "Buyer Dashboard" : isSeller ? "Seller Dashboard" : "Dashboard"}
                </h1>
              </header>

              {/* Page content */}
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
