"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,138,61,0.14),transparent_28%),linear-gradient(180deg,var(--bg),var(--bg-elevated))] text-[color:var(--text)]">
      <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--panel)]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-0">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.26em] text-[color:var(--accent)]">
            EPCVINA Solar
          </Link>
          <div className="flex flex-wrap gap-2">
            <ThemeLinkButton href="/combos/public" tone="secondary">
              Combo
            </ThemeLinkButton>
            <ThemeLinkButton href="/products/public" tone="secondary">
              Sản phẩm
            </ThemeLinkButton>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-0">{children}</main>
    </div>
  );
}
