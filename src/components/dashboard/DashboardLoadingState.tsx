import DelayedLoadingMessage from "@/components/dashboard/DelayedLoadingMessage";

type LoadingVariant = "overview" | "table" | "form";

export default function DashboardLoadingState({
  title = "Loading workspace",
  variant = "overview",
}: {
  title?: string;
  variant?: LoadingVariant;
}) {
  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 p-5 lg:p-6">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-3 h-7 w-64 max-w-full animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-3 h-4 w-[32rem] max-w-full animate-pulse rounded-full bg-slate-100" />
      </div>

      <div>
        <span className="sr-only">{title}</span>
        {variant === "form" ? <FormSkeleton /> : null}
        {variant === "table" ? <TableSkeleton /> : null}
        {variant === "overview" ? <OverviewSkeleton /> : null}
        <DelayedLoadingMessage />
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
              <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100" />
            </div>
            <div className="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <PanelSkeleton />
        <PanelSkeleton />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="p-4">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
      </div>
      <div className="grid gap-3 border-y border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto]">
        <div className="h-10 animate-pulse rounded-xl bg-white" />
        <div className="h-10 w-32 animate-pulse rounded-xl bg-white" />
        <div className="h-10 w-24 animate-pulse rounded-xl bg-white" />
      </div>
      <div className="hidden divide-y divide-slate-100 md:block">
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="grid grid-cols-6 gap-4 px-5 py-4">
            {Array.from({ length: 6 }, (_, column) => (
              <div
                key={column}
                className="h-4 animate-pulse rounded bg-slate-100"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-3 p-3 md:hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-5">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index}>
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-11 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="mt-6 h-10 w-32 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-slate-100" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="h-4 w-44 animate-pulse rounded bg-slate-100" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

