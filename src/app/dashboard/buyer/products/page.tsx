"use client";

export default function BuyerProductsPage() {
  const products = [
    { id: "P001", name: "Cotton T-Shirt", category: "Tops", price: "₹799", status: "Available" },
    { id: "P002", name: "Denim Jacket", category: "Outerwear", price: "₹1,999", status: "Out of Stock" },
    { id: "P003", name: "Cargo Pants", category: "Bottomwear", price: "₹1,499", status: "Available" },
    { id: "P004", name: "Hoodie Classic", category: "Hoodies", price: "₹1,299", status: "Available" },
  ];

  return (
    <main className="p-8 bg-[#F9FAFB] min-h-screen">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-2">Your Products</h1>
      <p className="text-gray-600 mb-6">Manage your purchased or favorited products.</p>

      <section className="bg-white p-6 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b bg-gray-50">
              <th className="pb-3 px-3">Product ID</th>
              <th className="pb-3 px-3">Name</th>
              <th className="pb-3 px-3">Category</th>
              <th className="pb-3 px-3">Price</th>
              <th className="pb-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 text-gray-700">
                <td className="px-3 py-2">{p.id}</td>
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2">{p.price}</td>
                <td className={`px-3 py-2 font-semibold ${p.status === "Available" ? "text-green-600" : "text-red-500"}`}>
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
