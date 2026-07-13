type FilterOption = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  subtitle: string;
  searchLabel?: string;
  searchName?: string;
  searchValue?: string;
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
  primaryLink,
  secondaryLinks = [],
  filters = [],
}: Props) {
  return (
    <div className="sticky top-4 z-20 rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-4 shadow-[var(--surface-shadow)] backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">{subtitle}</div>
          <h2 className="mt-2 text-xl font-semibold text-[color:var(--text)] md:text-2xl">{title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {secondaryLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm text-[color:var(--text)] transition hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
          {primaryLink && (
            <a
              href={primaryLink.href}
              className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
            >
              {primaryLink.label}
            </a>
          )}
        </div>
      </div>

      <form method="get" className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_repeat(3,minmax(0,0.75fr))_auto]">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{searchLabel}</span>
          <input
            name={searchName}
            defaultValue={searchValue}
            placeholder={searchLabel}
            className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none ring-0 placeholder:text-[color:var(--muted)]"
          />
        </label>
        {filters.map((filter) => (
          <label key={filter.name} className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{filter.label}</span>
            <select
              name={filter.name}
              defaultValue={filter.value ?? ""}
              className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none"
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
        <div className="flex items-end gap-2">
          <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-white">
            Lọc
          </button>
          <a href="?" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-sm text-[color:var(--text)]">
            Bỏ lọc
          </a>
        </div>
      </form>
    </div>
  );
}
