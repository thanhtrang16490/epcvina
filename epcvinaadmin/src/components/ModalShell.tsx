"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  trigger: ReactNode;
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode | ((close: () => void) => ReactNode);
};

export function ModalShell({ trigger, title, description, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const close = () => setOpen(false);

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
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-start justify-center px-4 py-6 sm:px-6">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="animate-[modalFade_180ms_ease-out] max-h-[92vh] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[color:var(--panel-strong)] shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/5 px-5 py-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--accent)]">Modal</div>
                  <h3 className="mt-1 text-xl font-semibold text-[color:var(--text)]">{title}</h3>
                  {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">{description}</p>}
                </div>
                <button type="button" onClick={close} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[color:var(--text)] transition hover:bg-white/10">
                  Đóng
                </button>
              </div>
              <div className="max-h-[calc(92vh-76px)] overflow-y-auto px-5 py-5">
                {typeof children === "function" ? children(close) : children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
