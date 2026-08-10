"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
};

const toneClasses: Record<NonNullable<Props["tone"]>, string> = {
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  error: "border-rose-400/20 bg-rose-400/10 text-rose-100",
  info: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
};

export function PageToast({ title, description, tone = "success" }: Props) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className={`fixed right-4 top-4 z-[60] max-w-sm rounded-2xl border px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.25)] backdrop-blur ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {description ? <div className="mt-1 text-xs leading-5 opacity-90">{description}</div> : null}
        </div>
        <button type="button" onClick={() => setOpen(false)} className="text-sm opacity-80 transition hover:opacity-100">
          ×
        </button>
      </div>
    </div>
  );
}
