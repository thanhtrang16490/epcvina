import { ThemeCard } from "@/components/ui/ThemeCard";

export type TechnicalSpecEntry = {
  title: string;
  value: string;
};

function getSpecGroup(title: string) {
  const text = title.toLowerCase();
  if (text.includes("công suất") || text.includes("điện áp") || text.includes("mppt") || text.includes("hiệu suất") || text.includes("dòng")) {
    return "Thông số điện";
  }
  if (text.includes("kích thước") || text.includes("trọng lượng") || text.includes("cơ khí") || text.includes("kết nối")) {
    return "Kích thước & kết nối";
  }
  if (text.includes("bảo hành") || text.includes("tiêu chuẩn") || text.includes("cấp bảo vệ") || text.includes("xuất xứ")) {
    return "Bảo hành & tiêu chuẩn";
  }
  if (text.includes("model") || text.includes("thương hiệu") || text.includes("danh mục") || text.includes("công nghệ") || text.includes("loại cell")) {
    return "Thông tin chính";
  }
  return "Khác";
}

export function normalizeTechnicalSpecs(value: unknown): TechnicalSpecEntry[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => ({
        title: String((item as { title?: unknown }).title ?? "").trim(),
        value: String((item as { value?: unknown }).value ?? "").trim(),
      }))
      .filter((item) => item.title || item.value);
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([title, rawValue]) => ({
        title,
        value: Array.isArray(rawValue) || typeof rawValue === "object" ? JSON.stringify(rawValue) : String(rawValue ?? ""),
      }))
      .filter((item) => item.title || item.value);
  }
  return [];
}

export function TechnicalSpecsView({ value }: { value: unknown }) {
  const specs = normalizeTechnicalSpecs(value);
  if (!specs.length) {
    return <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 text-sm text-[color:var(--muted)]">Chưa có thông số kỹ thuật.</div>;
  }

  const grouped = specs.reduce<Record<string, TechnicalSpecEntry[]>>((acc, spec) => {
    const group = getSpecGroup(spec.title);
    if (!acc[group]) acc[group] = [];
    acc[group].push(spec);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([group, items]) => (
        <ThemeCard key={group} className="p-4">
          <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">{group}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((spec, index) => (
              <div key={`${spec.title}-${index}`} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">{spec.title}</div>
                <div className="mt-2 text-sm font-medium text-[color:var(--text)] whitespace-pre-wrap break-words">{spec.value || "-"}</div>
              </div>
            ))}
          </div>
        </ThemeCard>
      ))}
    </div>
  );
}
