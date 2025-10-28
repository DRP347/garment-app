"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/auth"; // ✅ FIX: added import
import { IOrder } from "@/models/OrderModel";

function OrdersContent() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  if (!orders.length)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
        <p>No orders found.</p>
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
          >
            <p className="text-gray-700">
              <strong>Order ID:</strong> {order._id}
            </p>
            <p className="text-gray-700">
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong> {order.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
