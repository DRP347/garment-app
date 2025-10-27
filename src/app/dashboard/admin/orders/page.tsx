"use client";

import { useEffect, useState } from "react";

type Order = {
  _id: string;
  userId?: { name?: string; businessName?: string };
  items: { name: string; quantity: number }[];
  totalValue: number;
  status: string;
  createdAt: string;
};

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch orders");
        setOrders(await res.json());
      } catch (e: any) {
        setErr(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="p-6">Loading…</p>;
  if (err) return <p className="p-6 text-red-600">Error: {err}</p>;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#0A3D79] mb-6">Manage Orders</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <Th>Order</Th>
              <Th>Partner</Th>
              <Th>Date</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o._id} className="bg-white">
                <Td>#{o._id.slice(-6).toUpperCase()}</Td>
                <Td>{o.userId?.businessName || o.userId?.name || "N/A"}</Td>
                <Td>{new Date(o.createdAt).toLocaleDateString()}</Td>
                <Td>₹{Number(o.totalValue || 0).toFixed(2)}</Td>
                <Td>
                  <span
                    className={[
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      o.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : o.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800",
                    ].join(" ")}
                  >
                    {o.status}
                  </span>
                </Td>
                <Td className="text-right">
                  <button className="text-[#0A3D79] hover:underline">
                    Manage
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={
        "px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase " +
        (props.className || "")
      }
    />
  );
}
function Td(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={"px-6 py-4 text-sm " + (props.className || "")} />;
}
