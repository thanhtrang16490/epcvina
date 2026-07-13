import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const envText = await fs.readFile(new URL("../.env.local", import.meta.url), "utf8");
const env = Object.fromEntries(
  envText
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return index > 0 ? [line.slice(0, index), line.slice(index + 1)] : [line, ""];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });

function slugify(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function parseCapacity(value) {
  const match = String(value ?? "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function inferPhase(systemType) {
  return /3\s*pha|3phase|three phase/i.test(String(systemType ?? "")) ? 3 : 1;
}

function inferFamily(systemType) {
  return /hybrid|lưu trữ|luu tru/i.test(String(systemType ?? "")) ? "hybrid" : "ongrid";
}

function inferBattery(systemType) {
  const text = String(systemType ?? "");
  if (/áp cao|hv/i.test(text)) return "HV";
  if (/áp thấp|lv/i.test(text)) return "LV";
  return null;
}

function comboScore(combo, family, phase, capacity, batteryType) {
  const comboFamily = combo.battery_kwh && Number(combo.battery_kwh) > 0 ? "hybrid" : "ongrid";
  let score = 0;
  if (comboFamily !== family) score += 1000;
  if (Number(combo.phase ?? 1) !== phase) score += 400;
  score += Math.abs(Number(combo.solar_kw ?? 0) - capacity) * 50;
  if (family === "hybrid") {
    if ((combo.battery_type ?? null) !== batteryType && batteryType) score += 120;
    score += Math.abs(Number(combo.battery_kwh ?? 0) - (capacity <= 6 ? 5.12 : capacity <= 11 ? 10.24 : capacity <= 18 ? 16 : 32)) * 8;
  }
  return score;
}

function buildDerivedCombo(project, templateCombo) {
  const capacity = parseCapacity(project.capacity || project.code || project.name);
  const phase = inferPhase(project.system_type);
  const family = inferFamily(project.system_type);
  const batteryType = family === "hybrid" ? inferBattery(project.system_type) : null;
  const batteryKwh = family === "hybrid" ? (capacity <= 6 ? 5.12 : capacity <= 11 ? 10.24 : capacity <= 18 ? 16 : 32) : 0;
  const safeCapacityLabel = capacity || Number(templateCombo?.solar_kw ?? 0) || 0;
  return {
    code: `${family === "hybrid" ? "HYBRID" : "ON-GRID"}-${String(safeCapacityLabel).replace(/\./g, "-")}KW-${phase}PHA${family === "hybrid" && batteryKwh ? `-${String(batteryKwh).replace(/\./g, "-")}KWH` : ""}`,
    name: `${family === "hybrid" ? "Hy-Brid" : "On-Grid"} ${safeCapacityLabel} kWp ${phase} pha${family === "hybrid" && batteryKwh ? ` – ${batteryKwh} kWh` : ""}`,
    slug: slugify(`${project.slug || project.name}-${safeCapacityLabel}-${phase}-${family}`),
    phase,
    solar_kw: safeCapacityLabel,
    battery_kwh: family === "hybrid" ? batteryKwh : 0,
    battery_type: batteryType,
    combo_type: "custom",
    source_kind: "project",
    status: "public",
    is_active: true,
    combo_category_id: templateCombo?.combo_category_id ?? null,
    cost_price: Number(templateCombo?.cost_price ?? 0) * (safeCapacityLabel / Math.max(Number(templateCombo?.solar_kw ?? 1), 0.1)),
    target_min_price: Number(templateCombo?.target_min_price ?? 0) * (safeCapacityLabel / Math.max(Number(templateCombo?.solar_kw ?? 1), 0.1)),
    reference_price: Number(templateCombo?.reference_price ?? 0) * (safeCapacityLabel / Math.max(Number(templateCombo?.solar_kw ?? 1), 0.1)),
    margin: Number(templateCombo?.margin ?? 0),
    description: `Combo tự bù từ dự án ${project.name}`,
    highlights: [],
    sort_order: 0,
  };
}

async function ensureComboForProject(project, combos, comboItemsByComboId) {
  const capacity = parseCapacity(project.capacity || project.code || project.name);
  const phase = inferPhase(project.system_type);
  const family = inferFamily(project.system_type);
  const batteryType = family === "hybrid" ? inferBattery(project.system_type) : null;

  const exact = combos.find((combo) => {
    const comboFamily = combo.battery_kwh && Number(combo.battery_kwh) > 0 ? "hybrid" : "ongrid";
    const batteryMatch = family !== "hybrid" || !batteryType || (combo.battery_type ?? null) === batteryType;
    return comboFamily === family && Number(combo.phase ?? 1) === phase && Math.abs(Number(combo.solar_kw ?? 0) - capacity) < 0.15 && batteryMatch;
  });
  if (exact) return exact;

  const template = [...combos].sort((a, b) => comboScore(a, family, phase, capacity, batteryType) - comboScore(b, family, phase, capacity, batteryType))[0];
  if (!template) return null;

  const derived = buildDerivedCombo(project, template);
  const insert = await supabase.from("combos").insert(derived).select("*").single();
  if (insert.error) throw insert.error;
  const comboId = insert.data.id;
  const templateItems = comboItemsByComboId.get(String(template.id)) ?? [];
  const ratio = capacity > 0 && Number(template.solar_kw ?? 0) > 0 ? capacity / Number(template.solar_kw) : 1;
  const items = templateItems.map((item, index) => ({
    combo_id: comboId,
    product_id: item.product_id,
    item_name: item.item_name,
    category: item.category,
    brand: item.brand,
    unit: item.unit,
    quantity: Math.max(1, Math.round(Number(item.quantity ?? 1) * ratio)),
    unit_price_vat: Number(item.unit_price_vat ?? 0),
    total_price_vat: Number(item.unit_price_vat ?? 0) * Math.max(1, Math.round(Number(item.quantity ?? 1) * ratio)),
    cost_price: Number(item.cost_price ?? 0),
    total_cost_price: Number(item.cost_price ?? 0) * Math.max(1, Math.round(Number(item.quantity ?? 1) * ratio)),
    warranty: item.warranty ?? "",
    notes: item.notes ?? "Auto-derived from project",
    sort_order: Number(item.sort_order ?? 0) + index,
  }));
  if (items.length) {
    const { error } = await supabase.from("combo_items").insert(items);
    if (error) throw error;
  }
  return { id: comboId, ...derived };
}

async function upsertOrderForProject(project, customerId, combo) {
  const { data: comboItemRows } = await supabase
    .from("combo_items")
    .select("quantity, unit_price_vat, total_price_vat")
    .eq("combo_id", combo.id);
  const existing = await supabase.from("orders").select("id").eq("project_id", project.id).maybeSingle();
  const comboTotal =
    (comboItemRows ?? []).reduce(
      (sum, item) => sum + Number(item.total_price_vat ?? Number(item.unit_price_vat ?? 0) * Number(item.quantity ?? 1)),
      0,
    ) || Number(combo.reference_price ?? combo.target_min_price ?? 0);
  const orderItemsPayload = [
    {
      order_id: "__pending__",
      combo_id: combo.id,
      product_id: null,
      item_name: combo.name,
      item_type: "combo",
      quantity: 1,
      unit_price: comboTotal,
      total_price: comboTotal,
      note: "Auto-generated from project",
      sort_order: 1,
    },
  ];
  const orderPayload = {
    slug: slugify(`${project.slug}-order`),
    customer_id: customerId ?? project.customer_id ?? null,
    project_id: project.id,
    order_no: project.code || project.capacity || project.name,
    order_type: combo.battery_kwh && Number(combo.battery_kwh) > 0 ? "combo" : "combo",
    status: "public",
    order_date: null,
    note: `Auto-generated from project ${project.name}`,
    subtotal: comboTotal,
    discount: 0,
    total: comboTotal,
  };
  const orderResult = existing.data?.id
    ? await supabase.from("orders").update(orderPayload).eq("id", existing.data.id).select("id").single()
    : await supabase.from("orders").insert(orderPayload).select("id").single();
  if (orderResult.error) throw orderResult.error;
  const orderId = orderResult.data.id;
  const { error: deleteError } = await supabase.from("order_items").delete().eq("order_id", orderId);
  if (deleteError) throw deleteError;
  const { error: insertError } = await supabase.from("order_items").insert(
    orderItemsPayload.map((item) => ({ ...item, order_id: orderId })),
  );
  if (insertError) throw insertError;
  return orderId;
}

async function main() {
  const [projectsRes, customersRes, combosRes, comboItemsRes] = await Promise.all([
    supabase.from("projects").select("id, slug, name, code, capacity, system_type, status, customer_id").eq("status", "public").order("created_at", { ascending: false }),
    supabase.from("customers").select("id, name, slug"),
    supabase.from("combos").select("*").order("sort_order", { ascending: true }),
    supabase.from("combo_items").select("*").order("sort_order", { ascending: true }),
  ]);
  if (projectsRes.error) throw projectsRes.error;
  if (customersRes.error) throw customersRes.error;
  if (combosRes.error) throw combosRes.error;
  if (comboItemsRes.error) throw comboItemsRes.error;

  const projects = projectsRes.data ?? [];
  const customers = customersRes.data ?? [];
  const combos = combosRes.data ?? [];
  const comboItems = comboItemsRes.data ?? [];
  const comboItemsByComboId = new Map();
  for (const item of comboItems) {
    const key = String(item.combo_id);
    if (!comboItemsByComboId.has(key)) comboItemsByComboId.set(key, []);
    comboItemsByComboId.get(key).push(item);
  }

  const customerById = new Map(customers.map((row) => [String(row.id), row]));
  let createdCombos = 0;
  let createdOrders = 0;
  let updatedOrders = 0;

  for (const project of projects) {
    const combo = await ensureComboForProject(project, combos, comboItemsByComboId);
    if (!combo) continue;
    if (!combos.some((item) => String(item.id) === String(combo.id))) {
      combos.push(combo);
      createdCombos += 1;
    }
    const customer = customerById.get(String(project.customer_id ?? "")) ?? null;
    const existingOrder = await supabase.from("orders").select("id").eq("project_id", project.id).maybeSingle();
    const orderId = await upsertOrderForProject(project, customer?.id ?? null, combo);
    if (existingOrder.data?.id) updatedOrders += 1;
    else createdOrders += 1;
    console.log(`[OK] ${project.name} -> ${combo.name} -> order ${orderId}`);
  }

  console.log(JSON.stringify({ createdCombos, createdOrders, updatedOrders }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
