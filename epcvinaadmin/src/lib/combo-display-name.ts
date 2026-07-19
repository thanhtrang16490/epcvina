export type ComboDisplaySource = {
  code?: string;
  phase?: number | null;
  solar_kw?: number | string | null;
  battery_kwh?: number | string | null;
  battery_type?: string | null;
  systemType?: "on-grid" | "hybrid";
  panelBrand?: string | null;
  inverterBrand?: string | null;
  batteryBrand?: string | null;
  panelPower?: string | null;
  inverterPower?: string | null;
  batteryCapacity?: string | null;
  primaryBrand?: string | null;
  primaryPower?: string | null;
};

export function getComboDisplayName(combo: ComboDisplaySource) {
  const systemType = combo.systemType ?? ((String(combo.code ?? "").startsWith("HY") || Number(combo.battery_kwh ?? 0) > 0) ? "hybrid" : "on-grid");
  const systemLabel = systemType === "hybrid" ? "Hybrid" : "On-grid";
  const phaseLabel = Number(combo.phase ?? 1) === 1 ? "1P" : "3P";
  const voltageLabel = String(combo.battery_type ?? "").toUpperCase();
  const kwp = Number(combo.solar_kw ?? 0);
  const base = `${systemLabel} ${kwp}kWp ${phaseLabel}${voltageLabel ? ` ${voltageLabel}` : ""}`.trim();
  const parts = [
    base,
    combo.primaryBrand && combo.primaryPower ? `${combo.primaryBrand} ${combo.primaryPower}` : "",
    combo.panelBrand && combo.panelPower ? `${combo.panelBrand} ${combo.panelPower}` : "",
    combo.inverterBrand && combo.inverterPower ? `${combo.inverterBrand} ${combo.inverterPower}` : "",
    combo.batteryBrand && combo.batteryCapacity ? `${combo.batteryBrand} ${combo.batteryCapacity}` : "",
  ].filter(Boolean);
  return parts.join(" - ").replace(/\s+/g, " ").toLowerCase();
}
