"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  trigger: ReactNode;
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function ModalShell({ trigger, title, description, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="contents">
        {trigger}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm">
          <div className="animate-[modalFade_180ms_ease-out] max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-5 shadow-[var(--surface-shadow)]">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">Modal Form</div>
                <h3 className="mt-2 text-2xl font-semibold text-[color:var(--text)]">{title}</h3>
                {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">{description}</p>}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm text-[color:var(--text)] transition hover:bg-white/10"
              >
                Đóng
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
