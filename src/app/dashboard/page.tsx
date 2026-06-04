import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

function dashboardPathForRole(role?: string) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "seller") return "/dashboard/seller";
  if (role === "buyer") return "/dashboard/buyer";
  return "/login";
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  redirect(dashboardPathForRole(session.user.role));
}
