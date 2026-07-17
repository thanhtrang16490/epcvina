import { PublicShell } from "@/components/PublicShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { getComboAreaM2 } from "@/lib/combo-area";
import { getDisplayedComboPrice } from "@/lib/combo-price";
import { buildComboFinance, round2 } from "@/lib/combo-finance";
import { formatMoneyVnd } from "@/lib/money-format";
import { getPricingSettings } from "@/lib/pricing-settings";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeCombo, normalizeComboItem } from "@/lib/supabase/normalize";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

type ComboData = ReturnType<typeof normalizeCombo>;

type ComboItemRow = ReturnType<typeof normalizeComboItem> & {
  product?: {
    name?: string;
    brand?: string;
    category?: string;
    cover_image_url?: string;
    image_urls?: string[];
    technical_specs?: unknown;
  } | null;
};

type PublicProductRow = {
  id: string;
  name?: string;
  brand?: string;
  category?: string;
  cover_image_url?: string;
  image_urls?: string[];
  technical_specs?: unknown;
};

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
    return "Nhân công lắp đặt";
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

function isPrimaryGroup(label: string) {
  return label === "Tấm pin mặt trời" || label === "Inverter" || label === "Pin lưu trữ";
}

function getReferenceLabel(item: ComboItemRow) {
  const productName = item.product?.name?.trim();
  const productBrand = item.product?.brand?.trim();
  if (productBrand && productName) return `${productBrand} · ${productName}`;
  return productName || productBrand || "Không gắn sản phẩm tham chiếu";
}

function getCustomPrice(item: ComboItemRow) {
  return Number(item.total_price_vat || item.unit_price_vat * item.quantity || 0);
}

function getReferencePrice(item: ComboItemRow) {
  return Number(item.total_cost_price || item.cost_price * item.quantity || 0);
}

function getItemTitle(item: ComboItemRow) {
  return item.product?.name?.trim() || item.item_name || "Vật tư";
}

function getDisplayedMaterialPrice(item: ComboItemRow) {
  const customPrice = getCustomPrice(item);
  const referencePrice = getReferencePrice(item);
  return customPrice > 0 ? { label: "Giá tuỳ biến", value: customPrice } : { label: "Giá tham chiếu", value: referencePrice };
}

function getImage(item: ComboItemRow) {
  return item.product?.cover_image_url || item.product?.image_urls?.[0] || "";
}

function getSystemLabel(combo: ComboData) {
  const hybrid = combo.code.toUpperCase().includes("HY") || Number(combo.battery_kwh ?? 0) > 0;
  return hybrid ? "Hệ hybrid" : "Hệ on-grid";
}

function getVoltageLabel(combo: ComboData) {
  const type = String(combo.battery_type ?? "").toUpperCase();
  if (type === "HV") return "Áp cao";
  if (type === "LV") return "Áp thấp";
  return null;
}

function getComboTypeLabel(combo: ComboData) {
  return combo.combo_type === "custom" ? "Combo tuỳ biến" : "Combo chuẩn";
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
      <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function FeatureRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1rem] bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export default async function PublicComboDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const publicClient = createSupabaseAdminClient() ?? supabase;
  const pricingSettings = await getPricingSettings(supabase);
  const data = publicClient
    ? (normalizeCombo(
        (await publicClient
          .from("combos")
          .select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id, cover_image_url, image_urls")
          .eq("id", id)
          .or("status.eq.active,is_active.eq.true")
          .single()).data ?? {},
      ) as ComboData)
    : null;
  if (!data) notFound();

  const combo = data as ComboData;
  const finance = buildComboFinance({
    solarKw: Number(combo.solar_kw ?? 0),
    costPrice: Number(combo.cost_price ?? 0),
    referencePrice: Number(combo.reference_price ?? 0),
    pricingSettings,
  });
  const displayedPrice = getDisplayedComboPrice(combo);
  const financeReferencePrice = Number(displayedPrice.value ?? combo.reference_price ?? 0);
  const systemLabel = getSystemLabel(combo);
  const voltageLabel = getVoltageLabel(combo);
  const monthlyProduction = Math.round(finance.monthlyProductionKwh);
  const paybackYears = buildComboFinance({
    solarKw: Number(combo.solar_kw ?? 0),
    costPrice: Number(combo.cost_price ?? 0),
    referencePrice: financeReferencePrice,
    pricingSettings,
  }).paybackYears;

  const comboItems = publicClient
    ? ((await publicClient
        .from("combo_items")
        .select("id, combo_id, product_id, reference_product_id, category, item_name, quantity, unit_price_vat, total_price_vat, cost_price, total_cost_price, sort_order, sheet_group, gross_margin, warranty, notes")
        .eq("combo_id", id)
        .order("sort_order", { ascending: true })).data ?? []).map((row: any) => normalizeComboItem(row) as ComboItemRow)
    : [];

  const productIds = Array.from(
    new Set(
      comboItems.flatMap((item) =>
        [item.product_id, item.reference_product_id]
          .filter(Boolean)
          .map((value) => String(value)),
      ),
    ),
  );
  const productsById = new Map<string, PublicProductRow>();
  if (publicClient && productIds.length > 0) {
    const { data: products } = await publicClient
      .from("products")
      .select("id, name, brand, category, cover_image_url, image_urls, technical_specs")
      .in("id", productIds);
    (products ?? []).forEach((product: any) => {
      productsById.set(String(product.id), {
        id: String(product.id),
        name: product.name ?? "",
        brand: product.brand ?? "",
        category: product.category ?? "",
        cover_image_url: product.cover_image_url ?? "",
        image_urls: Array.isArray(product.image_urls) ? product.image_urls : [],
        technical_specs: product.technical_specs ?? null,
      });
    });
  }

  const comboItemsWithProduct = comboItems.map((item) => {
    const ref = item.product_id ? productsById.get(String(item.product_id)) : item.reference_product_id ? productsById.get(String(item.reference_product_id)) : null;
    return {
      ...item,
      product: ref ?? null,
      item_name: ref?.name?.trim() || item.item_name,
      category: ref?.category?.trim() || item.category,
      brand: ref?.brand?.trim() || item.brand,
    };
  });

  const areaM2 = getComboAreaM2(comboItemsWithProduct);

  const publicItems = comboItemsWithProduct.filter((item) => item.quantity > 0 || Number(item.total_price_vat ?? 0) > 0 || Number(item.total_cost_price ?? 0) > 0);
  const groupedItems = publicItems.reduce<Record<string, ComboItemRow[]>>((acc, item) => {
    const key = getGroupLabel(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const displayGroups = Object.entries(groupedItems).map(([label, items]) => ({
    label,
    items,
    total: items.reduce((sum, item) => sum + Number(item.total_price_vat ?? item.unit_price_vat * item.quantity), 0),
    primary: isPrimaryGroup(label),
  }));

  const mainDevices = displayGroups.filter((group) => group.primary);
  const accessoryGroups = displayGroups.filter((group) => !group.primary);
  const laborGroup = displayGroups.find((group) => group.label === "Nhân công lắp đặt");

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <ThemeCard tone="hero" className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] p-4 md:p-6">
              {(combo as typeof combo & { cover_image_url?: string }).cover_image_url ? (
                <img
                  src={(combo as typeof combo & { cover_image_url?: string }).cover_image_url}
                  alt={combo.name}
                  className="aspect-square w-full rounded-[1.5rem] object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 text-sm text-slate-300">
                  Chưa có ảnh combo
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5 p-5 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-100">{combo.code}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{combo.slug}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{systemLabel}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{combo.phase === 1 ? "1 pha" : "3 pha"}</span>
                <span className={combo.combo_type === "custom" ? "rounded-full bg-fuchsia-400/15 px-3 py-1 text-xs font-semibold text-fuchsia-100" : "rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-100"}>
                  {getComboTypeLabel(combo)}
                </span>
                {voltageLabel && <span className="rounded-full bg-blue-400/15 px-3 py-1 text-xs font-semibold text-blue-100">{voltageLabel}</span>}
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Combo public</div>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-5xl">{combo.name}</h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{combo.description}</p>
                <p className="mt-4 text-sm font-medium uppercase tracking-[0.24em] text-cyan-100">
                  {combo.source_kind || "project"} · {combo.phase === 1 ? "1 pha" : "3 pha"}
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center gap-2 text-sm uppercase tracking-[0.24em] text-slate-400">
                  <span>{displayedPrice.label}</span>
                  {displayedPrice.label === "Giá ưu đãi" && (
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-100">
                      Ưu đãi
                    </span>
                  )}
                </div>
                <div className="mt-2 text-3xl font-bold text-cyan-200 md:text-4xl">{formatMoneyVnd(displayedPrice.value)}</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <HeroStat label="Công suất" value={`${combo.solar_kw} kWp`} />
                {combo.battery_kwh ? <HeroStat label="Pin lưu trữ" value={`${combo.battery_kwh} kWh ${combo.battery_type ?? ""}`.trim()} /> : null}
                <HeroStat label="Sản lượng" value={`${monthlyProduction} kWh/tháng`} />
                <HeroStat label="Diện tích" value={areaM2 ? `${areaM2.toFixed(1)} m²` : "thiếu thông số kỹ thuật"} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <FeatureRow label="Hoàn vốn" value={`${paybackYears.toFixed(1)} năm`} />
                <FeatureRow label="Biên lợi nhuận" value={`${round2(finance.grossMargin).toFixed(1)}%`} />
              </div>

              <div className="mt-auto flex flex-wrap gap-3">
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_SALE_PHONE ?? ""}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Liên hệ ngay
                </a>
                <a
                  href="#bom"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Xem BOM
                </a>
              </div>
            </div>
          </div>
        </ThemeCard>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Tư vấn" title="Thông tin nhanh" description="Khối thông tin ngắn gọn để người xem hiểu combo trước khi đi sâu vào BOM." />
            <div className="mt-5 space-y-3">
              <FeatureRow label="Phù hợp" value={`${systemLabel} · ${combo.phase === 1 ? "1 pha" : "3 pha"}`} />
              <FeatureRow label="Điện áp" value={voltageLabel ?? "Không áp pin"} />
              <FeatureRow label="Ứng dụng" value={combo.phase === 3 ? "mái xưởng / thương mại" : "mái dân dụng"} />
              <FeatureRow label="Tình trạng" value={combo.status === "active" ? "Active" : "Inactive"} />
            </div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Mô tả" title="Cấu hình combo" description="Dữ liệu combo dự án vẫn được giữ nguyên, chỉ thay cách trình bày để dễ đọc hơn." />
            <div className="mt-4 rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 text-sm leading-7 text-[color:var(--text)]">
              Hệ {systemLabel.toLowerCase()} {combo.phase === 1 ? "1 pha" : "3 pha"} với công suất {combo.solar_kw} kWp.
              {combo.battery_kwh ? ` Kèm lưu trữ ${combo.battery_kwh} kWh.` : " Không bao gồm pin lưu trữ."}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <FeatureRow label={displayedPrice.label} value={formatMoneyVnd(displayedPrice.value)} />
              <FeatureRow label="Lợi ích tháng" value={formatMoneyVnd(finance.monthlyBenefitVnd)} />
              <FeatureRow label="Sản lượng tháng" value={`${monthlyProduction} kWh`} />
              <FeatureRow
                label="Giả định"
                value={`PSH ${pricingSettings.default_psh_hours}h · PR ${pricingSettings.default_pr.toFixed(2)} · tự dùng ${(pricingSettings.self_use_ratio * 100).toFixed(0)}%`}
              />
            </div>
          </ThemeCard>
        </section>

        <ThemeCard className="p-6">
          <SectionTitle eyebrow="Thiết bị chính" title="Danh sách vật tư trọng tâm" description="Giống bố cục EPCVINA: chỉ nhấn vào các nhóm chính như tấm pin, inverter, pin lưu trữ." />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mainDevices.length > 0 ? (
              mainDevices.map((group) => (
                <div key={group.label} className="rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[color:var(--text)]">{group.label}</div>
                      <div className="mt-1 text-xs text-[color:var(--muted)]">{group.items.length} vật tư</div>
                    </div>
                    <div className="text-sm font-semibold text-[color:var(--text)]">{formatMoneyVnd(group.total)}</div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3">
                        <div className="flex gap-3">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-strong)]">
                            {getImage(item) ? <img src={getImage(item)} alt={item.item_name} className="h-full w-full object-cover" /> : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-[color:var(--text)]">{item.item_name}</div>
                            <div className="mt-1 text-xs text-[color:var(--muted)]">{item.category || "Vật tư"}</div>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <FeatureRow label="Số lượng" value={`x${item.quantity}`} />
                          <FeatureRow label={getDisplayedMaterialPrice(item).label} value={formatMoneyVnd(getDisplayedMaterialPrice(item).value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-6 text-sm text-[color:var(--muted)]">
                Chưa có nhóm vật tư chính.
              </div>
            )}
          </div>
        </ThemeCard>

        <ThemeCard id="bom" className="p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-[color:var(--border)] pb-4">
            <SectionTitle
              eyebrow="BOM"
              title="Bản kê chi tiết vật tư"
              description="Bản kê chi tiết vật tư dựa theo excel BOM đã làm trước đó."
            />
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-xs font-medium text-[color:var(--muted)]">
                Excel BOM
              </span>
              <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-xs font-medium text-[color:var(--muted)]">
                Đồng bộ từ combo_items
              </span>
            </div>
          </div>
          {laborGroup ? (
            <div className="mt-5 rounded-[1.2rem] border border-orange-400/30 bg-orange-400/10 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-orange-200">Theo Excel BOM</div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-white/90">Khoản nhân công lắp đặt được tách riêng khỏi BOM phụ.</div>
                <div className="text-xl font-semibold text-white">{formatMoneyVnd(laborGroup.total)}</div>
              </div>
            </div>
          ) : null}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">Nhóm chính</div>
              <div className="mt-2 text-2xl font-semibold text-[color:var(--text)]">{mainDevices.length}</div>
            </div>
            <div className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">Nhóm phụ</div>
              <div className="mt-2 text-2xl font-semibold text-[color:var(--text)]">{accessoryGroups.length}</div>
            </div>
            <div className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">Tổng nhóm</div>
              <div className="mt-2 text-2xl font-semibold text-[color:var(--text)]">{displayGroups.length}</div>
            </div>
            <div className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">Nguồn</div>
              <div className="mt-2 text-lg font-semibold text-[color:var(--text)]">Excel BOM</div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.2rem] border border-[color:var(--border)]">
            <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_90px_110px_120px] gap-3 bg-[color:var(--panel)] px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
              <div>Vật tư</div>
              <div>Tham chiếu</div>
              <div className="text-right">SL</div>
              <div className="text-right">Đơn giá</div>
              <div className="text-right">Thành tiền</div>
            </div>
            <div className="divide-y divide-[color:var(--border)] bg-[color:var(--bg-elevated)]">
              {comboItemsWithProduct.length > 0 ? (
                comboItemsWithProduct.map((item) => (
                  <div key={item.id} className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_90px_110px_120px] gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[color:var(--text)]">{getItemTitle(item)}</div>
                      <div className="mt-1 text-xs text-[color:var(--muted)]">{item.category || "Vật tư"}</div>
                    </div>
                    <div className="min-w-0 text-sm text-[color:var(--text)]">{getReferenceLabel(item)}</div>
                    <div className="text-right text-sm text-[color:var(--text)]">x{item.quantity}</div>
                    <div className="text-right text-sm text-[color:var(--text)]">{formatMoneyVnd(Number(item.unit_price_vat ?? 0))}</div>
                    <div className="text-right text-sm font-medium text-[color:var(--text)]">{formatMoneyVnd(getCustomPrice(item))}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-sm text-[color:var(--muted)]">Chưa có dòng Excel BOM.</div>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {displayGroups.length > 0 ? (
              displayGroups.map((group) => {
                const openByDefault = group.primary;
                return (
                  <details key={group.label} open={openByDefault} className="group rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-[color:var(--text)]">{group.label}</div>
                        <div className="mt-1 text-xs text-[color:var(--muted)]">
                          {group.label === "Nhân công lắp đặt"
                            ? "1 khoản chi phí theo sheet"
                            : group.primary
                              ? `${group.items.length} vật tư`
                              : "Gộp các vật tư phụ trong cùng nhóm"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[color:var(--text)]">{formatMoneyVnd(group.total)}</div>
                        <div className="text-xs text-[color:var(--muted)]">Nhấn để xem</div>
                      </div>
                    </summary>

                    <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-[color:var(--border)]">
                      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_110px_90px_120px_120px] gap-3 bg-[color:var(--panel)] px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        <div>Vật tư</div>
                        <div>Tham chiếu</div>
                        <div className="text-right">SL</div>
                        <div className="text-right">Đơn giá</div>
                        <div className="text-right">Thành tiền</div>
                        <div className="text-right">Ghi chú</div>
                      </div>
                      <div className="divide-y divide-[color:var(--border)]">
                        {group.primary ? (
                          group.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_110px_90px_120px_120px] gap-3 bg-[color:var(--bg-elevated)] px-4 py-3">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-[color:var(--text)]">{item.item_name}</div>
                                <div className="mt-1 text-xs text-[color:var(--muted)]">{getReferenceLabel(item)}</div>
                              </div>
                              <div className="min-w-0 text-sm text-[color:var(--text)]">{item.brand || "-"}</div>
                              <div className="text-right text-sm text-[color:var(--text)]">x{item.quantity}</div>
                              <div className="text-right text-sm text-[color:var(--text)]">{formatMoneyVnd(Number(item.unit_price_vat ?? 0))}</div>
                              <div className="text-right text-sm font-medium text-[color:var(--text)]">{formatMoneyVnd(getCustomPrice(item))}</div>
                              <div className="min-w-0 text-right text-xs text-[color:var(--muted)]">{item.notes || "-"}</div>
                            </div>
                          ))
                        ) : group.label === "Chi phí nhân công" ? (
                          group.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_110px_90px_120px_120px] gap-3 bg-[color:var(--bg-elevated)] px-4 py-3">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-[color:var(--text)]">{item.item_name || "Chi phí nhân công"}</div>
                                <div className="mt-1 text-xs text-[color:var(--muted)]">{getReferenceLabel(item)}</div>
                              </div>
                              <div className="min-w-0 text-sm text-[color:var(--text)]">{item.brand || "-"}</div>
                              <div className="text-right text-sm text-[color:var(--text)]">1</div>
                              <div className="text-right text-sm text-[color:var(--text)]">{formatMoneyVnd(Number(item.unit_price_vat ?? 0))}</div>
                              <div className="text-right text-sm font-medium text-[color:var(--text)]">{formatMoneyVnd(getCustomPrice(item))}</div>
                              <div className="min-w-0 text-right text-xs text-[color:var(--muted)]">{item.notes || "-"}</div>
                            </div>
                          ))
                        ) : (
                          <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_110px_90px_120px_120px] gap-3 bg-[color:var(--bg-elevated)] px-4 py-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-[color:var(--text)]">{group.label}</div>
                              <div className="mt-1 text-xs text-[color:var(--muted)]">Gộp nhiều vật tư phụ trong cùng nhóm</div>
                            </div>
                            <div className="min-w-0 text-sm text-[color:var(--text)]">-</div>
                            <div className="text-right text-sm text-[color:var(--text)]">x1</div>
                            <div className="text-right text-sm text-[color:var(--text)]">-</div>
                            <div className="text-right text-sm font-medium text-[color:var(--text)]">{formatMoneyVnd(group.total)}</div>
                            <div className="min-w-0 text-right text-xs text-[color:var(--muted)]">Nhóm gộp</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-6 text-sm text-[color:var(--muted)]">
                Chưa có combo item.
              </div>
            )}
          </div>
        </ThemeCard>
      </div>
    </PublicShell>
  );
}
