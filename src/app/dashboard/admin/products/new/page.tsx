"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Package, DollarSign, BarChart3, Image as ImageIcon, FileText } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) return alert((await res.json())?.message || "Create failed");
    router.push("/dashboard/admin/products");
    router.refresh();
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#0A3D79] mb-6">Add New Product</h1>

      <form
        onSubmit={onSubmit}
        className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6"
      >
        <Field icon={<Package size={18} />} label="Product Name" name="name" placeholder="Premium Denim Jacket" required />
        <Textarea icon={<FileText size={18} />} label="Description" name="description" placeholder="Describe the product…" required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field icon={<DollarSign size={18} />} label="Price" name="price" type="number" step="0.01" required />
          <Field icon={<BarChart3 size={18} />} label="Stock" name="stock" type="number" required />
        </div>
        <Field icon={<Package size={18} />} label="Category" name="category" placeholder="Denim" required />
        <Textarea icon={<ImageIcon size={18} />} label="Image URLs (comma separated)" name="images" required />

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-lg bg-[#0A3D79] text-white font-semibold hover:bg-[#124E9C] disabled:bg-gray-400"
        >
          {saving ? "Saving…" : "Save Product"}
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
