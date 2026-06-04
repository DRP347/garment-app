import Link from "next/link";
import {
  Boxes,
  CheckCircle2,
  Clock3,
  Package,
  PackageCheck,
  Percent,
  ShoppingBag,
  Users,
} from "lucide-react";
import connectDB from "@/lib/db";
import { requireAdminPage } from "@/lib/authz";
import OrderModel from "@/models/OrderModel";
import ProductModel from "@/models/ProductModel";
import UserModel from "@/models/UserModel";
import {
  DashboardPage,
  DashboardPageHeader,
  MetricCard,
  MetricGrid,
  StatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { formatINR } from "@/lib/utils";

type RecentOrder = {
  _id: string;
  orderId?: string;
  buyerName?: string;
  buyerEmail?: string;
  status?: string;
  totalAmount?: number;
  total?: number;
  updatedAt?: string;
};

type RecentProduct = {
  _id: string;
  name: string;
  category?: string;
  approved?: boolean;
  sellerId?: string;
};

function percentage(part: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function orderTotal(order: RecentOrder) {
  return Number(order.totalAmount ?? order.total ?? 0);
}

function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  await requireAdminPage();
  await connectDB();

  const [
    totalProducts,
    pendingProducts,
    activeSellers,
    registeredBuyers,
    ordersInProcess,
    completedOrders,
    cancelledOrders,
    ignoredOrders,
    totalOrders,
    recentOrdersDocs,
    recentProductsDocs,
  ] = await Promise.all([
    ProductModel.countDocuments({}),
    ProductModel.countDocuments({ approved: false }),
    UserModel.countDocuments({ role: "seller" }),
    UserModel.countDocuments({ role: "buyer" }),
    OrderModel.countDocuments({ status: "in_process" }),
    OrderModel.countDocuments({ status: "purchased" }),
    OrderModel.countDocuments({ status: "cancelled" }),
    OrderModel.countDocuments({ status: "ignored" }),
    OrderModel.countDocuments({}),
    OrderModel.find({}).sort({ updatedAt: -1 }).limit(5).lean().exec(),
    ProductModel.find({}).sort({ createdAt: -1 }).limit(5).lean().exec(),
  ]);

  const recentOrders: RecentOrder[] = JSON.parse(JSON.stringify(recentOrdersDocs));
  const recentProducts: RecentProduct[] = JSON.parse(JSON.stringify(recentProductsDocs));
  const abandonedInquiries = cancelledOrders + ignoredOrders;

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="Admin overview"
        description="A live operating view of catalogue health, buyer activity, seller participation, and WhatsApp order intent."
        actions={
          <>
            <Link
              href="/dashboard/admin/products/new"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0A3D79] px-4 text-sm font-semibold text-white transition hover:bg-[#124E9C] active:translate-y-px"
            >
              Add product
            </Link>
            <Link
              href="/dashboard/admin/orders"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:translate-y-px"
            >
              Review orders
            </Link>
          </>
        }
      />

      <MetricGrid>
        <MetricCard icon={Package} label="Total Products" value={totalProducts} />
        <MetricCard
          icon={Clock3}
          label="Pending Products"
          value={pendingProducts}
          tone="amber"
        />
        <MetricCard icon={Users} label="Active Sellers" value={activeSellers} />
        <MetricCard
          icon={ShoppingBag}
          label="Registered Buyers"
          value={registeredBuyers}
          tone="slate"
        />
        <MetricCard
          icon={Boxes}
          label="Orders In Process"
          value={ordersInProcess}
          tone="amber"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Completed Orders"
          value={completedOrders}
          tone="emerald"
        />
        <MetricCard
          icon={PackageCheck}
          label="Abandoned Inquiries"
          value={abandonedInquiries}
          tone="rose"
        />
        <MetricCard
          icon={Percent}
          label="Conversion Rate"
          value={percentage(completedOrders, totalOrders)}
          helper={`${completedOrders} purchased of ${totalOrders} total inquiries`}
        />
      </MetricGrid>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_22px_45px_-35px_rgba(15,23,42,0.65)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Recent order activity
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Latest buyer inquiries and status changes.
              </p>
            </div>
            <Link
              href="/dashboard/admin/orders"
              className="text-sm font-semibold text-[#0A3D79] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.length === 0 ? (
              <p className="py-8 text-sm text-slate-500">No order activity yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="grid gap-3 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">
                      {order.orderId || `#${order._id.slice(-6).toUpperCase()}`}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {order.buyerName || order.buyerEmail || "Buyer"}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                  <div className="text-left sm:text-right">
                    <p className="font-mono text-sm font-semibold text-slate-950">
                      {formatINR(orderTotal(order))}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(order.updatedAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_22px_45px_-35px_rgba(15,23,42,0.65)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Latest products
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                New catalogue entries and seller submissions.
              </p>
            </div>
            <Link
              href="/dashboard/admin/products"
              className="text-sm font-semibold text-[#0A3D79] hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProducts.length === 0 ? (
              <p className="py-8 text-sm text-slate-500">No products yet.</p>
            ) : (
              recentProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">
                      {product.name}
                    </p>
                    <p className="mt-1 truncate text-sm capitalize text-slate-500">
                      {product.category || "Uncategorized"}
                    </p>
                  </div>
                  <StatusBadge status={Boolean(product.approved)} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </DashboardPage>
  );
}

