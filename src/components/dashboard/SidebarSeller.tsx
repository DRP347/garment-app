"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Package, BarChart3, Settings, LogOut } from "lucide-react";
import { useState } from "react";

export default function SidebarSeller() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const Item = ({
    href,
    icon: Icon,
    label,
  }: { href: string; icon: any; label: string }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 transition ${
        pathname === href
          ? "bg-white/10 text-white"
          : "text-blue-100 hover:bg-white/10"
      }`}
    >
      <Icon size={18} />
      {open && <span className="text-sm">{label}</span>}
    </Link>
  );

  return (
    <aside
      className={`bg-[#0A3D79] text-white h-screen sticky top-0 ${
        open ? "w-56" : "w-14"
      } transition-[width] duration-200`}
    >
      <div className="p-3 flex items-center justify-between">
        {open && <span className="font-semibold">Seller Panel</span>}
        <button onClick={() => setOpen((v) => !v)} className="text-white/80">
          <Menu size={18} />
        </button>
      </div>
      <nav className="px-2 space-y-1">
        <Item href="/dashboard/seller" icon={BarChart3} label="Overview" />
        <Item href="/dashboard/seller/products" icon={Package} label="Products" />
        <Item href="/dashboard/seller/orders" icon={BarChart3} label="Orders" />
        <div className="mt-4 border-t border-white/10 pt-2" />
        <Item href="/dashboard/seller/settings" icon={Settings} label="Settings" />
        <Item href="/auth/logout" icon={LogOut} label="Logout" />
      </nav>
    </aside>
  );
}
