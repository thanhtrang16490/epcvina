import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { CrudFilterBar } from "@/components/CrudFilterBar";
import { SectionTitle } from "@/components/SectionTitle";
import { comboGroups, getComboCategoryLabel, getComboGroupLabel } from "@/lib/combo-groups";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function formatVND(value: number) {
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value)} đ`;
}

function statusChip(status?: string) {
  switch (status) {
    case "active":
    case "public":
      return "border-emerald-400/30 bg-emerald-400/15 text-emerald-200";
    case "inactive":
    case "archive":
    case "draft":
      return "border-slate-400/30 bg-slate-400/15 text-slate-200";
    default:
      return "border-amber-400/30 bg-amber-400/15 text-amber-200";
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

function getBrandLine(combo: ComboRow) {
  const panelBrand = "Aiko";
  const inverterBrand = combo.code.startsWith("HY") ? "SAJ" : "Auxsol";
  const batteryBrand = combo.code.startsWith("HY") || Number(combo.battery_kwh ?? 0) > 0 ? "Genxgreen" : null;
  return [panelBrand, inverterBrand, batteryBrand].filter(Boolean).join(" - ");
}

function comboTypeLabel(combo: ComboRow) {
  return combo.combo_type === "custom" ? "Combo tuỳ biến" : "Combo chuẩn";
}

function comboTypeChip(combo: ComboRow) {
  return combo.combo_type === "custom"
    ? "border-fuchsia-400/30 bg-fuchsia-400/15 text-fuchsia-200"
    : "border-cyan-400/30 bg-cyan-400/15 text-cyan-100";
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

function thumbnailUrl(row: { cover_image_url?: string; image_urls?: string[] }) {
  return row.cover_image_url || row.image_urls?.[0] || "";
}

function normalizeQuery(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

async function deleteCombo(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("combos").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/combos");
  redirect("/combos");
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
  revalidatePath("/combos");
  redirect("/combos");
}

export default async function CombosPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const query = normalizeQuery(params.q).toLowerCase();
  const phaseFilter = normalizeQuery(params.phase);
  const typeFilter = normalizeQuery(params.type);
  const comboTypeFilter = normalizeQuery(params.combo_type);

  const supabase = createSupabaseAdminClient();
  const source = supabase ? "Supabase" : "Supabase only";
  const rawCombos = supabase ? ((await supabase.from("combos").select("*").order("sort_order", { ascending: true })).data ?? []) : [];
  const comboCategories = supabase ? ((await supabase.from("combo_categories").select("*").order("sort_order", { ascending: true })).data ?? []) : [];
  const comboCategoryNameById = new Map(comboCategories.map((category: { id: string; name: string }) => [category.id, category.name]));
  const statusFilter = normalizeQuery(params.status);
  const rows = rawCombos.map(normalizeCombo).filter((combo) => {
    const matchesQuery = !query || [combo.code, combo.name, combo.description].join(" ").toLowerCase().includes(query);
    const matchesPhase = !phaseFilter || String(combo.phase) === phaseFilter;
    const matchesType =
      !typeFilter ||
      (typeFilter === "battery" ? Number(combo.battery_kwh ?? 0) > 0 : typeFilter === "solar" ? Number(combo.battery_kwh ?? 0) === 0 : true);
    const matchesComboType = !comboTypeFilter || String(combo.combo_type ?? "standard") === comboTypeFilter;
    const matchesStatus = !statusFilter || String((combo as ComboRow).status ?? "") === statusFilter;
    return matchesQuery && matchesPhase && matchesType && matchesComboType && matchesStatus;
  }) as ComboRow[];
  const avgMargin = rows.length ? rows.reduce((sum, combo) => sum + Number(combo.margin ?? 0), 0) / rows.length : 0;

  const onGrid = rows.filter((combo) => combo.code.startsWith("OG"));
  const hybrid = rows.filter((combo) => combo.code.startsWith("HY"));
  const grouped = comboGroups.map((group) => ({
    ...group,
    items: rows.filter((combo) =>
      getComboGroupLabel({
        code: combo.code,
        phase: combo.phase,
        battery_kwh: combo.battery_kwh == null ? null : Number(combo.battery_kwh),
        battery_type: combo.battery_type,
      }) === group.label,
    ),
  }));

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <CrudFilterBar
          subtitle="Admin / Combos"
          title={`Quản lý combo (${rows.length})`}
          searchLabel="Tìm theo mã, tên, mô tả"
          searchValue={query}
          secondaryLinks={[
            { href: "/", label: "Dashboard" },
            { href: "/products", label: "Sản phẩm" },
          ]}
          filters={[
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
                { label: "Solar", value: "solar" },
                { label: "Hybrid", value: "battery" },
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
          <Link href="/combos/new" className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">
            Thêm combo
          </Link>
        </div>

        <section className="mt-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <SectionTitle eyebrow="Danh sách" title="Bảng combo" description="Đậm đặc thông tin như dashboard Magento, ưu tiên giá vốn, giá bán và lợi nhuận." />
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="text-sm text-slate-400">On-grid</div>
                <div className="mt-2 text-3xl font-semibold text-white">{onGrid.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="text-sm text-slate-400">Hybrid</div>
                <div className="mt-2 text-3xl font-semibold text-white">{hybrid.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <div className="text-sm text-slate-400">Biên gộp TB</div>
                <div className="mt-2 text-3xl font-semibold text-white">{avgMargin.toFixed(1)}%</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="uppercase tracking-[0.24em]">Tag đang xem:</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">{comboTypeFilterLabel(comboTypeFilter || undefined)}</span>
            </div>

            <form action={bulkUpdateComboStatus} className="mt-4 space-y-3">
              <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400">Bulk status</span>
                  <select name="bulk_status" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
                <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">
                  Cập nhật hàng loạt
                </button>
                <div className="text-sm text-slate-400">Chọn các combo cần đổi trạng thái rồi bấm cập nhật.</div>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-slate-950/80 text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Chọn</th>
                      <th className="px-4 py-3">Combo</th>
                      <th className="px-4 py-3">Loại</th>
                      <th className="px-4 py-3">Danh mục</th>
                      <th className="px-4 py-3">Pha</th>
                      <th className="px-4 py-3">Dung lượng</th>
                      <th className="px-4 py-3">Giá vốn</th>
                      <th className="px-4 py-3">Giá bán</th>
                      <th className="px-4 py-3">Lợi nhuận</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {rows.map((combo) => {
                      const profit = getProfit(combo);
                      const batteryLabel = Number(combo.battery_kwh ?? 0) > 0
                        ? `${Number(combo.battery_kwh).toFixed(1)} kWh${combo.battery_type ? ` · ${combo.battery_type}` : ""}`
                        : "-";
                      return (
                        <tr key={combo.id} className="bg-slate-950/40">
                          <td className="px-4 py-3">
                            <input type="checkbox" name="selected_ids" value={combo.id} className="h-4 w-4" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {thumbnailUrl(combo as typeof combo & { cover_image_url?: string; image_urls?: string[] }) ? (
                                <img
                                  src={thumbnailUrl(combo as typeof combo & { cover_image_url?: string; image_urls?: string[] })}
                                  alt={combo.name}
                                  className="h-12 w-12 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[10px] text-slate-400">No img</div>
                              )}
                              <div>
                                <div className="font-medium text-white">{combo.name}</div>
                                <div className="mt-1 text-xs text-slate-400">
                                  <span>{combo.code}</span>
                                  <span className="mx-2">·</span>
                                  <span>{getBrandLine(combo)}</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${comboTypeChip(combo)}`}>{comboTypeLabel(combo)}</span>
                                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-200">
                                    {combo.slug}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-200">
                                {combo.slug}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-200">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${comboTypeChip(combo)}`}>{comboTypeLabel(combo)}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-200">
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-200">
                              {combo.combo_category_id ? comboCategoryNameById.get(combo.combo_category_id) ?? "Chưa gán" : getComboCategoryLabel({
                                code: combo.code,
                                phase: combo.phase,
                                battery_kwh: combo.battery_kwh == null ? null : Number(combo.battery_kwh),
                                battery_type: combo.battery_type,
                              })}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-200">{combo.phase === 1 ? "1 pha" : "3 pha"}</td>
                          <td className="px-4 py-3 text-slate-200">{batteryLabel}</td>
                          <td className="px-4 py-3 text-slate-200">{formatVND(Number(combo.cost_price ?? 0))}</td>
                          <td className="px-4 py-3 text-slate-200">{formatVND(Number(combo.reference_price ?? 0))}</td>
                          <td className="px-4 py-3 text-slate-200">{formatVND(profit.profitRef)} ({profit.profitRefPct.toFixed(1)}%)</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusChip(combo.status)}`}>
                              {combo.status === "active"
                                ? "Active"
                                : combo.status === "inactive"
                                  ? "Inactive"
                                  : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <Link href={`/combos/${combo.id}/edit`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Sửa</Link>
                              <Link href={`/combos/${combo.id}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Xem</Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </form>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
