"use client";

import { useEffect, useState } from "react";

type Order = {
  _id: string;
  total: number;
  status: string;
  createdAt?: string;
  items: { name: string; quantity: number; price?: number }[];
  // optional if your schema includes it
  orderId?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json();
        if (mounted) setOrders(Array.isArray(data) ? data : []);
      } catch {
        // noop
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-6">My Orders</h1>

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const created =
              o.createdAt && !isNaN(Date.parse(o.createdAt))
                ? new Date(o.createdAt).toLocaleString()
                : "";
            return (
              <div
                key={o._id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-sm text-gray-500">
                      {created ? `Placed: ${created}` : "—"}
                    </p>
                    <h3 className="font-semibold text-[#0A3D79]">
                      {o.orderId || o._id}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0A3D79]">
                      ₹{o.total?.toFixed?.(2) ?? o.total}
                    </p>
                    <p className="text-sm text-gray-600">{o.status}</p>
                  </div>
                </div>

                <ul className="mt-4 space-y-1 text-sm text-gray-700">
                  {o.items?.map((it, idx) => (
                    <li key={idx}>• {it.name} × {it.quantity}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
