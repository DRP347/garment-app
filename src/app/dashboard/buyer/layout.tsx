import { requireDashboardRolePage } from "@/lib/authz";

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardRolePage("buyer");

  return <>{children}</>;
}
