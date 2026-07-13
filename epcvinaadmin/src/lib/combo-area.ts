type SpecLike = {
  title?: unknown;
  value?: unknown;
};

type PanelLike = {
  quantity?: number;
  product?: {
    technical_specs?: unknown;
  } | null;
  notes?: string;
  item_name?: string;
  category?: string;
};

function normalizeText(value: unknown) {
  return `${value ?? ""}`.toLowerCase();
}

function extractSpecEntries(value: unknown): SpecLike[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => ({
        title: (item as SpecLike).title,
        value: (item as SpecLike).value,
      }))
      .filter((item) => `${item.title ?? ""}`.trim() || `${item.value ?? ""}`.trim());
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(([title, rawValue]) => ({
      title,
      value: rawValue,
    }));
  }
  return [];
}

function parsePanelAreaFromText(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const matched = normalized.match(/(\d{3,4}(?:[.,]\d+)?)\s*[x×]\s*(\d{3,4}(?:[.,]\d+)?)/i);
  if (!matched) return null;
  const widthMm = Number(matched[1].replace(",", "."));
  const heightMm = Number(matched[2].replace(",", "."));
  if (!Number.isFinite(widthMm) || !Number.isFinite(heightMm) || widthMm <= 0 || heightMm <= 0) return null;
  return (widthMm / 1000) * (heightMm / 1000);
}

export function getPanelAreaM2FromSpecs(specs: unknown, fallbackText = "") {
  const entries = extractSpecEntries(specs);
  const candidates = [
    ...entries.map((item) => `${item.title ?? ""} ${item.value ?? ""}`),
    fallbackText,
  ];

  for (const candidate of candidates) {
    const value = parsePanelAreaFromText(normalizeText(candidate));
    if (value) return value;
  }

  return null;
}

export function getComboAreaM2(items: PanelLike[]) {
  let total = 0;
  let found = false;

  items.forEach((item) => {
    const text = normalizeText(`${item.item_name ?? ""} ${item.category ?? ""} ${item.notes ?? ""}`);
    if (!text.includes("pin") && !text.includes("panel") && !text.includes("pv")) return;
    const qty = Number(item.quantity ?? 0);
    const areaPerPanel = getPanelAreaM2FromSpecs(item.product?.technical_specs, text);
    if (!areaPerPanel || !Number.isFinite(qty) || qty <= 0) return;
    total += areaPerPanel * qty;
    found = true;
  });

  return found ? total : null;
}
