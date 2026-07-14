import { getDisplayedComboPrice } from "@/lib/combo-price";
import { getComboAreaM2 } from "@/lib/combo-area";
import { buildComboFinance, round2 } from "@/lib/combo-finance";
import { parseLocaleNumber } from "@/lib/number-format";
import type { PricingSettings } from "@/lib/pricing-settings";

export type AdvisorInputs = {
  customerType: "residential" | "commercial";
  phase: 1 | 3;
  monthlyBillVnd: number;
  monthlyConsumptionKwh: number;
  avgElectricityPriceVnd: number;
  budgetVnd: number | null;
  region: "north" | "central" | "south" | "custom";
  psh: number;
  pr: number;
  roofAreaM2: number;
  daytimeUseRatio: number;
  batteryWanted: boolean;
};

export type AdvisorCombo = {
  id: string;
  code: string;
  name: string;
  slug: string;
  phase: number;
  solar_kw: number;
  battery_kwh: number | null;
  battery_type: string | null;
  target_min_price: number;
  reference_price: number;
  description: string;
  is_active: boolean;
  status?: string;
  combo_type?: string;
  items?: Array<{
    quantity?: number;
    product?: { technical_specs?: unknown } | null;
    item_name?: string;
    category?: string;
    notes?: string;
  }>;
};

export type AdvisorComboSuggestion = AdvisorCombo & {
  displayedPriceVnd: number;
  displayedPriceLabel: string;
  estimatedPaybackYears: number;
  estimatedRoofAreaM2: number | null;
  score: number;
  fitLabel: string;
  reasons: string[];
};

export type AdvisorSummary = {
  recommendedKwP: number;
  estimatedMonthlyProductionKwh: number;
  estimatedAnnualProductionKwh: number;
  estimatedRoofAreaM2: number;
  estimatedInvestmentVnd: number;
  estimatedMonthlySavingsVnd: number;
  estimatedMonthlyExportVnd: number;
  estimatedMonthlyBenefitVnd: number;
  estimatedPaybackYears: number;
  estimatedRoiPct: number;
};

export const regionPresets: Record<AdvisorInputs["region"], { label: string; psh: number; note: string }> = {
  north: { label: "Miền Bắc", psh: 4.0, note: "Thường chọn mức thận trọng để tư vấn nhanh." },
  central: { label: "Miền Trung", psh: 4.8, note: "Bức xạ tốt hơn, công suất đề xuất thường cao hơn." },
  south: { label: "Miền Nam", psh: 5.0, note: "Giờ nắng cao, có thể tối ưu ROI nhanh." },
  custom: { label: "Tự nhập", psh: 4.0, note: "Dùng khi đã có dữ liệu thực tế từ site khảo sát." },
};

export function parseAdvisorNumber(value: FormDataEntryValue | null, fallback = 0) {
  return parseLocaleNumber(value, fallback);
}

function safeDivide(numerator: number, denominator: number, fallback = 0) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) return fallback;
  return numerator / denominator;
}

export function normalizeAdvisorInputs(raw: Record<string, string | string[] | undefined>, settings: PricingSettings): AdvisorInputs {
  const customerType = String(raw.customer_type ?? "residential") as AdvisorInputs["customerType"];
  const phaseRaw = String(raw.phase ?? "").trim();
  const phase =
    phaseRaw === "1"
      ? 1
      : phaseRaw === "3"
        ? 3
        : customerType === "commercial"
          ? 3
          : 1;
  const region = String(raw.region ?? "north") as AdvisorInputs["region"];
  const regionPsh = regionPresets[region]?.psh ?? regionPresets.north.psh;
  const monthlyBillVnd = parseAdvisorNumber(raw.bill as unknown as FormDataEntryValue | null, 0);
  const monthlyConsumptionKwh = parseAdvisorNumber(raw.consumption as unknown as FormDataEntryValue | null, 0);
  const avgElectricityPriceVnd = parseAdvisorNumber(
    raw.price as unknown as FormDataEntryValue | null,
    customerType === "commercial"
      ? settings.commercial_electricity_price_vnd_per_kwh
      : settings.residential_electricity_price_vnd_per_kwh,
  );
  const budgetRaw = String(raw.budget ?? "").trim();
  const budgetVnd = budgetRaw ? parseAdvisorNumber(raw.budget as unknown as FormDataEntryValue | null, 0) : null;
  const psh = parseAdvisorNumber(raw.psh as unknown as FormDataEntryValue | null, regionPsh);
  const pr = parseAdvisorNumber(raw.pr as unknown as FormDataEntryValue | null, settings.default_pr);
  const roofAreaM2 = parseAdvisorNumber(raw.roof as unknown as FormDataEntryValue | null, 0);
  const daytimeUseRatio = Math.min(1, Math.max(0, parseAdvisorNumber(raw.daytime as unknown as FormDataEntryValue | null, settings.self_use_ratio)));
  const batteryWanted = String(raw.battery ?? "off") === "on";

  return {
    monthlyBillVnd,
    monthlyConsumptionKwh,
    avgElectricityPriceVnd,
    customerType,
    phase,
    budgetVnd,
    region,
    psh,
    pr,
    roofAreaM2,
    daytimeUseRatio,
    batteryWanted,
  };
}

export function buildAdvisorSummary(input: AdvisorInputs, settings: PricingSettings): AdvisorSummary {
  const defaultElectricityPrice =
    input.customerType === "commercial"
      ? settings.commercial_electricity_price_vnd_per_kwh
      : settings.residential_electricity_price_vnd_per_kwh;
  const monthlyConsumptionKwh =
    input.monthlyConsumptionKwh > 0
      ? input.monthlyConsumptionKwh
      : input.monthlyBillVnd > 0 && (input.avgElectricityPriceVnd > 0 || defaultElectricityPrice > 0)
        ? safeDivide(input.monthlyBillVnd, input.avgElectricityPriceVnd > 0 ? input.avgElectricityPriceVnd : defaultElectricityPrice)
        : 0;
  const recommendedKwP = monthlyConsumptionKwh > 0 ? safeDivide(monthlyConsumptionKwh, input.psh * 30) : 0;
  const estimatedMonthlyProductionKwh = recommendedKwP * input.psh * 30 * input.pr;
  const estimatedAnnualProductionKwh = estimatedMonthlyProductionKwh * 12;
  const estimatedRoofAreaM2 = recommendedKwP * 4.8;
  const estimatedInvestmentVnd = recommendedKwP * (input.batteryWanted ? 15_500_000 : 13_000_000);
  const estimatedMonthlySavingsVnd = estimatedMonthlyProductionKwh * input.daytimeUseRatio * settings.electricity_price_vnd_per_kwh;
  const estimatedMonthlyExportVnd = 0;
  const estimatedMonthlyBenefitVnd = estimatedMonthlySavingsVnd;
  const estimatedPaybackYears = estimatedMonthlyBenefitVnd > 0 ? estimatedInvestmentVnd / (estimatedMonthlyBenefitVnd * 12) : 0;
  const estimatedRoiPct = estimatedInvestmentVnd > 0 ? (estimatedMonthlyBenefitVnd * 12) / estimatedInvestmentVnd * 100 : 0;

  return {
    recommendedKwP: round2(recommendedKwP),
    estimatedMonthlyProductionKwh: round2(estimatedMonthlyProductionKwh),
    estimatedAnnualProductionKwh: round2(estimatedAnnualProductionKwh),
    estimatedRoofAreaM2: round2(estimatedRoofAreaM2),
    estimatedInvestmentVnd: Math.round(estimatedInvestmentVnd),
    estimatedMonthlySavingsVnd: Math.round(estimatedMonthlySavingsVnd),
    estimatedMonthlyExportVnd: Math.round(estimatedMonthlyExportVnd),
    estimatedMonthlyBenefitVnd: Math.round(estimatedMonthlyBenefitVnd),
    estimatedPaybackYears: round2(estimatedPaybackYears),
    estimatedRoiPct: round2(estimatedRoiPct),
  };
}

function estimateComboArea(combo: AdvisorCombo) {
  if (combo.items?.length) {
    return getComboAreaM2(combo.items as never[]);
  }
  return combo.solar_kw > 0 ? combo.solar_kw * 4.8 : null;
}

export function getAdvisorSystemType(input: AdvisorInputs) {
  return input.batteryWanted ? "hybrid" : "on-grid";
}

export function getAdvisorRecommendedPhase(recommendedKwP: number) {
  return recommendedKwP >= 10 ? 3 : 1;
}

export function getAdvisorPhaseSuggestion(input: AdvisorInputs, summary: AdvisorSummary) {
  if (input.phase === 3) {
    return "Nhà có tải lớn, điều hòa tổng hoặc thang máy thì nên ưu tiên 3 pha cho cả nhà.";
  }
  return summary.recommendedKwP >= 10
    ? "Đang chọn 1 pha riêng, hệ thống sẽ ưu tiên các combo 1 pha phù hợp; nếu sau này đổi nhu cầu, có thể chuyển sang 3 pha."
    : "Phù hợp khi muốn chạy 1 pha riêng cho các thiết bị khác của nhà.";
}

export function scoreAdvisorCombo(
  combo: AdvisorCombo,
  summary: AdvisorSummary,
  input: AdvisorInputs,
  settings: PricingSettings,
): AdvisorComboSuggestion {
  const displayedPrice = getDisplayedComboPrice(combo);
  const displayedPriceVnd = Math.round(Number(displayedPrice.value ?? 0));
  const comboKw = Number(combo.solar_kw ?? 0);
  const comboArea = estimateComboArea(combo);
  const hybrid = Number(combo.battery_kwh ?? 0) > 0 || String(combo.code ?? "").toUpperCase().startsWith("HY");
  const recommendedSystemType = getAdvisorSystemType(input);
  const recommendedPhase = input.phase ?? getAdvisorRecommendedPhase(summary.recommendedKwP);
  const kwGap = Math.abs(comboKw - summary.recommendedKwP);
  const phaseMismatch = combo.phase !== recommendedPhase ? 0.35 : 0;
  const batteryMismatch = recommendedSystemType === "hybrid" && !hybrid ? 0.9 : recommendedSystemType === "on-grid" && hybrid ? 0.25 : 0;
  const areaPenalty =
    comboArea && summary.estimatedRoofAreaM2 > 0
      ? comboArea > summary.estimatedRoofAreaM2
        ? (comboArea - summary.estimatedRoofAreaM2) / summary.estimatedRoofAreaM2
        : 0
      : 0;
  const pricePerKwp = comboKw > 0 ? displayedPriceVnd / comboKw : displayedPriceVnd;
  const budgetPenalty =
    input.budgetVnd !== null && input.budgetVnd > 0 && displayedPriceVnd > input.budgetVnd
      ? ((displayedPriceVnd - input.budgetVnd) / input.budgetVnd) * 14 + 8
      : 0;
  const expectedPayback = buildComboFinance({
    solarKw: comboKw,
    costPrice: displayedPriceVnd,
    referencePrice: displayedPriceVnd,
    psh: input.psh,
    pr: input.pr,
    selfUseRatio: input.daytimeUseRatio,
    selfUsePrice: settings.electricity_price_vnd_per_kwh,
    exportPrice: 0,
    pricingSettings: settings,
  }).paybackYears;
  const underSizedPenalty = comboKw < summary.recommendedKwP * 0.75 ? (summary.recommendedKwP * 0.75 - comboKw) * 4 : 0;
  const overSizedPenalty = comboKw > summary.recommendedKwP * 1.35 ? (comboKw - summary.recommendedKwP * 1.35) * 3 : 0;
  const paybackPenalty = expectedPayback > 0 ? Math.max(0, expectedPayback - 5.5) * 1.2 : 8;
  const priceTierPenalty = pricePerKwp > 18_000_000 ? (pricePerKwp - 18_000_000) / 2_500_000 : 0;
  const score =
    kwGap * 7 +
    underSizedPenalty +
    overSizedPenalty * 1.3 +
    phaseMismatch * 6 +
    batteryMismatch * 10 +
    areaPenalty * 7 +
    priceTierPenalty +
    paybackPenalty +
    budgetPenalty;

  const fitLabel =
    recommendedSystemType === "hybrid"
      ? hybrid
        ? "Khớp hybrid"
        : "Thiếu pin"
      : hybrid
        ? "Hybrid vượt nhu cầu"
        : "Khớp on-grid";

  const reasons = [
    comboKw ? `${comboKw} kWp so với đề xuất ${summary.recommendedKwP} kWp` : "Có dữ liệu công suất rõ ràng",
    hybrid === input.batteryWanted ? "Đúng định hướng hệ" : input.batteryWanted ? "Thiếu pin lưu trữ" : "Không bị dư pin lưu trữ",
    combo.phase === recommendedPhase ? `${combo.phase} pha phù hợp` : `${combo.phase} pha cần xem lại`,
    comboArea ? `Mái ước tính ${comboArea.toFixed(1)} m²` : "Có thể triển khai linh hoạt",
    input.budgetVnd !== null && input.budgetVnd > 0
      ? displayedPriceVnd <= input.budgetVnd
        ? `Nằm trong ngân sách ${Math.round(input.budgetVnd).toLocaleString("vi-VN")} đ`
        : `Vượt ngân sách ${Math.round(input.budgetVnd).toLocaleString("vi-VN")} đ`
      : "Chưa lọc theo ngân sách",
  ];

  return {
    ...combo,
    displayedPriceVnd,
    displayedPriceLabel: displayedPrice.label,
    estimatedPaybackYears: expectedPayback,
    estimatedRoofAreaM2: comboArea,
    score,
    fitLabel,
    reasons,
  };
}

export function sortAdvisorCombos(combos: AdvisorCombo[], summary: AdvisorSummary, input: AdvisorInputs, settings: PricingSettings) {
  return combos
    .filter((combo) => combo.is_active !== false && combo.status !== "inactive")
    .filter((combo) => {
      if (!input.batteryWanted) return true;
      const hybrid = Number(combo.battery_kwh ?? 0) > 0 || String(combo.code ?? "").toUpperCase().startsWith("HY");
      return hybrid;
    })
    .filter((combo) => combo.phase === input.phase)
    .map((combo) => scoreAdvisorCombo(combo, summary, input, settings))
    .sort((a, b) => a.score - b.score)
    .slice(0, 6);
}
