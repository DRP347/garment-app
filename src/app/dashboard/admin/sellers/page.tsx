import connectDB from "@/lib/db";
import { requireAdminPage } from "@/lib/authz";
import ProductModel from "@/models/ProductModel";
import UserModel from "@/models/UserModel";
import {
  DashboardPage,
  DashboardPageHeader,
  MetricCard,
  MetricGrid,
} from "@/components/dashboard/DashboardPrimitives";
import { AdminSellersTable, type AdminUserRow } from "@/components/dashboard/AdminUsersTable";
import { CheckCircle2, Package, Store } from "lucide-react";

type SellerProductStats = {
  _id: string;
  submitted: number;
  approved: number;
};

export default async function AdminSellersPage() {
  await requireAdminPage();
  await connectDB();

  const sellerDocs = await UserModel.find({ role: "seller" })
    .select("-password")
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  const sellerEmails = sellerDocs
    .map((seller) => seller.email)
    .filter((email): email is string => Boolean(email));

  const productStats = sellerEmails.length
    ? await ProductModel.aggregate<SellerProductStats>([
        { $match: { sellerId: { $in: sellerEmails } } },
        {
          $group: {
            _id: "$sellerId",
            submitted: { $sum: 1 },
            approved: {
              $sum: {
                $cond: [{ $eq: ["$approved", true] }, 1, 0],
              },
            },
          },
        },
      ])
    : [];

  const statsByEmail = new Map(
    productStats.map((item) => [
      item._id,
      { submitted: item.submitted, approved: item.approved },
    ])
  );

  const sellers: AdminUserRow[] = sellerDocs.map((seller) => {
    const stats = seller.email ? statsByEmail.get(seller.email) : undefined;

    return {
      ...JSON.parse(JSON.stringify(seller)),
      submittedProductsCount: stats?.submitted ?? 0,
      approvedProductsCount: stats?.approved ?? 0,
    };
  });

  const submittedTotal = sellers.reduce(
    (sum, seller) => sum + Number(seller.submittedProductsCount || 0),
    0
  );
  const approvedTotal = sellers.reduce(
    (sum, seller) => sum + Number(seller.approvedProductsCount || 0),
    0
  );

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="Seller management"
        description="View seller accounts separately from buyers and track real product submissions."
      />
      <MetricGrid>
        <MetricCard icon={Store} label="Registered Sellers" value={sellers.length} />
        <MetricCard icon={Package} label="Submitted Products" value={submittedTotal} tone="amber" />
        <MetricCard icon={CheckCircle2} label="Approved Products" value={approvedTotal} tone="emerald" />
      </MetricGrid>
      <AdminSellersTable sellers={sellers} />
    </DashboardPage>
  );
}
