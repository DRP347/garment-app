"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeImagePath } from "@/lib/utils";

type ApiResponse = {
  error?: string;
  message?: string;
};

type ProductFormState = {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  moq: string;
  fabric: string;
  sizes: string;
  colors: string;
  images: string;
  pdfUrl: string;
  sellerNotes: string;
};

const initialForm: ProductFormState = {
  name: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  moq: "",
  fabric: "",
  sizes: "",
  colors: "",
  images: "",
  pdfUrl: "",
  sellerNotes: "",
};

async function readResponseBody(res: Response): Promise<ApiResponse> {
  const text = await res.text();

  if (!text) return {};

  try {
    return JSON.parse(text) as ApiResponse;
  } catch {
    return {
      error: res.ok
        ? "Server returned an invalid response"
        : `Request failed with status ${res.status}`,
    };
  }
}

function splitList(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function descriptionLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function SellerNewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [loading, setLoading] = useState(false);

  const previewImages = useMemo(() => splitList(form.images), [form.images]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.price || !form.stock) {
      alert("Please fill in product name, category, price, and stock.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          description: descriptionLines(form.description),
          price: Number(form.price),
          stock: Number(form.stock),
          images: previewImages,
          meta: {
            moq: form.moq ? Number(form.moq) : undefined,
            fabric: form.fabric,
            sizes: splitList(form.sizes),
            colors: splitList(form.colors),
            pdfUrl: form.pdfUrl,
            sellerNotes: form.sellerNotes,
          },
        }),
      });

      const data = await readResponseBody(res);

      if (res.ok) {
        alert(data.message || "Product submitted successfully");
        router.push("/dashboard/seller/products");
        router.refresh();
      } else {
        alert(data.error || data.message || "Failed to create product");
      }
    } catch (error) {
      console.error("SELLER_PRODUCT_SUBMIT_ERROR:", error);
      alert("An error occurred while submitting product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F7FB] p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0A3D79]">
              Submit Product
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Add garment details for admin review before public listing.
            </p>
          </div>
          <Link
            href="/dashboard/seller/products"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to products
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <SectionTitle title="Product Details" />
              <Field
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
                <Field
                  label="Fabric"
                  name="fabric"
                  value={form.fabric}
                  onChange={handleChange}
                  placeholder="Cotton, denim, rayon"
                />
              </div>
              <Textarea
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Use one line per key product detail."
                rows={4}
              />

              <SectionTitle title="Pricing and Quantity" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="Price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
                <Field
                  label="Stock / Quantity"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
                <Field
                  label="MOQ"
                  name="moq"
                  type="number"
                  min="0"
                  value={form.moq}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <SectionTitle title="Options" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Textarea
                  label="Size Options"
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="S, M, L, XL"
                  rows={3}
                />
                <Textarea
                  label="Color Options"
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="Black, Navy, White"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-5">
              <SectionTitle title="Media and Review Notes" />
              <Textarea
                label="Product Image Paths / URLs"
                name="images"
                value={form.images}
                onChange={handleChange}
                placeholder={"/products/shirt-1.jpg\nhttps://example.com/shirt-2.jpg"}
                rows={5}
              />

              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {previewImages.slice(0, 4).map((src) => (
                    <div
                      key={src}
                      className="h-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={normalizeImagePath(src)}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Field
                label="Catalogue / PDF URL or Path"
                name="pdfUrl"
                value={form.pdfUrl}
                onChange={handleChange}
                placeholder="/catalogues/product.pdf"
              />
              <Textarea
                label="Notes for Admin"
                name="sellerNotes"
                value={form.sellerNotes}
                onChange={handleChange}
                placeholder="Share production notes, lead time, customization details, or anything admin should review."
                rows={5}
              />

              <div className="rounded-lg border border-[#0A3D79]/15 bg-[#F4F7FB] p-4 text-sm leading-6 text-slate-600">
                Products submitted here are saved as pending approval and will
                not appear publicly until admin approval.
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/seller/products"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-[#0A3D79] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124E9C] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="border-b border-slate-100 pb-2 text-sm font-bold uppercase tracking-wide text-[#0A3D79]">
      {title}
    </h2>
  );
}

function Field(
  props: { label: string } & React.InputHTMLAttributes<HTMLInputElement>
) {
  const { label, ...inputProps } = props;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...inputProps}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#0A3D79] focus:ring-2 focus:ring-[#0A3D79]/20"
      />
    </div>
  );
}

function Textarea(
  props: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const { label, ...textareaProps } = props;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        {...textareaProps}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#0A3D79] focus:ring-2 focus:ring-[#0A3D79]/20"
      />
    </div>
  );
}
