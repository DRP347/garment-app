"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  PackageSearch,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import DashboardTable, {
  type DashboardTableColumn,
  type DashboardTableFilter,
} from "@/components/dashboard/DashboardTable";
import {
  DashboardPage,
  DashboardPageHeader,
  MetricCard,
  MetricGrid,
  StatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import DashboardStatusSelect from "@/components/dashboard/DashboardStatusSelect";
import { formatINR } from "@/lib/utils";

type OrderStatus = "in_process" | "purchased" | "cancelled" | "ignored";

type AdminOrder = {
  _id: string;
  orderId?: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  userEmail?: string;
  sellerId?: string;
  sellerName?: string;
  items?: {
    name?: string;
    quantity?: number;
    price?: number;
    sellerId?: string;
  }[];
  totalAmount?: number;
  total?: number;
  status?: OrderStatus | "pending" | string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
};

async function readJson<T>(res: Response): Promise<T | { error?: string }> {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as T;
  } catch {
    return { error: "Server returned an invalid response" };
  }
}

function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function orderTotal(order: AdminOrder) {
  return Number(order.totalAmount ?? order.total ?? 0);
}

function orderItems(order: AdminOrder) {
  if (!order.items?.length) return "-";
  return order.items
    .map((item) => `${item.name || "Item"} x ${item.quantity || 1}`)
    .join(", ");
}

function sellerLabel(order: AdminOrder) {
  if (order.sellerName) return order.sellerName;
  if (order.sellerId) return order.sellerId;

  const itemSeller = order.items?.find((item) => item.sellerId)?.sellerId;
  return itemSeller || "Direct / Admin Product";
}

function normalizedOrderStatus(status?: AdminOrder["status"]): OrderStatus {
  if (status === "purchased" || status === "cancelled" || status === "ignored") {
    return status;
  }

  return "in_process";
}

const STICKY_ACTION_HEADER_CLASS =
  "sticky right-0 z-[4] min-w-[156px] border-l border-slate-200 bg-slate-100/95 shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.2)] text-right";

const STICKY_ACTION_CELL_CLASS =
  "sticky right-0 z-[2] min-w-[156px] border-l border-slate-200 bg-white shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.2)] text-right";

const ORDER_STATUS_OPTIONS = [
  { label: "In Process", value: "in_process" },
  { label: "Purchased", value: "purchased" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Ignored", value: "ignored" },
] as const satisfies readonly { label: string; value: OrderStatus }[];

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await readJson<AdminOrder[]>(res);

      if (res.ok && Array.isArray(data)) {
        setOrders(data);
      } else {
        setError("error" in data && data.error ? data.error : "Failed to load orders");
      }
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(order: AdminOrder, status: OrderStatus) {
    const id = order._id || order.orderId;
    if (!id) return;

    setUpdatingId(id);
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await readJson<AdminOrder>(res);

      if (res.ok && "_id" in data) {
        setOrders((current) =>
          current.map((item) => (item._id === data._id ? data : item))
        );
      } else {
        setError("error" in data && data.error ? data.error : "Failed to update order");
      }
    } catch {
      setError("Failed to update order");
    } finally {
      setUpdatingId("");
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const counts = useMemo(
    () =>
      orders.reduce(
        (acc, order) => {
          const status = normalizedOrderStatus(order.status);
          if (status === "purchased") acc.purchased += 1;
          else if (status === "cancelled") acc.cancelled += 1;
          else if (status === "ignored") acc.ignored += 1;
          else acc.inProcess += 1;
          return acc;
        },
        { inProcess: 0, purchased: 0, cancelled: 0, ignored: 0 }
      ),
    [orders]
  );

  const columns: DashboardTableColumn<AdminOrder>[] = [
    {
      id: "order",
      header: "Order ID",
      width: "110px",
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
      width: "170px",
      searchValue: (order) => `${order.buyerName || ""} ${order.buyerEmail || ""}`,
      cell: (order) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-950">
            {order.buyerName || "Buyer"}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {order.buyerEmail || order.userEmail || "-"}
          </p>
        </div>
      ),
    },
    {
      id: "seller",
      header: "Seller",
      width: "120px",
      searchValue: sellerLabel,
      cell: (order) => <span className="block truncate">{sellerLabel(order)}</span>,
    },
    {
      id: "products",
      header: "Products",
      width: "220px",
      searchValue: orderItems,
      cell: (order) => (
        <span className="block truncate" title={orderItems(order)}>
          {orderItems(order)}
        </span>
      ),
    },
    {
      id: "value",
      header: "Value",
      width: "96px",
      cell: (order) => (
        <span className="font-mono font-semibold text-slate-950">
          {formatINR(orderTotal(order))}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: "124px",
      className: "whitespace-nowrap",
      cell: (order) => (
        <span className="inline-flex min-w-[116px]">
          <StatusBadge status={normalizedOrderStatus(order.status)} />
        </span>
      ),
    },
    {
      id: "created",
      header: "Created",
      width: "112px",
      cell: (order) => <span className="block truncate">{formatDate(order.createdAt)}</span>,
    },
    {
      id: "updated",
      header: "Updated",
      width: "112px",
      cell: (order) => <span className="block truncate">{formatDate(order.updatedAt)}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      width: "156px",
      headerClassName: STICKY_ACTION_HEADER_CLASS,
      className: STICKY_ACTION_CELL_CLASS,
      cell: (order) => {
        const rowId = order._id || order.orderId || "";
        const disabled = updatingId === rowId;

        return (
          <DashboardStatusSelect
            disabled={disabled}
            onChange={(status) => updateStatus(order, status)}
            options={ORDER_STATUS_OPTIONS}
            value={normalizedOrderStatus(order.status)}
          />
        );
      },
    },
  ];

  const filters: DashboardTableFilter<AdminOrder>[] = [
    { label: "In Process", value: "in_process", predicate: (order) => normalizedOrderStatus(order.status) === "in_process" },
    { label: "Purchased", value: "purchased", predicate: (order) => normalizedOrderStatus(order.status) === "purchased" },
    { label: "Cancelled", value: "cancelled", predicate: (order) => normalizedOrderStatus(order.status) === "cancelled" },
    { label: "Ignored", value: "ignored", predicate: (order) => normalizedOrderStatus(order.status) === "ignored" },
  ];

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="Order management"
        description="Review WhatsApp order intents and update the status buyers see in their dashboard."
      />

      <MetricGrid>
        <MetricCard icon={Clock3} label="In Process" value={counts.inProcess} tone="amber" />
        <MetricCard icon={CheckCircle2} label="Purchased" value={counts.purchased} tone="emerald" />
        <MetricCard icon={XCircle} label="Cancelled" value={counts.cancelled} tone="rose" />
        <MetricCard icon={ShoppingBag} label="Ignored" value={counts.ignored} tone="slate" />
      </MetricGrid>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <DashboardTable
        title="Orders / inquiries"
        description="Search buyers, sellers, products, or order IDs. Status actions use the existing admin order API."
        data={orders}
        columns={columns}
        getRowKey={(order) => order._id}
        searchPlaceholder="Search orders"
        filters={filters}
        filterLabel="Status"
        emptyIcon={PackageSearch}
        emptyTitle="No orders found"
        emptyDescription="WhatsApp inquiries created by buyers will appear here."
        loading={loading}
        minTableWidth="1220px"
        renderMobileCard={(order) => {
          const rowId = order._id || order.orderId || "";
          const disabled = updatingId === rowId;

          return (
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
                <StatusBadge status={normalizedOrderStatus(order.status)} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <dt className="text-xs font-medium text-slate-500">Products</dt>
                  <dd className="mt-1 text-slate-800">{orderItems(order)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Seller</dt>
                  <dd className="mt-1 truncate text-slate-800">{sellerLabel(order)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Value</dt>
                  <dd className="mt-1 font-mono font-semibold text-slate-950">
                    {formatINR(orderTotal(order))}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Created</dt>
                  <dd className="mt-1 text-slate-800">{formatDate(order.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Updated</dt>
                  <dd className="mt-1 text-slate-800">{formatDate(order.updatedAt)}</dd>
                </div>
              </dl>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <DashboardStatusSelect
                  disabled={disabled}
                  fullWidth
                  onChange={(status) => updateStatus(order, status)}
                  options={ORDER_STATUS_OPTIONS}
                  value={normalizedOrderStatus(order.status)}
                />
              </div>
            </article>
          );
        }}
      />
    </DashboardPage>
  );
}
