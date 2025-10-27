"use client";

import { motion } from "framer-motion";

export default function SellerDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-semibold text-[#0A3D79] mb-6">Welcome Back, Seller!</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Total Sales", value: "₹1,24,500" },
          { title: "Active Products", value: 56 },
          { title: "Pending Orders", value: 8 },
          { title: "Messages", value: 14 },
        ].map((item, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-5 text-center">
            <h3 className="text-lg font-semibold text-[#124E9C]">{item.title}</h3>
            <p className="text-2xl font-bold text-[#0A3D79] mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow mb-10">
        <h3 className="text-xl font-semibold text-[#0A3D79] mb-4">Recent Orders</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-[#124E9C]">
              <th className="py-2">Order ID</th>
              <th>Buyer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["#1005", "Aarav Patel", "Processing", "₹2,299"],
              ["#1006", "Neha Sharma", "Delivered", "₹1,899"],
              ["#1007", "Ravi Mehta", "Pending", "₹1,499"],
            ].map(([id, buyer, status, total], i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="py-2">{id}</td>
                <td>{buyer}</td>
                <td>{status}</td>
                <td>{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="bg-[#0A3D79] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#124E9C] transition">
          Add Product
        </button>
        <button className="bg-gray-100 text-[#0A3D79] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
          Manage Inventory
        </button>
      </div>
    </motion.div>
  );
}
