import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { CustomerTypePhaseField } from "@/components/CustomerTypePhaseField";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { RegionPshField } from "@/components/RegionPshField";
import { SystemAdvisorShareButton } from "@/components/SystemAdvisorShareButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeCombo } from "@/lib/supabase/normalize";
import { buildAdvisorSummary, getAdvisorPhaseSuggestion, normalizeAdvisorInputs, regionPresets, sortAdvisorCombos, type AdvisorInputs } from "@/lib/system-advisor";
import { getPricingSettings, formatVnd, formatPct, getDefaultElectricityPrice, getSalesElectricityPriceLabel } from "@/lib/pricing-settings";
import { parseLocaleNumber } from "@/lib/number-format";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
const decimal1 = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });

function money(value: number) {
  return `${currency.format(Math.round(value || 0))} đ`;
}

function pct(value: number) {
  return `${number1(value)}%`;
}

function number1(value: number) {
  return decimal1.format(Number(value ?? 0));
}

function phaseBadgeLabel(inputs: AdvisorInputs) {
  if (inputs.batteryWanted) return "Ưu tiên hybrid";
  return inputs.phase === 3 ? "Ưu tiên 3 pha" : "Ưu tiên 1 pha";
}

function readNumber(value: string | string[] | undefined, fallback = 0) {
  const raw = Array.isArray(value) ? value[0] : value;
  return parseLocaleNumber(raw, fallback);
}

export default async function SystemAdvisorPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => queryString.append(key, item));
      return;
    }
    if (value !== undefined && value !== "") {
      queryString.set(key, value);
    }
  });
  const shareUrl = `/system-advisor${queryString.toString() ? `?${queryString.toString()}` : ""}`;
  const supabase = await createSupabaseServerClient();
  const pricingSettings = await getPricingSettings(supabase);
  const combos = supabase
    ? ((await supabase.from("combos").select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id, cover_image_url, image_urls").or("status.eq.active,is_active.eq.true").order("sort_order", { ascending: true })).data ?? []).map(normalizeCombo)
    : [];

  const inputs: AdvisorInputs = normalizeAdvisorInputs(params, pricingSettings);
  const summary = buildAdvisorSummary(inputs, pricingSettings);
  const phaseSuggestion = getAdvisorPhaseSuggestion(inputs, summary);
  const suggestions = sortAdvisorCombos(
    combos.map((combo) => ({
      ...combo,
      items: [],
    })),
    summary,
    inputs,
    pricingSettings,
  );

  const monthlyConsumption = inputs.monthlyConsumptionKwh > 0 ? inputs.monthlyConsumptionKwh : inputs.monthlyBillVnd / inputs.avgElectricityPriceVnd;
  const hasCalculatedLoad = Number.isFinite(monthlyConsumption) && monthlyConsumption > 0;
  const regionPreset = regionPresets[inputs.region];

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-3 py-3 md:px-0 md:py-4">
        <div className="mb-3 grid grid-cols-3 gap-2 md:hidden">
          <a href="#advisor-input" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-center text-[11px] font-medium text-[color:var(--text)]">
            Nhập liệu
          </a>
          <a href="#advisor-result" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-center text-[11px] font-medium text-[color:var(--text)]">
            Kết quả
          </a>
          <a href="#advisor-combo" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-center text-[11px] font-medium text-[color:var(--text)]">
            Combo
          </a>
        </div>

        <ThemeCard tone="hero" className="overflow-hidden p-4 md:p-8">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-orange-200 md:text-xs md:tracking-[0.28em]">
                Tư vấn hệ thống
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:mt-4 md:text-6xl">
                Đề xuất hệ phù hợp cho khách chỉ từ vài thông số
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:mt-4 md:text-base md:leading-7">
                Nhập tiền điện, khu vực, diện tích mái và nhu cầu lưu trữ. Hệ thống sẽ tính nhanh công suất đề xuất, phần tiết kiệm điện, hoàn vốn, ROI và gợi ý combo public phù hợp nhất.
              </p>
            </div>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-3 backdrop-blur-sm md:rounded-3xl md:p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400 md:text-xs md:tracking-[0.24em]">Giờ nắng hiệu dụng (PSH)</div>
                <div className="mt-2 text-xl font-semibold text-white md:text-2xl">{number1(inputs.psh)}h</div>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-3 backdrop-blur-sm md:rounded-3xl md:p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400 md:text-xs md:tracking-[0.24em]">Khu vực</div>
                <div className="mt-2 text-xl font-semibold text-white md:text-2xl">{regionPreset.label}</div>
                <div className="mt-2 text-[11px] leading-4 text-slate-400 md:text-xs md:leading-5">{regionPreset.note}</div>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-3 backdrop-blur-sm md:rounded-3xl md:p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400 md:text-xs md:tracking-[0.24em]">Combo gợi ý</div>
                <div className="mt-2 text-xl font-semibold text-white md:text-2xl">{suggestions.length}</div>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-3 backdrop-blur-sm md:rounded-3xl md:p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400 md:text-xs md:tracking-[0.24em]">Khuyến nghị</div>
                <div className="mt-2 text-xl font-semibold text-white md:text-2xl">
                  {inputs.batteryWanted ? "Hybrid" : inputs.phase === 3 ? "3 pha cho cả nhà" : "1 pha riêng"}
                </div>
                <div className="mt-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-100">
                  {phaseBadgeLabel(inputs)}
                </div>
                <div className="mt-2 text-[11px] leading-4 text-slate-400 md:text-xs md:leading-5">
                  {phaseSuggestion}
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-3 backdrop-blur-sm md:rounded-3xl md:p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400 md:text-xs md:tracking-[0.24em]">Giá điện</div>
                <div className="mt-2 text-xl font-semibold text-white md:text-2xl">{formatVnd(inputs.avgElectricityPriceVnd)}</div>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-3 backdrop-blur-sm md:rounded-3xl md:p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400 md:text-xs md:tracking-[0.24em]">Ngân sách</div>
                <div className="mt-2 text-xl font-semibold text-white md:text-2xl">
                  {inputs.budgetVnd !== null && inputs.budgetVnd > 0 ? formatVnd(inputs.budgetVnd) : "Không giới hạn"}
                </div>
              </div>
            </div>
          </div>
        </ThemeCard>

        <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <ThemeCard id="advisor-input" className="p-4 md:p-6">
            <SectionTitle eyebrow="Input" title="Nhập thông tin khách" description="Sales chỉ cần nhập phần có thật từ hóa đơn, mái và nhu cầu lưu trữ." />
            <form className="mt-4 grid gap-3 md:mt-5 md:gap-4" method="get">
              <div className="grid gap-2">
                <label className="text-xs font-medium text-[color:var(--muted)] md:text-sm">Tiền điện hàng tháng</label>
                <FormattedNumberInput name="bill" min={0} step={1} defaultValue={inputs.monthlyBillVnd || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                <p className="text-[11px] leading-5 text-[color:var(--muted)] md:text-xs">Dùng khi khách chỉ nhớ hóa đơn điện. Mặc định theo {getSalesElectricityPriceLabel(inputs.customerType).toLowerCase()}.</p>
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-medium text-[color:var(--muted)] md:text-sm">Hoặc sản lượng tiêu thụ/tháng</label>
                <FormattedNumberInput name="consumption" min={0} step={1} defaultValue={inputs.monthlyConsumptionKwh || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                <p className="text-[11px] leading-5 text-[color:var(--muted)] md:text-xs">Chỉ cần nhập 1 trong 2 ô này. Nếu có số kWh thực tế thì ưu tiên dùng số đó.</p>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-[color:var(--muted)] md:text-sm">Giá điện trung bình</label>
                  <FormattedNumberInput
                    name="price"
                    min={1}
                    step={1}
                    required
                    defaultValue={inputs.avgElectricityPriceVnd || getDefaultElectricityPrice(inputs.customerType, pricingSettings)}
                    className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-medium text-[color:var(--muted)] md:text-sm">Ngân sách dự kiến</label>
                <FormattedNumberInput
                  name="budget"
                  min={0}
                  step={1000000}
                  defaultValue={inputs.budgetVnd ?? ""}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none"
                />
                <p className="text-[11px] leading-5 text-[color:var(--muted)] md:text-xs">Để trống nếu khách không giới hạn ngân sách. Khi có nhập, combo vượt mức sẽ bị hạ ưu tiên.</p>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="grid gap-4">
                  <CustomerTypePhaseField defaultCustomerType={inputs.customerType} defaultPhase={inputs.phase} />
                  <RegionPshField defaultRegion={inputs.region} defaultPsh={inputs.psh} />
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-xs font-medium text-[color:var(--muted)] md:text-sm">Hiệu suất hệ thống (PR)</label>
                    <FormattedNumberInput name="pr" min={0.01} max={1} step={0.01} required defaultValue={inputs.pr} integer={false} inputMode="decimal" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                    <p className="text-[11px] leading-5 text-[color:var(--muted)] md:text-xs">Hệ số suy hao hệ thống, thường dùng khoảng 0.75 - 0.85.</p>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-medium text-[color:var(--muted)] md:text-sm">Diện tích mái hữu dụng (m²)</label>
                    <FormattedNumberInput name="roof" min={0} step={0.1} required defaultValue={inputs.roofAreaM2 || ""} integer={false} inputMode="decimal" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-medium text-[color:var(--muted)] md:text-sm">Tỷ lệ dùng điện ban ngày</label>
                    <FormattedNumberInput name="daytime" min={0} max={1} step={0.01} required defaultValue={inputs.daytimeUseRatio} integer={false} inputMode="decimal" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--muted)]">
                <input type="checkbox" name="battery" defaultChecked={inputs.batteryWanted} className="h-4 w-4 accent-orange-500" />
                Khách muốn phương án có pin lưu trữ
              </label>

              <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition active:scale-[0.99]">
                Tính và đề xuất combo
              </button>
            </form>
          </ThemeCard>

          <div className="space-y-6">
            <ThemeCard id="advisor-result" className="p-4 md:p-6">
            <SectionTitle eyebrow="Kết quả" title="Tóm tắt tư vấn" description="Bản nhẩm nhanh cho sales để nói chuyện với khách bằng số liệu rõ ràng." />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Chia sẻ kết quả tư vấn</div>
              <SystemAdvisorShareButton url={shareUrl} label="Copy share link" />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">Công suất đề xuất</div>
                <div className="mt-2 text-xl font-semibold text-[color:var(--text)] md:text-2xl">{number1(summary.recommendedKwP)} kWp</div>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">Sản lượng tháng</div>
                <div className="mt-2 text-xl font-semibold text-[color:var(--text)] md:text-2xl">{number1(summary.estimatedMonthlyProductionKwh)} kWh</div>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">Sản lượng năm</div>
                <div className="mt-2 text-xl font-semibold text-[color:var(--text)] md:text-2xl">{number1(summary.estimatedAnnualProductionKwh)} kWh</div>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">Mái cần</div>
                <div className="mt-2 text-xl font-semibold text-[color:var(--text)] md:text-2xl">{number1(summary.estimatedRoofAreaM2)} m²</div>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">Đầu tư ước tính</div>
                <div className="mt-2 text-xl font-semibold text-[color:var(--text)] md:text-2xl">{money(summary.estimatedInvestmentVnd)}</div>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">Hoàn vốn</div>
                <div className="mt-2 text-xl font-semibold text-[color:var(--text)] md:text-2xl">{number1(summary.estimatedPaybackYears)} năm</div>
              </div>
            </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 text-sm text-[color:var(--muted)]">
                  Tiết kiệm điện: <span className="text-[color:var(--text)]">{money(summary.estimatedMonthlySavingsVnd)}</span> / tháng
                </div>
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 text-sm text-[color:var(--muted)]">
                  ROI: <span className="text-[color:var(--text)]">{pct(summary.estimatedRoiPct)}</span> / năm
                </div>
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 text-sm text-[color:var(--muted)]">
                  Ngân sách:{" "}
                  <span className="text-[color:var(--text)]">
                    {inputs.budgetVnd !== null && inputs.budgetVnd > 0 ? money(inputs.budgetVnd) : "Không giới hạn"}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 text-sm text-[color:var(--muted)]">
                {hasCalculatedLoad
                  ? `Từ hóa đơn/sản lượng hiện tại, hệ thống đang nhẩm ra nhu cầu khoảng ${summary.recommendedKwP.toFixed(1)} kWp.`
                  : "Nhập tiền điện hoặc sản lượng để nhận ngay công suất đề xuất và danh sách combo phù hợp."}
              </div>
              <div className="mt-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 text-sm text-[color:var(--muted)]">
                Tip nhanh: {phaseSuggestion}
              </div>
            </ThemeCard>

            <ThemeCard id="advisor-combo" className="p-4 md:p-6">
              <SectionTitle eyebrow="Combo" title="Đề xuất combo public" description="Các combo dưới đây được chấm theo độ khớp công suất, lưu trữ, mái và hoàn vốn." />
              <div className="mt-4 space-y-3 md:mt-5 md:space-y-4">
                {suggestions.length > 0 ? (
                  suggestions.map((combo) => (
                    <div key={combo.id} className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-[color:var(--text)]">{combo.name}</div>
                          <div className="mt-1 text-[11px] leading-5 text-[color:var(--muted)]">
                            {combo.code} · {combo.phase} pha · {number1(combo.solar_kw)} kWp{combo.battery_kwh ? ` · ${number1(combo.battery_kwh)} kWh` : ""}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">Đề xuất</div>
                          <div className="text-base font-semibold text-[color:var(--text)] md:text-lg">{number1(combo.estimatedPaybackYears)} năm</div>
                        </div>
                      </div>
                      <div className="mt-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-700 dark:text-cyan-100">
                        {combo.fitLabel}
                      </div>
                      {inputs.budgetVnd !== null && inputs.budgetVnd > 0 && (
                        <div className="mt-2 text-[11px] leading-5 text-[color:var(--muted)]">
                          {combo.displayedPriceVnd <= inputs.budgetVnd
                            ? "Trong ngân sách"
                            : `Vượt ngân sách ${money(combo.displayedPriceVnd - inputs.budgetVnd)}`}
                        </div>
                      )}
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3 text-sm text-[color:var(--muted)]">
                          {combo.displayedPriceLabel}: <span className="text-[color:var(--text)]">{money(combo.displayedPriceVnd)}</span>
                        </div>
                        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3 text-sm text-[color:var(--muted)]">
                          Mái ước tính: <span className="text-[color:var(--text)]">{combo.estimatedRoofAreaM2 ? `${number1(combo.estimatedRoofAreaM2)} m²` : "đang thiếu"}</span>
                        </div>
                        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3 text-sm text-[color:var(--muted)]">
                          Điểm khớp: <span className="text-[color:var(--text)]">{number1(combo.score)}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {combo.reasons.map((reason) => (
                          <span key={reason} className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-[11px] text-[color:var(--muted)]">
                            {reason}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3 text-[11px] leading-6 text-[color:var(--muted)]">
                        Ưu tiên này hiện dựa trên công suất, loại hệ, pin lưu trữ, diện tích mái và hoàn vốn. Nếu muốn, có thể đổi thành logic theo ngân sách hoặc theo rooftop trước.
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={`/combos/public/${combo.id}`} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950">
                          Xem public
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-6 text-sm text-[color:var(--muted)]">
                    Chưa có combo active để đề xuất.
                  </div>
                )}
              </div>
            </ThemeCard>
          </div>
        </section>

        <ThemeCard className="mt-5 p-4 md:mt-6 md:p-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Nhẩm nhanh</div>
              <div className="mt-2 text-lg font-semibold text-[color:var(--text)]">1 triệu tiền điện ≈ 3 kWp</div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Giúp sales ước lượng ngay khi chưa có hóa đơn đầy đủ.</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Mái & tấm pin</div>
              <div className="mt-2 text-lg font-semibold text-[color:var(--text)]">1 kWp ≈ 4.5 - 5 m²</div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Dùng để chốt khả năng lắp trên mái trước khi đi khảo sát chi tiết.</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Hành động</div>
              <div className="mt-2 text-lg font-semibold text-[color:var(--text)]">Chốt bằng combo public</div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Khi đã ra kết quả, mở ngay combo public để gửi khách hoặc báo giá.</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Cách chấm điểm</div>
              <div className="mt-2 text-lg font-semibold text-[color:var(--text)]">Đúng hệ, đúng mái, đúng hoàn vốn</div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Một combo tốt không chỉ gần kWp mà còn phải khớp nhu cầu dùng điện và diện tích thực tế.</p>
            </div>
          </div>
        </ThemeCard>
      </main>
    </PublicShell>
  );
}
