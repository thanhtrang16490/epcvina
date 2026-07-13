import type { ReactNode } from "react";
import { ThemeCard } from "@/components/ui/ThemeCard";

type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
};

export function DataTable<T>({ rows, columns }: Props<T>) {
  return (
    <ThemeCard className="overflow-hidden rounded-3xl">
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
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-[color:var(--border)]/60 text-[color:var(--text)]">
                {columns.map((column) => (
                  <td key={column.header} className={`px-4 py-4 align-top ${column.className ?? ""}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ThemeCard>
  );
}
