"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Package, Settings, LogOut } from "lucide-react";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-56" : "w-16"
        } bg-[#0A3D79] text-white flex flex-col transition-all duration-300`}
      >
        <button
          className="p-4 text-white focus:outline-none md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <nav className="flex-1 flex flex-col gap-2 mt-4 px-2">
          <SidebarItem href="/dashboard/buyer" icon={<ShoppingBag size={20} />} label="Orders" open={sidebarOpen} />
          <SidebarItem href="/dashboard/buyer/products" icon={<Package size={20} />} label="Products" open={sidebarOpen} />
          <SidebarItem href="/dashboard/buyer/settings" icon={<Settings size={20} />} label="Settings" open={sidebarOpen} />
        </nav>

        <div className="mt-auto mb-4 px-2">
          <SidebarItem href="/logout" icon={<LogOut size={20} />} label="Logout" open={sidebarOpen} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  open,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-white px-3 py-2 rounded-md hover:bg-[#124E9C] transition"
    >
      {icon}
      {open && <span>{label}</span>}
    </Link>
  );
}
