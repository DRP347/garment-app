"use client";

import { motion } from "framer-motion";

export default function BuyerDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-semibold text-[#0A3D79] mb-6">Welcome Back, Buyer!</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Active Orders", value: 3 },
          { title: "Delivered", value: 12 },
          { title: "Cancelled", value: 1 },
          { title: "Total Spent", value: "₹24,500" },
        ].map((item, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-5 text-center">
            <h3 className="text-lg font-semibold text-[#124E9C]">{item.title}</h3>
            <p className="text-2xl font-bold text-[#0A3D79] mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-[#0A3D79] mb-4">Recent Orders</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-[#124E9C]">
              <th className="py-2">Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["#0012", "2025-10-10", "Delivered", "₹1,499"],
              ["#0013", "2025-10-12", "Processing", "₹899"],
              ["#0014", "2025-10-14", "Cancelled", "₹1,099"],
            ].map(([id, date, status, amount], i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="py-2">{id}</td>
                <td>{date}</td>
                <td>{status}</td>
                <td>{amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
