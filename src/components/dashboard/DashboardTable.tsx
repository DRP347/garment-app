"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/dashboard/DashboardPrimitives";

export type DashboardTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  searchValue?: (row: T) => string;
  className?: string;
  headerClassName?: string;
  width?: string;
};

export type DashboardTableFilter<T> = {
  label: string;
  value: string;
  predicate: (row: T) => boolean;
};

type DashboardTableProps<T> = {
  title?: string;
  description?: string;
  data: T[];
  columns: DashboardTableColumn<T>[];
  getRowKey: (row: T) => string;
  actions?: ReactNode;
  searchPlaceholder?: string;
  filters?: DashboardTableFilter<T>[];
  filterLabel?: string;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  loading?: boolean;
  minTableWidth?: string;
  renderMobileCard?: (row: T) => ReactNode;
};

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

function pageWindow(currentPage: number, totalPages: number) {
  const maxVisible = 5;
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - maxVisible + 1));
  return Array.from({ length: maxVisible }, (_, index) => start + index);
}

export default function DashboardTable<T>({
  title,
  description,
  data,
  columns,
  getRowKey,
  actions,
  searchPlaceholder = "Search",
  filters = [],
  filterLabel = "Filter",
  emptyIcon,
  emptyTitle,
  emptyDescription,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  initialPageSize = 10,
  loading = false,
  minTableWidth,
  renderMobileCard,
}: DashboardTableProps<T>) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(1);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    const filter = filters.find((item) => item.value === activeFilter);

    return data.filter((row) => {
      const matchesFilter = !filter || filter.predicate(row);
      if (!matchesFilter) return false;
      if (!normalizedQuery) return true;

      return columns.some((column) => {
        if (!column.searchValue) return false;
        return column.searchValue(row).toLowerCase().includes(normalizedQuery);
      });
    });
  }, [activeFilter, columns, data, filters, normalizedQuery]);

  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = totalRows === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, totalRows);
  const visibleRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);
  const pages = pageWindow(safePage, totalPages);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, normalizedQuery, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_22px_45px_-35px_rgba(15,23,42,0.65)]">
      {(title || description || actions) && (
        <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-5">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-base font-semibold tracking-tight text-slate-950">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      )}

      <div className="grid gap-3 border-y border-slate-200/80 bg-slate-50/70 px-4 py-3 lg:grid-cols-[minmax(220px,1fr)_auto_auto] lg:items-center lg:px-5">
        <label className="relative block min-w-0">
          <span className="sr-only">{searchPlaceholder}</span>
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            strokeWidth={1.9}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0A3D79] focus:ring-2 focus:ring-[#0A3D79]/15"
          />
        </label>

        {filters.length > 0 ? (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <span className="whitespace-nowrap">{filterLabel}</span>
            <select
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0A3D79] focus:ring-2 focus:ring-[#0A3D79]/15"
            >
              <option value="all">All</option>
              {filters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span />
        )}

        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className="whitespace-nowrap">Rows</span>
          <select
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0A3D79] focus:ring-2 focus:ring-[#0A3D79]/15"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <TableSkeleton columns={columns.length} />
      ) : totalRows === 0 ? (
        <div className="p-4">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
          />
        </div>
      ) : (
        <>
          <div className="hidden min-w-0 overflow-x-auto md:block">
            <table
              className="w-full table-fixed border-separate border-spacing-0 text-left"
              style={minTableWidth ? { minWidth: minTableWidth } : undefined}
            >
              <thead className="sticky top-0 z-[1] bg-slate-100/95 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 backdrop-blur">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      className={`border-b border-slate-200 px-4 py-3 first:rounded-tl-2xl last:rounded-tr-2xl lg:px-5 ${column.headerClassName || ""}`}
                      style={column.width ? ({ width: column.width } as CSSProperties) : undefined}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {visibleRows.map((row, rowIndex) => (
                  <tr
                    key={getRowKey(row)}
                    className={rowIndex % 2 === 0 ? "bg-white hover:bg-slate-50" : "bg-slate-50/35 hover:bg-slate-100/70"}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={`border-b border-slate-100 px-4 py-3 align-middle lg:px-5 ${column.className || ""}`}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {visibleRows.map((row) =>
              renderMobileCard ? (
                <div key={getRowKey(row)}>{renderMobileCard(row)}</div>
              ) : (
                <GenericMobileCard
                  key={getRowKey(row)}
                  row={row}
                  columns={columns}
                />
              )
            )}
          </div>

          <div className="flex flex-col gap-3 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-5">
            <p className="font-medium">
              Showing {startIndex}-{endIndex} of {totalRows}
            </p>
            <div className="flex items-center justify-between gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={safePage === 1}
                className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Prev
              </button>
              <p className="font-semibold text-slate-700">
                Page {safePage} of {totalPages}
              </p>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={safePage === totalPages}
                className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
              </button>
            </div>
            <div className="hidden items-center gap-1 md:flex">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={safePage === 1}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              {pages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-9 min-w-9 rounded-lg px-3 font-semibold transition ${
                    safePage === pageNumber
                      ? "bg-[#0A3D79] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={safePage === totalPages}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function GenericMobileCard<T>({
  row,
  columns,
}: {
  row: T;
  columns: DashboardTableColumn<T>[];
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <dl className="space-y-3">
        {columns.map((column) => (
          <div key={column.id} className="min-w-0">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {column.header}
            </dt>
            <dd className="mt-1 min-w-0 text-sm text-slate-800">{column.cell(row)}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="p-4">
      <div className="space-y-2">
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }, (_, column) => (
              <span
                key={column}
                className="h-10 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
