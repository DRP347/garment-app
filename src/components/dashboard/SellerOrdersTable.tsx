"use client";

import { PackageSearch } from "lucide-react";
import DashboardTable, {
  type DashboardTableColumn,
  type DashboardTableFilter,
} from "@/components/dashboard/DashboardTable";
import { StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { formatINR } from "@/lib/utils";

export type SellerOrderRow = {
  _id: string;
  orderId?: string;
  buyerName?: string;
  buyerEmail?: string;
  items?: { name?: string; quantity?: number; price?: number; sellerId?: string }[];
  totalAmount?: number;
  total?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function orderTotal(order: SellerOrderRow) {
  return Number(order.totalAmount ?? order.total ?? 0);
}

function orderItems(order: SellerOrderRow) {
  if (!order.items?.length) return "-";
  return order.items
    .map((item) => `${item.name || "Item"} x ${item.quantity || 1}`)
    .join(", ");
}

export default function SellerOrdersTable({ orders }: { orders: SellerOrderRow[] }) {
  const columns: DashboardTableColumn<SellerOrderRow>[] = [
    {
      id: "order",
      header: "Order / Inquiry",
      width: "17%",
      searchValue: (order) => order.orderId || order._id,
      cell: (order) => (
        <span className="block truncate font-mono font-semibold text-slate-950">
          {order.orderId || `#${order._id.slice(-6).toUpperCase()}`}
        </span>
      ),
    },
    {
      id: "buyer",
      header: "Buyer",
      width: "22%",
      searchValue: (order) => `${order.buyerName || ""} ${order.buyerEmail || ""}`,
      cell: (order) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-950">
            {order.buyerName || "Buyer"}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {order.buyerEmail || "-"}
          </p>
        </div>
      ),
    },
    {
      id: "items",
      header: "Items",
      width: "29%",
      searchValue: orderItems,
      cell: (order) => (
        <span className="block truncate" title={orderItems(order)}>
          {orderItems(order)}
        </span>
      ),
    },
    {
      id: "total",
      header: "Total",
      width: "13%",
      cell: (order) => (
        <span className="font-mono font-semibold text-slate-950">
          {formatINR(orderTotal(order))}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: "11%",
      cell: (order) => <StatusBadge status={order.status} />,
    },
    {
      id: "date",
      header: "Date",
      width: "8%",
      cell: (order) => <span className="block truncate">{formatDate(order.createdAt)}</span>,
    },
  ];

  const filters: DashboardTableFilter<SellerOrderRow>[] = [
    {
      label: "In Process",
      value: "in_process",
      predicate: (order) =>
        order.status !== "purchased" &&
        order.status !== "cancelled" &&
        order.status !== "ignored",
    },
    { label: "Purchased", value: "purchased", predicate: (order) => order.status === "purchased" },
    { label: "Cancelled", value: "cancelled", predicate: (order) => order.status === "cancelled" },
    { label: "Ignored", value: "ignored", predicate: (order) => order.status === "ignored" },
  ];

  return (
    <DashboardTable
      title="Orders / leads"
      description="Real buyer inquiries linked to your submitted products."
      data={orders}
      columns={columns}
      getRowKey={(order) => order._id}
      searchPlaceholder="Search leads"
      filters={filters}
      filterLabel="Status"
      emptyIcon={PackageSearch}
      emptyTitle="No orders or leads yet"
      emptyDescription="When buyers inquire about your approved products, they will appear here."
      renderMobileCard={(order) => (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-mono font-semibold text-slate-950">
                {order.orderId || `#${order._id.slice(-6).toUpperCase()}`}
              </p>
              <p className="mt-1 truncate text-sm text-slate-500">
                {order.buyerName || order.buyerEmail || "Buyer"}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="col-span-2">
              <dt className="text-xs font-medium text-slate-500">Items</dt>
              <dd className="mt-1 text-slate-800">{orderItems(order)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Total</dt>
              <dd className="mt-1 font-mono font-semibold text-slate-950">
                {formatINR(orderTotal(order))}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Date</dt>
              <dd className="mt-1 text-slate-800">{formatDate(order.createdAt)}</dd>
            </div>
          </dl>
        </article>
      )}
    />
  );
}

