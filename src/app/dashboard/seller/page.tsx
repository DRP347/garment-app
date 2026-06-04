import Link from "next/link";
import { CheckCircle2, Clock3, Package, Plus } from "lucide-react";
import connectDB from "@/lib/db";
import { requireDashboardRolePage } from "@/lib/authz";
import ProductModel from "@/models/ProductModel";
import {
  DashboardPage,
  DashboardPageHeader,
  EmptyState,
  MetricCard,
  MetricGrid,
  StatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { formatINR, normalizeImagePath } from "@/lib/utils";

type SellerProduct = {
  _id: string;
  name: string;
  images?: string[];
  price?: number;
  category?: string;
  approved?: boolean;
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

export default async function SellerOverview() {
  const session = await requireDashboardRolePage("seller");
  const sellerEmail = session.user.email;

  await connectDB();
  const [totalProducts, approvedProducts, pendingProducts, recentDocs] =
    await Promise.all([
      ProductModel.countDocuments({ sellerId: sellerEmail }),
      ProductModel.countDocuments({ sellerId: sellerEmail, approved: true }),
      ProductModel.countDocuments({ sellerId: sellerEmail, approved: false }),
      ProductModel.find({ sellerId: sellerEmail })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .exec(),
    ]);

  const recentProducts: SellerProduct[] = JSON.parse(JSON.stringify(recentDocs));

  return (
    <DashboardPage>
      <DashboardPageHeader
        title={`Welcome, ${session.user.name || "Seller"}`}
        description="Track your submitted garments and admin approval status."
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

      <MetricGrid>
        <MetricCard icon={Package} label="Submitted Products" value={totalProducts} />
        <MetricCard
          icon={Clock3}
          label="Pending Approval"
          value={pendingProducts}
          tone="amber"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Approved Products"
          value={approvedProducts}
          tone="emerald"
        />
      </MetricGrid>

      {totalProducts === 0 ? (
        <EmptyState
          icon={Package}
          title="No products submitted yet"
          description="Submit your first garment for admin review. Products remain private until admin approval."
          action={
            <Link
              href="/dashboard/seller/products/new"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0A3D79] px-4 text-sm font-semibold text-white transition hover:bg-[#124E9C] active:translate-y-px"
            >
              Add Product
            </Link>
          }
        />
      ) : (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_22px_45px_-35px_rgba(15,23,42,0.65)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Recent submitted products
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Latest products submitted from your seller account.
              </p>
            </div>
            <Link
              href="/dashboard/seller/products"
              className="text-sm font-semibold text-[#0A3D79] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProducts.map((product) => (
              <div
                key={product._id}
                className="grid gap-3 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
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
                    <p className="truncate font-semibold text-slate-950">
                      {product.name}
                    </p>
                    <p className="mt-1 truncate text-sm capitalize text-slate-500">
                      {product.category || "Uncategorized"} · {formatDate(product.createdAt)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={Boolean(product.approved)} />
                <p className="font-mono text-sm font-semibold text-slate-950 sm:text-right">
                  {formatINR(Number(product.price || 0))}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </DashboardPage>
  );
}

