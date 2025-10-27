"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerNewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: "",
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Preview images instantly
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urls = e.target.value.split(",").map((u) => u.trim());
    setPreviewImages(urls);
    setFormData((prev) => ({ ...prev, images: e.target.value }));
  };

  // Submit to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: formData.images.split(",").map((i) => i.trim()),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        router.push("/dashboard/seller/products");
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch (err) {
      console.error("Error submitting product:", err);
      alert("An error occurred while submitting product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#EEF2FF] to-[#EAF1FF] p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-[#0A3D79] mb-6">Upload New Product</h1>
        <p className="text-gray-500 mb-8">
          Add product details below. Once submitted, it will be reviewed by admin for approval.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0A3D79] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0A3D79] outline-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0A3D79] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0A3D79] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0A3D79] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs (comma-separated)
            </label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleImageChange}
              placeholder="e.g. /images/jeans1.jpg, /images/jeans2.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0A3D79] outline-none"
            />
          </div>

          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {previewImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative h-40 w-full border rounded-lg overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-[#0A3D79] text-white font-medium py-3 rounded-xl hover:bg-[#124E9C] transition"
          >
            {loading ? "Uploading..." : "Submit Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
