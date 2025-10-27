"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SellerSidebar({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const navItems = [
    { name: "Dashboard", href: "/seller" },
    { name: "My Products", href: "/seller/products" },
    { name: "Orders", href: "/seller/orders" },
    { name: "Messages", href: "/seller/messages" },
    { name: "Analytics", href: "/seller/analytics" },
    { name: "Settings", href: "/seller/settings" },
    { name: "Logout", href: "/logout" },
  ];

  return (
    <aside className="w-64 bg-[#0A3D79] text-white h-screen flex flex-col shadow-lg">
      <div className="p-4 text-xl font-bold border-b border-[#124E9C]">
        Seller Panel
      </div>
      <nav className="flex-1 flex flex-col mt-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`px-6 py-3 text-sm font-medium hover:bg-[#124E9C] transition ${
              pathname === item.href ? "bg-[#124E9C]" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
