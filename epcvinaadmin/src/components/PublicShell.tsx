"use client";

import { supabaseBrowserClient } from "@/lib/supabase/browser";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";

const PUBLIC_UNLOCK_CODE = process.env.NEXT_PUBLIC_PUBLIC_PASSCODE?.trim() || "2026";
const PUBLIC_UNLOCK_STORAGE_KEY = "epcvina_public_unlock_v1";

export function PublicShell({ children }: { children: ReactNode }) {
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accountLabel, setAccountLabel] = useState<string | null>(null);
  const [accountAvatar, setAccountAvatar] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const digits = useMemo(() => Array.from({ length: 4 }, (_, index) => passcode[index] ?? "•"), [passcode]);

  const accountInitial = useMemo(() => {
    const source = accountLabel?.trim() || "A";
    return source[0]?.toUpperCase() || "A";
  }, [accountLabel]);

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.dataset.theme;
    const previousColorScheme = root.style.colorScheme;
    root.dataset.theme = "light";
    root.style.colorScheme = "light";

    const restoreUnlockState = async () => {
      const storedUnlock = window.localStorage.getItem(PUBLIC_UNLOCK_STORAGE_KEY) === "1";
      const sessionResult = await supabaseBrowserClient?.auth.getSession();
      const session = sessionResult?.data.session;
      const isLoggedIn = Boolean(session);
      const metadata = session?.user.user_metadata as Record<string, unknown> | undefined;
      const displayName =
        (typeof metadata?.full_name === "string" && metadata.full_name) ||
        (typeof metadata?.name === "string" && metadata.name) ||
        (typeof metadata?.username === "string" && metadata.username) ||
        session?.user.email ||
        session?.user.phone ||
        "User";
      setAccountLabel(displayName);
      setAccountAvatar(
        (typeof metadata?.avatar_url === "string" && metadata.avatar_url) ||
          (typeof metadata?.picture === "string" && metadata.picture) ||
          null,
      );
      setIsUnlocked(isLoggedIn || storedUnlock);
    };

    void restoreUnlockState();
    return () => {
      if (previousTheme) root.dataset.theme = previousTheme;
      else delete root.dataset.theme;
      root.style.colorScheme = previousColorScheme;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-account-menu]")) return;
      setMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabaseBrowserClient?.auth.signOut();
    window.localStorage.removeItem(PUBLIC_UNLOCK_STORAGE_KEY);
    setMenuOpen(false);
    setIsUnlocked(false);
    setAccountLabel(null);
    setAccountAvatar(null);
    window.location.href = "/login";
  };

  const submitPasscode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextValue = passcode.trim();
    if (nextValue === PUBLIC_UNLOCK_CODE) {
      window.localStorage.setItem(PUBLIC_UNLOCK_STORAGE_KEY, "1");
      setError(null);
      setIsUnlocked(true);
      setPasscode("");
      return;
    }
    setError("Passcode không đúng.");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.1),transparent_28%),linear-gradient(180deg,var(--bg),var(--bg-elevated))] text-[color:var(--text)]">
      {!isUnlocked ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[color:var(--panel)] p-6 shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--muted)]">
              EPCVINA Public
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-[color:var(--text)]">Nhập passcode để xem nội dung</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Vui lòng nhập mã 4 số để mở trang public.
            </p>
            <form onSubmit={submitPasscode} className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="grid grid-cols-4 gap-3">
                  {digits.map((digit, index) => (
                    <div
                      key={`${index}-${digit}`}
                      className="flex h-14 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] text-2xl font-semibold tracking-[0.35em] text-[color:var(--text)]"
                    >
                      {digit}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-center text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  Nhập 4 số passcode
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => {
                      setError(null);
                      setPasscode((current) => (current.length < 4 ? `${current}${digit}` : current));
                    }}
                    className="h-14 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-lg font-semibold text-[color:var(--text)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setPasscode((current) => (current.length < 4 ? `${current}0` : current));
                  }}
                  className="h-14 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-lg font-semibold text-[color:var(--text)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setPasscode((current) => current.slice(0, -1));
                  }}
                  className="h-14 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-sm font-semibold text-[color:var(--text)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                >
                  Xóa
                </button>
                <button
                  type="submit"
                  className="h-14 rounded-2xl bg-[color:var(--accent)] text-base font-semibold text-white transition hover:brightness-110"
                >
                  Mở khóa
                </button>
              </div>

              {error ? <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-700">{error}</div> : null}
              <div className="text-center text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Mặc định: {PUBLIC_UNLOCK_CODE}
              </div>
            </form>
          </div>
        </div>
      ) : null}
      <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--panel)]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-0">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-epcvina-solar.png" alt="EPCVINA Solar" className="h-8 w-auto" />
          </Link>
          <div className="flex flex-wrap gap-2">
            <ThemeLinkButton href="/projects/public" tone="secondary">
              Dự án
            </ThemeLinkButton>
            <ThemeLinkButton href="/combos/public" tone="secondary">
              Combo
            </ThemeLinkButton>
            <ThemeLinkButton href="/products/public" tone="secondary">
              Sản phẩm
            </ThemeLinkButton>
            {accountLabel ? (
              <div className="relative" data-account-menu>
                <button
                  type="button"
                  onClick={() => setMenuOpen((current) => !current)}
                  className="inline-flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2.5 text-left text-sm font-medium text-[color:var(--text)] shadow-sm transition hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)]"
                >
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[color:var(--accent)]/10 text-sm font-semibold text-[color:var(--accent)]">
                    {accountAvatar ? (
                      <img src={accountAvatar} alt={accountLabel} className="h-full w-full object-cover" />
                    ) : (
                      accountInitial
                    )}
                  </span>
                  <span className="max-w-40 truncate">{accountLabel}</span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">▾</span>
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-2 shadow-2xl">
                    <div className="px-3 py-3">
                      <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Tên user</div>
                      <div className="mt-1 truncate text-sm font-semibold text-[color:var(--text)]">{accountLabel}</div>
                    </div>
                    <div className="h-px bg-[color:var(--border)]" />
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex rounded-xl px-3 py-2.5 text-sm text-[color:var(--text)] transition hover:bg-[color:var(--bg-elevated)]"
                    >
                      Vào dashboard admin
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-500/10"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <ThemeLinkButton href="/login" tone="primary">
                Đăng nhập
              </ThemeLinkButton>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-0">{children}</main>
    </div>
  );
}
