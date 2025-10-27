"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { 
    LayoutDashboard, Package, Users, ClipboardList, LogOut, ShoppingCart
} from 'lucide-react';

const userLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "Products", icon: Package },
    { href: "/dashboard/orders", label: "My Orders", icon: ClipboardList },
];
const adminLinks = [
    { href: "/admin", label: "Admin Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Manage Products", icon: Package },
    { href: "/admin/partners", label: "Manage Partners", icon: Users },
    { href: "/admin/orders", label: "All Orders", icon: ClipboardList },
    { href: "/admin/abandoned-carts", label: "Abandoned Carts", icon: ShoppingCart },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // @ts-ignore
  const isAdmin = session?.user?.role === 'admin';
  const linksToDisplay = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-background flex-shrink-0 border-r border-border flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-border">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/image/Logo-Icon.webp" alt="Logo" width={32} height={32} />
                <span className="font-bold text-lg text-foreground font-heading">The Garment Guy</span>
            </Link>
        </div>

        <nav className="flex-grow p-4">
            <ul className="space-y-2">
                {linksToDisplay.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.href}>
                            <Link href={item.href} className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors text-sm font-semibold ${
                                isActive ? 'bg-primary text-primary-foreground shadow-soft' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}>
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>

        <div className="p-4 border-t border-border mt-auto">
            <button 
                onClick={() => signOut({ callbackUrl: '/login' })} 
                className="w-full flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors text-sm font-semibold text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
            >
                <LogOut size={18} />
                Sign Out
            </button>
        </div>
    </aside>
  );
}