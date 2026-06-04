"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, UserRound } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

function roleLabel(role?: string) {
  if (role === "admin") return "Admin Panel";
  if (role === "seller") return "Seller Workspace";
  if (role === "buyer") return "Buyer Workspace";
  return "Dashboard";
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="h-dvh overflow-hidden bg-[#F5F7FA] text-slate-900 lg:flex">
      <div className="hidden lg:flex lg:flex-none">
        <DashboardSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((current) => !current)}
        />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard menu"
            className="absolute inset-0 bg-slate-950/55"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-72 max-w-[82vw]">
            <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-30 flex h-16 flex-none items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 shadow-[0_12px_35px_-32px_rgba(15,23,42,0.9)] backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open dashboard menu"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#0A3D79] transition hover:bg-slate-50 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {roleLabel(session?.user?.role)}
              </p>
              <h1 className="truncate text-base font-semibold text-slate-950 sm:text-lg">
                Dashboard
              </h1>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <UserRound size={17} className="flex-none text-[#0A3D79]" />
              <span className="hidden max-w-[220px] truncate sm:inline">
                {session?.user?.name || session?.user?.email || "Account"}
              </span>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
