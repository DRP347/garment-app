"use client";

import { Store, Users } from "lucide-react";
import DashboardTable, {
  type DashboardTableColumn,
} from "@/components/dashboard/DashboardTable";

export type AdminUserRow = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  shopName?: string;
  businessType?: string;
  location?: string;
  createdAt?: string;
  ordersCount?: number;
  lastActivityAt?: string;
  submittedProductsCount?: number;
  approvedProductsCount?: number;
};

function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function displayBusiness(user: AdminUserRow) {
  return user.businessName || user.shopName || "-";
}

export function AdminBuyersTable({ buyers }: { buyers: AdminUserRow[] }) {
  const columns: DashboardTableColumn<AdminUserRow>[] = [
    {
      id: "name",
      header: "Name",
      width: "22%",
      searchValue: (buyer) => `${buyer.name || ""} ${buyer.email || ""}`,
      cell: (buyer) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-950">
            {buyer.name || "Unnamed buyer"}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {buyer.location || "No location"}
          </p>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      width: "26%",
      searchValue: (buyer) => buyer.email || "",
      cell: (buyer) => <span className="block truncate">{buyer.email || "-"}</span>,
    },
    {
      id: "phone",
      header: "Phone",
      width: "16%",
      searchValue: (buyer) => buyer.phone || "",
      cell: (buyer) => <span className="block truncate">{buyer.phone || "-"}</span>,
    },
    {
      id: "joined",
      header: "Joined",
      width: "13%",
      cell: (buyer) => <span className="block truncate">{formatDate(buyer.createdAt)}</span>,
    },
    {
      id: "orders",
      header: "Orders / Inquiries",
      width: "12%",
      className: "whitespace-nowrap",
      cell: (buyer) => (
        <span className="font-mono font-semibold text-slate-900">
          {buyer.ordersCount ?? 0}
        </span>
      ),
    },
    {
      id: "lastActivity",
      header: "Last Activity",
      width: "11%",
      cell: (buyer) => (
        <span className="block truncate">{formatDate(buyer.lastActivityAt)}</span>
      ),
    },
  ];

  return (
    <DashboardTable
      title="Registered buyers"
      description="Buyer accounts only, with real inquiry activity when available."
      data={buyers}
      columns={columns}
      getRowKey={(buyer) => buyer._id}
      searchPlaceholder="Search buyers"
      emptyIcon={Users}
      emptyTitle="No buyers found"
      emptyDescription="Buyer accounts will appear here after registration."
      minTableWidth="980px"
      renderMobileCard={(buyer) => (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">
              {buyer.name || "Unnamed buyer"}
            </p>
            <p className="mt-1 truncate text-sm text-slate-500">{buyer.email || "-"}</p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs font-medium text-slate-500">Phone</dt>
              <dd className="mt-1 truncate text-slate-800">{buyer.phone || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Joined</dt>
              <dd className="mt-1 text-slate-800">{formatDate(buyer.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Inquiries</dt>
              <dd className="mt-1 font-mono font-semibold text-slate-950">
                {buyer.ordersCount ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Last activity</dt>
              <dd className="mt-1 text-slate-800">{formatDate(buyer.lastActivityAt)}</dd>
            </div>
          </dl>
        </article>
      )}
    />
  );
}

export function AdminSellersTable({ sellers }: { sellers: AdminUserRow[] }) {
  const columns: DashboardTableColumn<AdminUserRow>[] = [
    {
      id: "name",
      header: "Name",
      width: "18%",
      searchValue: (seller) => `${seller.name || ""} ${seller.email || ""}`,
      cell: (seller) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-950">
            {seller.name || "Unnamed seller"}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {seller.location || "No location"}
          </p>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      width: "22%",
      searchValue: (seller) => seller.email || "",
      cell: (seller) => <span className="block truncate">{seller.email || "-"}</span>,
    },
    {
      id: "phone",
      header: "Phone",
      width: "12%",
      searchValue: (seller) => seller.phone || "",
      cell: (seller) => <span className="block truncate">{seller.phone || "-"}</span>,
    },
    {
      id: "business",
      header: "Business",
      width: "18%",
      searchValue: displayBusiness,
      cell: (seller) => (
        <span className="block truncate">{displayBusiness(seller)}</span>
      ),
    },
    {
      id: "businessType",
      header: "Business Type",
      width: "13%",
      searchValue: (seller) => seller.businessType || "",
      cell: (seller) => (
        <span className="block truncate">{seller.businessType || "-"}</span>
      ),
    },
    {
      id: "submitted",
      header: "Submitted",
      width: "8%",
      className: "whitespace-nowrap",
      cell: (seller) => (
        <span className="font-mono font-semibold text-slate-900">
          {seller.submittedProductsCount ?? 0}
        </span>
      ),
    },
    {
      id: "approved",
      header: "Approved",
      width: "8%",
      className: "whitespace-nowrap",
      cell: (seller) => (
        <span className="font-mono font-semibold text-slate-900">
          {seller.approvedProductsCount ?? 0}
        </span>
      ),
    },
    {
      id: "joined",
      header: "Joined",
      width: "11%",
      cell: (seller) => <span className="block truncate">{formatDate(seller.createdAt)}</span>,
    },
  ];

  return (
    <DashboardTable
      title="Registered sellers"
      description="Seller accounts only, with real submitted and approved product counts."
      data={sellers}
      columns={columns}
      getRowKey={(seller) => seller._id}
      searchPlaceholder="Search sellers"
      emptyIcon={Store}
      emptyTitle="No sellers found"
      emptyDescription="Seller accounts will appear here after registration."
      minTableWidth="1100px"
      renderMobileCard={(seller) => (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">
              {seller.name || "Unnamed seller"}
            </p>
            <p className="mt-1 truncate text-sm text-slate-500">{seller.email || "-"}</p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="col-span-2">
              <dt className="text-xs font-medium text-slate-500">Business</dt>
              <dd className="mt-1 truncate text-slate-800">{displayBusiness(seller)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Phone</dt>
              <dd className="mt-1 truncate text-slate-800">{seller.phone || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Business type</dt>
              <dd className="mt-1 truncate text-slate-800">{seller.businessType || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Submitted</dt>
              <dd className="mt-1 font-mono font-semibold text-slate-950">
                {seller.submittedProductsCount ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Approved</dt>
              <dd className="mt-1 font-mono font-semibold text-slate-950">
                {seller.approvedProductsCount ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Joined</dt>
              <dd className="mt-1 text-slate-800">{formatDate(seller.createdAt)}</dd>
            </div>
          </dl>
        </article>
      )}
    />
  );
}
