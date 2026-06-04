"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PackageSearch } from "lucide-react";
import BuyerOrdersTable, {
  type BuyerOrderRow,
} from "@/components/dashboard/BuyerOrdersTable";
import {
  DashboardPage,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardPrimitives";

async function readOrdersResponse(res: Response) {
  const text = await res.text();
  if (!text) return [];

  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? (data as BuyerOrderRow[]) : [];
  } catch {
    return [];
  }
}

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<BuyerOrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await readOrdersResponse(res);
        if (active) setOrders(data);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="My orders / inquiries"
        description="Review your submitted garment purchase requests and their latest status."
        actions={
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D79] px-4 text-sm font-semibold text-white transition hover:bg-[#124E9C] active:translate-y-px"
          >
            <PackageSearch size={17} />
            Browse products
          </Link>
        }
      />
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-600">
          Loading orders...
        </div>
      ) : (
        <BuyerOrdersTable orders={orders} />
      )}
    </DashboardPage>
  );
}

