"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
    items: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }],
  },
  {
    id: "sales",
    label: "Bán hàng",
    icon: "orders",
    description: "Khách hàng, dự án và đơn hàng",
    items: [
      { href: "/orders", label: "Đơn hàng", icon: "orders" },
      { href: "/admin/projects", label: "Dự án", icon: "project" },
      { href: "/admin/customers", label: "Khách hàng", icon: "customer" },
      { href: "/admin/discounts", label: "Chiết khấu", icon: "card" },
      { href: "/admin/payment-policies", label: "Thanh toán", icon: "card" },
    ],
  },
  {
    id: "crm",
    label: "CRM",
    icon: "customer",
    description: "Tổng hợp và quản lý lead đa nguồn",
    items: [
      { href: "/admin/leads", label: "Bảng lead chung", icon: "customer", badge: "CRM" },
      { href: "/admin/leads/pipeline", label: "CRM Pipeline", icon: "grid", badge: "Kanban" },
    ],
  },
  {
    id: "content",
    label: "Content",
    icon: "card",
    description: "Bài viết, lịch đăng và AI",
    items: [
      { href: "/admin/content", label: "Content Hub", icon: "card", badge: "New" },
      { href: "/admin/content/review", label: "Review Queue", icon: "check" },
      { href: "/admin/content/settings", label: "AI Settings", icon: "settings", badge: "API" },
      { href: "/admin/content/studio", label: "AI Studio", icon: "sun" },
      { href: "/admin/content/new", label: "Tạo bài", icon: "card" },
      { href: "/admin/content/calendar", label: "Calendar", icon: "grid" },
      { href: "/admin/content/facebook-sync", label: "Facebook Sync", icon: "grid", badge: "Sync" },
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
      { href: "/admin/combo-categories", label: "Danh mục combo", icon: "category" },
      { href: "/admin/product-categories", label: "Danh mục sản phẩm", icon: "category" },
      { href: "/admin/brands", label: "Thương hiệu", icon: "brand" },
    ],
  },
  {
    id: "partners",
    label: "Đối tác",
    icon: "supplier",
    description: "Nhà cung cấp và ánh xạ sản phẩm",
    items: [
      { href: "/suppliers", label: "Nhà cung cấp", icon: "supplier" },
      { href: "/admin/supplier-products", label: "SP theo nhà cung cấp", icon: "box" },
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
      { href: "/system-advisor", label: "Tư vấn hệ thống", icon: "card", badge: "New" },
      { href: "/admin/settings", label: "Cài đặt doanh nghiệp", icon: "settings" },
    ],
  },
];

function isRouteActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (pathname === href) return true;
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(`${href}/`);
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
    case "sun":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M12 3v2.5M12 18.5V21M4.2 4.2l1.8 1.8M18 18l1.8 1.8M3 12h2.5M18.5 12H21M4.2 19.8 6 18M18 6l1.8-1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "logout":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M10 17l-1.5 1.5A2.5 2.5 0 0 1 4 17V7a2.5 2.5 0 0 1 4.5-1.5L10 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 12h10M17 9l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "chevron":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [crmCounts, setCrmCounts] = useState({ customers: 0, projects: 0, orders: 0 });
  const [collapsed, setCollapsed] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("epcvina-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const [themeTooltip, setThemeTooltip] = useState(() => (theme === "dark" ? "Chuyển sang light mode" : "Chuyển sang dark mode"));
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    dashboard: false,
    sales: false,
    catalog: false,
    partners: false,
    content: false,
    storefront: false,
    system: false,
  });
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);
  const hoverCloseTimerRef = useRef<number | null>(null);
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
  const mobileSidebarOpen = isMobile && mobileMenuOpen;
  const desktopSidebarExpanded = useMemo(() => !collapsed || hovered, [collapsed, hovered]);
  const sidebarExpanded = isMobile ? true : desktopSidebarExpanded;

  useEffect(() => {
    const syncSession = async () => {
      const sessionResult = await supabaseBrowserClient?.auth.getSession();
      const session = sessionResult?.data.session;
      if (!session) {
        setIsAuthenticated(false);
        setIdentityName("Guest");
        return;
      }

      const metadata = session.user.user_metadata as Record<string, unknown> | undefined;
      const displayName =
        (typeof metadata?.full_name === "string" && metadata.full_name) ||
        (typeof metadata?.name === "string" && metadata.name) ||
        (typeof metadata?.username === "string" && metadata.username) ||
        session.user.email ||
        session.user.phone ||
        "Admin";
      setIsAuthenticated(true);
      setIdentityName(displayName);
    };

    void syncSession();

    const stored = window.localStorage.getItem("epcvina-theme");
    const bootstrapped = document.documentElement.dataset.theme;
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
    const initial = stored === "light" || stored === "dark" ? stored : bootstrapped === "light" ? "light" : prefersLight ? "light" : "dark";
    setTheme(initial);
    setThemeTooltip(initial === "dark" ? "Chuyển sang light mode" : "Chuyển sang dark mode");
    document.documentElement.dataset.theme = initial;
    document.documentElement.style.colorScheme = initial;
  }, []);

  useEffect(() => {
    const syncCollapsed = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
        setHovered(false);
        setMobileMenuOpen(false);
      }
    };
    syncCollapsed();
    window.addEventListener("resize", syncCollapsed);
    return () => window.removeEventListener("resize", syncCollapsed);
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
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("epcvina-theme", theme);
    setThemeTooltip(theme === "dark" ? "Chuyển sang light mode" : "Chuyển sang dark mode");
  }, [theme]);

  useEffect(() => {
    const activeGroup = navGroups.find((group) => group.items.some((item) => isRouteActive(pathname, item.href)));
    setHoverTarget(null);
    setOpenGroups(
      navGroups.reduce<Record<string, boolean>>((acc, group) => {
        acc[group.id] = group.id === activeGroup?.id;
        return acc;
      }, {})
    );
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (sidebarExpanded) {
      setHoverTarget(null);
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    return () => {
      if (hoverCloseTimerRef.current !== null) {
        window.clearTimeout(hoverCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "epcvina-theme" && (event.newValue === "light" || event.newValue === "dark")) {
        setTheme(event.newValue);
        document.documentElement.dataset.theme = event.newValue;
        document.documentElement.style.colorScheme = event.newValue;
      }
    };

    const channel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("epcvina-theme") : null;
    const onMessage = (event: MessageEvent) => {
      if (event.data === "light" || event.data === "dark") {
        setTheme(event.data);
        document.documentElement.dataset.theme = event.data;
        document.documentElement.style.colorScheme = event.data;
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
        {mobileSidebarOpen ? (
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1.5px] lg:hidden"
          />
        ) : null}
        <aside
          className={`group fixed left-0 top-0 z-50 h-dvh overflow-y-auto border-r border-[color:var(--border)] bg-[color:var(--panel-strong)]/90 backdrop-blur-2xl shadow-[4px_0_28px_rgba(0,0,0,0.18)] px-2 py-3 transition-[width,transform,box-shadow] duration-300 ease-out lg:px-3 lg:py-4 lg:hover:shadow-[8px_0_32px_rgba(0,0,0,0.24)] ${
            isMobile
              ? `${mobileSidebarOpen ? "w-[86vw] max-w-[320px] translate-x-0" : "w-[86vw] max-w-[320px] -translate-x-full"}`
              : sidebarExpanded
                ? "w-[252px] translate-x-0"
                : "w-[64px] translate-x-0"
          }`}
          onMouseEnter={() => {
            if (!isMobile) setHovered(true);
          }}
          onMouseLeave={() => {
            if (!isMobile) setHovered(false);
          }}
        >
          <div className="sticky top-3 lg:top-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-orange-500">E</span>
                </div>
                <div className={`${sidebarExpanded ? "min-w-0" : "sr-only"} transition-all duration-200`}>
                  <div className="truncate text-sm font-semibold text-white">EPCVINA Solar</div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-orange-500">Admin</div>
                </div>
              </div>
              {isMobile ? (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition active:scale-[0.98]"
                  aria-label="Đóng sidebar"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCollapsed((value) => !value)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                  aria-label={sidebarExpanded ? "Thu sidebar" : "Mở sidebar"}
                >
                  <NavIcon kind="chevron" />
                </button>
              )}
            </div>

              {sidebarExpanded ? (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm transition-all duration-200">
                  <div className={mutedText}>Đang đăng nhập</div>
                  <div className={`mt-0.5 truncate font-medium ${theme === "light" ? "text-slate-900" : "text-white"}`}>{identityName}</div>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-cyan-300" />
                </div>
              )}

              <nav className="mt-3 space-y-1.5 lg:mt-4">
              {navGroups.map((group) => {
                const groupActive = group.items.some((item) => isRouteActive(pathname, item.href));
                const expanded = openGroups[group.id] ?? false;
                const isHoverOpen = !sidebarExpanded && hoverTarget === group.id;
                const shouldShowSubmenu = sidebarExpanded ? expanded : expanded || isHoverOpen;

                const openCollapsedGroup = () => {
                  if (sidebarExpanded) return;
                  if (hoverCloseTimerRef.current !== null) {
                    window.clearTimeout(hoverCloseTimerRef.current);
                    hoverCloseTimerRef.current = null;
                  }
                  setHoverTarget(group.id);
                  setOpenGroups(
                    navGroups.reduce<Record<string, boolean>>((acc, navGroup) => {
                      acc[navGroup.id] = navGroup.id === group.id;
                      return acc;
                    }, {})
                  );
                };

                const closeCollapsedGroup = () => {
                  if (sidebarExpanded) return;
                  if (hoverCloseTimerRef.current !== null) {
                    window.clearTimeout(hoverCloseTimerRef.current);
                  }
                  hoverCloseTimerRef.current = window.setTimeout(() => {
                    setOpenGroups((value) => ({ ...value, [group.id]: false }));
                    setHoverTarget((value) => (value === group.id ? null : value));
                  }, 90);
                };

                return (
                  <div
                    key={group.id}
                    className="group/nav relative space-y-1"
                    onMouseEnter={openCollapsedGroup}
                    onMouseLeave={closeCollapsedGroup}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (sidebarExpanded) {
                          setOpenGroups((value) => ({ ...value, [group.id]: !value[group.id] }));
                        } else {
                          openCollapsedGroup();
                        }
                      }}
                      className={`flex w-full items-center gap-2 rounded-2xl border px-2.5 py-2 text-sm transition duration-200 ${groupActive ? navActive : navIdle} ${sidebarExpanded ? "" : "justify-center px-2"} ${isMobile ? "touch-manipulation active:scale-[0.99]" : "hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]"}`}
                      aria-expanded={expanded}
                      aria-label={sidebarExpanded ? `${expanded ? "Thu" : "Mở"} ${group.label}` : group.label}
                      title={sidebarExpanded ? group.description : group.label}
                    >
                        <span className="transition-transform duration-200 group-hover/nav:scale-110 group-hover/nav:text-[color:var(--accent)]">
                          <NavIcon kind={group.icon} />
                        </span>
                        <span className={sidebarExpanded ? "flex-1 text-left" : "sr-only"}>
                          <span className="block font-medium">{group.label}</span>
                          <span className={`mt-0.5 block text-[11px] leading-4 ${groupActive ? "opacity-70" : "opacity-55"}`}>{group.description}</span>
                        </span>
                        {sidebarExpanded && (
                          <span className="shrink-0 text-xs opacity-60">
                            <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`} aria-hidden="true">
                              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </button>

                    {shouldShowSubmenu && sidebarExpanded && (
                      <div className={`ml-3 space-y-1 border-l pl-2.5 ${theme === "light" ? "border-slate-200" : "border-white/10"}`}>
                        {group.items.map((item) => {
                          const active = isRouteActive(pathname, item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href as never}
                              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition duration-200 ${active ? navChildActive : navChildIdle} ${isMobile ? "touch-manipulation active:scale-[0.99]" : "hover:-translate-x-0.5 hover:border-[color:var(--accent)]/35 hover:bg-white/8 hover:shadow-[0_8px_18px_rgba(0,0,0,0.10)]"}`}
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
                    {!sidebarExpanded && shouldShowSubmenu ? (
                      <div
                        className={`pointer-events-none absolute left-full top-0 z-50 ml-2 w-[240px] rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--panel-strong)]/98 p-2.5 opacity-0 translate-x-1 shadow-[0_20px_45px_rgba(0,0,0,0.22)] transition-all duration-180 ease-out group-hover/nav:pointer-events-auto group-hover/nav:translate-x-0 group-hover/nav:opacity-100 ${
                          groupActive ? "ring-1 ring-[color:var(--accent)]/20" : ""
                        }`}
                        onMouseEnter={openCollapsedGroup}
                        onMouseLeave={closeCollapsedGroup}
                      >
                        <div className="mb-2 px-2 pt-1">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">{group.label}</div>
                          <div className="mt-1 text-xs text-[color:var(--muted)]">{group.description}</div>
                        </div>
                        <div className="space-y-1">
                          {group.items.map((item) => {
                            const active = isRouteActive(pathname, item.href);
                            return (
                              <Link
                                key={item.href}
                                href={item.href as never}
                                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition duration-150 ease-out ${active ? navChildActive : navChildIdle} hover:-translate-x-0.5 hover:border-[color:var(--accent)]/35 hover:bg-white/8`}
                              >
                                <span className="transition-transform duration-200 group-hover/nav:scale-110">
                                  <NavIcon kind={item.icon} />
                                </span>
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
                      </div>
                    ) : null}
                  </div>
                );
              })}
              </nav>

              <div className="mt-4 lg:mt-5">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => logout()}
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10 lg:w-full lg:px-3 lg:py-2.5 lg:text-sm ${isMobile ? "touch-manipulation active:scale-[0.98]" : ""}`}
                  >
                    <NavIcon kind="logout" />
                    <span className={sidebarExpanded ? "ml-2" : "sr-only"}>Đăng xuất</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className={`flex h-10 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--accent)] px-3 text-sm font-medium text-white transition hover:brightness-110 lg:w-full ${isMobile ? "touch-manipulation active:scale-[0.98]" : ""}`}
                  >
                    <span className={sidebarExpanded ? "" : "sr-only"}>Đăng nhập</span>
                    <span className={sidebarExpanded ? "hidden" : ""}>Đăng nhập</span>
                  </Link>
                )}
              </div>

              <div className="mt-4 lg:mt-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm">
                  <div className={sidebarExpanded ? mutedText : "sr-only"}>{isAuthenticated ? "Đang đăng nhập" : "Chưa đăng nhập"}</div>
                  <div className={`mt-0.5 truncate font-medium ${theme === "light" ? "text-slate-900" : "text-white"} ${sidebarExpanded ? "" : "sr-only"}`}>{identityName}</div>
                </div>
              </div>

              <div className="mt-4 lg:mt-5">
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
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 transition ${
                    theme === "light" ? "bg-[color:var(--accent)] text-white hover:brightness-110" : "bg-white/5 text-slate-200 hover:bg-white/10"
                  } lg:w-full lg:justify-start lg:gap-2 lg:px-3 lg:py-2.5 ${isMobile ? "touch-manipulation active:scale-[0.98]" : ""}`}
                  aria-label="Đổi giao diện"
                  aria-pressed={theme === "light"}
                  title={themeTooltip}
                >
                  <NavIcon kind={theme === "dark" ? "moon" : "sun"} />
                  <span className={sidebarExpanded ? "text-sm font-medium" : "sr-only"}>{themeTooltip}</span>
                </button>
              </div>
            </div>
          </aside>
        <section className="min-w-0 px-2 py-2 md:px-4 md:py-4 lg:px-8 lg:pl-[96px]">
          <div className="mb-4 hidden lg:hidden" />
          <div className="mb-3 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2.5 shadow-md lg:hidden">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((value) => !value)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--text)] shadow-sm transition active:scale-[0.98]"
                aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
                aria-expanded={mobileMenuOpen}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  {mobileMenuOpen ? (
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  ) : (
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  )}
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold tracking-[0.14em] text-[color:var(--text)]">EPCVINA ADMIN</div>
                <div className="mt-0.5 truncate text-xs text-[color:var(--muted)]">Điều khiển hệ thống</div>
              </div>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 text-sm text-[color:var(--text)] shadow-sm transition active:scale-[0.98]"
                >
                  Đăng xuất
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--accent)] px-4 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-[0.98]"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
          {children}
        </section>
      </div>
    </AuthGate>
  );
}
