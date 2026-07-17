import { AdminShell } from "@/components/AdminShell";
import { ComboBomAccordion } from "@/components/ComboBomAccordion";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { getComboAreaM2 } from "@/lib/combo-area";
import { buildComboFinance, round2 } from "@/lib/combo-finance";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeCombo, normalizeComboItem } from "@/lib/supabase/normalize";
import { comboItemGroups } from "@/lib/combo-builder";
import { getCachedComboCategories } from "@/lib/reference-data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

type ComboViewData = ReturnType<typeof normalizeCombo>;
type ComboItemRow = ReturnType<typeof normalizeComboItem> & {
  product?: {
    name?: string;
    brand?: string;
    cover_image_url?: string;
    image_urls?: string[];
    technical_specs?: unknown;
  } | null;
  source_sheet?: string | null;
};

const currency = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

function formatVND(value: number) {
  return `${currency.format(value)} đ`;
}

function getSystemType(combo: ComboViewData) {
  return combo.code.startsWith("HY") || combo.battery_kwh ? "Hybrid" : "On-Grid";
}

function getVoltageLabel(combo: ComboViewData) {
  const type = String(combo.battery_type ?? "").toUpperCase();
  if (type === "HV") return "Áp cao";
  if (type === "LV") return "Áp thấp";
  return null;
}

function getBrandLine(combo: ComboViewData) {
  const panelBrand = "Aiko";
  const inverterBrand = combo.code.startsWith("HY") ? "SAJ" : "Auxsol";
  const batteryBrand = combo.battery_kwh ? "Genxgreen" : null;
  return [panelBrand, inverterBrand, batteryBrand].filter(Boolean).join(" - ");
}

function getComboTypeLabel(combo: ComboViewData) {
  return combo.combo_type === "custom" ? "Combo tuỳ biến" : "Combo chuẩn";
}

function getItemImage(item: ComboItemRow) {
  return item.product?.cover_image_url || item.product?.image_urls?.[0] || "";
}

function getItemTitle(item: ComboItemRow) {
  return item.item_name || item.product?.name || item.category || "Vật tư";
}

function getGroupLabel(item: ComboItemRow) {
  const text = `${item.category ?? ""} ${item.item_name ?? ""}`.toLowerCase();
  if (
    text.includes("nhan cong") ||
    text.includes("nhân công") ||
    text.includes("thi cong") ||
    text.includes("thi công") ||
    text.includes("lao dong") ||
    text.includes("lao động")
  ) {
    return "Chi phí nhân công";
  }
  if (text.includes("pin lưu trữ") || text.includes("battery") || text.includes("lithium")) return "Pin lưu trữ";
  if (text.includes("tấm pin") || text.includes("panel") || text.includes("pv")) return "Tấm pin mặt trời";
  if (text.includes("inverter") || text.includes("biến tần")) return "Inverter";
  if (text.includes("khung") || text.includes("rail") || text.includes("mount")) return "Hệ khung nhôm";
  if (text.includes("dây") || text.includes("cáp") || text.includes("wire") || text.includes("mc4")) return "Hệ dây điện";
  if (text.includes("tủ điện") || text.includes("cabinet") || text.includes("meter")) return "Tủ điện";
  if (text.includes("tiếp địa") || text.includes("ground")) return "Hệ tiếp địa";
  return item.category || "Khác";
}

export default async function ComboShowPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const data = supabase
    ? (normalizeCombo(
        (await supabase
          .from("combos")
          .select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id, cover_image_url, image_urls")
          .eq("id", id)
          .single()).data ?? {},
      ) as ComboViewData)
    : null;
  if (!data) notFound();
  const combo = data as ComboViewData;
  const comboCategories = supabase ? await getCachedComboCategories() : [];
  const comboCategoryName = combo.combo_category_id ? comboCategories.find((item: any) => String(item.id) === String(combo.combo_category_id))?.name ?? null : null;
  const finance = buildComboFinance({
    solarKw: Number(combo.solar_kw ?? 0),
    costPrice: Number(combo.cost_price ?? 0) * 1_000_000,
    referencePrice: Number(combo.reference_price ?? 0) * 1_000_000,
  });
  const systemType = getSystemType(combo);
  const voltageLabel = getVoltageLabel(combo);
  const monthlyProduction = Math.round(finance.monthlyProductionKwh);
  const paybackYears = finance.paybackYears;
  const comboItems = supabase
    ? ((await supabase
      .from("combo_items")
        .select("id, combo_id, product_id, reference_product_id, category, item_name, brand, quantity, unit_price_vat, total_price_vat, cost_price, total_cost_price, sort_order, notes, sheet_group, gross_margin, warranty")
        .eq("combo_id", id)
        .order("sort_order", { ascending: true })).data ?? []).map((row: any) => normalizeComboItem(row) as ComboItemRow)
    : [];
  const areaM2 = getComboAreaM2(comboItems);
  const groupedItems = comboItems.reduce<Record<string, ComboItemRow[]>>((acc, item) => {
    const key = getGroupLabel(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const groupedSummary = Object.entries(groupedItems).map(([label, items]) => ({
    label,
    count: items.length,
    total: items.reduce((sum, item) => sum + Number(item.total_price_vat ?? item.unit_price_vat * item.quantity), 0),
  }));
  const laborSummary = groupedSummary.find((group) => group.label === "Chi phí nhân công");

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-4 md:p-5">
          <SectionTitle eyebrow="Combo detail" title={combo.name} description={combo.description} />
          <div className="flex flex-wrap gap-2">
            <ThemeLinkButton href={`/admin/combos/${combo.id}/edit`} tone="secondary">
              Sửa combo
            </ThemeLinkButton>
            <ThemeLinkButton href={`/admin/combos/${combo.id}/excel`} tone="secondary">
              Xem sheet
            </ThemeLinkButton>
            <ThemeLinkButton href="/admin/combos" tone="secondary">
              Back
            </ThemeLinkButton>
          </div>
        </div>

        <ThemeCard tone="hero" className="overflow-hidden p-6 md:p-10">
          {(combo as typeof combo & { cover_image_url?: string }).cover_image_url ? (
            <img
              src={(combo as typeof combo & { cover_image_url?: string }).cover_image_url}
              alt={combo.name}
              className="mb-5 h-60 w-full rounded-3xl object-cover"
            />
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-100">{combo.code}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{combo.slug}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{systemType}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{combo.phase === 1 ? "1 pha" : "3 pha"}</span>
            {comboCategoryName ? <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{comboCategoryName}</span> : null}
            <span className={combo.combo_type === "custom" ? "rounded-full bg-fuchsia-400/15 px-3 py-1 text-xs font-semibold text-fuchsia-100" : "rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-100"}>
              {getComboTypeLabel(combo)}
            </span>
            {voltageLabel && <span className="rounded-full bg-blue-400/15 px-3 py-1 text-xs font-semibold text-blue-100">{voltageLabel}</span>}
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">{combo.name}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{combo.description}</p>
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.24em] text-cyan-100">{getBrandLine(combo)}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Code</div>
                  <div className="mt-2 text-sm font-semibold text-white">{combo.code}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Slug</div>
                  <div className="mt-2 text-sm font-semibold text-white break-all">{combo.slug}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Nguồn</div>
                  <div className="mt-2 text-sm font-semibold text-white">{combo.source_kind || "-"}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá vốn</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{formatVND(Number(combo.cost_price))}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá bán</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{formatVND(Number(combo.reference_price))}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Hoàn vốn</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{paybackYears.toFixed(1)} năm</div>
                  <div className="mt-1 text-xs text-slate-400">Theo PSH 4h, PR 0.80, tự dùng 80%</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Biên</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{round2(finance.grossMargin).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <aside className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-slate-400">Thông tin nhanh</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-slate-400">PV</span>
                  <span className="text-white">{combo.solar_kw} kWp</span>
                </div>
                {combo.battery_kwh ? (
                  <div className="flex justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span className="text-slate-400">Pin</span>
                    <span className="text-white">
                      {combo.battery_kwh} kWh {combo.battery_type ?? ""}
                    </span>
                  </div>
                ) : null}
                <div className="flex justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-slate-400">Sản lượng</span>
                  <span className="text-white">{monthlyProduction} kWh/tháng</span>
                </div>
                <div className="flex justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-slate-400">Diện tích</span>
                  <span className="text-white">{areaM2 ? `${areaM2.toFixed(1)} m²` : "thiếu thông số kỹ thuật"}</span>
                </div>
              </div>
            </aside>
          </div>
        </ThemeCard>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ThemeCard className="p-6">
          <SectionTitle eyebrow="Tư vấn" title="CTA nhanh" description="Khối liên hệ theo style landing page để người xem biết bước tiếp theo." />
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl bg-slate-950/50 px-4 py-3">
                Phù hợp: <span className="text-white">{systemType} · {combo.phase === 1 ? "1 pha" : "3 pha"}</span>
              </div>
              <div className="rounded-2xl bg-slate-950/50 px-4 py-3">
                Điện áp: <span className="text-white">{voltageLabel ?? "Không áp pin"}</span>
              </div>
              <div className="rounded-2xl bg-slate-950/50 px-4 py-3">
                Dùng cho: <span className="text-white">{combo.phase === 3 ? "mái xưởng / thương mại" : "mái dân dụng"}</span>
              </div>
            </div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Mô tả" title="Chi tiết combo" description="Giữ thêm JSON debug bên dưới để đối chiếu dữ liệu." />
            <div className="mt-4 rounded-2xl bg-slate-950/50 p-4 text-sm text-slate-300">
              <p className="leading-7">
                Hệ {systemType.toLowerCase()} {combo.phase === 1 ? "1 pha" : "3 pha"} với công suất {combo.solar_kw} kWp.
                {combo.battery_kwh ? ` Kèm lưu trữ ${combo.battery_kwh} kWh.` : " Không bao gồm pin lưu trữ."}
              </p>
            </div>
          </ThemeCard>
        </section>

        <ThemeCard className="mt-6 p-6 text-sm text-[color:var(--muted)]">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">Workbook title</div>
              <div className="mt-2 font-medium text-[color:var(--text)]">{combo.name}</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">Workbook code</div>
              <div className="mt-2 font-medium text-[color:var(--text)]">{combo.code}</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">Workbook slug</div>
              <div className="mt-2 font-medium text-[color:var(--text)] break-all">{combo.slug}</div>
            </div>
          </div>
          {((combo as typeof combo & { image_urls?: string[] }).image_urls ?? []).length > 0 && (
            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(combo as typeof combo & { image_urls?: string[] }).image_urls!.slice(0, 6).map((url) => (
                <img key={url} src={url} alt={combo.name} className="h-36 w-full rounded-2xl object-cover" />
              ))}
            </div>
          )}
          <pre className="whitespace-pre-wrap break-words">{JSON.stringify(combo, null, 2)}</pre>
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <SectionTitle
            eyebrow="BOM"
            title="Bản kê chi tiết vật tư"
            description="Bản kê chi tiết vật tư dựa theo excel BOM đã làm trước đó."
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {groupedSummary.map((group) => (
              <div key={group.label} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
                <div className="text-sm font-semibold text-[color:var(--text)]">{group.label}</div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">{group.count} vật tư</div>
                <div className="mt-2 text-base font-semibold text-[color:var(--text)]">{formatVND(group.total)}</div>
              </div>
            ))}
          </div>
          {laborSummary ? (
            <div className="mt-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-orange-200">Theo Excel BOM</div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-white/90">Khoản nhân công lắp đặt đã được tách riêng khỏi BOM vật tư.</div>
                <div className="text-xl font-semibold text-white">{formatVND(laborSummary.total)}</div>
              </div>
            </div>
          ) : null}
          {Object.keys(groupedItems).length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-6 text-sm text-[color:var(--muted)]">
              Chưa có combo item.
            </div>
          ) : (
            <ComboBomAccordion
              groups={Object.entries(groupedItems).map(([label, items]) => [
                label,
                items
                  .map((item) => ({
                    ...item,
                    product: item.product ?? null,
                  }))
                  .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)),
              ])}
            />
          )}
        </ThemeCard>
      </main>
    </AdminShell>
  );
}
