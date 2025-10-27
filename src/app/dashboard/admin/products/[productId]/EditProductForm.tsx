"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Package, DollarSign, BarChart3, ImageIcon, FileText, Trash2 } from "lucide-react";

type ProductInput = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
};

export default function EditProductForm({ product }: { product: ProductInput }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      description: String(fd.get("description") || ""),
      price: Number(fd.get("price") || 0),
      category: String(fd.get("category") || ""),
      stock: Number(fd.get("stock") || 0),
      images: String(fd.get("images") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await fetch(`/api/admin/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) return alert((await res.json())?.message || "Update failed");
    router.push("/dashboard/admin/products");
    router.refresh();
  }

  async function onDelete() {
    if (!confirm("Delete this product?")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${product._id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) return alert((await res.json())?.message || "Delete failed");
    router.push("/dashboard/admin/products");
    router.refresh();
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0A3D79]">Edit Product</h1>
        <button
          onClick={onDelete}
          disabled={deleting || saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
        >
          <Trash2 size={16} />
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6"
      >
        <Field icon={<Package size={18} />} label="Product Name" name="name" defaultValue={product.name} required />
        <Textarea icon={<FileText size={18} />} label="Description" name="description" defaultValue={product.description} required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field icon={<DollarSign size={18} />} label="Price" name="price" type="number" step="0.01" defaultValue={product.price} required />
          <Field icon={<BarChart3 size={18} />} label="Stock" name="stock" type="number" defaultValue={product.stock} required />
        </div>

        <Field icon={<Package size={18} />} label="Category" name="category" defaultValue={product.category} required />
        <Textarea
          icon={<ImageIcon size={18} />}
          label="Image URLs (comma separated)"
          name="images"
          defaultValue={product.images?.join(", ")}
          required
        />

        <button
          type="submit"
          disabled={saving || deleting}
          className="w-full py-3 rounded-lg bg-[#0A3D79] text-white font-semibold hover:bg-[#124E9C] disabled:bg-gray-400"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function Field(props: { icon: React.ReactNode; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { icon, label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">{icon}</div>
        <input
          {...rest}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A3D79]"
        />
      </div>
    </div>
  );
}
function Textarea(
  props: { icon: React.ReactNode; label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const { icon, label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute top-3 left-3 text-gray-400">{icon}</div>
        <textarea
          {...rest}
          rows={3}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A3D79]"
        />
      </div>
    </div>
  );
}
