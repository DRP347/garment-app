"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Package, Plus } from "lucide-react";
import DashboardTable, {
  type DashboardTableColumn,
  type DashboardTableFilter,
} from "@/components/dashboard/DashboardTable";
import {
  DashboardPage,
  DashboardPageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { formatINR, normalizeImagePath } from "@/lib/utils";

type SellerProduct = {
  _id: string;
  name: string;
  images?: string[];
  price?: number;
  stock?: number;
  category?: string;
  approved?: boolean;
  createdAt?: string;
  meta?: {
    moq?: number;
    pdfUrl?: string;
  };
};

type ApiBody<T> = T & {
  error?: string;
  message?: string;
};

async function readResponseBody<T>(res: Response): Promise<ApiBody<T>> {
  const text = await res.text();

  if (!text) return {} as ApiBody<T>;

  try {
    return JSON.parse(text) as ApiBody<T>;
  } catch {
    return {
      error: res.ok
        ? "Server returned an invalid response"
        : `Request failed with status ${res.status}`,
    } as ApiBody<T>;
  }
}

function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function normalizeFilePath(path?: string) {
  if (!path) return "";
  const cleaned = path.replace(/\\/g, "/").replace(/"/g, "").trim();
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;
  return `/${cleaned.replace(/^public\//i, "")}`;
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/seller/products");
        const data = await readResponseBody<SellerProduct[]>(res);

        if (!mounted) return;

        if (res.ok && Array.isArray(data)) {
          setProducts(data);
        } else {
          setError(data.error || data.message || "Failed to load products");
        }
      } catch (loadError) {
        console.error("SELLER_PRODUCTS_LOAD_ERROR:", loadError);
        if (mounted) setError("Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const columns: DashboardTableColumn<SellerProduct>[] = [
    {
      id: "product",
      header: "Product",
      width: "28%",
      searchValue: (product) => product.name,
      cell: (product) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-11 w-11 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={normalizeImagePath(product.images?.[0])}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="min-w-0 truncate font-semibold text-slate-950">
            {product.name}
          </span>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      width: "13%",
      searchValue: (product) => product.category || "",
      cell: (product) => (
        <span className="block truncate capitalize">{product.category || "-"}</span>
      ),
    },
    {
      id: "moq",
      header: "MOQ",
      width: "8%",
      cell: (product) => <span className="font-mono">{product.meta?.moq ?? "-"}</span>,
    },
    {
      id: "price",
      header: "Price",
      width: "11%",
      cell: (product) => (
        <span className="font-mono font-semibold text-slate-950">
          {formatINR(Number(product.price || 0))}
        </span>
      ),
    },
    {
      id: "stock",
      header: "Stock",
      width: "8%",
      cell: (product) => <span className="font-mono">{product.stock ?? 0}</span>,
    },
    {
      id: "status",
      header: "Status",
      width: "12%",
      cell: (product) => <StatusBadge status={Boolean(product.approved)} />,
    },
    {
      id: "submitted",
      header: "Submitted",
      width: "12%",
      cell: (product) => <span className="block truncate">{formatDate(product.createdAt)}</span>,
    },
    {
      id: "catalogue",
      header: "PDF",
      width: "8%",
      cell: (product) =>
        product.meta?.pdfUrl ? (
          <a
            href={normalizeFilePath(product.meta.pdfUrl)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[#0A3D79] hover:underline"
          >
            <FileText size={15} />
            Open
          </a>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
  ];

  const filters: DashboardTableFilter<SellerProduct>[] = [
    { label: "Pending", value: "pending", predicate: (product) => !product.approved },
    { label: "Approved", value: "approved", predicate: (product) => Boolean(product.approved) },
  ];

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="My products"
        description="Submitted products stay pending until admin approval."
        actions={
          <Link
            href="/dashboard/seller/products/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D79] px-4 text-sm font-semibold text-white transition hover:bg-[#124E9C] active:translate-y-px"
          >
            <Plus size={17} />
            Add product
          </Link>
        }
      />

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <DashboardTable
        title="Submitted products"
        description="Track product details, catalogue links, and approval status."
        data={products}
        columns={columns}
        getRowKey={(product) => product._id}
        searchPlaceholder="Search products"
        filters={filters}
        filterLabel="Status"
        emptyIcon={Package}
        emptyTitle="No products submitted yet"
        emptyDescription="Submit your first garment with image paths, quantity details, and catalogue information for admin review."
        loading={loading}
        renderMobileCard={(product) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={normalizeImagePath(product.images?.[0])}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold text-slate-950">{product.name}</p>
                  <StatusBadge status={Boolean(product.approved)} />
                </div>
                <p className="mt-1 truncate text-sm capitalize text-slate-500">
                  {product.category || "Uncategorized"}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-slate-500">Price</dt>
                <dd className="mt-1 font-mono font-semibold text-slate-950">
                  {formatINR(Number(product.price || 0))}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">MOQ</dt>
                <dd className="mt-1 font-mono text-slate-800">
                  {product.meta?.moq ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Stock</dt>
                <dd className="mt-1 font-mono text-slate-800">{product.stock ?? 0}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Submitted</dt>
                <dd className="mt-1 text-slate-800">{formatDate(product.createdAt)}</dd>
              </div>
            </dl>
            {product.meta?.pdfUrl ? (
              <a
                href={normalizeFilePath(product.meta.pdfUrl)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-[#0A3D79] transition hover:bg-slate-50"
              >
                Open catalogue
              </a>
            ) : null}
          </article>
        )}
      />
    </DashboardPage>
  );
}
