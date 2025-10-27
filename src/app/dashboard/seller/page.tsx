export default function SellerOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0A3D79]">Seller Overview</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { k: "Active Listings", v: 24 },
          { k: "Pending Orders", v: 7 },
          { k: "Revenue (30d)", v: "₹1.8L" },
        ].map((c) => (
          <div key={c.k} className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">{c.k}</p>
            <p className="text-2xl font-semibold mt-1">{c.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
