export type ComboGroupId =
  | "on-grid-1phase"
  | "on-grid-3phase"
  | "hybrid-1phase"
  | "hybrid-3phase-lv"
  | "hybrid-3phase-hv";

export type ComboGroup = {
  id: ComboGroupId;
  label: string;
  description: string;
  order: number;
};

export const comboGroups: ComboGroup[] = [
  { id: "on-grid-1phase", label: "On-Grid 1 pha", description: "Hệ bám tải 1 pha", order: 1 },
  { id: "on-grid-3phase", label: "On-Grid 3 pha", description: "Hệ bám tải 3 pha", order: 2 },
  { id: "hybrid-1phase", label: "Hybrid 1 pha", description: "Hybrid có pin lưu trữ 1 pha", order: 3 },
  { id: "hybrid-3phase-lv", label: "Hybrid 3 pha áp thấp", description: "Hybrid 3 pha dùng pin áp thấp", order: 4 },
  { id: "hybrid-3phase-hv", label: "Hybrid 3 pha áp cao", description: "Hybrid 3 pha dùng pin áp cao", order: 5 },
];

export function getComboGroupId(combo: { code?: string; phase?: number; battery_kwh?: number | null; battery_type?: string | null }) {
  const code = String(combo.code ?? "").toUpperCase();
  const phase = Number(combo.phase ?? 1);
  const batteryKwh = Number(combo.battery_kwh ?? 0);
  const batteryType = String(combo.battery_type ?? "").toUpperCase();
  const isHybrid = code.startsWith("HY") || batteryKwh > 0;

  if (!isHybrid) {
    return phase === 3 ? "on-grid-3phase" : "on-grid-1phase";
  }

  if (phase === 3 && batteryType === "HV") return "hybrid-3phase-hv";
  if (phase === 3) return "hybrid-3phase-lv";
  if (batteryKwh > 0) return "hybrid-1phase";
  return phase === 3 ? "hybrid-3phase-lv" : "hybrid-1phase";
}

export function getComboGroupLabel(combo: { code?: string; phase?: number; battery_kwh?: number | null; battery_type?: string | null }) {
  const groupId = getComboGroupId(combo);
  return comboGroups.find((group) => group.id === groupId)?.label ?? "Khác";
}

export function getComboCategoryLabel(combo: { code?: string; phase?: number; battery_kwh?: number | null; battery_type?: string | null }) {
  const groupId = getComboGroupId(combo);
  switch (groupId) {
    case "on-grid-1phase":
      return "On-Grid 1 pha";
    case "on-grid-3phase":
      return "On-Grid 3 pha";
    case "hybrid-1phase":
      return "Hybrid 1 pha";
    case "hybrid-3phase-lv":
      return "Hybrid 3 pha áp thấp";
    case "hybrid-3phase-hv":
      return "Hybrid 3 pha áp cao";
    default:
      return "Khác";
  }
}
