import type { ReactNode } from "react";
import { ThemeCard } from "@/components/ui/ThemeCard";

type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type Detail<T> = {
  label: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T, index: number) => string | number;
  mobileTitle: (row: T) => ReactNode;
  mobileSummary?: (row: T) => ReactNode;
  mobileDetails?: Detail<T>[];
  mobileActions?: (row: T) => ReactNode;
  emptyState: ReactNode;
};

export function ResponsiveTable<T>({
  rows,
  columns,
  getRowKey,
  mobileTitle,
  mobileSummary,
  mobileDetails = [],
  mobileActions,
  emptyState,
}: Props<T>) {
  return (
    <ThemeCard className="overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
      <div className="md:hidden">
        <div className="divide-y divide-[color:var(--border)]/70">
          {rows.length ? (
            rows.map((row, index) => (
              <article key={getRowKey(row, index)} className="space-y-3 px-4 py-3">
                <div className="space-y-1">
                  <div className="text-[15px] font-semibold leading-snug text-[color:var(--text)]">{mobileTitle(row)}</div>
                  {mobileSummary ? <div className="text-xs text-[color:var(--muted)]">{mobileSummary(row)}</div> : null}
                </div>
                {mobileDetails.length ? (
                  <dl className="grid gap-2">
                    {mobileDetails.map((detail) => (
                      <div key={detail.label} className={`flex items-start justify-between gap-3 rounded-xl border border-[color:var(--border)]/60 bg-[color:var(--bg-elevated)]/70 px-3 py-2 text-xs ${detail.className ?? ""}`}>
                        <dt className="shrink-0 text-[color:var(--muted)]">{detail.label}</dt>
                        <dd className="text-right leading-snug text-[color:var(--text)]">{detail.render(row)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {mobileActions ? <div className="flex flex-wrap gap-2 pt-1">{mobileActions(row)}</div> : null}
              </article>
            ))
          ) : (
            <div className="px-4 py-6 text-sm text-[color:var(--muted)]">{emptyState}</div>
          )}
        </div>
      </div>
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[color:var(--bg-elevated)] text-[color:var(--muted)]">
              <tr>
                {columns.map((column) => (
                  <th key={column.header} className="px-4 py-3 font-medium">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
                {rows.length ? (
                  rows.map((row, index) => (
                    <tr key={getRowKey(row, index)} className="bg-[color:var(--panel)]/70 text-[color:var(--text)]">
                      {columns.map((column) => (
                      <td key={column.header} className={`px-4 py-3 align-top ${column.className ?? ""}`}>
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-sm text-[color:var(--muted)]">
                    {emptyState}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ThemeCard>
  );
}
