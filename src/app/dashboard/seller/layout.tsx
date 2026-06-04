import { requireDashboardRolePage } from "@/lib/authz";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardRolePage("seller");

  return <>{children}</>;
}
