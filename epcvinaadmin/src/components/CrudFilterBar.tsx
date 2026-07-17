"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type FilterOption = {
  label: string;
  value: string;
};

type SearchSuggestion = {
  label: string;
  href: string;
  meta?: string;
  group?: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(value: string, query: string) {
  const safeQuery = query.trim();
  if (!safeQuery) return value;
  const regex = new RegExp(`(${escapeRegExp(safeQuery)})`, "ig");
  const lowerQuery = safeQuery.toLowerCase();
  const parts = value.split(regex);
  return parts.map((part, index) =>
    part.toLowerCase() === lowerQuery ? (
      <mark key={`${part}-${index}`} className="rounded bg-cyan-400/20 px-0.5 text-cyan-100">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

type Props = {
  title: string;
  subtitle: string;
  searchLabel?: string;
  searchName?: string;
  searchValue?: string;
  searchSuggestions?: SearchSuggestion[];
  primaryLink?: { href: string; label: string };
  secondaryLinks?: Array<{ href: string; label: string }>;
  filters?: Array<{
    name: string;
    label: string;
    value?: string;
    options: FilterOption[];
  }>;
};

export function CrudFilterBar({
  title,
  subtitle,
  searchLabel = "Tìm kiếm",
  searchName = "q",
  searchValue = "",
  searchSuggestions = [],
  primaryLink,
  secondaryLinks = [],
  filters = [],
}: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const suggestionLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const activeFilterCount = useMemo(() => {
    return [searchValue, ...filters.map((filter) => filter.value)].filter((value) => Boolean(String(value ?? "").trim())).length;
  }, [filters, searchValue]);
  const visibleSuggestions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const source = searchSuggestions.slice(0, 8);
    if (!query) return source;
    return source.filter((item) => [item.label, item.meta ?? ""].join(" ").toLowerCase().includes(query)).slice(0, 8);
  }, [searchSuggestions, searchValue]);
  const searchQuery = searchValue.trim();
  const suggestionGroups = useMemo(() => {
    const groups = new Map<string, SearchSuggestion[]>();
    for (const item of visibleSuggestions) {
      const group = item.group?.trim() || "Khác";
      const bucket = groups.get(group) ?? [];
      bucket.push(item);
      groups.set(group, bucket);
    }
    return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
  }, [visibleSuggestions]);

  useEffect(() => {
    setActiveSuggestionIndex(0);
  }, [searchOpen, searchValue]);

  useEffect(() => {
    if (!searchOpen) return;
    const frame = window.requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveSuggestionIndex((current) => {
          const next = Math.min(current + 1, Math.max(visibleSuggestions.length - 1, 0));
          suggestionLinkRefs.current[next]?.focus();
          return next;
        });
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveSuggestionIndex((current) => {
          const next = Math.max(current - 1, 0);
          if (next === 0) searchInputRef.current?.focus();
          else suggestionLinkRefs.current[next]?.focus();
          return next;
        });
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  return (
    <div className="sticky top-4 z-20 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] px-3 py-2.5 shadow-[var(--surface-shadow)] backdrop-blur md:px-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">{subtitle}</div>
          <h2 className="mt-0.5 truncate text-lg font-semibold text-[color:var(--text)] md:text-xl">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {secondaryLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-[11px] text-[color:var(--text)] transition hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
          {primaryLink && (
            <a
              href={primaryLink.href}
              className="rounded-full bg-[color:var(--accent)] px-3 py-2 text-[11px] font-medium text-white transition hover:brightness-110"
            >
              {primaryLink.label}
            </a>
          )}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)] transition hover:bg-white/10"
            aria-label={`Mở ${searchLabel}`}
            title={searchLabel}
          >
            <span className="text-base leading-none">⌕</span>
          </button>
        </div>
      </div>

      <form method="get" className="mt-3 grid gap-2 md:flex md:flex-wrap md:items-end">
        <input type="hidden" name={searchName} value={searchValue} />
        {filters.map((filter) => (
          <label key={filter.name} className="min-w-0 md:min-w-[150px] md:flex-1">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">{filter.label}</span>
            <select
              name={filter.name}
              defaultValue={filter.value ?? ""}
              className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-sm text-[color:var(--text)] outline-none"
            >
              <option value="">Tất cả</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        <div className="flex items-center gap-2 md:justify-end">
          <button type="submit" className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110">
            Lọc
          </button>
          <a href="?" className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm text-[color:var(--text)] transition hover:bg-white/10">
            Bỏ lọc
          </a>
        </div>
      </form>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-[color:var(--muted)] md:text-[11px]">
        <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1">Đang lọc: {activeFilterCount}</span>
        {filters.map((filter) =>
          filter.value ? (
            <span key={filter.name} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1">
              {filter.label}: {filter.options.find((option) => option.value === filter.value)?.label ?? filter.value}
            </span>
          ) : null,
        )}
      </div>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-[color:var(--bg)]/72 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSearchOpen(false);
          }}
        >
          <div className="mx-auto flex min-h-full w-full max-w-3xl items-start justify-center px-4 pt-[12vh] sm:px-6">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={searchLabel}
              className="w-full overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] shadow-[0_30px_120px_rgba(0,0,0,0.22)]"
            >
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--accent)]">Search</div>
                  <h3 className="mt-1 text-lg font-semibold text-[color:var(--text)]">{searchLabel}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-sm text-[color:var(--text)] transition hover:bg-white/10"
                >
                  Đóng
                </button>
              </div>

              <form
                method="get"
                className="space-y-4 px-5 py-5"
                onSubmit={(event) => {
                  if (visibleSuggestions[0]) {
                    event.preventDefault();
                    window.location.href = visibleSuggestions[0].href;
                  }
                }}
              >
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{searchLabel}</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]">⌕</span>
                    <input
                      ref={searchInputRef}
                      name={searchName}
                      defaultValue={searchValue}
                      placeholder={`Nhập ${searchLabel.toLowerCase()}`}
                      className="h-14 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] pl-11 pr-4 text-[color:var(--text)] outline-none ring-0 placeholder:text-[color:var(--muted)]"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--muted)]">
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1">↑↓ chọn</span>
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1">Enter mở kết quả đầu</span>
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1">Esc đóng</span>
                  </div>
                </label>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    <span>Gợi ý nhanh</span>
                    <span>{visibleSuggestions.length} kết quả</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-2">
                    {visibleSuggestions.length ? (
                      suggestionGroups.map((group) => (
                        <div key={group.label} className="space-y-1">
                          <div className="px-3 pt-2 text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">{group.label}</div>
                          {group.items.map((item) => {
                            const index = visibleSuggestions.findIndex((candidate) => candidate.href === item.href);
                            return (
                              <a
                                key={item.href}
                                ref={(node) => {
                                  suggestionLinkRefs.current[index] = node;
                                }}
                                href={item.href}
                                onMouseEnter={() => setActiveSuggestionIndex(index)}
                                className={`flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition ${
                                  activeSuggestionIndex === index ? "bg-white/10 ring-1 ring-[color:var(--border)]" : "hover:bg-white/5"
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-medium text-[color:var(--text)]">{highlightMatch(item.label, searchQuery)}</div>
                                  {item.meta && <div className="mt-1 truncate text-xs text-[color:var(--muted)]">{highlightMatch(item.meta, searchQuery)}</div>}
                                </div>
                                <span className="shrink-0 text-xs text-[color:var(--muted)]">Mở</span>
                              </a>
                            );
                          })}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-8 text-center text-sm text-[color:var(--muted)]">
                        Không có gợi ý phù hợp.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-white transition hover:brightness-110">
                    Tìm kiếm
                  </button>
                  <a href="?" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)] transition hover:bg-white/10">
                    Xóa
                  </a>
                  <span className="ml-auto hidden text-xs text-[color:var(--muted)] sm:inline-flex">
                    <kbd className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1">Esc</kbd>
                    <span className="mx-2">đóng</span>
                    <kbd className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1">⌘K</kbd>
                    <span className="mx-2">mở lại</span>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
