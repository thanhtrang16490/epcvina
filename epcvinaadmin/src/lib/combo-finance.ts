import { defaultPricingSettings, type PricingSettings } from "@/lib/pricing-settings";

export type ComboFinanceInput = {
  solarKw: number;
  costPrice: number;
  targetMargin?: number;
  referencePrice?: number;
  psh?: number;
  pr?: number;
  selfUseRatio?: number;
  gridExportRatio?: number;
  selfUsePrice?: number;
  exportPrice?: number;
  pricingSettings?: Partial<PricingSettings>;
};

const DEFAULT_PSH = 4;
const DEFAULT_PR = 0.8;
const DEFAULT_SELF_USE_RATIO = 0.8;
const DEFAULT_SELF_USE_PRICE = 3200;
const DEFAULT_EXPORT_PRICE = 1700;

export function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function getSuggestedSellingPrice(costPrice: number, targetMargin = 0.2) {
  if (costPrice <= 0) return 0;
  return costPrice / (1 - targetMargin);
}

export function getGrossProfit(sellingPrice: number, costPrice: number) {
  return Math.max(0, sellingPrice - costPrice);
}

export function getGrossMargin(sellingPrice: number, costPrice: number) {
  return sellingPrice > 0 ? ((sellingPrice - costPrice) / sellingPrice) * 100 : 0;
}

export function getMonthlyProductionKwh(solarKw: number, psh = DEFAULT_PSH, pr = DEFAULT_PR) {
  return solarKw * psh * 30 * pr;
}

export function getMonthlyBenefitVnd(
  monthlyProductionKwh: number,
  selfUseRatio = DEFAULT_SELF_USE_RATIO,
  selfUsePrice = DEFAULT_SELF_USE_PRICE,
  exportPrice = DEFAULT_EXPORT_PRICE,
) {
  const selfUseKwh = monthlyProductionKwh * selfUseRatio;
  const exportKwh = Math.max(0, monthlyProductionKwh - selfUseKwh);
  return selfUseKwh * selfUsePrice + exportKwh * exportPrice;
}

export function getPaybackYears(
  sellingPriceVnd: number,
  monthlyBenefitVnd: number,
) {
  return monthlyBenefitVnd > 0 ? sellingPriceVnd / (monthlyBenefitVnd * 12) : 0;
}

export function buildComboFinance(input: ComboFinanceInput) {
  const pricingSettings = {
    ...defaultPricingSettings,
    ...input.pricingSettings,
  };
  const solarKw = Number(input.solarKw ?? 0);
  const costPrice = Number(input.costPrice ?? 0);
  const targetMargin = Number(input.targetMargin ?? 0.2);
  const suggestedSellingPrice = Number(input.referencePrice ?? getSuggestedSellingPrice(costPrice, targetMargin));
  const grossProfit = getGrossProfit(suggestedSellingPrice, costPrice);
  const grossMargin = getGrossMargin(suggestedSellingPrice, costPrice);
  const monthlyProductionKwh = getMonthlyProductionKwh(solarKw, input.psh ?? pricingSettings.default_psh_hours, input.pr ?? pricingSettings.default_pr);
  const monthlyBenefitVnd = getMonthlyBenefitVnd(
    monthlyProductionKwh,
    input.selfUseRatio ?? pricingSettings.self_use_ratio,
    input.selfUsePrice ?? pricingSettings.electricity_price_vnd_per_kwh,
    input.exportPrice ?? pricingSettings.feed_in_tariff_vnd_per_kwh,
  );
  const paybackYears = getPaybackYears(suggestedSellingPrice, monthlyBenefitVnd);

  return {
    solarKw,
    costPrice,
    targetMargin,
    suggestedSellingPrice,
    grossProfit,
    grossMargin,
    monthlyProductionKwh,
    monthlyBenefitVnd,
    paybackYears,
  };
}
