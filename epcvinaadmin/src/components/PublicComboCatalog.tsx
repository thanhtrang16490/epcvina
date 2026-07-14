"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { comboGroups, getComboGroupId, getComboGroupLabel } from "@/lib/combo-groups";
import { getDisplayedComboPrice } from "@/lib/combo-price";
import { buildComboFinance } from "@/lib/combo-finance";
import { formatMoneyVnd } from "@/lib/money-format";
import type { PricingSettings } from "@/lib/pricing-settings";
import { ThemeButton } from "@/components/ui/ThemeButton";
import { ThemeCard } from "@/components/ui/ThemeCard";

type AnyCombo = {
  id: string;
  code: string;
  name: string;
  slug: string;
  phase: number;
  solar_kw: number;
  battery_kwh: number | null;
  battery_type: string | null;
  reference_price: number;
  description: string;
  margin: number;
  is_active: boolean;
  status?: string;
  systemType?: "on-grid" | "hybrid";
};

type Props = {
  combos: AnyCombo[];
  pricingSettings: PricingSettings;
};

function getSystemType(combo: AnyCombo) {
  if (combo.systemType) return combo.systemType;
  return combo.code.startsWith("HY") || combo.battery_kwh ? "hybrid" : "on-grid";
}

function getBatteryVoltageLabel(combo: AnyCombo) {
  const batteryType = String(combo.battery_type ?? "").toUpperCase();
  if (batteryType === "HV") return "Áp cao";
  if (batteryType === "LV") return "Áp thấp";
  if (combo.battery_kwh) return "Áp thấp";
  return null;
}

function getBrandLine(combo: AnyCombo) {
  const panelBrand = "Aiko";
  const inverterBrand = combo.systemType === "hybrid" || combo.code.startsWith("HY") ? "SAJ" : "Auxsol";
  const batteryBrand = combo.code.startsWith("HY") || combo.battery_kwh ? "Genxgreen" : null;
  return [panelBrand, inverterBrand, batteryBrand].filter(Boolean).join(" - ");
}

function getMonthlyProduction(combo: AnyCombo) {
  return Math.round(Number(combo.solar_kw) * 4 * 30);
}

function getPaybackLabel(combo: AnyCombo) {
  const monthly = getMonthlyProduction(combo);
  const annualSavings = monthly * 3500 * 12;
  const priceInVND = Number(combo.reference_price);
  const payback = annualSavings > 0 ? priceInVND / annualSavings : 0;
  const years = Math.floor(payback);
  const months = Math.round((payback - years) * 12);
  return months > 0 ? `${years} năm ${months} tháng` : `${years} năm`;
}

function getArea(combo: AnyCombo): number | null {
  return null;
}

export function PublicComboCatalog({ combos, pricingSettings }: Props) {
  const [filter, setFilter] = useState<"all" | "on-grid-1phase" | "on-grid-3phase" | "hybrid-1phase" | "hybrid-3phase-lv" | "hybrid-3phase-hv">("all");
  const visibleCombos = useMemo(() => combos.filter((combo) => combo.is_active !== false && combo.status !== "inactive"), [combos]);

  const filtered = useMemo(() => {
    return visibleCombos.filter((combo) => {
      if (filter === "all") return true;
      return getComboGroupId(combo) === filter;
    });
  }, [visibleCombos, filter]);

  const count = (kind: "all" | "on-grid-1phase" | "on-grid-3phase" | "hybrid-1phase" | "hybrid-3phase-lv" | "hybrid-3phase-hv") =>
    visibleCombos.filter((combo) => {
      if (kind === "all") return true;
      return getComboGroupId(combo) === kind;
    }).length;

  const tabs: Array<{ id: "all" | "on-grid-1phase" | "on-grid-3phase" | "hybrid-1phase" | "hybrid-3phase-lv" | "hybrid-3phase-hv"; label: string }> = [
    { id: "all", label: "Tất cả" },
    ...comboGroups.map((group) => ({ id: group.id, label: group.label })),
  ];

  const categorySummary = useMemo(() => {
    const map = new Map<string, number>();
    visibleCombos.forEach((combo) => {
      const label = getComboGroupLabel(combo);
      map.set(label, (map.get(label) ?? 0) + 1);
    });
    return Array.from(map.entries());
  }, [visibleCombos]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = filter === tab.id;
          return (
            <ThemeButton
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              tone={active ? "primary" : "secondary"}
            >
              {tab.label} ({count(tab.id)})
            </ThemeButton>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categorySummary.map(([label, count]) => (
          <span key={label} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1 text-xs font-medium text-[color:var(--muted)]">
            {label} ({count})
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((combo) => {
          const systemType = getSystemType(combo);
          const groupLabel = getComboGroupLabel(combo);
          const monthlyProduction = getMonthlyProduction(combo);
          const area = getArea(combo);
          const batteryVoltageLabel = getBatteryVoltageLabel(combo);
          const brandLine = getBrandLine(combo);
          const displayedPrice = getDisplayedComboPrice(combo);
          const finance = buildComboFinance({
            solarKw: Number(combo.solar_kw),
            costPrice: Number(combo.reference_price),
            referencePrice: Number(displayedPrice.value ?? combo.reference_price),
            pricingSettings,
          });
          const paybackLabel = `${finance.paybackYears.toFixed(1)} năm`;

          return (
            <ThemeCard as="article" key={combo.id} className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,rgba(8,18,33,0.95),rgba(10,26,45,0.82))]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.22),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.16),_transparent_30%)]" />
                <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-sm ${
                      systemType === "hybrid" ? "bg-blue-500/90 text-white" : "bg-orange-500/90 text-white"
                    }`}
                  >
                    {groupLabel}
                  </span>
                  {batteryVoltageLabel && (
                    <span className="rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-cyan-100 backdrop-blur-sm">
                      {batteryVoltageLabel}
                    </span>
                  )}
                </div>
                {combo.margin >= 0 && (
                  <div className="absolute right-3 top-3 z-10">
                    <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                      Bán chạy
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur">
                    <span className="text-4xl text-white/90">⚡</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <h3 className="text-sm font-bold leading-snug text-[color:var(--text)] group-hover:text-[color:var(--accent)]">
                    {combo.name
                      .replace(/Hy-Brid/gi, "Hybrid")
                      .replace(/1pha/gi, "1 pha")
                      .replace(/3pha/gi, "3 pha")
                      .replace(/\s+/g, " ")
                      .trim()}
                  </h3>
                      <p className="mt-1 text-xs text-[color:var(--muted)]">
                        {combo.phase === 1 ? "1 pha" : "3 pha"} · {combo.solar_kw} kWp
                      </p>
                    </div>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${combo.phase === 1 ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                    {combo.phase === 1 ? "AT" : "AC"}
                  </span>
                </div>

                <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-[color:var(--muted)]">
                  {brandLine}
                </p>

                <p className="mt-3 line-clamp-3 text-xs leading-6 text-[color:var(--muted)]">{combo.description}</p>

                <div className="mt-4 space-y-1.5 text-xs text-[color:var(--muted)]">
                  <div className="flex justify-between">
                    <span>PV:</span>
                    <span className="font-medium text-[color:var(--text)]">{combo.solar_kw} kWp</span>
                  </div>
                  {systemType === "hybrid" && (
                    <div className="flex justify-between">
                      <span>Hệ:</span>
                      <span className="font-medium text-[color:var(--text)]">
                        {combo.phase === 3 ? "Hybrid 3 pha" : "Hybrid 1 pha"}
                      </span>
                    </div>
                  )}
                  {systemType === "hybrid" && (
                    <div className="flex justify-between">
                      <span>Pin:</span>
                      <span className="font-medium text-[color:var(--text)]">
                        {combo.battery_kwh ? `${combo.battery_kwh} kWh${combo.battery_type ? ` (${combo.battery_type})` : ""}` : "-"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Sản lượng:</span>
                    <span className="font-medium text-[color:var(--text)]">{monthlyProduction} kWh/tháng</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hoàn vốn:</span>
                    <span className="font-medium text-[color:var(--text)]">{paybackLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diện tích:</span>
                    <span className="font-medium text-[color:var(--text)]">{area ? `${area.toFixed(1)} m²` : "thiếu thông số kỹ thuật"}</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-[color:var(--border)] pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[color:var(--muted)]">{displayedPrice.label}</p>
                    {displayedPrice.label === "Giá ưu đãi" && (
                      <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-100">
                        Ưu đãi
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-bold text-[color:var(--accent)]">{formatMoneyVnd(displayedPrice.value)}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/combos/public/${combo.id}`}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2.5 text-sm font-medium text-[color:var(--text)] transition hover:bg-white/10"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            </ThemeCard>
          );
        })}
      </div>
    </div>
  );
}
