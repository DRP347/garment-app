"use client";

export default function BuyerDashboardPage() {
  const orders = [
    { id: "#0012", date: "2025-10-10", status: "Delivered", amount: "₹1,499" },
    { id: "#0013", date: "2025-10-12", status: "Processing", amount: "₹899" },
    { id: "#0014", date: "2025-10-14", status: "Cancelled", amount: "₹1,099" },
  ];

  return (
    <main className="p-8 bg-[#F9FAFB] min-h-screen">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-2">Welcome, Buyer!</h1>
      <p className="text-gray-600 mb-8">Here’s a quick overview of your account.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Active Orders" value="3" />
        <StatCard title="Delivered" value="12" />
        <StatCard title="Cancelled" value="1" />
      </div>

      {/* Recent Orders */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#0A3D79]">Recent Orders</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b bg-gray-50">
              <th className="pb-2 px-3">Order ID</th>
              <th className="pb-2 px-3">Date</th>
              <th className="pb-2 px-3">Status</th>
              <th className="pb-2 px-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50 transition text-gray-700">
                <td className="px-3 py-2">{order.id}</td>
                <td className="px-3 py-2">{order.date}</td>
                <td className="px-3 py-2">{order.status}</td>
                <td className="px-3 py-2">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <h3 className="text-[#0A3D79] font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
