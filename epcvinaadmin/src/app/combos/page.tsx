import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { CrudFilterBar } from "@/components/CrudFilterBar";
import { SectionTitle } from "@/components/SectionTitle";
import { comboGroups, getComboCategoryLabel, getComboGroupId, getComboGroupLabel } from "@/lib/combo-groups";
import { getComboDisplayName } from "@/lib/combo-display-name";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import { getCachedComboCategories } from "@/lib/reference-data";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { referenceDataTags } from "@/lib/reference-data";

export const dynamic = "force-dynamic";

function formatVND(value: number) {
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(Math.round(Number(value ?? 0) / 1000) * 1000)} đ`;
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M12 5c5.5 0 9.8 4 11 7-.7 1.7-2.2 3.7-4.4 5.2C16.6 18.8 14.4 20 12 20s-4.6-1.2-6.6-2.8C3.2 15.7 1.7 13.7 1 12c1.2-3 5.5-7 11-7Zm0 2C8 7 4.9 9.6 3.5 12 4.9 14.4 8 17 12 17s7.1-2.6 8.5-5C19.1 9.6 16 7 12 7Zm0 1.8A3.2 3.2 0 1 1 12 15a3.2 3.2 0 0 1 0-6.2Zm0 2A1.2 1.2 0 1 0 12 13a1.2 1.2 0 0 0 0-2.4Z"
      />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25Zm2.92 1.33H5v-.92l8.6-8.6.92.92-8.6 8.6ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.48 1.48 3.75 3.75 1.48-1.48Z"
      />
    </svg>
  );
}

function IconSolar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M4 10h16v8H4v-8Zm2 2v4h3v-4H6Zm5 0v4h3v-4h-3Zm5 0v4h3v-4h-3ZM5 6h14v2H5V6Zm2 12h10v2H7v-2Z"
      />
    </svg>
  );
}

function IconInverter() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M7 4h10v16H7V4Zm2 2v12h6V6H9Zm1 2h4v2h-4V8Zm0 4h4v2h-4v-2Z"
      />
    </svg>
  );
}

function IconBattery() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M7 6h10V5h2v2h1v10h-1v2h-2v-1H7v1H5v-2H4V7h1V5h2v1Zm0 2v8h10V8H7Zm2 2h2v4H9v-4Zm3 0h2v4h-2v-4Zm3 0h2v4h-2v-4Z"
      />
    </svg>
  );
}

function statusChip(status?: string) {
  switch (status) {
    case "active":
    case "public":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-700";
    case "inactive":
    case "archive":
    case "draft":
      return "border-slate-400/30 bg-slate-400/10 text-slate-700";
    default:
      return "border-amber-400/30 bg-amber-400/10 text-amber-700";
  }
}

type ComboRow = {
  id: string;
  code: string;
  name: string;
  slug: string;
  phase: number;
  solar_kw: string | number;
  battery_kwh: string | number | null;
  battery_type: string | null;
  cost_price: string | number;
  target_min_price: string | number;
  reference_price: string | number;
  margin: string | number;
  description: string;
  sort_order: number;
  is_active: boolean;
  status: string;
  combo_type?: string;
  source_kind?: string;
  combo_category_id?: string | null;
};

function isHiddenComboCategory(category?: { name?: string; slug?: string } | null) {
  if (!category) return false;
  const name = String(category.name ?? "").toLowerCase();
  const slug = String(category.slug ?? "").toLowerCase();
  return slug === "hybrid-inverter" || name.includes("hybrid inverter");
}

function getProfit(combo: ComboRow) {
  const cost = Number(combo.cost_price ?? 0);
  const target = Number(combo.target_min_price ?? 0);
  const reference = Number(combo.reference_price ?? 0);
  return {
    profitMin: target - cost,
    profitRef: reference - cost,
    profitMinPct: cost > 0 ? ((target - cost) / cost) * 100 : 0,
    profitRefPct: cost > 0 ? ((reference - cost) / cost) * 100 : 0,
  };
}

function getPanelLabel(combo: ComboRow) {
  const solarKw = Number(combo.solar_kw ?? 0);
  return solarKw > 0 ? `${solarKw.toFixed(solarKw % 1 === 0 ? 0 : 1)} kWp` : "-";
}

function getInverterLabel(combo: ComboRow) {
  const systemType = combo.code.startsWith("HY") || Number(combo.battery_kwh ?? 0) > 0 ? "Hybrid inverter" : "On-grid inverter";
  return systemType;
}

function getBatteryLabel(combo: ComboRow) {
  return Number(combo.battery_kwh ?? 0) > 0
    ? `${Number(combo.battery_kwh).toFixed(1)} kWh${combo.battery_type ? ` · ${combo.battery_type}` : ""}`
    : "-";
}

type ComboItemRow = {
  combo_id: string;
  product_id: string | null;
  item_name: string;
  brand: string;
  category: string;
  unit: string;
  sheet_group: string;
  sort_order: number;
};

type ComboProductRow = {
  id: string;
  brand: string;
  name: string;
};

function inferItemGroup(item: Pick<ComboItemRow, "sheet_group" | "category" | "item_name">) {
  const explicit = String(item.sheet_group ?? "").trim().toLowerCase();
  if (explicit) {
    if (explicit.includes("panel") || explicit.includes("pin") || explicit.includes("pv")) return "panel";
    if (explicit.includes("inverter") || explicit.includes("biến tần")) return "inverter";
    if (explicit.includes("battery") || explicit.includes("lithium") || explicit.includes("storage")) return "battery";
  }
  const text = `${item.category ?? ""} ${item.item_name ?? ""}`.toLowerCase();
  if (text.includes("pin lưu trữ") || text.includes("battery") || text.includes("lithium")) return "battery";
  if (text.includes("inverter") || text.includes("biến tần")) return "inverter";
  if (text.includes("tấm pin") || text.includes("panel") || text.includes("pv")) return "panel";
  return "other";
}

function extractPowerLabel(text: string, fallback?: string) {
  const source = String(text ?? "");
  const kwp = source.match(/(\d+(?:[.,]\d+)?)\s*kWp/i);
  if (kwp) return `${kwp[1].replace(",", ".")} kWp`;
  const kw = source.match(/(\d+(?:[.,]\d+)?)\s*kW\b/i);
  if (kw) return `${kw[1].replace(",", ".")} kW`;
  const kwh = source.match(/(\d+(?:[.,]\d+)?)\s*kWh/i);
  if (kwh) return `${kwh[1].replace(",", ".")} kWh`;
  return fallback ?? "-";
}

function iconRow(icon: JSX.Element, brand: string, value: string) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] p-1 text-[color:var(--muted)]">{icon}</span>
      <div className="min-w-0">
        <div className="truncate text-[11px] font-semibold text-[color:var(--text)]">{brand}</div>
        <div className="truncate text-[11px] font-medium text-[color:var(--text)]">{value}</div>
      </div>
    </div>
  );
}

function getSystemType(combo: Pick<ComboRow, "code" | "battery_kwh">) {
  return combo.code.startsWith("HY") || Number(combo.battery_kwh ?? 0) > 0 ? "hybrid" : "on-grid";
}

function comboTypeFilterLabel(value?: string) {
  switch (value) {
    case "custom":
      return "Combo tuỳ biến";
    case "standard":
      return "Combo chuẩn";
    default:
      return "Tất cả";
  }
}

function groupFilterLabel(value?: string) {
  return comboGroups.find((group) => group.id === value)?.label ?? "Tất cả nhóm";
}

function thumbnailUrl(row: { cover_image_url?: string; image_urls?: string[] }) {
  return row.cover_image_url || row.image_urls?.[0] || "";
}

function normalizeQuery(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function escapeLike(value: string) {
  return value.replace(/[%_]/g, "\\$&").replace(/,/g, " ");
}

async function deleteCombo(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("combos").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin/combos");
  revalidateTag(referenceDataTags.combos);
  redirect("/admin/combos");
}

async function bulkUpdateComboStatus(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const status = String(formData.get("bulk_status") ?? "inactive");
  const ids = formData.getAll("selected_ids").map(String).filter(Boolean);
  if (!ids.length) return;
  await supabase.from("combos").update({
    status,
    is_active: status === "active",
  }).in("id", ids);
  revalidatePath("/admin/combos");
  revalidateTag(referenceDataTags.combos);
  redirect("/admin/combos");
}

export default async function CombosPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const query = normalizeQuery(params.q).toLowerCase();
  const phaseFilter = normalizeQuery(params.phase);
  const typeFilter = normalizeQuery(params.type);
  const comboTypeFilter = normalizeQuery(params.combo_type);
  const groupFilter = normalizeQuery(params.group);
  const statusFilter = normalizeQuery(params.status);
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const searchPattern = escapeLike(query);

  const supabase = createSupabaseAdminClient();
  let combosQuery = supabase
    ? supabase
        .from("combos")
        .select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id", {
          count: "exact",
        })
        .order("sort_order", { ascending: true })
    : null;
  if (combosQuery) {
    if (phaseFilter) combosQuery = combosQuery.eq("phase", Number(phaseFilter));
    if (typeFilter === "hybrid") combosQuery = combosQuery.or("code.ilike.HY%,battery_kwh.gt.0");
    if (typeFilter === "on-grid") combosQuery = combosQuery.not("code", "ilike", "HY%").or("battery_kwh.lte.0,battery_kwh.is.null");
    if (comboTypeFilter) combosQuery = combosQuery.eq("combo_type", comboTypeFilter);
    if (groupFilter) combosQuery = combosQuery.eq("combo_category_id", groupFilter);
    if (statusFilter) combosQuery = combosQuery.eq("status", statusFilter);
    if (query) combosQuery = combosQuery.or(`code.ilike.%${searchPattern}%,name.ilike.%${searchPattern}%,description.ilike.%${searchPattern}%`);
  }
  const rawCombosRes = combosQuery ? await combosQuery.range(start, end) : { data: [], count: 0 };
  const rawCombos = rawCombosRes.data ?? [];
  const comboItems = supabase
    ? ((await supabase.from("combo_items").select("combo_id, product_id, item_name, brand, category, unit, sheet_group, sort_order").order("sort_order", { ascending: true })).data ?? []).map((row: any) => ({
        combo_id: String(row.combo_id ?? ""),
        product_id: row.product_id ? String(row.product_id) : null,
        item_name: String(row.item_name ?? ""),
        brand: String(row.brand ?? ""),
        category: String(row.category ?? ""),
        unit: String(row.unit ?? ""),
        sheet_group: String(row.sheet_group ?? ""),
        sort_order: Number(row.sort_order ?? 0),
      }))
    : [];
  const comboCategories = supabase ? await getCachedComboCategories() : [];
  const visibleComboCategories = comboCategories as Array<{ id: string; name: string; slug?: string }>;
  const visibleComboCategoriesFiltered = visibleComboCategories.filter((category) => !isHiddenComboCategory(category));
  const comboCategoryNameById = new Map(visibleComboCategoriesFiltered.map((category) => [category.id, category.name]));
  const firstItemByComboId = new Map<string, ComboItemRow>();
  const firstItemByGroupAndComboId = new Map<string, ComboItemRow>();
  for (const item of comboItems) {
    if (!item.combo_id) continue;
    if (!firstItemByComboId.has(item.combo_id)) firstItemByComboId.set(item.combo_id, item);
    const groupId = inferItemGroup(item);
    if (groupId !== "other" && !firstItemByGroupAndComboId.has(`${item.combo_id}:${groupId}`)) {
      firstItemByGroupAndComboId.set(`${item.combo_id}:${groupId}`, item);
    }
  }
  const rows = rawCombos.map(normalizeCombo) as ComboRow[];
  const comboDisplayMeta = rows.map((combo) => {
    const categoryLabel = combo.combo_category_id ? comboCategoryNameById.get(combo.combo_category_id) ?? "" : "";
    const derivedLabel = getComboCategoryLabel({
      code: combo.code,
      phase: combo.phase,
      battery_kwh: combo.battery_kwh == null ? null : Number(combo.battery_kwh),
      battery_type: combo.battery_type,
    });
    const panelItem = firstItemByGroupAndComboId.get(`${combo.id}:panel`) ?? firstItemByComboId.get(combo.id);
    const inverterItem = firstItemByGroupAndComboId.get(`${combo.id}:inverter`) ?? panelItem;
    const batteryItem = firstItemByGroupAndComboId.get(`${combo.id}:battery`) ?? firstItemByComboId.get(combo.id);
    return {
      ...combo,
      displayName: getComboDisplayName({
        code: combo.code,
        phase: combo.phase,
        solar_kw: combo.solar_kw,
        battery_kwh: combo.battery_kwh,
        battery_type: combo.battery_type,
      }),
      categoryLabel: categoryLabel || derivedLabel,
      panelBrand: panelItem?.brand || "-",
      panelPower: extractPowerLabel(panelItem?.item_name || "", combo.solar_kw ? `${Number(combo.solar_kw).toFixed(1)} kWp` : "-"),
      inverterBrand: inverterItem?.brand || "-",
      inverterPower: extractPowerLabel(inverterItem?.item_name || "", "-"),
      batteryBrand: batteryItem?.brand || "-",
      batteryCapacity: extractPowerLabel(batteryItem?.item_name || "", combo.battery_kwh ? `${Number(combo.battery_kwh).toFixed(1)} kWh` : "-"),
    };
  });
  const avgMargin = rows.length ? rows.reduce((sum, combo) => sum + Number(combo.margin ?? 0), 0) / rows.length : 0;

  const groupCounts = comboGroups.map((group) => ({
    ...group,
    count: rows.filter((combo) =>
      getComboGroupId({
        code: combo.code,
        phase: combo.phase,
        battery_kwh: combo.battery_kwh == null ? null : Number(combo.battery_kwh),
        battery_type: combo.battery_type,
      }) === group.id,
    ).length,
  }));
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <CrudFilterBar
          subtitle="Admin / Combos"
          title={`Quản lý combo (${rawCombosRes.count ?? rows.length})`}
          searchLabel="Tìm theo mã, tên, mô tả"
          searchValue={query}
          searchSuggestions={rows.slice(0, 8).map((combo) => ({
            label: combo.name,
            href: `/admin/combos/${combo.id}`,
            meta: [combo.code, combo.combo_type === "custom" ? "Tuỳ biến" : "Chuẩn"].filter(Boolean).join(" · "),
          }))}
          secondaryLinks={[
            { href: "/", label: "Dashboard" },
            { href: "/admin/products", label: "Sản phẩm" },
          ]}
          filters={[
            {
              name: "group",
              label: "Nhóm combo",
              value: groupFilter,
              options: comboGroups.map((group) => ({ label: group.label, value: group.id })),
            },
            {
              name: "phase",
              label: "Pha",
              value: phaseFilter,
              options: [
                { label: "1 pha", value: "1" },
                { label: "3 pha", value: "3" },
              ],
            },
            {
              name: "type",
              label: "Loại",
              value: typeFilter,
              options: [
                { label: "On-Grid", value: "on-grid" },
                { label: "Hybrid", value: "hybrid" },
              ],
            },
            {
              name: "combo_type",
              label: "Tag combo",
              value: comboTypeFilter,
              options: [
                { label: "Combo chuẩn", value: "standard" },
                { label: "Combo tuỳ biến", value: "custom" },
              ],
            },
            {
              name: "status",
              label: "Trạng thái",
              value: statusFilter,
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
          ]}
        />
        <div className="mt-4 flex justify-end">
          <Link href="/admin/combos/new" className="w-full rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-center text-sm font-medium text-white sm:w-auto">
            Thêm combo
          </Link>
        </div>

        <section className="mt-6">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-2.5 md:p-6">
            <SectionTitle eyebrow="Danh sách" title="Bảng combo" description="Đậm đặc thông tin như dashboard Magento, ưu tiên giá vốn, giá bán và lợi nhuận." />
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
              <span className="uppercase tracking-[0.24em]">Tóm tắt:</span>
            {groupCounts.map((group) => (
                <span key={group.id} className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-[color:var(--text)]">
                  {group.label} {group.count}
                </span>
              ))}
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-[color:var(--text)]">Biên gộp TB {avgMargin.toFixed(1)}%</span>
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-[color:var(--text)]">Danh mục {groupFilterLabel(groupFilter || undefined)}</span>
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-[color:var(--text)]">Loại {comboTypeFilterLabel(comboTypeFilter || undefined)}</span>
            </div>

            <form action={bulkUpdateComboStatus} className="mt-4 flex flex-wrap items-end gap-2">
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">Bulk status</span>
                <select name="bulk_status" className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-[color:var(--text)] outline-none sm:w-auto">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <button type="submit" className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white">
                Cập nhật hàng loạt
              </button>
              <div className="text-sm text-[color:var(--muted)]">Chọn combo rồi đổi trạng thái.</div>
              <div className="md:hidden space-y-3">
                {comboDisplayMeta.map((combo) => {
                  const profit = getProfit(combo);
                  return (
                    <article key={combo.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3">
                      <div className="flex items-start gap-3">
                        {thumbnailUrl(combo as typeof combo & { cover_image_url?: string; image_urls?: string[] }) ? (
                          <img
                            src={thumbnailUrl(combo as typeof combo & { cover_image_url?: string; image_urls?: string[] })}
                            alt={combo.name}
                            className="h-14 w-14 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] text-[10px] text-[color:var(--muted)]">No img</div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-[color:var(--text)]">{combo.displayName}</div>
                          <div className="mt-1 text-[10px] text-[color:var(--muted)]">{combo.code}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                            <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[color:var(--text)]">{combo.categoryLabel}</span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-[color:var(--muted)]">
                            <div className="rounded-xl border border-[color:var(--border)]/60 bg-[color:var(--panel)] px-2 py-1.5">Tấm quang năng: {getPanelLabel(combo)}</div>
                            <div className="rounded-xl border border-[color:var(--border)]/60 bg-[color:var(--panel)] px-2 py-1.5">Inverter: {getInverterLabel(combo)}</div>
                            <div className="rounded-xl border border-[color:var(--border)]/60 bg-[color:var(--panel)] px-2 py-1.5">Pin lithium: {getBatteryLabel(combo)}</div>
                            <div className="rounded-xl border border-[color:var(--border)]/60 bg-[color:var(--panel)] px-2 py-1.5">Giá vốn: {formatVND(Number(combo.cost_price ?? 0))}</div>
                            <div className="rounded-xl border border-[color:var(--border)]/60 bg-[color:var(--panel)] px-2 py-1.5">Giá bán: {formatVND(Number(combo.reference_price ?? 0))}</div>
                            <div className="rounded-xl border border-[color:var(--border)]/60 bg-[color:var(--panel)] px-2 py-1.5">Lãi: {formatVND(profit.profitRef)}</div>
                          </div>
                          <div className="mt-2">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusChip(combo.status)}`}>
                              {combo.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Link href={`/admin/combos/${combo.id}/edit`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1.5 text-[11px] text-[color:var(--text)]">Sửa</Link>
                            <Link href={`/admin/combos/${combo.id}`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1.5 text-[11px] text-[color:var(--text)]">Xem</Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="hidden w-full overflow-x-auto rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] md:block">
                <table className="min-w-[1220px] divide-y divide-[color:var(--border)] text-left text-sm">
                  <thead className="bg-[color:var(--panel-strong)] text-[color:var(--muted)]">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-3">Chọn</th>
                      <th className="whitespace-nowrap px-4 py-3">Combo</th>
                      <th className="whitespace-nowrap px-4 py-3">Danh mục combo</th>
                      <th className="whitespace-nowrap px-4 py-3">Thiết bị chính</th>
                      <th className="whitespace-nowrap px-4 py-3">Giá</th>
                      <th className="whitespace-nowrap px-4 py-3">Trạng thái</th>
                      <th className="whitespace-nowrap px-4 py-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--border)]">
                    {comboDisplayMeta.map((combo) => {
                      const profit = getProfit(combo);
                      return (
                        <tr key={combo.id} className="bg-transparent align-top">
                          <td className="whitespace-nowrap px-4 py-4">
                            <input type="checkbox" name="selected_ids" value={combo.id} className="h-4 w-4" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex min-w-0 items-center gap-3">
                              {thumbnailUrl(combo as typeof combo & { cover_image_url?: string; image_urls?: string[] }) ? (
                                <img
                                  src={thumbnailUrl(combo as typeof combo & { cover_image_url?: string; image_urls?: string[] })}
                                  alt={combo.name}
                                  className="h-12 w-12 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] text-[10px] text-[color:var(--muted)]">No img</div>
                              )}
                              <div className="min-w-0">
                                <div className="truncate font-medium text-[color:var(--text)]">{combo.displayName}</div>
                                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[color:var(--muted)]">
                                  <span className="whitespace-nowrap">{combo.code}</span>
                                  <span className="mx-2">·</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[color:var(--text)]">
                            <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--text)]">
                              {combo.categoryLabel}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[color:var(--text)]">
                            <div className="space-y-2">
                              {iconRow(<IconSolar />, String(combo.panelBrand), String(combo.panelPower))}
                              {iconRow(<IconInverter />, String(combo.inverterBrand), String(combo.inverterPower))}
                              {iconRow(<IconBattery />, String(combo.batteryBrand), String(combo.batteryCapacity))}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[color:var(--text)]">
                            <div className="space-y-1 text-[11px] leading-5">
                              <div>
                                <span className="font-medium text-[color:var(--muted)]">GV:</span> {formatVND(Number(combo.cost_price ?? 0))}
                              </div>
                              <div>
                                <span className="font-medium text-[color:var(--muted)]">GB:</span> {formatVND(Number(combo.reference_price ?? 0))}
                              </div>
                              <div>
                                <span className="font-medium text-[color:var(--muted)]">LN:</span> {formatVND(profit.profitRef)} ({profit.profitRefPct.toFixed(1)}%)
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusChip(combo.status)}`}>
                              {combo.status === "active"
                                ? "Active"
                                : combo.status === "inactive"
                                  ? "Inactive"
                                  : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <Link
                                href={`/admin/combos/${combo.id}/edit`}
                                aria-label={`Sửa combo ${combo.name}`}
                                title="Sửa"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--muted)] transition hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)]"
                              >
                                <IconPencil />
                              </Link>
                              <Link
                                href={`/admin/combos/${combo.id}`}
                                aria-label={`Xem combo ${combo.name}`}
                                title="Xem"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--muted)] transition hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)]"
                              >
                                <IconEye />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </form>
            <div className="pt-3 text-sm text-[color:var(--muted)]">Trang {page} / {getPageCount(Number(rawCombosRes.count ?? 0), pageSize)}</div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
