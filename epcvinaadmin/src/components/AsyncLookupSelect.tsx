"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type LookupItem = {
  id: string;
  label: string;
  meta?: string;
};

type Props = {
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  endpoint: string;
  initialLabel?: string;
  renderSelected?: (item: LookupItem | null) => ReactNode;
  disabled?: boolean;
  minChars?: number;
  className?: string;
};

export function AsyncLookupSelect({
  name,
  value,
  onValueChange,
  placeholder,
  endpoint,
  initialLabel = "",
  renderSelected,
  disabled = false,
  minChars = 0,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<LookupItem | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      if (!open || query.trim().length < minChars) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const url = new URL(endpoint, window.location.origin);
        url.searchParams.set("q", query.trim());
        const response = await fetch(url.toString(), { signal: controller.signal });
        const data = (await response.json()) as { items?: LookupItem[] };
        setItems(data.items ?? []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [endpoint, minChars, open, query]);

  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    if (selected?.id === value) return;
    const current = items.find((item) => item.id === value) ?? selected;
    if (current?.id === value) setSelected(current);
  }, [items, selected, value]);

  const selectedLabel = useMemo(() => {
    if (selected?.id === value) return selected.label;
    if (!selected && initialLabel && value) return initialLabel;
    return selected?.label ?? "";
  }, [initialLabel, selected, value]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input type="hidden" name={name} value={value} readOnly />
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((current) => !current);
        }}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{placeholder}</div>
        <div className="mt-1 text-sm text-slate-900">{selectedLabel || "Chọn từ danh sách..."}</div>
      </button>
      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 p-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Gõ tên, SĐT hoặc email..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
            />
          </div>
          <div className="max-h-72 overflow-y-auto">
            {!query.trim() && !loading ? <div className="px-4 py-3 text-sm text-slate-500">Bắt đầu gõ để lọc nhanh, hoặc chờ danh sách gợi ý tải lên.</div> : null}
            {loading ? <div className="px-4 py-3 text-sm text-slate-500">Đang tải khách hàng...</div> : null}
            {!loading && items.length === 0 ? <div className="px-4 py-3 text-sm text-slate-500">Không có kết quả.</div> : null}
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onValueChange(item.id);
                  setSelected(item);
                  setOpen(false);
                }}
                className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50"
              >
                <div className="text-sm font-medium text-slate-900">{item.label}</div>
                {item.meta ? <div className="mt-1 text-xs text-slate-500">{item.meta}</div> : null}
              </button>
            ))}
          </div>
          {renderSelected ? <div className="border-t border-slate-200 p-3">{renderSelected(selected)}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
