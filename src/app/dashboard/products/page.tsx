"use client";

import { useEffect, useState } from "react";
import { normalizeImagePath, formatINR } from "@/lib/utils";
import Image from "next/image";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  approved: boolean;
};

export default function SellerProducts() {
  const [mine, setMine] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "", images: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const r = await fetch("/api/seller/products");
    if (r.ok) setMine(await r.json());
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setLoading(true);
    const res = await fetch("/api/seller/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        images: form.images.split(",").map((x) => x.trim()).filter(Boolean),
      }),
    });
    setLoading(false);
    if (res.ok) {
      setForm({ name: "", price: "", stock: "", category: "", images: "" });
      await load();
      alert("Submitted for approval.");
    } else {
      const e = await res.json();
      alert(e.message || "Failed");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-[#0A3D79]">Seller Products</h1>

      <div className="bg-white rounded-xl border p-4 grid md:grid-cols-2 gap-4">
        <input className="border rounded p-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input className="border rounded p-2" placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})}/>
        <input className="border rounded p-2" placeholder="Stock" value={form.stock} onChange={(e)=>setForm({...form,stock:e.target.value})}/>
        <input className="border rounded p-2" placeholder="Category" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}/>
        <input className="md:col-span-2 border rounded p-2" placeholder="Image URLs, comma separated" value={form.images} onChange={(e)=>setForm({...form,images:e.target.value})}/>
        <button disabled={loading} onClick={submit} className="md:col-span-2 px-4 py-2 rounded-lg bg-[#0A3D79] text-white">
          {loading ? "Saving…" : "Submit for approval"}
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b">
              <th className="p-3">Product</th><th>Price</th><th>Stock</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((p)=>(
              <tr key={p._id} className="border-b">
                <td className="p-3 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded overflow-hidden border">
                    <Image src={normalizeImagePath(p.images?.[0])} alt={p.name} fill className="object-cover"/>
                  </div>
                  {p.name}
                </td>
                <td>{formatINR(p.price)}</td>
                <td>{p.stock}</td>
                <td>{p.approved ? <span className="text-green-600">Approved</span> : <span className="text-amber-600">Pending</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
