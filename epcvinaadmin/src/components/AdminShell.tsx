"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthGate } from "@/components/AuthGate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@refinedev/core";
import { supabaseBrowserClient } from "@/lib/supabase/browser";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: string;
};

type NavGroup = {
  id: string;
  label: string;
  icon: string;
  description: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    id: "dashboard",
    label: "Tổng quan",
    icon: "dashboard",
    description: "Sức khỏe dữ liệu và chỉ số chính",
    items: [{ href: "/", label: "Dashboard", icon: "dashboard" }],
  },
  {
    id: "sales",
    label: "Bán hàng",
    icon: "orders",
    description: "Khách hàng, dự án và đơn hàng",
    items: [
      { href: "/orders", label: "Đơn hàng", icon: "orders" },
      { href: "/projects", label: "Dự án", icon: "project" },
      { href: "/customers", label: "Khách hàng", icon: "customer" },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    icon: "combo",
    description: "Combo, thiết bị, danh mục và thương hiệu",
    items: [
      { href: "/combos", label: "Combo", icon: "combo", badge: "CRUD" },
      { href: "/products", label: "Sản phẩm", icon: "box", badge: "CRUD" },
      { href: "/combo-categories", label: "Danh mục combo", icon: "category" },
      { href: "/product-categories", label: "Danh mục sản phẩm", icon: "category" },
      { href: "/brands", label: "Thương hiệu", icon: "brand" },
    ],
  },
  {
    id: "partners",
    label: "Đối tác",
    icon: "supplier",
    description: "Nhà cung cấp và ánh xạ sản phẩm",
    items: [
      { href: "/suppliers", label: "Nhà cung cấp", icon: "supplier" },
      { href: "/supplier-products", label: "SP theo nhà cung cấp", icon: "box" },
    ],
  },
  {
    id: "storefront",
    label: "Khu công khai",
    icon: "card",
    description: "Trang hiển thị bán hàng không cần đăng nhập",
    items: [
      { href: "/combos/public", label: "Combo công khai", icon: "card", badge: "Live" },
      { href: "/products/public", label: "Sản phẩm công khai", icon: "card", badge: "Live" },
    ],
  },
  {
    id: "system",
    label: "Hệ thống",
    icon: "settings",
    description: "Thông tin doanh nghiệp và cấu hình",
    items: [
      { href: "/settings", label: "Cài đặt doanh nghiệp", icon: "settings" },
    ],
  },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ kind }: { kind: string }) {
  const common = "h-4 w-4 shrink-0";
  switch (kind) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "combo":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M12 2 3 8v8l9 6 9-6V8l-9-6Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="m3 8 9 6 9-6m-9 6v8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "box":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 3v18M4 7.5l8 4.5 8-4.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "card":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <rect x="4" y="5" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 10h16" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "orders":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M7 4h10a2 2 0 0 1 2 2v14l-3-1.8-3 1.8-3-1.8L7 20V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "project":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M4 19V7l8-4 8 4v12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8 19v-7h8v7M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "customer":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "supplier":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M4 8h10v9H4V8Zm10 3h3.5l2.5 3v3h-6v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "category":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M4 6.5h7M4 12h10M4 17.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M16 5h4v4h-4V5Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "brand":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 9h4.5a2 2 0 0 1 0 4H9V9Zm0 4h5a2 2 0 0 1 0 4H9v-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "settings":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="m19 12 .9-2-2-3.4-2.2.2-1.7-1L13 4h-4l-1 1.8-1.7 1-2.2-.2-2 3.4L3 12l-.9 2 2 3.4 2.2-.2 1.7 1L9 20h4l1-1.8 1.7-1 2.2.2 2-3.4L19 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const [identityName, setIdentityName] = useState("Admin");
  const [crmCounts, setCrmCounts] = useState({ customers: 0, projects: 0, orders: 0 });
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [themeReady, setThemeReady] = useState(false);
  const [themeTooltip, setThemeTooltip] = useState("Chuyển sang light mode");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    sales: true,
    catalog: true,
    partners: false,
    storefront: false,
    system: false,
  });
  const sidebarWidth = useMemo(() => (collapsed ? "lg:grid-cols-[84px_1fr]" : "lg:grid-cols-[272px_1fr]"), [collapsed]);
  const shellText = theme === "light" ? "text-slate-900" : "text-white";
  const sidebarClass =
    theme === "light"
      ? "border-r border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,250,0.98))] shadow-[inset_-1px_0_0_rgba(15,23,34,0.05)]"
      : "border-r border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(11,18,31,0.98),rgba(8,14,24,0.96))] shadow-[inset_-1px_0_0_rgba(255,255,255,0.03)]";
  const panelClass = theme === "light" ? "bg-white text-slate-900" : "bg-[color:var(--panel)] text-white";
  const mutedText = theme === "light" ? "text-slate-600" : "text-slate-400";
  const navIdle = theme === "light" ? "border-transparent bg-transparent text-slate-700 hover:border-[color:var(--border)] hover:bg-white" : "border-transparent bg-transparent text-slate-300 hover:border-[color:var(--border)] hover:bg-white/8";
  const navActive =
    theme === "light"
      ? "border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 text-slate-950 shadow-[0_0_0_1px_rgba(255,85,0,0.12)]"
      : "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/12 text-white shadow-[0_0_0_1px_rgba(255,85,0,0.18)]";
  const navChildIdle = theme === "light" ? "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950" : "border-transparent text-slate-400 hover:bg-white/8 hover:text-white";
  const navChildActive = theme === "light" ? "border-orange-200 bg-orange-50 text-slate-950" : "border-orange-400/30 bg-orange-400/10 text-white";

  useEffect(() => {
    const stored = window.localStorage.getItem("epcvina-theme");
    const initial = stored === "light" ? "light" : "dark";
    setTheme(initial);
    setThemeTooltip(initial === "dark" ? "Chuyển sang light mode" : "Chuyển sang dark mode");
    document.documentElement.dataset.theme = initial;
    setThemeReady(true);
  }, []);

  useEffect(() => {
    let alive = true;
    async function loadIdentity() {
      if (!supabaseBrowserClient) return;
      const { data } = await supabaseBrowserClient.auth.getUser();
      if (!alive) return;
      setIdentityName(data.user?.email ?? "Admin");
    }
    loadIdentity().catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/catalog", { cache: "no-store" }).then((response) => response.json()).catch(() => null),
      fetch("/api/health", { cache: "no-store" }).then((response) => response.json()).catch(() => null),
    ]).then(() => {
      if (!alive) return;
      const stored = window.localStorage.getItem("epcvina-crm-counts");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<{ customers: number; projects: number; orders: number }>;
          setCrmCounts({
            customers: Number(parsed.customers ?? 0),
            projects: Number(parsed.projects ?? 0),
            orders: Number(parsed.orders ?? 0),
          });
        } catch {
          // ignore
        }
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("epcvina-theme", theme);
    setThemeTooltip(theme === "dark" ? "Chuyển sang light mode" : "Chuyển sang dark mode");
  }, [theme]);

  useEffect(() => {
    const activeGroup = navGroups.find((group) => group.items.some((item) => isRouteActive(pathname, item.href)));
    if (!activeGroup) return;
    setOpenGroups((value) => ({ ...value, [activeGroup.id]: true }));
  }, [pathname]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "epcvina-theme" && (event.newValue === "light" || event.newValue === "dark")) {
        setTheme(event.newValue);
        document.documentElement.dataset.theme = event.newValue;
      }
    };

    const channel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("epcvina-theme") : null;
    const onMessage = (event: MessageEvent) => {
      if (event.data === "light" || event.data === "dark") {
        setTheme(event.data);
        document.documentElement.dataset.theme = event.data;
      }
    };

    window.addEventListener("storage", onStorage);
    channel?.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.removeEventListener("message", onMessage);
      channel?.close();
    };
  }, []);

  return (
    <AuthGate>
      <div className={`min-h-screen ${shellText}`}>
        <div className={`mx-auto grid min-h-screen max-w-[1680px] transition-all duration-300 ${sidebarWidth}`}>
          <aside className={`${sidebarClass} px-4 py-6`}>
            <div className="sticky top-6">
              <div className="flex items-start justify-between gap-3">
                <div className={collapsed ? "sr-only" : ""}>
                  <div className="text-xs uppercase tracking-[0.32em] text-orange-500">EPCVINA Admin</div>
                  <div className={`mt-2 text-2xl font-semibold ${theme === "light" ? "text-slate-900" : "text-white"}`}>Control Center</div>
                  <p className={`mt-2 text-sm leading-6 ${mutedText}`}>Quản trị catalog, bán hàng, dự án và dữ liệu công khai.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTheme((value) => {
                        const next = value === "dark" ? "light" : "dark";
                        window.localStorage.setItem("epcvina-theme", next);
                        if ("BroadcastChannel" in window) {
                          new BroadcastChannel("epcvina-theme").postMessage(next);
                        }
                        return next;
                      });
                    }}
                    className={`group relative flex min-h-11 min-w-11 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--border)] px-3 py-2 text-sm font-semibold shadow-sm transition ${
                      theme === "light"
                        ? "bg-[color:var(--accent)] text-white hover:brightness-110"
                        : "bg-[color:var(--panel)] text-slate-200 hover:bg-white/10"
                    }`}
                    aria-label="Đổi giao diện"
                    aria-pressed={theme === "light"}
                    title={themeTooltip}
                  >
                    <span className="sr-only">{themeTooltip}</span>
                    <span className="relative block h-5 w-5">
                      {theme === "dark" ? (
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                          <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                          <path d="M12 3v2.5M12 18.5V21M4.2 4.2l1.8 1.8M18 18l1.8 1.8M3 12h2.5M18.5 12H21M4.2 19.8 6 18M18 6l1.8-1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCollapsed((value) => !value)}
                    className={`rounded-xl border border-[color:var(--border)] p-2 transition ${panelClass} hover:bg-white/10`}
                    aria-label={collapsed ? "Mở sidebar" : "Thu sidebar"}
                  >
                    <span className="block h-4 w-4">
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                        <path d={collapsed ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              <div className={`mt-5 rounded-2xl border border-[color:var(--border)] p-4 text-sm shadow-[var(--surface-shadow)] ${panelClass}`}>
                <div className={`${mutedText} ${collapsed ? "sr-only" : ""}`}>Đang đăng nhập</div>
                <div className={`mt-1 font-medium ${theme === "light" ? "text-slate-900" : "text-white"} ${collapsed ? "sr-only" : ""}`}>{identityName}</div>
                {collapsed && <div className="mx-auto h-2 w-2 rounded-full bg-cyan-300" />}
              </div>

              <nav className="mt-6 space-y-2">
                {navGroups.map((group) => {
                  const groupActive = group.items.some((item) => isRouteActive(pathname, item.href));
                  const expanded = openGroups[group.id] ?? false;
                  return (
                    <div key={group.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setOpenGroups((value) => ({ ...value, [group.id]: !value[group.id] }))}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${groupActive ? navActive : navIdle}`}
                        aria-expanded={expanded}
                        aria-label={collapsed ? group.label : `${expanded ? "Thu" : "Mở"} ${group.label}`}
                        title={collapsed ? group.label : group.description}
                      >
                        <NavIcon kind={group.icon} />
                        <span className={collapsed ? "sr-only" : "flex-1 text-left"}>
                          <span className="block font-medium">{group.label}</span>
                          <span className={`mt-0.5 block text-[11px] leading-4 ${groupActive ? "opacity-70" : "opacity-55"}`}>{group.description}</span>
                        </span>
                        {!collapsed && (
                          <span className="shrink-0 text-xs opacity-60">
                            <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`} aria-hidden="true">
                              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </button>

                      {expanded && !collapsed && (
                        <div className={`ml-5 space-y-1 border-l pl-3 ${theme === "light" ? "border-slate-200" : "border-white/10"}`}>
                          {group.items.map((item) => {
                            const active = isRouteActive(pathname, item.href);
                            return (
                              <Link
                                key={item.href}
                                href={item.href as never}
                                className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${active ? navChildActive : navChildIdle}`}
                              >
                                <NavIcon kind={item.icon} />
                                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                {item.badge ? (
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${active ? "bg-white/50 text-orange-700" : "bg-white/8 text-[color:var(--muted)]"}`}>
                                    {item.badge}
                                  </span>
                                ) : (
                                  <span className="text-xs opacity-45">→</span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                      {collapsed && groupActive && (
                        <div className="pl-2">
                          <div className={`rounded-2xl border px-3 py-2 text-xs uppercase tracking-[0.22em] ${navActive}`}>
                            {group.label}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={() => logout()}
                className={`mt-6 w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 text-sm transition ${panelClass} hover:bg-white/10`}
              >
                {collapsed ? "⇦" : "Đăng xuất"}
              </button>

              <div className={`mt-4 rounded-2xl border border-[color:var(--border)] p-4 text-sm ${panelClass}`}>
                <span className={collapsed ? "sr-only" : ""}>Dữ liệu đang đi từ Supabase thật. API JSON cũng đã sẵn cho hệ thống epcvinasolar dùng lại.</span>
              </div>
              <div className={`mt-3 rounded-2xl border border-[color:var(--border)] px-4 py-3 text-xs uppercase tracking-[0.24em] ${panelClass} text-orange-500`}>
                <span className={collapsed ? "sr-only" : ""}>Session sync via supabase/ssr</span>
              </div>
            </div>
          </aside>
          <section className="min-w-0 px-4 py-4 md:px-6 lg:px-8">{children}</section>
        </div>
      </div>
    </AuthGate>
  );
}
