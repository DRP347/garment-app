import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { UserRound } from "lucide-react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dashboardPathForRole } from "@/lib/authz";

function roleLabel(role?: string) {
  if (role === "admin") return "Admin";
  if (role === "seller") return "Seller";
  if (role === "buyer") return "Buyer";
  return "Account";
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0A3D79]">
          Profile / Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Review your account details for this dashboard.
        </p>
      </div>

      <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[#EAF1FF] text-[#0A3D79]">
            <UserRound size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-950">
              {user?.name || "Account"}
            </h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-500">Email</dt>
                <dd className="mt-1 truncate text-slate-900">
                  {user?.email || "-"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Role</dt>
                <dd className="mt-1 text-slate-900">
                  {roleLabel(user?.role)}
                </dd>
              </div>
            </dl>
            <Link
              href={dashboardPathForRole(user?.role)}
              className="mt-5 inline-flex rounded-lg bg-[#0A3D79] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124E9C]"
            >
              Back to overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
