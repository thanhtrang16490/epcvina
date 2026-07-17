import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { CrudFilterBar } from "@/components/CrudFilterBar";
import { SectionTitle } from "@/components/SectionTitle";
import { comboGroups, getComboGroupId, getComboGroupLabel } from "@/lib/combo-groups";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import { getCachedComboCategories } from "@/lib/reference-data";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { referenceDataTags } from "@/lib/reference-data";

export const dynamic = "force-dynamic";

function formatVND(value: number) {
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value)} đ`;
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
    ? "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-700"
    : "border-cyan-400/30 bg-cyan-400/10 text-cyan-700";
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
  revalidatePath("/combos");
  revalidateTag(referenceDataTags.combos);
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
  revalidateTag(referenceDataTags.combos);
  redirect("/combos");
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
  const comboCategories = supabase ? await getCachedComboCategories() : [];
  const visibleComboCategories = comboCategories.filter((category: { name?: string; slug?: string }) => !isHiddenComboCategory(category));
  const comboCategoryNameById = new Map(visibleComboCategories.map((category: { id: string; name: string }) => [category.id, category.name]));
  const rows = rawCombos.map(normalizeCombo) as ComboRow[];
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
            href: `/combos/${combo.id}`,
            meta: [combo.code, combo.combo_type === "custom" ? "Tuỳ biến" : "Chuẩn"].filter(Boolean).join(" · "),
          }))}
          secondaryLinks={[
            { href: "/", label: "Dashboard" },
            { href: "/products", label: "Sản phẩm" },
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
          <Link href="/combos/new" className="w-full rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-center text-sm font-medium text-white sm:w-auto">
            Thêm combo
          </Link>
        </div>

        <section className="mt-6">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-3 md:p-6">
            <SectionTitle eyebrow="Danh sách" title="Bảng combo" description="Đậm đặc thông tin như dashboard Magento, ưu tiên giá vốn, giá bán và lợi nhuận." />
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
              <span className="uppercase tracking-[0.24em]">Tóm tắt:</span>
            {groupCounts.map((group) => (
                <span key={group.id} className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-[color:var(--text)]">
                  {group.label} {group.count}
                </span>
              ))}
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-[color:var(--text)]">Biên gộp TB {avgMargin.toFixed(1)}%</span>
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-[color:var(--text)]">Nhóm {groupFilterLabel(groupFilter || undefined)}</span>
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
                {rows.map((combo) => {
                  const profit = getProfit(combo);
                  const comboGroup = getComboGroupLabel({
                    code: combo.code,
                    phase: combo.phase,
                    battery_kwh: combo.battery_kwh == null ? null : Number(combo.battery_kwh),
                    battery_type: combo.battery_type,
                  });
                  const batteryLabel = Number(combo.battery_kwh ?? 0) > 0
                    ? `${Number(combo.battery_kwh).toFixed(1)} kWh${combo.battery_type ? ` · ${combo.battery_type}` : ""}`
                    : "-";
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
                          <div className="truncate text-sm font-medium text-[color:var(--text)]">{combo.name}</div>
                          <div className="mt-1 text-[10px] text-[color:var(--muted)]">{combo.code} · {getBrandLine(combo)}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                            <span className={`rounded-full border px-2 py-0.5 font-medium ${comboTypeChip(combo)}`}>{comboTypeLabel(combo)}</span>
                            <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[color:var(--text)]">{comboGroup}</span>
                            <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[color:var(--text)]">{combo.phase === 1 ? "1 pha" : "3 pha"}</span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-[color:var(--muted)]">
                            <div className="rounded-xl border border-[color:var(--border)]/60 bg-[color:var(--panel)] px-2 py-1.5">Dung lượng: {batteryLabel}</div>
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
                            <Link href={`/combos/${combo.id}/edit`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1.5 text-[11px] text-[color:var(--text)]">Sửa</Link>
                            <Link href={`/combos/${combo.id}`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1.5 text-[11px] text-[color:var(--text)]">Xem</Link>
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
                      <th className="whitespace-nowrap px-4 py-3">Loại</th>
                      <th className="whitespace-nowrap px-4 py-3">Danh mục</th>
                      <th className="whitespace-nowrap px-4 py-3">Pha</th>
                      <th className="whitespace-nowrap px-4 py-3">Dung lượng</th>
                      <th className="whitespace-nowrap px-4 py-3">Giá vốn</th>
                      <th className="whitespace-nowrap px-4 py-3">Giá bán</th>
                      <th className="whitespace-nowrap px-4 py-3">Lợi nhuận</th>
                      <th className="whitespace-nowrap px-4 py-3">Trạng thái</th>
                      <th className="whitespace-nowrap px-4 py-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--border)]">
                    {rows.map((combo) => {
                      const profit = getProfit(combo);
                      const comboGroup = getComboGroupLabel({
                        code: combo.code,
                        phase: combo.phase,
                        battery_kwh: combo.battery_kwh == null ? null : Number(combo.battery_kwh),
                        battery_type: combo.battery_type,
                      });
                      const batteryLabel = Number(combo.battery_kwh ?? 0) > 0
                        ? `${Number(combo.battery_kwh).toFixed(1)} kWh${combo.battery_type ? ` · ${combo.battery_type}` : ""}`
                        : "-";
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
                                <div className="truncate font-medium text-[color:var(--text)]">{combo.name}</div>
                                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[color:var(--muted)]">
                                  <span className="whitespace-nowrap">{combo.code}</span>
                                  <span className="mx-2">·</span>
                                  <span className="min-w-0 break-words">{getBrandLine(combo)}</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${comboTypeChip(combo)}`}>{comboTypeLabel(combo)}</span>
                                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--text)]">{combo.slug}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text)]">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${comboTypeChip(combo)}`}>{comboTypeLabel(combo)}</span>
                          </td>
                          <td className="px-4 py-4 text-[color:var(--text)]">
                            <div className="flex flex-col gap-1">
                              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--text)]">
                                {comboGroup}
                              </span>
                              {combo.combo_category_id ? (
                                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--muted)]">
                                  {comboCategoryNameById.get(combo.combo_category_id) ?? "Chưa gán"}
                                  </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text)]">{combo.phase === 1 ? "1 pha" : "3 pha"}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text)]">{batteryLabel}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text)]">{formatVND(Number(combo.cost_price ?? 0))}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text)]">{formatVND(Number(combo.reference_price ?? 0))}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text)]">{formatVND(profit.profitRef)} ({profit.profitRefPct.toFixed(1)}%)</td>
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
                              <Link href={`/combos/${combo.id}/edit`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Sửa</Link>
                              <Link href={`/combos/${combo.id}`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Xem</Link>
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
