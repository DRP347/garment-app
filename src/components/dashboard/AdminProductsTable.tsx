"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronDown,
  EyeOff,
  FileText,
  Package,
  Pencil,
  Plus,
} from "lucide-react";
import DashboardTable, {
  type DashboardTableColumn,
  type DashboardTableFilter,
} from "@/components/dashboard/DashboardTable";
import { StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { formatINR, normalizeImagePath } from "@/lib/utils";

export type AdminProductRow = {
  _id: string;
  name: string;
  sku?: string;
  images?: string[];
  price?: number;
  stock?: number;
  category?: string;
  approved?: boolean;
  sellerId?: string;
  sellerName?: string;
  sellerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  meta?: {
    moq?: number;
    pdfUrl?: string;
  };
};

type ProductPatchResponse = {
  error?: string;
  message?: string;
  product?: AdminProductRow;
};

type ProductStatus = "approved" | "pending" | "hidden";

function normalizeFilePath(path?: string) {
  if (!path) return "";
  const cleaned = path.replace(/\\/g, "/").replace(/"/g, "").trim();
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;
  return `/${cleaned.replace(/^public\//i, "")}`;
}

function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function productSource(product: AdminProductRow) {
  return product.sellerId || product.sellerEmail
    ? "Seller Submission"
    : "Direct / Admin Product";
}

function productSourceDetail(product: AdminProductRow) {
  return product.sellerName || product.sellerEmail || product.sellerId || "Admin catalogue";
}

function productStatus(product: AdminProductRow): ProductStatus {
  if (product.approved) return "approved";
  if (product.sellerId || product.sellerEmail) return "pending";
  return "hidden";
}

function productStatusLabel(status: ProductStatus) {
  if (status === "approved") return "Approved";
  if (status === "pending") return "Pending Approval";
  return "Hidden";
}

function statusBadgeStatus(status: ProductStatus) {
  if (status === "approved") return "approved";
  if (status === "pending") return "pending";
  return "ignored";
}

async function readPatchResponse(res: Response): Promise<ProductPatchResponse> {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as ProductPatchResponse;
  } catch {
    return { error: "Server returned an invalid response" };
  }
}

export default function AdminProductsTable({ products }: { products: AdminProductRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(products);
  const [error, setError] = useState("");
  const [openProductId, setOpenProductId] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  async function updateApproval(product: AdminProductRow, approved: boolean) {
    setOpenProductId("");
    setError("");
    setUpdatingId(product._id);

    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const data = await readPatchResponse(res);

      if (res.ok && data.product) {
        setRows((current) =>
          current.map((item) => (item._id === data.product?._id ? data.product : item))
        );
        router.refresh();
      } else {
        setError(data.error || data.message || "Failed to update product status");
      }
    } catch {
      setError("Failed to update product status");
    } finally {
      setUpdatingId("");
    }
  }

  function reviewProduct(product: AdminProductRow) {
    setOpenProductId("");
    router.push(`/dashboard/admin/products/${product._id}`);
  }

  const columns: DashboardTableColumn<AdminProductRow>[] = [
    {
      id: "product",
      header: "Product",
      width: "250px",
      searchValue: (product) => `${product.name} ${product.sku || ""}`,
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
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">{product.name}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {product.sku || product.sellerId || "Direct product"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "source",
      header: "Source",
      width: "190px",
      searchValue: (product) => `${productSource(product)} ${productSourceDetail(product)}`,
      cell: (product) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{productSource(product)}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {productSourceDetail(product)}
          </p>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      width: "120px",
      searchValue: (product) => product.category || "",
      headerClassName: "whitespace-nowrap",
      className: "whitespace-nowrap",
      cell: (product) => (
        <span className="block truncate capitalize">{product.category || "-"}</span>
      ),
    },
    {
      id: "moq",
      header: "MOQ",
      width: "80px",
      headerClassName: "whitespace-nowrap",
      className: "whitespace-nowrap",
      cell: (product) => <span className="font-mono">{product.meta?.moq ?? "-"}</span>,
    },
    {
      id: "price",
      header: "Price",
      width: "100px",
      headerClassName: "whitespace-nowrap",
      className: "whitespace-nowrap",
      cell: (product) => (
        <span className="font-mono font-semibold text-slate-900">
          {formatINR(Number(product.price || 0))}
        </span>
      ),
    },
    {
      id: "stock",
      header: "Stock",
      width: "90px",
      headerClassName: "whitespace-nowrap",
      className: "whitespace-nowrap",
      cell: (product) => (
        <span className="font-mono text-slate-700">{product.stock ?? 0}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: "180px",
      headerClassName: "whitespace-nowrap",
      className: "whitespace-nowrap",
      cell: (product) => (
        <ProductStatusMenu
          disabled={updatingId === product._id}
          open={openProductId === product._id}
          product={product}
          onApprove={() => updateApproval(product, true)}
          onHide={() => updateApproval(product, false)}
          onReview={() => reviewProduct(product)}
          onToggle={() =>
            setOpenProductId((current) => (current === product._id ? "" : product._id))
          }
        />
      ),
    },
    {
      id: "catalogue",
      header: "PDF",
      width: "80px",
      headerClassName: "whitespace-nowrap",
      className: "whitespace-nowrap",
      cell: (product) =>
        product.meta?.pdfUrl ? (
          <a
            href={normalizeFilePath(product.meta.pdfUrl)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[#0A3D79] hover:underline"
          >
            <FileText size={15} />
            View
          </a>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      id: "updated",
      header: "Updated",
      width: "120px",
      headerClassName: "whitespace-nowrap",
      className: "whitespace-nowrap",
      cell: (product) => <span className="block truncate">{formatDate(product.updatedAt)}</span>,
    },
  ];

  const filters: DashboardTableFilter<AdminProductRow>[] = [
    {
      label: "Approved",
      value: "approved",
      predicate: (product) => productStatus(product) === "approved",
    },
    {
      label: "Pending Approval",
      value: "pending",
      predicate: (product) => productStatus(product) === "pending",
    },
    {
      label: "Hidden",
      value: "hidden",
      predicate: (product) => productStatus(product) === "hidden",
    },
    {
      label: "Seller Submissions",
      value: "seller",
      predicate: (product) => Boolean(product.sellerId || product.sellerEmail),
    },
  ];

  return (
    <>
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}
      <DashboardTable
        title="Products"
        description="Review catalogue items, seller submissions, stock, and approval state."
        data={rows}
        columns={columns}
        getRowKey={(product) => product._id}
        actions={
          <Link
            href="/dashboard/admin/products/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D79] px-4 text-sm font-semibold text-white transition hover:bg-[#124E9C] active:translate-y-px"
          >
            <Plus size={17} />
            Add product
          </Link>
        }
        searchPlaceholder="Search products"
        filters={filters}
        filterLabel="View"
        emptyIcon={Package}
        emptyTitle="No products found"
        emptyDescription="Products added by admin or submitted by sellers will appear here."
        minTableWidth="1210px"
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
                <p className="min-w-0 truncate font-semibold text-slate-950">
                  {product.name}
                </p>
                <p className="mt-1 truncate text-sm capitalize text-slate-500">
                  {product.category || "Uncategorized"}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="col-span-2">
                <dt className="text-xs font-medium text-slate-500">Source</dt>
                <dd className="mt-1 min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {productSource(product)}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {productSourceDetail(product)}
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Price</dt>
                <dd className="mt-1 font-mono font-semibold text-slate-950">
                  {formatINR(Number(product.price || 0))}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Stock</dt>
                <dd className="mt-1 font-mono text-slate-800">{product.stock ?? 0}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">MOQ</dt>
                <dd className="mt-1 font-mono text-slate-800">
                  {product.meta?.moq ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Updated</dt>
                <dd className="mt-1 text-slate-800">{formatDate(product.updatedAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Catalogue</dt>
                <dd className="mt-1">
                  {product.meta?.pdfUrl ? (
                    <a
                      href={normalizeFilePath(product.meta.pdfUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#0A3D79]"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </dd>
              </div>
            </dl>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <ProductStatusMenu
                disabled={updatingId === product._id}
                open={openProductId === product._id}
                product={product}
                onApprove={() => updateApproval(product, true)}
                onHide={() => updateApproval(product, false)}
                onReview={() => reviewProduct(product)}
                onToggle={() =>
                  setOpenProductId((current) => (current === product._id ? "" : product._id))
                }
              />
            </div>
          </article>
        )}
      />
    </>
  );
}

function ProductStatusMenu({
  disabled,
  onApprove,
  onHide,
  onReview,
  onToggle,
  open,
  product,
}: {
  disabled?: boolean;
  onApprove: () => void;
  onHide: () => void;
  onReview: () => void;
  onToggle: () => void;
  open: boolean;
  product: AdminProductRow;
}) {
  const status = productStatus(product);

  return (
    <div className="relative inline-flex w-full max-w-[180px]">
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className="inline-flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-left text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0A3D79]/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <StatusBadge status={statusBadgeStatus(status)}>
          {productStatusLabel(status)}
        </StatusBadge>
        <ChevronDown size={14} className="flex-none text-slate-400" />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl shadow-slate-900/12">
          <ProductMenuItem
            disabled={disabled || Boolean(product.approved)}
            icon={CheckCircle2}
            label="Approve product"
            description="Make this product visible in the public catalogue."
            onClick={onApprove}
            tone="approved"
          />
          <ProductMenuItem
            disabled={disabled || !product.approved}
            icon={EyeOff}
            label="Hide product"
            description="Remove this product from the public catalogue."
            onClick={onHide}
            tone="hidden"
          />
          <ProductMenuItem
            disabled={disabled}
            icon={Pencil}
            label="Review details"
            description="Open product details and edit this submission."
            onClick={onReview}
            tone="review"
          />
        </div>
      ) : null}
    </div>
  );
}

function ProductMenuItem({
  description,
  disabled,
  icon: Icon,
  label,
  onClick,
  tone,
}: {
  description: string;
  disabled?: boolean;
  icon: typeof CheckCircle2;
  label: string;
  onClick: () => void;
  tone: "approved" | "hidden" | "review";
}) {
  const iconTone =
    tone === "approved"
      ? "text-emerald-600"
      : tone === "hidden"
      ? "text-slate-500"
      : "text-[#0A3D79]";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
    >
      <Icon className={`mt-0.5 h-4 w-4 flex-none ${iconTone}`} />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        <span className="mt-0.5 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </button>
  );
}
