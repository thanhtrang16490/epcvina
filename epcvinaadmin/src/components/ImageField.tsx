"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
};

export function ImageField({ name, label, defaultValue = "", placeholder, className = "" }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
    setPreview(defaultValue);
  }, [defaultValue]);

  const fallback = useMemo(() => value.trim(), [value]);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{label}</label>
      <div className="grid gap-3 md:grid-cols-[120px_1fr]">
        <div className="flex h-[120px] w-full items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)]">
          {preview || fallback ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview || fallback} alt={label} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">No image</span>
          )}
        </div>
        <div className="grid gap-2">
          <input
            name={name}
            value={value}
            onChange={(event) => {
              const next = event.target.value;
              setValue(next);
              setPreview(next);
            }}
            placeholder={placeholder}
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]/50 focus:ring-2 focus:ring-[color:var(--accent)]/10"
          />
          <input
            name="images"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const next = String(reader.result ?? "");
                setPreview(next);
              };
              reader.readAsDataURL(file);
            }}
            className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--accent)] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-950"
          />
        </div>
      </div>
    </div>
  );
}
