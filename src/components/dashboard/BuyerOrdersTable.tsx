"use client";

import { PackageSearch } from "lucide-react";
import DashboardTable, {
  type DashboardTableColumn,
  type DashboardTableFilter,
} from "@/components/dashboard/DashboardTable";
import { StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { formatINR } from "@/lib/utils";

export type BuyerOrderRow = {
  _id: string;
  orderId?: string;
  total?: number;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: { name?: string; quantity?: number; price?: number }[];
};

function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function orderTotal(order: BuyerOrderRow) {
  return Number(order.totalAmount ?? order.total ?? 0);
}

function orderItems(order: BuyerOrderRow) {
  if (!order.items?.length) return "-";
  return order.items
    .map((item) => `${item.name || "Item"} x ${item.quantity || 1}`)
    .join(", ");
}

export default function BuyerOrdersTable({
  orders,
  title = "My orders / inquiries",
  description = "Search and review the WhatsApp inquiries created from your account.",
}: {
  orders: BuyerOrderRow[];
  title?: string;
  description?: string;
}) {
  const columns: DashboardTableColumn<BuyerOrderRow>[] = [
    {
      id: "order",
      header: "Order",
      width: "17%",
      searchValue: (order) => order.orderId || order._id,
      cell: (order) => (
        <span className="block truncate font-mono font-semibold text-slate-950">
          {order.orderId || `#${order._id.slice(-6).toUpperCase()}`}
        </span>
      ),
    },
    {
      id: "items",
      header: "Items",
      width: "36%",
      searchValue: orderItems,
      cell: (order) => (
        <span className="block truncate" title={orderItems(order)}>
          {orderItems(order)}
        </span>
      ),
    },
    {
      id: "date",
      header: "Date",
      width: "16%",
      cell: (order) => <span className="block truncate">{formatDate(order.createdAt)}</span>,
    },
    {
      id: "status",
      header: "Status",
      width: "16%",
      cell: (order) => <StatusBadge status={order.status} />,
    },
    {
      id: "amount",
      header: "Amount",
      width: "15%",
      cell: (order) => (
        <span className="font-mono font-semibold text-slate-950">
          {formatINR(orderTotal(order))}
        </span>
      ),
    },
  ];

  const filters: DashboardTableFilter<BuyerOrderRow>[] = [
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
  ];

  return (
    <DashboardTable
      title={title}
      description={description}
      data={orders}
      columns={columns}
      getRowKey={(order) => order._id}
      searchPlaceholder="Search orders"
      filters={filters}
      filterLabel="Status"
      emptyIcon={PackageSearch}
      emptyTitle="No orders yet"
      emptyDescription="Start exploring products and continue to WhatsApp when you are ready."
      renderMobileCard={(order) => (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-mono font-semibold text-slate-950">
                {order.orderId || `#${order._id.slice(-6).toUpperCase()}`}
              </p>
              <p className="mt-1 truncate text-sm text-slate-500">
                {formatDate(order.createdAt)}
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
              <dt className="text-xs font-medium text-slate-500">Amount</dt>
              <dd className="mt-1 font-mono font-semibold text-slate-950">
                {formatINR(orderTotal(order))}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Updated</dt>
              <dd className="mt-1 text-slate-800">{formatDate(order.updatedAt)}</dd>
            </div>
          </dl>
        </article>
      )}
    />
  );
}
