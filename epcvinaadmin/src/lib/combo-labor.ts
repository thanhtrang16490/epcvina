import { defaultPricingSettings, type PricingSettings } from "@/lib/pricing-settings";

export function isHybridCombo(input: { battery_kwh?: number | null; code?: string; combo_type?: string }) {
  const hasBattery = Number(input.battery_kwh ?? 0) > 0;
  const code = String(input.code ?? "").toUpperCase();
  const type = String(input.combo_type ?? "").toLowerCase();
  return hasBattery || code.startsWith("HY") || type === "custom";
}

export function getLaborRatePerKwp(
  input: { battery_kwh?: number | null; code?: string; combo_type?: string },
  pricingSettings: PricingSettings = defaultPricingSettings,
) {
  return isHybridCombo(input) ? pricingSettings.labor_hybrid_per_kwp : pricingSettings.labor_ongrid_per_kwp;
}

export function getLaborCostByKw(
  input: { solar_kw: number; battery_kwh?: number | null; code?: string; combo_type?: string },
  pricingSettings: PricingSettings = defaultPricingSettings,
) {
  const solarKw = Number(input.solar_kw ?? 0);
  if (solarKw <= 0) return 0;
  return Math.round(solarKw * getLaborRatePerKwp(input, pricingSettings));
}
