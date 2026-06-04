"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShoppingBag,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SidebarLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

type SidebarSection = {
  label: string;
  links: SidebarLink[];
};

const adminSections: SidebarSection[] = [
  {
    label: "Workspace",
    links: [
      { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/admin/products", label: "Products", icon: Package },
      { href: "/dashboard/admin/orders", label: "Orders", icon: ClipboardList },
      { href: "/dashboard/admin/buyers", label: "Buyers", icon: Users },
      { href: "/dashboard/admin/sellers", label: "Sellers", icon: Store },
      { href: "/dashboard/admin/abandoned-carts", label: "Abandoned Carts", icon: Boxes },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/dashboard/settings", label: "Profile", icon: UserRound },
    ],
  },
];

const buyerSections: SidebarSection[] = [
  {
    label: "Workspace",
    links: [
      { href: "/dashboard/buyer", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/buyer/orders", label: "My Orders / Inquiries", icon: ClipboardList },
    ],
  },
  {
    label: "System",
    links: [{ href: "/dashboard/buyer/settings", label: "Profile / Settings", icon: Settings }],
  },
];

const sellerSections: SidebarSection[] = [
  {
    label: "Workspace",
    links: [
      { href: "/dashboard/seller", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/seller/products", label: "My Products", icon: Package },
      { href: "/dashboard/seller/orders", label: "Orders / Leads", icon: ShoppingBag },
    ],
  },
  {
    label: "System",
    links: [{ href: "/dashboard/settings", label: "Profile / Settings", icon: Settings }],
  },
];

function panelLabel(role?: string) {
  if (role === "admin") return "Admin";
  if (role === "seller") return "Seller";
  if (role === "buyer") return "Buyer";
  return "Dashboard";
}

function initials(name?: string | null, email?: string | null) {
  const source = name || email || "Account";
  return source
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function isLinkActive(currentPath: string, item: SidebarLink) {
  if (item.exact) return currentPath === item.href;
  return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
}

export default function DashboardSidebar({
  collapsed = false,
  onToggle,
  onNavigate,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const currentPath = pathname ?? "";
  const { data: session } = useSession();
  const role = session?.user?.role;
  const sections =
    role === "admin"
      ? adminSections
      : role === "seller"
      ? sellerSections
      : role === "buyer"
      ? buyerSections
      : [];
  const accountInitials = initials(session?.user?.name, session?.user?.email);

  return (
    <aside
      className={`flex h-dvh flex-shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-white/10 bg-[#071B34] text-white shadow-[14px_0_40px_-36px_rgba(15,23,42,0.9)] transition-[width] duration-200 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      <div className="border-b border-white/10 p-3">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between gap-2"}`}>
          <Link
            href="/"
            onClick={onNavigate}
            className={`flex min-w-0 items-center rounded-2xl p-2 transition hover:bg-white/10 ${
              collapsed ? "justify-center" : "gap-3"
            }`}
            title="The Garment Guy"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white ring-1 ring-white/25">
              <Image
                src="/image/Logo-Icon.webp"
                alt="The Garment Guy"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </span>
            {!collapsed ? (
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold leading-tight">
                  The Garment Guy
                </span>
                <span className="mt-1 block truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100/60">
                  {panelLabel(role)} workspace
                </span>
              </span>
            ) : null}
          </Link>
          {onToggle ? (
            <button
              type="button"
              onClick={onToggle}
              className="hidden h-9 w-9 flex-none items-center justify-center rounded-xl text-blue-100/70 transition hover:bg-white/10 hover:text-white lg:inline-flex"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-5 px-3 py-4">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed ? (
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100/45">
                {section.label}
              </p>
            ) : null}
            <ul className="space-y-1">
              {section.links.map((item) => {
                const active = isLinkActive(currentPath, item);

                return (
                  <li key={`${section.label}-${item.label}`}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex h-11 items-center rounded-xl text-sm font-semibold transition ${
                        collapsed ? "justify-center px-0" : "gap-3 px-3"
                      } ${
                        active
                          ? "bg-white text-[#071B34] shadow-sm"
                          : "text-blue-100/76 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#8FC8FF] transition ${
                          active && !collapsed ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <item.icon size={18} strokeWidth={1.9} className="flex-none" />
                      {!collapsed ? <span className="min-w-0 truncate">{item.label}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-white/10 p-3">
        <div
          className={`rounded-2xl border border-white/10 bg-white/[0.06] ${
            collapsed ? "p-2" : "p-3"
          }`}
        >
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white text-sm font-bold text-[#071B34]">
              {accountInitials}
            </span>
            {!collapsed ? (
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {session?.user?.name || "Account"}
                </span>
                <span className="mt-1 block truncate text-xs text-blue-100/58">
                  {session?.user?.email || panelLabel(role)}
                </span>
              </span>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`flex h-11 w-full items-center rounded-xl text-sm font-semibold text-blue-100/78 transition hover:bg-rose-500/15 hover:text-white ${
            collapsed ? "justify-center px-0" : "gap-3 px-3"
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} strokeWidth={1.9} />
          {!collapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </aside>
  );
}
