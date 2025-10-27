"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Product = {
  name: string;
  sku: string;
  description: string;
  images: string[];
  price: number;
};

export default function LegacyEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = String(params?.productId || "");

  const [data, setData] = useState<Product>({
    name: "",
    sku: "",
    description: "",
    images: [""],
    price: 0,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/products/${productId}`);
        if (!res.ok) throw new Error("Failed to load product");
        setData(await res.json());
      } catch (e: any) {
        setErr(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setData((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, price: Number(data.price) }),
      });
      if (!res.ok) throw new Error((await res.json())?.message || "Update failed");
      router.push("/dashboard/admin/products");
    } catch (e: any) {
      setErr(e?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-6">Loading…</p>;
  if (err) return <p className="p-6 text-red-600">{err}</p>;

  const inp =
    "w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FACC15]";

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#0A3D79]">Edit Product</h1>

      <form onSubmit={onSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-sm space-y-6">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input className={inp} name="name" value={data.name} onChange={onChange} required />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">SKU</label>
            <input className={inp} name="sku" value={data.sku} onChange={onChange} required />
          </div>
          <div>
            <label className="text-sm font-medium">Price (₹)</label>
            <input className={inp} type="number" step="0.01" name="price" value={data.price} onChange={onChange} required />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea className={inp} name="description" rows={4} value={data.description} onChange={onChange} required />
        </div>

        <div>
          <label className="text-sm font-medium">Image URL</label>
          <input className={inp} name="images" value={data.images[0]} onChange={(e) => setData((p) => ({ ...p, images: [e.target.value] }))} />
        </div>

        {err && <p className="text-red-600 text-center">{err}</p>}

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/admin/products" className="px-5 py-2 rounded-md bg-gray-200">
            Cancel
          </Link>
          <button disabled={submitting} className="px-5 py-2 rounded-md bg-[#0A3D79] text-white">
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
