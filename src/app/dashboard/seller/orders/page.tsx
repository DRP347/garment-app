export default function SellerOrders() {
  const rows = [
    { id: "#0012", buyer: "A Khan", total: "₹1,499", status: "Processing" },
    { id: "#0013", buyer: "S Nair", total: "₹899", status: "Delivered" },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0A3D79]">Orders</h1>
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-[640px] w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm">
              <th className="py-2">Order</th><th>Buyer</th><th>Total</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2">{r.id}</td>
                <td>{r.buyer}</td>
                <td>{r.total}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
