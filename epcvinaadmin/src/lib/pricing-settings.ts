import type { SupabaseClient } from "@supabase/supabase-js";
import { parseLocaleNumber } from "@/lib/number-format";

export type PricingSettings = {
  labor_ongrid_per_kwp: number;
  labor_hybrid_per_kwp: number;
  target_gross_margin_pct: number;
  default_psh_hours: number;
  default_pr: number;
  self_use_ratio: number;
  residential_electricity_price_vnd_per_kwh: number;
  commercial_electricity_price_vnd_per_kwh: number;
  electricity_price_vnd_per_kwh: number;
  feed_in_tariff_vnd_per_kwh: number;
};

export const defaultPricingSettings: PricingSettings = {
  labor_ongrid_per_kwp: 500_000,
  labor_hybrid_per_kwp: 900_000,
  target_gross_margin_pct: 20,
  default_psh_hours: 4,
  default_pr: 0.8,
  self_use_ratio: 0.8,
  residential_electricity_price_vnd_per_kwh: 2_204,
  commercial_electricity_price_vnd_per_kwh: 2_500,
  electricity_price_vnd_per_kwh: 2_204,
  feed_in_tariff_vnd_per_kwh: 1_700,
};

export function normalizePricingSettings(input: Partial<PricingSettings> | null | undefined): PricingSettings {
  return {
    labor_ongrid_per_kwp: Number(input?.labor_ongrid_per_kwp ?? defaultPricingSettings.labor_ongrid_per_kwp) || defaultPricingSettings.labor_ongrid_per_kwp,
    labor_hybrid_per_kwp: Number(input?.labor_hybrid_per_kwp ?? defaultPricingSettings.labor_hybrid_per_kwp) || defaultPricingSettings.labor_hybrid_per_kwp,
    target_gross_margin_pct: Number(input?.target_gross_margin_pct ?? defaultPricingSettings.target_gross_margin_pct) || defaultPricingSettings.target_gross_margin_pct,
    default_psh_hours: Number(input?.default_psh_hours ?? defaultPricingSettings.default_psh_hours) || defaultPricingSettings.default_psh_hours,
    default_pr: Number(input?.default_pr ?? defaultPricingSettings.default_pr) || defaultPricingSettings.default_pr,
    self_use_ratio: Number(input?.self_use_ratio ?? defaultPricingSettings.self_use_ratio) || defaultPricingSettings.self_use_ratio,
    residential_electricity_price_vnd_per_kwh: Number(input?.residential_electricity_price_vnd_per_kwh ?? defaultPricingSettings.residential_electricity_price_vnd_per_kwh) || defaultPricingSettings.residential_electricity_price_vnd_per_kwh,
    commercial_electricity_price_vnd_per_kwh: Number(input?.commercial_electricity_price_vnd_per_kwh ?? defaultPricingSettings.commercial_electricity_price_vnd_per_kwh) || defaultPricingSettings.commercial_electricity_price_vnd_per_kwh,
    electricity_price_vnd_per_kwh: Number(input?.electricity_price_vnd_per_kwh ?? defaultPricingSettings.electricity_price_vnd_per_kwh) || defaultPricingSettings.electricity_price_vnd_per_kwh,
    feed_in_tariff_vnd_per_kwh: Number(input?.feed_in_tariff_vnd_per_kwh ?? defaultPricingSettings.feed_in_tariff_vnd_per_kwh) || defaultPricingSettings.feed_in_tariff_vnd_per_kwh,
  };
}

export function getDefaultElectricityPrice(customerType: "residential" | "commercial", pricingSettings: PricingSettings = defaultPricingSettings) {
  return customerType === "commercial"
    ? pricingSettings.commercial_electricity_price_vnd_per_kwh
    : pricingSettings.residential_electricity_price_vnd_per_kwh;
}

export function getSalesElectricityPriceLabel(customerType: "residential" | "commercial") {
  return customerType === "commercial" ? "Giá điện kinh doanh" : "Giá điện sinh hoạt";
}

export function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(Number(value ?? 0));
}

export function formatPct(value: number) {
  return `${Number(value ?? 0).toFixed(0)}%`;
}

export function parseNumberField(value: FormDataEntryValue | null) {
  return parseLocaleNumber(value, 0);
}

export async function getPricingSettings(supabase: SupabaseClient | null | undefined) {
  if (!supabase) return defaultPricingSettings;
  const { data } = await supabase.from("pricing_settings").select("*").eq("id", 1).maybeSingle();
  return normalizePricingSettings(data ?? defaultPricingSettings);
}
