"use client";

import { useList } from "@refinedev/core";
import { getDisplayedComboPrice } from "@/lib/combo-price";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";
import Link from "next/link";

const currency = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

type ComboRow = ReturnType<typeof normalizeCombo>;
type ProductRow = ReturnType<typeof normalizeProduct>;

export function DashboardMetrics() {
  const combosQuery = useList<ComboRow>({
    resource: "combos",
    pagination: { pageSize: 8 },
    sorters: [{ field: "sort_order", order: "asc" }],
  });

  const productsQuery = useList<ProductRow>({
    resource: "products",
    pagination: { pageSize: 10 },
    sorters: [{ field: "sort_order", order: "asc" }],
  });

  const combos = combosQuery.data?.data ?? [];
  const products = productsQuery.data?.data ?? [];
  const totalCombos = combosQuery.data?.total ?? 0;
  const totalProducts = productsQuery.data?.total ?? 0;
  const activeCombos = combos.filter((combo) => combo.is_active !== false).length;
  const panels = products.filter((product) => `${product.category ?? ""} ${product.name ?? ""}`.toLowerCase().includes("panel")).length;
  const batteries = products.filter((product) => `${product.category ?? ""} ${product.name ?? ""}`.toLowerCase().includes("battery") || `${product.category ?? ""} ${product.name ?? ""}`.toLowerCase().includes("pin")).length;
  const avgMargin = combos.length ? combos.reduce((sum, combo) => sum + Number(combo.margin ?? 0), 0) / combos.length : 0;
  const maxDiscountRoom = combos.length ? Math.max(...combos.map((combo) => Number(combo.reference_price ?? 0) - Number(combo.target_min_price ?? 0))) : 0;

  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Combo" value={`${totalCombos}`} hint="Tổng combo đang có trong Supabase" />
        <StatCard label="Sản phẩm" value={`${totalProducts}`} hint="Tổng sản phẩm đang lưu trong Supabase" />
        <StatCard label="Active" value={`${activeCombos}`} hint="Combo đang bật hiển thị" />
        <StatCard label="Biên gộp TB" value={`${avgMargin.toFixed(1)}%`} hint="Mốc lợi nhuận trung bình" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard label="Thiết bị panel" value={panels} />
        <MetricCard label="Thiết bị pin" value={batteries} />
        <MetricCard label="Dư địa giảm giá" value={currency.format(maxDiscountRoom)} suffix=" đ" />
      </div>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Tổng quan</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">Bảng công việc gần đây</h2>
          </div>
          <div className="text-sm text-slate-400">Nguồn: Refine useList</div>
        </div>

        <div className="mt-5 space-y-3">
          {combos.map((combo) => {
            const displayedPrice = getDisplayedComboPrice(combo);
            return (
            <div key={combo.id} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4 lg:grid-cols-[1.25fr_0.75fr_0.75fr_auto] lg:items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.26em] text-orange-300">{combo.code}</div>
                <div className="mt-2 text-lg font-medium text-white">{combo.name}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {combo.phase} pha · {combo.solar_kw} kWp{combo.battery_kwh ? ` · ${combo.battery_kwh} kWh` : ""}
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 px-3 py-2">
                <div className="text-xs text-slate-500">Giá vốn</div>
                <div className="mt-1 font-semibold text-white">{currency.format(Number(combo.cost_price ?? 0))} đ</div>
              </div>
              <div className="rounded-2xl bg-white/5 px-3 py-2">
                <div className="text-xs text-slate-500">{displayedPrice.label}</div>
                <div className="mt-1 font-semibold text-white">{currency.format(displayedPrice.value)} đ</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/combos/${combo.id}/edit`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  Sửa
                </Link>
                <Link href={`/combos/${combo.id}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  Xem
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </div>
  );
}

function MetricCard({ label, value, suffix = "" }: { label: string; value: number | string; suffix?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-white">
        {value}
        {suffix}
      </div>
    </div>
  );
}
