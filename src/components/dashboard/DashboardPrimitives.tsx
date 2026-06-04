import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type MetricTone = "blue" | "amber" | "emerald" | "rose" | "slate";

const metricTones: Record<MetricTone, string> = {
  blue: "bg-blue-50 text-[#0A3D79] ring-blue-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function DashboardPage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1500px] space-y-5 p-5 lg:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function DashboardPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
  helper,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: MetricTone;
  helper?: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.55)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${metricTones[tone]}`}
        >
          <Icon size={18} strokeWidth={1.9} />
        </span>
      </div>
      <p className="mt-4 font-mono text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      {helper ? <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p> : null}
    </article>
  );
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{children}</section>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8">
      <div className="flex max-w-2xl items-start gap-4">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-slate-100 text-[#0A3D79]">
          <Icon size={22} strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          {action ? <div className="mt-5">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({
  status,
  children,
}: {
  status?: string | boolean;
  children?: ReactNode;
}) {
  const normalized =
    typeof status === "boolean"
      ? status
        ? "approved"
        : "pending"
      : String(status || "in_process").toLowerCase();

  const styles =
    normalized === "purchased" ||
    normalized === "approved" ||
    normalized === "converted"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : normalized === "cancelled" ||
        normalized === "lost" ||
        normalized === "rejected"
      ? "bg-rose-50 text-rose-700 ring-rose-100"
      : normalized === "ignored"
      ? "bg-slate-100 text-slate-700 ring-slate-200"
      : "bg-amber-50 text-amber-700 ring-amber-100";

  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles}`}
    >
      <span className="truncate">{children || humanizeStatus(normalized)}</span>
    </span>
  );
}

export function humanizeStatus(status?: string) {
  if (status === "in_process") return "In Process";
  if (status === "purchased") return "Purchased";
  if (status === "cancelled") return "Cancelled";
  if (status === "ignored") return "Ignored";
  if (status === "approved") return "Approved";
  if (status === "pending") return "Pending Approval";
  if (status === "converted") return "Converted";
  if (status === "lost") return "Lost";

  return String(status || "Pending")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

