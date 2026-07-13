export type PricingRuleGroup = {
  key: string;
  label: string;
  description: string;
  laborRatePerKwp: number;
};

export const pricingRules = {
  labor: {
    ongrid: {
      key: "ongrid",
      label: "On-grid",
      description: "Áp dụng cho combo không pin lưu trữ.",
      laborRatePerKwp: 500_000,
    },
    hybrid: {
      key: "hybrid",
      label: "Hybrid",
      description: "Áp dụng cho combo có pin lưu trữ hoặc combo hybrid.",
      laborRatePerKwp: 900_000,
    },
  },
} as const satisfies {
  labor: Record<"ongrid" | "hybrid", PricingRuleGroup>;
};

export function formatPricingRuleMoney(value: number) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(Number(value ?? 0));
}
