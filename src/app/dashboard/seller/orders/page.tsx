import Link from "next/link";
import { PackageSearch, Plus } from "lucide-react";
import connectDB from "@/lib/db";
import { requireDashboardRolePage } from "@/lib/authz";
import OrderModel from "@/models/OrderModel";
import SellerOrdersTable, {
  type SellerOrderRow,
} from "@/components/dashboard/SellerOrdersTable";
import {
  DashboardPage,
  DashboardPageHeader,
  EmptyState,
} from "@/components/dashboard/DashboardPrimitives";

export default async function SellerOrdersPage() {
  const session = await requireDashboardRolePage("seller");
  const sellerEmail = session.user.email;

  await connectDB();
  const docs = await OrderModel.find({
    $or: [{ sellerId: sellerEmail }, { "items.sellerId": sellerEmail }],
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  const orders: SellerOrderRow[] = JSON.parse(JSON.stringify(docs));

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="Orders / leads"
        description="Real buyer inquiries linked to products submitted from your seller account."
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

      {orders.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No orders or leads yet"
          description="When buyers inquire about your approved products, they will appear here."
          action={
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/seller/products"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:translate-y-px"
              >
                View My Products
              </Link>
              <Link
                href="/dashboard/seller/products/new"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0A3D79] px-4 text-sm font-semibold text-white transition hover:bg-[#124E9C] active:translate-y-px"
              >
                Add Product
              </Link>
            </div>
          }
        />
      ) : (
        <SellerOrdersTable orders={orders} />
      )}
    </DashboardPage>
  );
}

