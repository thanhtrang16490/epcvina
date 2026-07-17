"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ThemeButton } from "@/components/ui/ThemeButton";
import { ThemeCard } from "@/components/ui/ThemeCard";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  quantity: number;
  sale_price_vat: number;
  cost_price: number;
  warranty: string;
  description: string;
};

type Props = {
  products: Product[];
};

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}

function groupLabel(category: string) {
  const value = category.toLowerCase();
  if (value.includes("panel")) return "Panel";
  if (value.includes("inverter")) return "Inverter";
  if (value.includes("battery") || value.includes("pin")) return "Battery";
  return "Mounting";
}

function ProductFallbackArt({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,138,61,0.22),transparent_30%),linear-gradient(135deg,#09111f,#0b1d33_55%,#102845)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),transparent_30%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/18 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
          <img src="/brands/epcvina-solar.png" alt={label} className="h-full w-full object-contain" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-4 text-[10px] uppercase tracking-[0.24em] text-white/70">
        <span>EPCVINA Solar</span>
        <span>Public catalog</span>
      </div>
    </div>
  );
}

const filters = ["all", "panel", "inverter", "battery", "mounting"] as const;

export function ProductCatalogClient({ products }: Props) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const value = product.category.toLowerCase();
      const group = value.includes("panel")
        ? "panel"
        : value.includes("inverter")
          ? "inverter"
          : value.includes("battery") || value.includes("pin")
            ? "battery"
            : "mounting";
      return filter === "all" ? true : filter === group;
    });
  }, [filter, products]);

  const counts = useMemo(
    () =>
      filters.map((group) => ({
        value: group,
        count:
          group === "all"
            ? products.length
            : products.filter((product) => {
                const value = product.category.toLowerCase();
                const productGroup = value.includes("panel")
                  ? "panel"
                  : value.includes("inverter")
                    ? "inverter"
                    : value.includes("battery") || value.includes("pin")
                      ? "battery"
                      : "mounting";
                return productGroup === group;
              }).length,
      })),
    [products],
  );

  const brandCounts = useMemo(() => {
    const items = new Map<string, number>();
    for (const product of products) {
      const key = product.brand || "Khác";
      items.set(key, (items.get(key) ?? 0) + 1);
    }
    return Array.from(items.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [products]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        <ThemeCard className="p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Lọc nhanh</div>
          <div className="mt-3 grid gap-2">
            {counts.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  filter === item.value
                    ? "border-[color:var(--accent)] bg-[color:var(--accent)]/10 text-[color:var(--text)]"
                    : "border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--text)] hover:border-[color:var(--accent)]/30 hover:bg-[color:var(--panel)]"
                }`}
              >
                <span>{item.value === "all" ? "Tất cả" : groupLabel(item.value)}</span>
                <span className="text-xs text-[color:var(--muted)]">{item.count}</span>
              </button>
            ))}
          </div>
        </ThemeCard>

        <ThemeCard className="p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Brand nổi bật</div>
          <div className="mt-3 space-y-2">
            {brandCounts.map(([brand, count]) => (
              <div key={brand} className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm">
                <span className="min-w-0 truncate text-[color:var(--text)]">{brand}</span>
                <span className="text-xs text-[color:var(--muted)]">{count}</span>
              </div>
            ))}
          </div>
        </ThemeCard>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
          {filters.map((group) => (
            <ThemeButton
              key={group}
              type="button"
              onClick={() => setFilter(group)}
              tone={filter === group ? "primary" : "secondary"}
            >
              {group === "all" ? "Tất cả" : groupLabel(group)}
            </ThemeButton>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-sm text-[color:var(--muted)]">
          <span>
            Đang xem: <strong className="text-[color:var(--text)]">{filter === "all" ? "Tất cả nhóm" : groupLabel(filter)}</strong>
          </span>
          <span>{filtered.length} sản phẩm</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ThemeCard as="article" key={product.id} className="group overflow-hidden border-[color:var(--border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,rgba(8,18,33,0.95),rgba(10,26,45,0.82))]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.14),_transparent_30%)]" />
                <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                  <span className="rounded-full bg-[color:var(--accent)] px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    {groupLabel(product.category)}
                  </span>
                  <span className="rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-cyan-100 backdrop-blur-sm">
                    {product.brand}
                  </span>
                </div>
                <ProductFallbackArt label={product.name} />
              </div>

              <div className="flex flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold leading-snug text-[color:var(--text)] group-hover:text-[color:var(--accent)]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-[color:var(--muted)]">
                      {product.category} · {product.unit}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    {product.warranty || "No BH"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[color:var(--muted)]">
                  <div className="rounded-2xl bg-[color:var(--bg-elevated)] px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.2em]">Giá bán</div>
                    <div className="mt-1 font-semibold text-[color:var(--text)]">{formatVND(Number(product.sale_price_vat ?? 0))}</div>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-xs leading-6 text-[color:var(--muted)]">{product.description || "Sản phẩm public từ Supabase."}</p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[color:var(--border)] pt-3">
                  <span className="text-xs text-[color:var(--muted)]">Chi tiết public</span>
                  <Link
                    href={`/products/public/${product.id}`}
                    className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm font-medium text-[color:var(--text)] transition hover:bg-white/10"
                  >
                    Xem ngay
                  </Link>
                </div>
              </div>
            </ThemeCard>
          ))}
        </div>
      </div>
    </div>
  );
}
