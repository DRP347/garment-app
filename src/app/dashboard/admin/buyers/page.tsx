import connectDB from "@/lib/db";
import { requireAdminPage } from "@/lib/authz";
import OrderModel from "@/models/OrderModel";
import UserModel from "@/models/UserModel";
import {
  DashboardPage,
  DashboardPageHeader,
  MetricCard,
  MetricGrid,
} from "@/components/dashboard/DashboardPrimitives";
import { AdminBuyersTable, type AdminUserRow } from "@/components/dashboard/AdminUsersTable";
import { ClipboardList, ShoppingBag, Users } from "lucide-react";

type BuyerActivity = {
  _id: string;
  count: number;
  lastActivityAt?: Date;
};

export default async function AdminBuyersPage() {
  await requireAdminPage();
  await connectDB();

  const buyerDocs = await UserModel.find({ role: "buyer" })
    .select("-password")
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  const buyerEmails = buyerDocs
    .map((buyer) => buyer.email)
    .filter((email): email is string => Boolean(email));

  const activity = buyerEmails.length
    ? await OrderModel.aggregate<BuyerActivity>([
        {
          $match: {
            $or: [
              { buyerEmail: { $in: buyerEmails } },
              { userEmail: { $in: buyerEmails } },
            ],
          },
        },
        {
          $group: {
            _id: { $ifNull: ["$buyerEmail", "$userEmail"] },
            count: { $sum: 1 },
            lastActivityAt: { $max: "$updatedAt" },
          },
        },
      ])
    : [];

  const activityByEmail = new Map(
    activity.map((item) => [
      item._id,
      {
        count: item.count,
        lastActivityAt: item.lastActivityAt
          ? new Date(item.lastActivityAt).toISOString()
          : undefined,
      },
    ])
  );

  const buyers: AdminUserRow[] = buyerDocs.map((buyer) => {
    const stats = buyer.email ? activityByEmail.get(buyer.email) : undefined;

    return {
      ...JSON.parse(JSON.stringify(buyer)),
      ordersCount: stats?.count ?? 0,
      lastActivityAt: stats?.lastActivityAt,
    };
  });

  const totalInquiries = buyers.reduce(
    (sum, buyer) => sum + Number(buyer.ordersCount || 0),
    0
  );
  const activeBuyers = buyers.filter((buyer) => Number(buyer.ordersCount || 0) > 0).length;

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="Buyer management"
        description="View buyer accounts separately from sellers and track real inquiry activity."
      />
      <MetricGrid>
        <MetricCard icon={Users} label="Registered Buyers" value={buyers.length} />
        <MetricCard icon={ClipboardList} label="Total Inquiries" value={totalInquiries} tone="amber" />
        <MetricCard icon={ShoppingBag} label="Active Buyers" value={activeBuyers} tone="emerald" />
      </MetricGrid>
      <AdminBuyersTable buyers={buyers} />
    </DashboardPage>
  );
}
