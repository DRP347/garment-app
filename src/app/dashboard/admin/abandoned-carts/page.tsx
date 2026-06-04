"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, MessageSquareText, PackageSearch, XCircle } from "lucide-react";
import DashboardTable, {
  type DashboardTableColumn,
  type DashboardTableFilter,
} from "@/components/dashboard/DashboardTable";
import {
  DashboardPage,
  DashboardPageHeader,
  MetricCard,
  MetricGrid,
  StatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import DashboardStatusSelect from "@/components/dashboard/DashboardStatusSelect";
import { formatINR } from "@/lib/utils";

type InquiryStatus = "in_process" | "purchased" | "cancelled" | "ignored";

type Inquiry = {
  _id: string;
  orderId?: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  items?: { name?: string; quantity?: number; price?: number }[];
  totalAmount?: number;
  total?: number;
  status?: InquiryStatus | string;
  createdAt?: string;
  updatedAt?: string;
};

async function readJson<T>(res: Response): Promise<T | { error?: string }> {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as T;
  } catch {
    return { error: "Server returned an invalid response" };
  }
}

function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function firstProduct(inquiry: Inquiry) {
  return inquiry.items?.[0]?.name || "Inquiry";
}

function totalQuantity(inquiry: Inquiry) {
  return (
    inquiry.items?.reduce((sum, item) => sum + Number(item.quantity || 1), 0) || 0
  );
}

function inquiryValue(inquiry: Inquiry) {
  return Number(inquiry.totalAmount ?? inquiry.total ?? 0);
}

function inquiryStatus(status?: string) {
  if (status === "purchased") return "Converted";
  if (status === "cancelled" || status === "ignored") return "Lost";
  return "Contacted";
}

function inquiryStatusValue(status?: string) {
  if (status === "purchased") return "purchased";
  if (status === "cancelled" || status === "ignored") return "ignored";
  return "in_process";
}

function inquiryStatusBadge(status?: string) {
  if (status === "purchased") return "converted";
  if (status === "cancelled" || status === "ignored") return "lost";
  return "in_process";
}

const INQUIRY_STATUS_OPTIONS = [
  { label: "Contacted", value: "in_process" },
  { label: "Converted", value: "purchased" },
  { label: "Lost", value: "ignored" },
] as const satisfies readonly { label: string; value: InquiryStatus }[];

export default function AbandonedInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  async function loadInquiries() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await readJson<Inquiry[]>(res);

      if (res.ok && Array.isArray(data)) {
        setInquiries(data);
      } else {
        setError("error" in data && data.error ? data.error : "Failed to load inquiries");
      }
    } catch {
      setError("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }

  async function markInquiry(inquiry: Inquiry, status: InquiryStatus) {
    const id = inquiry._id || inquiry.orderId;
    if (!id) return;

    setUpdatingId(id);
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await readJson<Inquiry>(res);

      if (res.ok && "_id" in data) {
        setInquiries((current) =>
          current.map((item) => (item._id === data._id ? data : item))
        );
      } else {
        setError("error" in data && data.error ? data.error : "Failed to update inquiry");
      }
    } catch {
      setError("Failed to update inquiry");
    } finally {
      setUpdatingId("");
    }
  }

  useEffect(() => {
    loadInquiries();
  }, []);

  const metrics = useMemo(
    () =>
      inquiries.reduce(
        (acc, inquiry) => {
          if (inquiry.status === "purchased") acc.converted += 1;
          else if (inquiry.status === "cancelled" || inquiry.status === "ignored") {
            acc.lost += 1;
          } else {
            acc.contacted += 1;
          }
          return acc;
        },
        { total: inquiries.length, contacted: 0, converted: 0, lost: 0 }
      ),
    [inquiries]
  );

  const columns: DashboardTableColumn<Inquiry>[] = [
    {
      id: "buyer",
      header: "Buyer",
      width: "19%",
      searchValue: (inquiry) => `${inquiry.buyerName || ""} ${inquiry.buyerEmail || ""}`,
      cell: (inquiry) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-950">
            {inquiry.buyerName || "Buyer"}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {inquiry.buyerEmail || inquiry.buyerPhone || "-"}
          </p>
        </div>
      ),
    },
    {
      id: "product",
      header: "Product",
      width: "20%",
      searchValue: firstProduct,
      cell: (inquiry) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{firstProduct(inquiry)}</p>
          <p className="mt-0.5 font-mono text-xs text-slate-500">
            {formatINR(inquiryValue(inquiry))}
          </p>
        </div>
      ),
    },
    {
      id: "quantity",
      header: "Quantity",
      width: "10%",
      cell: (inquiry) => <span className="font-mono">{totalQuantity(inquiry)}</span>,
    },
    {
      id: "inquiryDate",
      header: "Inquiry Date",
      width: "14%",
      cell: (inquiry) => <span className="block truncate">{formatDate(inquiry.createdAt)}</span>,
    },
    {
      id: "lastContact",
      header: "Last Contact",
      width: "14%",
      cell: (inquiry) => <span className="block truncate">{formatDate(inquiry.updatedAt)}</span>,
    },
    {
      id: "status",
      header: "Status",
      width: "11%",
      cell: (inquiry) => (
        <span className="inline-flex min-w-[104px]">
          <StatusBadge status={inquiryStatusBadge(inquiry.status)}>
            {inquiryStatus(inquiry.status)}
          </StatusBadge>
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      width: "15%",
      headerClassName: "text-right",
      className: "text-right",
      cell: (inquiry) => {
        const rowId = inquiry._id || inquiry.orderId || "";
        const disabled = updatingId === rowId;

        return (
          <DashboardStatusSelect
            disabled={disabled}
            label="Update inquiry status"
            onChange={(status) => markInquiry(inquiry, status)}
            options={INQUIRY_STATUS_OPTIONS}
            value={inquiryStatusValue(inquiry.status)}
          />
        );
      },
    },
  ];

  const filters: DashboardTableFilter<Inquiry>[] = [
    {
      label: "Contacted",
      value: "contacted",
      predicate: (inquiry) =>
        inquiry.status !== "purchased" &&
        inquiry.status !== "cancelled" &&
        inquiry.status !== "ignored",
    },
    {
      label: "Converted",
      value: "converted",
      predicate: (inquiry) => inquiry.status === "purchased",
    },
    {
      label: "Lost",
      value: "lost",
      predicate: (inquiry) =>
        inquiry.status === "cancelled" || inquiry.status === "ignored",
    },
  ];

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="Abandoned inquiries"
        description="A professional view over WhatsApp inquiries using the existing order status flow. No separate cart tracking is introduced in this UX pass."
      />

      <MetricGrid>
        <MetricCard icon={MessageSquareText} label="Total Inquiries" value={metrics.total} />
        <MetricCard icon={Clock3} label="Contacted" value={metrics.contacted} tone="amber" />
        <MetricCard icon={CheckCircle2} label="Converted" value={metrics.converted} tone="emerald" />
        <MetricCard icon={XCircle} label="Lost" value={metrics.lost} tone="rose" />
      </MetricGrid>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <DashboardTable
        title="Inquiry follow-up"
        description="Track buyer interest and update follow-up outcomes with the same admin order status API."
        data={inquiries}
        columns={columns}
        getRowKey={(inquiry) => inquiry._id}
        searchPlaceholder="Search inquiries"
        filters={filters}
        filterLabel="Status"
        emptyIcon={PackageSearch}
        emptyTitle="No inquiries found"
        emptyDescription="Buyer WhatsApp inquiries will appear here once they are created."
        loading={loading}
        renderMobileCard={(inquiry) => {
          const rowId = inquiry._id || inquiry.orderId || "";
          const disabled = updatingId === rowId;

          return (
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">
                    {inquiry.buyerName || "Buyer"}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {inquiry.buyerEmail || inquiry.buyerPhone || "-"}
                  </p>
                </div>
                <StatusBadge status={inquiryStatusBadge(inquiry.status)}>
                  {inquiryStatus(inquiry.status)}
                </StatusBadge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <dt className="text-xs font-medium text-slate-500">Product</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {firstProduct(inquiry)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Quantity</dt>
                  <dd className="mt-1 font-mono text-slate-800">
                    {totalQuantity(inquiry)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Value</dt>
                  <dd className="mt-1 font-mono font-semibold text-slate-950">
                    {formatINR(inquiryValue(inquiry))}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Inquiry date</dt>
                  <dd className="mt-1 text-slate-800">{formatDate(inquiry.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Last contact</dt>
                  <dd className="mt-1 text-slate-800">{formatDate(inquiry.updatedAt)}</dd>
                </div>
              </dl>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <DashboardStatusSelect
                  disabled={disabled}
                  fullWidth
                  label="Update inquiry status"
                  onChange={(status) => markInquiry(inquiry, status)}
                  options={INQUIRY_STATUS_OPTIONS}
                  value={inquiryStatusValue(inquiry.status)}
                />
              </div>
            </article>
          );
        }}
      />
    </DashboardPage>
  );
}
