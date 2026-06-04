import connectDB from "@/lib/db";
import { requireAdminPage } from "@/lib/authz";
import UserModel from "@/models/UserModel";
import PartnersTable, { type PartnerRow } from "@/components/dashboard/PartnersTable";
import {
  DashboardPage,
  DashboardPageHeader,
  MetricCard,
  MetricGrid,
} from "@/components/dashboard/DashboardPrimitives";
import { ShieldCheck, ShoppingBag, Store, Users } from "lucide-react";

export default async function ManagePartnersPage() {
  await requireAdminPage();

  await connectDB();
  const [docs, buyers, sellers, admins] = await Promise.all([
    UserModel.find({}).select("-password").sort({ createdAt: -1 }).lean().exec(),
    UserModel.countDocuments({ role: "buyer" }),
    UserModel.countDocuments({ role: "seller" }),
    UserModel.countDocuments({ role: "admin" }),
  ]);
  const partners: PartnerRow[] = JSON.parse(JSON.stringify(docs));

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="Partner management"
        description="Browse registered buyers, sellers, and internal admin accounts from one readable table."
      />
      <MetricGrid>
        <MetricCard icon={Users} label="Total Accounts" value={partners.length} />
        <MetricCard icon={ShoppingBag} label="Registered Buyers" value={buyers} />
        <MetricCard icon={Store} label="Active Sellers" value={sellers} tone="emerald" />
        <MetricCard icon={ShieldCheck} label="Admins" value={admins} tone="slate" />
      </MetricGrid>
      <PartnersTable partners={partners} />
    </DashboardPage>
  );
}

