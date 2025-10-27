"use client";

const orders = [
  { id: "001", product: "Denim Jacket", status: "Shipped", amount: "₹5,200" },
  { id: "002", product: "Cotton T-Shirt", status: "Pending", amount: "₹2,400" },
  { id: "003", product: "Cargo Pants", status: "Delivered", amount: "₹4,700" },
];

export default function RecentOrdersTable() {
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex justify-between items-center py-3 px-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
        >
          <div>
            <h3 className="font-medium text-[#0A3D79]">{order.product}</h3>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-700">{order.amount}</p>
            <p
              className={`text-sm font-medium ${
                order.status === "Shipped"
                  ? "text-blue-600"
                  : order.status === "Delivered"
                  ? "text-green-600"
                  : "text-amber-600"
              }`}
            >
              {order.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
