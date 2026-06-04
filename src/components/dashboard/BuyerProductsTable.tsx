"use client";

import Link from "next/link";
import { PackageSearch } from "lucide-react";
import DashboardTable, {
  type DashboardTableColumn,
  type DashboardTableFilter,
} from "@/components/dashboard/DashboardTable";
import { StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { formatINR, normalizeImagePath } from "@/lib/utils";

export type BuyerProductRow = {
  id: string;
  productId?: string;
  name: string;
  image?: string;
  price?: number;
  quantity?: number;
  status?: string;
  orderId?: string;
  createdAt?: string;
};

function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function BuyerProductsTable({ products }: { products: BuyerProductRow[] }) {
  const columns: DashboardTableColumn<BuyerProductRow>[] = [
    {
      id: "product",
      header: "Product",
      width: "34%",
      searchValue: (product) => product.name,
      cell: (product) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-11 w-11 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={normalizeImagePath(product.image)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">{product.name}</p>
            <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
              {product.orderId || "Inquiry"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "quantity",
      header: "Quantity",
      width: "12%",
      cell: (product) => <span className="font-mono">{product.quantity || 1}</span>,
    },
    {
      id: "price",
      header: "Price",
      width: "15%",
      cell: (product) => (
        <span className="font-mono font-semibold text-slate-950">
          {formatINR(Number(product.price || 0))}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: "17%",
      cell: (product) => <StatusBadge status={product.status} />,
    },
    {
      id: "date",
      header: "Inquiry Date",
      width: "14%",
      cell: (product) => <span className="block truncate">{formatDate(product.createdAt)}</span>,
    },
    {
      id: "action",
      header: "Action",
      width: "8%",
      headerClassName: "text-right",
      className: "text-right",
      cell: (product) =>
        product.productId ? (
          <Link
            href={`/products/${product.productId}`}
            className="font-semibold text-[#0A3D79] hover:underline"
          >
            View
          </Link>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
  ];

  const filters: DashboardTableFilter<BuyerProductRow>[] = [
    {
      label: "In Process",
      value: "in_process",
      predicate: (product) =>
        product.status !== "purchased" &&
        product.status !== "cancelled" &&
        product.status !== "ignored",
    },
    { label: "Purchased", value: "purchased", predicate: (product) => product.status === "purchased" },
    { label: "Cancelled", value: "cancelled", predicate: (product) => product.status === "cancelled" },
  ];

  return (
    <DashboardTable
      title="Products from my inquiries"
      description="Only products you inquired about or purchased are listed here."
      data={products}
      columns={columns}
      getRowKey={(product) => product.id}
      searchPlaceholder="Search products"
      filters={filters}
      filterLabel="Status"
      emptyIcon={PackageSearch}
      emptyTitle="No products yet"
      emptyDescription="Products you inquire about or purchase will appear here."
      renderMobileCard={(product) => (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-14 w-14 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={normalizeImagePath(product.image)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-semibold text-slate-950">{product.name}</p>
                <StatusBadge status={product.status} />
              </div>
              <p className="mt-1 truncate font-mono text-xs text-slate-500">
                {product.orderId || "Inquiry"}
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
              <dt className="text-xs font-medium text-slate-500">Quantity</dt>
              <dd className="mt-1 font-mono text-slate-800">{product.quantity || 1}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs font-medium text-slate-500">Inquiry date</dt>
              <dd className="mt-1 text-slate-800">{formatDate(product.createdAt)}</dd>
            </div>
          </dl>
          {product.productId ? (
            <Link
              href={`/products/${product.productId}`}
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-[#0A3D79] transition hover:bg-slate-50"
            >
              View product
            </Link>
          ) : null}
        </article>
      )}
    />
  );
}

