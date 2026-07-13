"use client";

import { useMemo, useState } from "react";
import { ThemeButton } from "@/components/ui/ThemeButton";
import { ThemeInput } from "@/components/ui/ThemeField";
import { normalizeTechnicalSpecs, type TechnicalSpecEntry } from "@/components/TechnicalSpecs";

type Props = {
  name: string;
  defaultValue?: unknown;
  className?: string;
};

function encode(specs: TechnicalSpecEntry[]) {
  return JSON.stringify(specs.filter((item) => item.title.trim() || item.value.trim()));
}

export function TechnicalSpecsEditor({ name, defaultValue, className = "" }: Props) {
  const initial = useMemo(() => {
    const normalized = normalizeTechnicalSpecs(defaultValue);
    return normalized.length ? normalized : [{ title: "", value: "" }];
  }, [defaultValue]);
  const [rows, setRows] = useState<TechnicalSpecEntry[]>(initial);

  const updateRow = (index: number, key: keyof TechnicalSpecEntry, value: string) => {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  };

  const addRow = () => setRows((current) => [...current, { title: "", value: "" }]);
  const removeRow = (index: number) => setRows((current) => (current.length > 1 ? current.filter((_, rowIndex) => rowIndex !== index) : current));

  return (
    <div className={`space-y-3 ${className}`}>
      <input type="hidden" name={name} value={encode(rows)} readOnly />
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-[color:var(--text)]">Thông số kỹ thuật</div>
            <div className="text-xs text-[color:var(--muted)]">Thêm từng cặp title/value, dữ liệu sẽ lưu dạng JSON.</div>
          </div>
          <ThemeButton type="button" onClick={addRow} tone="secondary" className="px-3 py-2 text-xs">
            Thêm field
          </ThemeButton>
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={`${index}-${row.title}`} className="grid gap-2 md:grid-cols-[1fr_1.2fr_auto]">
              <ThemeInput
                value={row.title}
                onChange={(event) => updateRow(index, "title", event.target.value)}
                placeholder="Title, ví dụ: Công suất"
              />
              <ThemeInput
                value={row.value}
                onChange={(event) => updateRow(index, "value", event.target.value)}
                placeholder="Value, ví dụ: 620 Wp"
              />
              <ThemeButton type="button" onClick={() => removeRow(index)} tone="ghost" className="px-3 py-2 text-xs">
                Xóa
              </ThemeButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
