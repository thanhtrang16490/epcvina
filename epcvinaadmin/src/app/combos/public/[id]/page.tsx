import { PublicShell } from "@/components/PublicShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { getComboAreaM2 } from "@/lib/combo-area";
import { getDisplayedComboPrice } from "@/lib/combo-price";
import { buildComboFinance, round2 } from "@/lib/combo-finance";
import { parseBatteryKwh, parsePowerWp } from "@/lib/combo-builder";
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
    unit?: string;
    category?: string;
    cover_image_url?: string;
    image_urls?: string[];
    technical_specs?: unknown;
  } | null;
  referenceProduct?: {
    name?: string;
    brand?: string;
    unit?: string;
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
  const sheetGroup = String(item.sheet_group ?? "").toLowerCase();
  if (sheetGroup === "panel") return "Tấm quang năng";
  if (sheetGroup === "inverter") return "Biến tần";
  if (sheetGroup === "battery") return "Pin lưu trữ";
  if (sheetGroup === "mounting") return "Hệ khung nhôm";
  if (sheetGroup === "wiring") return "Hệ dây điện";
  if (sheetGroup === "cabinet") return "Tủ điện";
  if (sheetGroup === "grounding") return "Hệ tiếp địa";
  if (sheetGroup === "labor") return "Nhân công lắp đặt";

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
  if (text.includes("tấm pin") || text.includes("panel") || text.includes("pv")) return "Tấm quang năng";
  if (text.includes("inverter") || text.includes("biến tần")) return "Biến tần";
  if (text.includes("khung") || text.includes("rail") || text.includes("mount")) return "Hệ khung nhôm";
  if (text.includes("dây") || text.includes("cáp") || text.includes("wire") || text.includes("mc4")) return "Hệ dây điện";
  if (text.includes("tủ điện") || text.includes("cabinet") || text.includes("meter")) return "Tủ điện";
  if (text.includes("tiếp địa") || text.includes("ground")) return "Hệ tiếp địa";
  return item.category || "Khác";
}

function isPrimaryGroup(label: string) {
  return label === "Tấm quang năng" || label === "Biến tần" || label === "Pin lưu trữ";
}

function getGroupOrder(label: string) {
  if (label === "Tấm quang năng") return 1;
  if (label === "Biến tần") return 2;
  if (label === "Pin lưu trữ") return 3;
  if (label === "Hệ khung nhôm") return 4;
  if (label === "Hệ dây điện") return 5;
  if (label === "Tủ điện") return 6;
  if (label === "Hệ tiếp địa") return 7;
  if (label === "Nhân công lắp đặt") return 8;
  return 99;
}

function getReferenceLabel(item: ComboItemRow) {
  const productName = item.referenceProduct?.name?.trim();
  const productBrand = item.referenceProduct?.brand?.trim();
  if (productBrand && productName) return `${productBrand} · ${productName}`;
  return productName || productBrand || "-";
}

function getItemUnit(item: ComboItemRow, groupLabel?: string) {
  if (groupLabel === "Chi phí nhân công" || groupLabel === "Nhân công lắp đặt") return "Trọn gói";
  return item.unit?.trim() || "Bộ";
}

function shouldHideGroupTitle(label: string) {
  return label === "Hệ khung nhôm" || label === "Hệ dây điện" || label === "Nhân công lắp đặt";
}

function numberToVietnameseWords(value: number) {
  const n = Math.max(0, Math.round(Number(value ?? 0)));
  if (n === 0) return "Không đồng";

  const units = ["", " nghìn", " triệu", " tỷ"];
  const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

  function readTriple(num: number, full: boolean) {
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const one = num % 10;
    const parts: string[] = [];

    if (hundred > 0 || full) {
      parts.push(`${digits[hundred]} trăm`);
    }

    if (ten > 1) {
      parts.push(`${digits[ten]} mươi`);
      if (one === 1) parts.push("mốt");
      else if (one === 4) parts.push("bốn");
      else if (one === 5) parts.push("lăm");
      else if (one > 0) parts.push(digits[one]);
    } else if (ten === 1) {
      parts.push("mười");
      if (one === 5) parts.push("lăm");
      else if (one > 0) parts.push(digits[one]);
    } else if (one > 0) {
      if (hundred > 0 || full) parts.push("lẻ");
      parts.push(digits[one]);
    }

    return parts.join(" ");
  }

  const groups: number[] = [];
  let remaining = n;
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  const words = groups
    .map((group, index) => ({ group, index }))
    .filter(({ group }) => group > 0)
    .reverse()
    .map(({ group, index }, position, arr) => {
      const full = position !== arr.length - 1 && group < 100;
      const chunk = readTriple(group, full);
      const unit = units[index] ?? "";
      return `${chunk}${unit}`.trim();
    });

  return `${words.join(" ")} đồng`.replace(/\s+/g, " ").replace("mươi năm", "mươi lăm");
}

function moneyDisplay(value: number) {
  return formatMoneyVnd(value);
}

function getCustomPrice(item: ComboItemRow) {
  return Number(item.total_price_vat || item.unit_price_vat * item.quantity || 0);
}

function getReferencePrice(item: ComboItemRow) {
  return Number(item.total_cost_price || item.cost_price * item.quantity || 0);
}

function getComboCover(combo: ComboData & { cover_image_url?: string; image_urls?: string[] }) {
  return combo.cover_image_url || combo.image_urls?.[0] || "";
}

function ComboFallbackArt({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] bg-white">
      <img src="/sample-combo.jpg" alt={label} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

function getPreVatUnitPrice(item: ComboItemRow) {
  const vatUnitPrice = Number(item.unit_price_vat ?? 0);
  return vatUnitPrice > 0 ? vatUnitPrice / 1.1 : 0;
}

function getPreVatTotalPrice(item: ComboItemRow) {
  const vatTotal = Number(item.total_price_vat ?? 0);
  const fallback = getPreVatUnitPrice(item) * Number(item.quantity ?? 0);
  return vatTotal > 0 ? vatTotal / 1.1 : fallback;
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

function getProductTitlePower(item: ComboItemRow, kind: "panel" | "inverter" | "battery") {
  const product = item.referenceProduct ?? item.product;
  if (!product) return "";
  const name = String(product.name ?? "").trim();
  const specs = `${name} ${String(product.technical_specs ?? "").trim()}`;
  if (kind === "battery") {
    const batteryKwh = parseBatteryKwh({ name, description: specs } as never);
    if (batteryKwh > 0) return `${batteryKwh.toFixed(2).replace(/\.00$/, "")}kWh`;
    if (product.unit) return `${product.unit}`;
    return "";
  }

  const kwp = parsePowerWp({ name, description: specs } as never);
  if (kwp > 0) {
    const display = kwp >= 1000 ? (kwp / 1000).toFixed(2).replace(/\.00$/, "") : kwp.toFixed(2).replace(/\.00$/, "");
    return kind === "panel" ? `${display}kWp` : `${display}kW`;
  }

  return "";
}

function getComboDisplayName(combo: ComboData, comboItems: ComboItemRow[]) {
  const systemLabel = combo.battery_kwh ? "Hybrid" : "On-grid";
  const phaseLabel = combo.phase === 1 ? "1P" : "3P";
  const voltageLabel = combo.battery_kwh ? (getVoltageLabel(combo) ?? "ÁP THẤP") : "";

  const panel = comboItems.find((item) => getGroupLabel(item) === "Tấm quang năng");
  const inverter = comboItems.find((item) => getGroupLabel(item) === "Biến tần");
  const battery = comboItems.find((item) => getGroupLabel(item) === "Pin lưu trữ");

  const parts = [
    `${systemLabel} ${combo.solar_kw}kWp ${phaseLabel}${voltageLabel ? ` ${voltageLabel.toUpperCase()}` : ""}`.trim(),
    panel?.referenceProduct?.brand || panel?.product?.brand
      ? `${(panel?.referenceProduct?.brand || panel?.product?.brand || "").trim()}${getProductTitlePower(panel ?? ({} as ComboItemRow), "panel") ? ` ${getProductTitlePower(panel ?? ({} as ComboItemRow), "panel")}` : ""}`.trim()
      : "",
    inverter?.referenceProduct?.brand || inverter?.product?.brand
      ? `${(inverter?.referenceProduct?.brand || inverter?.product?.brand || "").trim()}${getProductTitlePower(inverter ?? ({} as ComboItemRow), "inverter") ? ` ${getProductTitlePower(inverter ?? ({} as ComboItemRow), "inverter")}` : ""}`.trim()
      : "",
    battery?.referenceProduct?.brand || battery?.product?.brand
      ? `${(battery?.referenceProduct?.brand || battery?.product?.brand || "").trim()}${getProductTitlePower(battery ?? ({} as ComboItemRow), "battery") ? ` ${getProductTitlePower(battery ?? ({} as ComboItemRow), "battery")}` : ""}`.trim()
      : "",
  ].filter(Boolean);

  return parts.join(" - ").toLowerCase();
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

function ProductVisualFallback({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,rgba(8,18,33,0.98),rgba(10,26,45,0.86))]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.14),_transparent_30%)]" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/18 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
          <img src="/brands/epcvina-solar.png" alt={label} className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  );
}

function getReferenceProductHref(item: ComboItemRow) {
  const id = item.referenceProduct?.id;
  return id ? `/products/public/${id}` : "#";
}

export default async function PublicComboDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const publicClient = createSupabaseAdminClient() ?? supabase;
  const sessionUser = supabase ? (await supabase.auth.getUser()).data.user : null;
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
        .select("id, combo_id, product_id, reference_product_id, category, item_name, unit, quantity, unit_price_vat, total_price_vat, cost_price, total_cost_price, sort_order, sheet_group, gross_margin, warranty, notes")
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
      .select("id, name, brand, unit, category, cover_image_url, image_urls, technical_specs")
      .in("id", productIds);
    (products ?? []).forEach((product: any) => {
      productsById.set(String(product.id), {
        id: String(product.id),
        name: product.name ?? "",
        brand: product.brand ?? "",
        unit: product.unit ?? "",
        category: product.category ?? "",
        cover_image_url: product.cover_image_url ?? "",
        image_urls: Array.isArray(product.image_urls) ? product.image_urls : [],
        technical_specs: product.technical_specs ?? null,
      });
    });
  }

  const comboItemsWithProduct = comboItems.map((item) => {
    const referenceId = item.reference_product_id ? String(item.reference_product_id) : "";
    const selfId = item.product_id ? String(item.product_id) : "";
    const manualReference = referenceId && referenceId !== selfId ? productsById.get(referenceId) ?? null : null;
    const product = item.product_id ? productsById.get(selfId) ?? null : null;
    return {
      ...item,
      product,
      referenceProduct: manualReference,
      item_name: product?.name?.trim() || item.item_name,
      category: product?.category?.trim() || item.category,
      brand: product?.brand?.trim() || item.brand,
      unit: item.unit || "",
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

  const displayGroups = Object.entries(groupedItems)
    .map(([label, items]) => ({
    label,
    items,
    total: items.reduce((sum, item) => sum + getPreVatTotalPrice(item), 0),
    primary: isPrimaryGroup(label),
    }))
    .sort((a, b) => getGroupOrder(a.label) - getGroupOrder(b.label));

  const mainDevices = displayGroups
    .filter((group) => group.primary)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => Boolean(item.referenceProduct)),
    }))
    .filter((group) => group.items.length > 0);
  const accessoryGroups = displayGroups.filter((group) => !group.primary);
  const laborGroup = displayGroups.find((group) => group.label === "Nhân công lắp đặt");
  const bomSubTotal = publicItems.reduce((sum, item) => sum + getPreVatTotalPrice(item), 0);
  const bomVat = bomSubTotal * 0.1;
  const bomGrandTotal = bomSubTotal + bomVat;

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <ThemeCard tone="hero" className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] p-4 md:p-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-[1.5rem]">
                {getComboCover(combo as typeof combo & { cover_image_url?: string; image_urls?: string[] }) ? (
                  <img
                    src={getComboCover(combo as typeof combo & { cover_image_url?: string; image_urls?: string[] })}
                    alt={combo.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ComboFallbackArt label={combo.name} />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 p-5 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-orange-400/15 px-3 py-1 text-xs font-semibold text-orange-100">{combo.code}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{systemLabel}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{combo.phase === 1 ? "1 pha" : "3 pha"}</span>
                <span className={combo.combo_type === "custom" ? "rounded-full bg-fuchsia-400/15 px-3 py-1 text-xs font-semibold text-fuchsia-100" : "rounded-full bg-orange-400/15 px-3 py-1 text-xs font-semibold text-orange-100"}>
                  {getComboTypeLabel(combo)}
                </span>
                {voltageLabel && <span className="rounded-full bg-orange-400/15 px-3 py-1 text-xs font-semibold text-orange-100">{voltageLabel}</span>}
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Combo public</div>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-5xl">{getComboDisplayName(combo, comboItemsWithProduct)}</h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{combo.description}</p>
                <p className="mt-4 text-sm font-medium uppercase tracking-[0.24em] text-orange-100">
                  {combo.source_kind || "project"} · {combo.phase === 1 ? "1 pha" : "3 pha"}
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                <div className="mt-2 text-3xl font-bold text-orange-300 md:text-4xl">{formatMoneyVnd(displayedPrice.value)}</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <HeroStat label="Công suất" value={`${combo.solar_kw} kWp`} />
                {combo.battery_kwh ? <HeroStat label="Pin lưu trữ" value={`${combo.battery_kwh} kWh ${combo.battery_type ?? ""}`.trim()} /> : null}
                <HeroStat label="Sản lượng" value={`${monthlyProduction} kWh/tháng`} />
                <HeroStat label="Diện tích" value={areaM2 ? `${areaM2.toFixed(1)} m²` : "thiếu thông số kỹ thuật"} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <FeatureRow label="Hoàn vốn" value={`${paybackYears.toFixed(1)} năm`} />
              </div>

              <div className="mt-auto flex flex-wrap gap-3">
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_SALE_PHONE ?? ""}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Liên hệ ngay
                </a>
                {sessionUser ? (
                  <ThemeLinkButton href={`/admin/combos/${combo.id}/edit`} tone="secondary">
                    Sửa combo
                  </ThemeLinkButton>
                ) : null}
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
          <div className="mt-5 overflow-x-auto pb-2">
            {mainDevices.length > 0 ? (
              <div className="flex min-w-max gap-4">
                {mainDevices.map((group) => (
                  <div
                    key={group.label}
                    className="w-[min(28rem,82vw)] overflow-hidden rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] lg:w-[28rem]"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-[color:var(--border)] px-4 py-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[color:var(--text)]">{group.label}</div>
                        <div className="mt-1 text-xs text-[color:var(--muted)]">{group.items.length} sản phẩm tham chiếu</div>
                      </div>
                    </div>

                    <div className="grid gap-4 p-4">
                      {group.items.map((item) => (
                        <ThemeCard
                          as="article"
                          key={item.id}
                          className="group overflow-hidden border-[color:var(--border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,rgba(8,18,33,0.95),rgba(10,26,45,0.82))]">
                            <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                              <span className="rounded-full bg-[color:var(--accent)] px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                {group.label}
                              </span>
                            </div>
                            {item.referenceProduct?.cover_image_url || item.referenceProduct?.image_urls?.[0] ? (
                              <img
                                src={item.referenceProduct?.cover_image_url || item.referenceProduct?.image_urls?.[0] || ""}
                                alt={item.referenceProduct?.name || item.item_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ProductVisualFallback label={item.referenceProduct?.name || item.item_name} />
                            )}
                          </div>

                          <a href={getReferenceProductHref(item)} className="flex flex-col p-4 transition hover:bg-white/5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="text-sm font-bold leading-snug text-[color:var(--text)] group-hover:text-[color:var(--accent)]">
                                  {item.referenceProduct?.name?.trim() || "Sản phẩm tham chiếu"}
                                </h3>
                                <p className="mt-1 text-xs text-[color:var(--muted)]">{item.referenceProduct?.brand || item.brand || "EPCVINA"}</p>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[color:var(--border)] pt-3">
                              <span className="text-xs text-[color:var(--muted)]">Tham chiếu thủ công</span>
                              <span className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm font-medium text-[color:var(--text)]">
                                Xem sản phẩm
                              </span>
                            </div>
                          </a>
                        </ThemeCard>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-6 text-sm text-[color:var(--muted)]">
                Chưa có sản phẩm tham chiếu thủ công.
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
          <div className="mt-5 space-y-4">
            {displayGroups.length > 0 ? (
              <>
                <div className="hidden overflow-hidden rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] md:block">
                  <div className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--panel)] px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    <div>Vật tư</div>
                    <div className="text-right">Bảo hành</div>
                    <div className="text-center">ĐVT</div>
                    <div className="text-center">SL</div>
                    <div className="text-right">Đơn giá</div>
                    <div className="text-right">Thành tiền</div>
                    <div className="text-right">Tổng tiền</div>
                  </div>
                  <div className="divide-y divide-[color:var(--border)]">
                    {displayGroups.map((group) => (
                      <div key={group.label}>
                        <div className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--panel)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                          <div className="col-span-7 flex items-center justify-between gap-4">
                            <span>{shouldHideGroupTitle(group.label) ? "" : group.label}</span>
                          </div>
                        </div>
                        {group.primary ? (
                          group.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--bg-elevated)] px-4 py-3">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-[color:var(--text)]">{item.item_name}</div>
                                <div className="mt-1 text-xs text-[color:var(--muted)]">{item.brand || "-"}</div>
                              </div>
                              <div className="min-w-0 text-center text-xs text-[color:var(--text)]">{item.warranty || "-"}</div>
                              <div className="text-center text-sm text-[color:var(--text)]">{getItemUnit(item, group.label)}</div>
                              <div className="text-center text-sm text-[color:var(--text)]">x{item.quantity}</div>
                              <div className="text-right text-sm text-[color:var(--text)]">{moneyDisplay(getPreVatUnitPrice(item))}</div>
                              <div className="text-right text-sm font-medium text-[color:var(--text)]">{moneyDisplay(getPreVatTotalPrice(item))}</div>
                              <div className="text-right text-sm text-[color:var(--text)]">{moneyDisplay(getPreVatTotalPrice(item))}</div>
                            </div>
                          ))
                        ) : group.label === "Chi phí nhân công" ? (
                          group.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--bg-elevated)] px-4 py-3">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-[color:var(--text)]">{item.item_name || "Chi phí nhân công"}</div>
                                <div className="mt-1 text-xs text-[color:var(--muted)]">{item.brand || "-"}</div>
                              </div>
                              <div className="min-w-0 text-center text-xs text-[color:var(--text)]">{item.warranty || "-"}</div>
                              <div className="text-center text-sm text-[color:var(--text)]">{getItemUnit(item, group.label)}</div>
                              <div className="text-center text-sm text-[color:var(--text)]">1</div>
                              <div className="text-right text-sm text-[color:var(--text)]">{moneyDisplay(getPreVatUnitPrice(item))}</div>
                              <div className="text-right text-sm font-medium text-[color:var(--text)]">{moneyDisplay(getPreVatTotalPrice(item))}</div>
                              <div className="text-right text-sm text-[color:var(--text)]">{moneyDisplay(getPreVatTotalPrice(item))}</div>
                            </div>
                          ))
                        ) : (
                          <div className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--bg-elevated)] px-4 py-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-[color:var(--text)]">{group.label}</div>
                              <div className="mt-1 text-xs text-[color:var(--muted)]">Gộp nhiều vật tư phụ trong cùng nhóm</div>
                            </div>
                            <div className="min-w-0 text-center text-xs text-[color:var(--text)]">2 năm</div>
                            <div className="text-center text-sm text-[color:var(--text)]">
                              {group.label === "Nhân công lắp đặt" ? "Trọn gói" : "Bộ"}
                            </div>
                            <div className="text-center text-sm text-[color:var(--text)]">1</div>
                            <div className="text-right text-sm text-[color:var(--text)]">{moneyDisplay(group.total)}</div>
                            <div className="text-right text-sm font-medium text-[color:var(--text)]">{moneyDisplay(group.total)}</div>
                            <div className="text-right text-sm text-[color:var(--text)]">{moneyDisplay(group.total)}</div>
                          </div>
                        )}
                      </div>
                    ))}
                      <div className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--panel)] px-4 py-3 text-sm font-semibold text-[color:var(--text)]">
                      <div>Tạm tính</div>
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div className="text-right text-[color:var(--text)]">{moneyDisplay(bomSubTotal)}</div>
                    </div>
                    <div className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--bg-elevated)] px-4 py-3 text-sm font-semibold text-[color:var(--text)]">
                      <div>VAT 10%</div>
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div className="text-right text-[color:var(--text)]">{moneyDisplay(bomVat)}</div>
                    </div>
                    <div className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--panel)] px-4 py-3 text-sm font-semibold text-[color:var(--text)]">
                      <div>Tổng cộng</div>
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div className="text-right text-[color:var(--text)]">{moneyDisplay(bomGrandTotal)}</div>
                      <div className="col-span-7 pt-2 text-right text-xs font-normal italic text-[color:var(--muted)]">
                        {numberToVietnameseWords(bomGrandTotal)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:hidden">
                  {displayGroups.map((group) => {
                    return (
                      <div key={group.label} className="rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                            <div className="text-sm font-semibold text-[color:var(--text)]">{shouldHideGroupTitle(group.label) ? "" : group.label}</div>
                            <div className="mt-1 text-xs text-[color:var(--muted)]">
                              {group.label === "Nhân công lắp đặt"
                                ? "1 khoản chi phí theo sheet"
                                : group.primary
                                  ? `${group.items.length} vật tư`
                                  : "Gộp các vật tư phụ trong cùng nhóm"}
                            </div>
                            </div>
                        </div>

                        <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-[color:var(--border)]">
                          <div className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--panel)] px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
                            <div>Vật tư</div>
                            <div className="text-right">Bảo hành</div>
                            <div>ĐVT</div>
                            <div className="text-right">SL</div>
                            <div className="text-right">Đơn giá</div>
                            <div className="text-right">Thành tiền</div>
                            <div className="text-right">Tổng tiền</div>
                          </div>
                          <div className="divide-y divide-[color:var(--border)]">
                            {group.primary ? (
                              group.items.map((item) => (
                                <div key={item.id} className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--bg-elevated)] px-4 py-3">
                                  <div className="min-w-0">
                                    <div className="truncate text-sm font-medium text-[color:var(--text)]">{item.item_name}</div>
                                    <div className="mt-1 text-xs text-[color:var(--muted)]">{item.brand || "-"}</div>
                                  </div>
                                  <div className="min-w-0 text-right text-xs text-[color:var(--text)]">{item.warranty || "-"}</div>
                                  <div className="text-sm text-[color:var(--text)]">{getItemUnit(item, group.label)}</div>
                                  <div className="text-right text-sm text-[color:var(--text)]">x{item.quantity}</div>
                                  <div className="text-right text-sm text-[color:var(--text)]">{formatMoneyVnd(getPreVatUnitPrice(item))}</div>
                                  <div className="text-right text-sm font-medium text-[color:var(--text)]">{formatMoneyVnd(getPreVatTotalPrice(item))}</div>
                                  <div className="text-right text-sm text-[color:var(--text)]">{formatMoneyVnd(getPreVatTotalPrice(item))}</div>
                                </div>
                              ))
                            ) : group.label === "Chi phí nhân công" ? (
                              group.items.map((item) => (
                                <div key={item.id} className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--bg-elevated)] px-4 py-3">
                                  <div className="min-w-0">
                                    <div className="truncate text-sm font-medium text-[color:var(--text)]">{item.item_name || "Chi phí nhân công"}</div>
                                    <div className="mt-1 text-xs text-[color:var(--muted)]">{item.brand || "-"}</div>
                                  </div>
                                  <div className="min-w-0 text-right text-xs text-[color:var(--text)]">{item.warranty || "-"}</div>
                                  <div className="text-sm text-[color:var(--text)]">{getItemUnit(item, group.label)}</div>
                                  <div className="text-right text-sm text-[color:var(--text)]">1</div>
                                  <div className="text-right text-sm text-[color:var(--text)]">{formatMoneyVnd(getPreVatUnitPrice(item))}</div>
                                  <div className="text-right text-sm font-medium text-[color:var(--text)]">{formatMoneyVnd(getPreVatTotalPrice(item))}</div>
                                  <div className="text-right text-sm text-[color:var(--text)]">{formatMoneyVnd(getPreVatTotalPrice(item))}</div>
                                </div>
                              ))
                            ) : (
                              <div className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_80px_90px_120px_120px] gap-3 bg-[color:var(--bg-elevated)] px-4 py-3">
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-medium text-[color:var(--text)]">{group.label}</div>
                                  <div className="mt-1 text-xs text-[color:var(--muted)]">Gộp nhiều vật tư phụ trong cùng nhóm</div>
                                </div>
                                <div className="min-w-0 text-right text-xs text-[color:var(--text)]">2 năm</div>
                                <div className="text-sm text-[color:var(--text)]">
                                  {group.label === "Nhân công lắp đặt" ? "Trọn gói" : "Bộ"}
                                </div>
                                <div className="text-right text-sm text-[color:var(--text)]">x1</div>
                                <div className="text-right text-sm text-[color:var(--text)]">{formatMoneyVnd(group.total)}</div>
                                <div className="text-right text-sm font-medium text-[color:var(--text)]">{formatMoneyVnd(group.total)}</div>
                                <div className="text-right text-sm text-[color:var(--text)]">{formatMoneyVnd(group.total)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
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
