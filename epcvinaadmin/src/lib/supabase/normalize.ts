type AnyRecord = Record<string, unknown>;

export function toNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value
        .split(/[\n,]/g)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
}

export function normalizeCombo(row: AnyRecord) {
  const rawStatus = String(row.status ?? "").toLowerCase();
  const status =
    rawStatus === "public" || rawStatus === "active"
      ? "active"
      : rawStatus === "archive" || rawStatus === "draft" || rawStatus === "inactive"
        ? "inactive"
        : row.is_active ?? row.isActive ?? true
          ? "active"
          : "inactive";
  return {
    id: String(row.id ?? ""),
    code: String(row.code ?? ""),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    phase: Number(row.phase ?? 1),
    solar_kw: toNumber(row.solar_kw ?? row.solarKw),
    battery_kwh:
      row.battery_kwh === null || row.battery_kwh === undefined
        ? row.batteryKwh === null || row.batteryKwh === undefined
          ? null
          : toNumber(row.batteryKwh)
        : toNumber(row.battery_kwh),
    battery_type: (row.battery_type ?? row.batteryType ?? null) as string | null,
    cost_price: toNumber(row.cost_price ?? row.costPrice),
    target_min_price: toNumber(row.target_min_price ?? row.targetMinPrice),
    reference_price: toNumber(row.reference_price ?? row.referencePrice),
    margin: toNumber(row.margin),
    description: String(row.description ?? ""),
    cover_image_url: String(row.cover_image_url ?? row.coverImageUrl ?? ""),
    image_urls: toStringArray(row.image_urls),
    highlights: Array.isArray(row.highlights) ? row.highlights : null,
    sort_order: Number(row.sort_order ?? row.sortOrder ?? 0),
    is_active: Boolean(row.is_active ?? row.isActive ?? true),
    status,
    combo_type: String(row.combo_type ?? row.comboType ?? (row.source_kind === "project" ? "custom" : "standard")),
    source_kind: String(row.source_kind ?? row.sourceKind ?? ""),
    combo_category_id: String(row.combo_category_id ?? row.comboCategoryId ?? ""),
  };
}

export function normalizeProduct(row: AnyRecord) {
  const technicalSpecsRaw = row.technical_specs ?? row.technicalSpecs ?? {};
  const technicalSpecs = typeof technicalSpecsRaw === "object" && technicalSpecsRaw !== null ? technicalSpecsRaw : {};
  const rawStatus = String(row.status ?? "").toLowerCase();
  const status =
    rawStatus === "public" || rawStatus === "active"
      ? "active"
      : rawStatus === "archive" || rawStatus === "draft" || rawStatus === "inactive"
        ? "inactive"
        : row.is_active ?? row.isActive ?? true
          ? "active"
          : "inactive";
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    category: String(row.category ?? ""),
    brand: String(row.brand ?? ""),
    unit: String(row.unit ?? ""),
    quantity: toNumber(row.quantity),
    sale_price_vat: toNumber(row.sale_price_vat ?? row.salePriceVat),
    cost_price: toNumber(row.cost_price ?? row.costPrice),
    warranty: String(row.warranty ?? ""),
    description: String(row.description ?? ""),
    cover_image_url: String(row.cover_image_url ?? row.coverImageUrl ?? ""),
    image_urls: toStringArray(row.image_urls),
    technical_specs: technicalSpecs,
    sort_order: Number(row.sort_order ?? row.sortOrder ?? 0),
    is_active: Boolean(row.is_active ?? row.isActive ?? true),
    isActive: Boolean(row.is_active ?? row.isActive ?? true),
    status,
  };
}

export function normalizeComboItem(row: AnyRecord) {
  return {
    id: String(row.id ?? ""),
    combo_id: String(row.combo_id ?? row.comboId ?? ""),
    product_id: row.product_id ?? row.productId ?? null,
    reference_product_id: row.reference_product_id ?? row.referenceProductId ?? null,
    item_name: String(row.item_name ?? row.itemName ?? ""),
    category: String(row.category ?? ""),
    brand: String(row.brand ?? ""),
    unit: String(row.unit ?? ""),
    quantity: toNumber(row.quantity),
    unit_price_vat: toNumber(row.unit_price_vat ?? row.unitPriceVat),
    total_price_vat: toNumber(row.total_price_vat ?? row.totalPriceVat),
    cost_price: toNumber(row.cost_price ?? row.costPrice),
    total_cost_price: toNumber(row.total_cost_price ?? row.totalCostPrice),
    sheet_group: String(row.sheet_group ?? row.sheetGroup ?? ""),
    gross_margin: toNumber(row.gross_margin ?? row.grossMargin),
    warranty: String(row.warranty ?? ""),
    notes: String(row.notes ?? ""),
    sort_order: Number(row.sort_order ?? row.sortOrder ?? 0),
  };
}
