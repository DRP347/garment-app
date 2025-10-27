"use client";

import { useEffect, useState } from "react";

interface Product {
  _id?: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  status?: string;
}

export default function SellerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch seller's products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/seller/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          console.error("Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add product (POST /api/products)
  const addProduct = async () => {
    if (!draft.name || !draft.price || !draft.stock) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          price: Number(draft.price),
          stock: Number(draft.stock),
          category: draft.category,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setProducts((prev) => [...prev, data.product]);
        setDraft({ name: "", price: "", stock: "", category: "" });
      } else {
        alert(data.message || "Error submitting product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#EEF2FF] to-[#EAF1FF] px-8 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-[#0A3D79]">My Products</h1>

      {/* Add Product Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-5">
        <h2 className="text-xl font-semibold text-[#0A3D79] mb-4">Add New Product</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#0A3D79] outline-none"
          />
          <input
            placeholder="Price"
            type="number"
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            className="border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#0A3D79] outline-none"
          />
          <input
            placeholder="Stock"
            type="number"
            value={draft.stock}
            onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
            className="border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#0A3D79] outline-none"
          />
          <input
            placeholder="Category"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            className="border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#0A3D79] outline-none"
          />
        </div>

        <button
          onClick={addProduct}
          disabled={submitting}
          className="mt-4 bg-[#0A3D79] hover:bg-[#124E9C] text-white font-semibold px-6 py-2.5 rounded-lg transition"
        >
          {submitting ? "Submitting..." : "Add Product"}
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold text-[#0A3D79] mb-4">Uploaded Products</h2>

        {loading ? (
          <p className="text-[#0A3D79]">Loading products...</p>
        ) : products.length > 0 ? (
          <table className="min-w-[700px] w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b">
                <th className="pb-2">Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="border-t text-gray-700 hover:bg-gray-50 transition"
                >
                  <td className="py-2">{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.category || "—"}</td>
                  <td
                    className={`font-semibold ${
                      p.status === "approved"
                        ? "text-green-600"
                        : p.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {p.status || "pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-4">No products found.</p>
        )}
      </div>
    </div>
  );
}
