"use client";

import { Users } from "lucide-react";
import DashboardTable, {
  type DashboardTableColumn,
  type DashboardTableFilter,
} from "@/components/dashboard/DashboardTable";
import { StatusBadge } from "@/components/dashboard/DashboardPrimitives";

export type PartnerRow = {
  _id: string;
  name?: string;
  email?: string;
  role?: "admin" | "buyer" | "seller" | "user";
  phone?: string;
  businessName?: string;
  shopName?: string;
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

export default function PartnersTable({ partners }: { partners: PartnerRow[] }) {
  const columns: DashboardTableColumn<PartnerRow>[] = [
    {
      id: "name",
      header: "Name",
      width: "25%",
      searchValue: (partner) => `${partner.name || ""} ${partner.businessName || ""}`,
      cell: (partner) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-950">
            {partner.name || "Unnamed user"}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {partner.businessName || partner.shopName || "No business name"}
          </p>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      width: "27%",
      searchValue: (partner) => partner.email || "",
      cell: (partner) => <span className="block truncate">{partner.email || "-"}</span>,
    },
    {
      id: "phone",
      header: "Phone",
      width: "14%",
      searchValue: (partner) => partner.phone || "",
      cell: (partner) => <span className="block truncate">{partner.phone || "-"}</span>,
    },
    {
      id: "role",
      header: "Role",
      width: "14%",
      cell: (partner) => {
        const role = partner.role || "user";
        return (
          <StatusBadge
            status={
              role === "seller"
                ? "approved"
                : role === "buyer"
                ? "in_process"
                : role === "admin"
                ? "cancelled"
                : "ignored"
            }
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </StatusBadge>
        );
      },
    },
    {
      id: "joined",
      header: "Joined",
      width: "20%",
      cell: (partner) => <span className="block truncate">{formatDate(partner.createdAt)}</span>,
    },
  ];

  const filters: DashboardTableFilter<PartnerRow>[] = [
    { label: "Buyers", value: "buyer", predicate: (partner) => partner.role === "buyer" },
    { label: "Sellers", value: "seller", predicate: (partner) => partner.role === "seller" },
    { label: "Admins", value: "admin", predicate: (partner) => partner.role === "admin" },
  ];

  return (
    <DashboardTable
      title="Buyers and sellers"
      description="Search account contacts, business names, and roles."
      data={partners}
      columns={columns}
      getRowKey={(partner) => partner._id}
      searchPlaceholder="Search partners"
      filters={filters}
      filterLabel="Role"
      emptyIcon={Users}
      emptyTitle="No partners found"
      emptyDescription="Registered buyers and sellers will appear here."
      renderMobileCard={(partner) => {
        const role = partner.role || "user";

        return (
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-950">
                  {partner.name || "Unnamed user"}
                </p>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {partner.businessName || partner.shopName || "No business name"}
                </p>
              </div>
              <StatusBadge
                status={
                  role === "seller"
                    ? "approved"
                    : role === "buyer"
                    ? "in_process"
                    : role === "admin"
                    ? "cancelled"
                    : "ignored"
                }
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </StatusBadge>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="col-span-2">
                <dt className="text-xs font-medium text-slate-500">Email</dt>
                <dd className="mt-1 truncate text-slate-800">{partner.email || "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Phone</dt>
                <dd className="mt-1 truncate text-slate-800">{partner.phone || "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Joined</dt>
                <dd className="mt-1 text-slate-800">{formatDate(partner.createdAt)}</dd>
              </div>
            </dl>
          </article>
        );
      }}
    />
  );
}
