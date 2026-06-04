import Link from "next/link";
import { CheckCircle2, Clock3, PackageSearch, ShoppingBag, XCircle } from "lucide-react";
import connectDB from "@/lib/db";
import { requireDashboardRolePage } from "@/lib/authz";
import OrderModel from "@/models/OrderModel";
import BuyerOrdersTable, {
  type BuyerOrderRow,
} from "@/components/dashboard/BuyerOrdersTable";
import {
  DashboardPage,
  DashboardPageHeader,
  EmptyState,
  MetricCard,
  MetricGrid,
  StatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { formatINR } from "@/lib/utils";

function orderTotal(order: BuyerOrderRow) {
  return Number(order.totalAmount ?? order.total ?? 0);
}

function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function firstItem(order: BuyerOrderRow) {
  return order.items?.[0]?.name || "Inquiry";
}

export default async function BuyerDashboardPage() {
  const session = await requireDashboardRolePage("buyer");
  const email = session.user.email;

  await connectDB();
  const docs = await OrderModel.find({
    $or: [{ buyerEmail: email }, { userEmail: email }],
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  const orders: BuyerOrderRow[] = JSON.parse(JSON.stringify(docs));
  const counts = orders.reduce(
    (acc, order) => {
      acc.total += 1;
      if (order.status === "purchased") acc.purchased += 1;
      else if (order.status === "cancelled") acc.cancelled += 1;
      else acc.pending += 1;
      return acc;
    },
    { total: 0, purchased: 0, pending: 0, cancelled: 0 }
  );
  const recentOrders = orders.slice(0, 5);

  return (
    <DashboardPage>
      <DashboardPageHeader
        title={`Welcome, ${session.user.name || "Buyer"}`}
        description="Your real WhatsApp inquiries and purchase status updates are collected here."
        actions={
          <Link
            href="/dashboard/buyer/products"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D79] px-4 text-sm font-semibold text-white transition hover:bg-[#124E9C] active:translate-y-px"
          >
            <PackageSearch size={17} />
            Browse products
          </Link>
        }
      />

      <MetricGrid>
        <MetricCard icon={ShoppingBag} label="Total Inquiries" value={counts.total} />
        <MetricCard
          icon={CheckCircle2}
          label="Purchased Orders"
          value={counts.purchased}
          tone="emerald"
        />
        <MetricCard icon={Clock3} label="Pending Orders" value={counts.pending} tone="amber" />
        <MetricCard
          icon={XCircle}
          label="Cancelled Orders"
          value={counts.cancelled}
          tone="rose"
        />
      </MetricGrid>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Start exploring products and continue to WhatsApp when you are ready. Your inquiry will appear here after it is created."
          action={
            <Link
              href="/dashboard/buyer/products"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0A3D79] px-4 text-sm font-semibold text-white transition hover:bg-[#124E9C] active:translate-y-px"
            >
              Explore products
            </Link>
          }
        />
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_22px_45px_-35px_rgba(15,23,42,0.65)]">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-950">Recent activity</h2>
              <p className="mt-1 text-sm text-slate-600">
                Latest inquiry changes from your account.
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="grid gap-3 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">
                      {firstItem(order)}
                    </p>
                    <p className="mt-1 truncate font-mono text-xs text-slate-500">
                      {order.orderId || `#${order._id.slice(-6).toUpperCase()}`} ·{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                  <p className="font-mono text-sm font-semibold text-slate-950 sm:text-right">
                    {formatINR(orderTotal(order))}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <BuyerOrdersTable
            orders={orders}
            title="My orders"
            description="Every inquiry created from your WhatsApp checkout flow."
          />
        </>
      )}
    </DashboardPage>
  );
}

