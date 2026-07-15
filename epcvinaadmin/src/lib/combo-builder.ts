import type { normalizeProduct } from "@/lib/supabase/normalize";

export type ProductRow = ReturnType<typeof normalizeProduct>;

export const comboItemGroups = [
  { id: "panel", label: "Tấm pin mặt trời" },
  { id: "inverter", label: "Inverter" },
  { id: "battery", label: "Pin lưu trữ" },
  { id: "mounting", label: "Hệ khung nhôm" },
  { id: "wiring", label: "Hệ dây điện" },
  { id: "cabinet", label: "Tủ điện" },
  { id: "grounding", label: "Hệ tiếp địa" },
  { id: "labor", label: "Chi phí nhân công" },
] as const;

export type ComboGroupId = (typeof comboItemGroups)[number]["id"];

export function getProductGroup(product: ProductRow): ComboGroupId {
  const category = `${product.category ?? ""} ${product.name ?? ""}`.toLowerCase();
  if (category.includes("pin lưu trữ") || category.includes("battery") || category.includes("lithium")) return "battery";
  if (category.includes("tấm pin") || category.includes("panel") || category.includes("pv")) return "panel";
  if (category.includes("inverter") || category.includes("biến tần")) return "inverter";
  if (category.includes("khung") || category.includes("rail") || category.includes("mount")) return "mounting";
  if (category.includes("dây") || category.includes("cáp") || category.includes("wire")) return "wiring";
  if (category.includes("tủ điện") || category.includes("cabinet") || category.includes("meter")) return "cabinet";
  if (category.includes("tiếp địa") || category.includes("ground")) return "grounding";
  if (category.includes("nhân công") || category.includes("thi công") || category.includes("lao động") || category.includes("labor")) return "labor";
  return "wiring";
}

export function parsePowerWp(product: ProductRow) {
  const text = `${product.name ?? ""} ${product.description ?? ""}`;
  const match = text.match(/(\d+(?:\.\d+)?)\s*wp/i);
  if (match) return Number(match[1]);
  const wattMatch = text.match(/(\d+(?:\.\d+)?)\s*w\b/i);
  if (wattMatch) return Number(wattMatch[1]);
  return 0;
}

export function parseBatteryKwh(product: ProductRow) {
  const text = `${product.name ?? ""} ${product.description ?? ""}`;
  const match = text.match(/(\d+(?:\.\d+)?)\s*kwh/i);
  if (match) return Number(match[1]);
  const ahMatch = text.match(/(\d+(?:\.\d+)?)\s*ah/i);
  if (ahMatch && /51,?2v|51\.2v/i.test(text)) {
    return (Number(ahMatch[1]) * 51.2) / 1000;
  }
  return 0;
}

export function calculateItemQuantity(product: ProductRow, comboKw: number, comboBatteryKwh: number | null, factor = 1) {
  const group = getProductGroup(product);
  if (group === "panel") {
    const watt = parsePowerWp(product) || 620;
    return Math.max(1, Math.ceil(((comboKw * 1000) / watt) * factor));
  }
  if (group === "battery") {
    const capacity = parseBatteryKwh(product) || 5.12;
    const target = Number(comboBatteryKwh ?? 0);
    return target > 0 ? Math.max(1, Math.ceil((target / capacity) * factor)) : 1;
  }
  if (group === "inverter") return Math.max(1, Math.round(factor));
  return Math.max(1, Math.round(Number(product.quantity || 1) * factor));
}

export function deriveSolarKwFromPanelCount(panelProduct: ProductRow, panelCount: number) {
  const watt = parsePowerWp(panelProduct) || 620;
  return Number(((panelCount * watt) / 1000).toFixed(2));
}

export function deriveBatteryKwhFromBatteryCount(batteryProduct: ProductRow, batteryCount: number) {
  const capacity = parseBatteryKwh(batteryProduct) || 5.12;
  return Number((batteryCount * capacity).toFixed(2));
}
