import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { companySettings } from "@/lib/company-settings";
import {
  defaultPricingSettings,
  formatPct,
  formatVnd,
  normalizePricingSettings,
  parseNumberField,
  type PricingSettings,
} from "@/lib/pricing-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function savePricingSettings(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const payload: PricingSettings = {
    labor_ongrid_per_kwp: parseNumberField(formData.get("labor_ongrid_per_kwp")) || defaultPricingSettings.labor_ongrid_per_kwp,
    labor_hybrid_per_kwp: parseNumberField(formData.get("labor_hybrid_per_kwp")) || defaultPricingSettings.labor_hybrid_per_kwp,
    target_gross_margin_pct: parseNumberField(formData.get("target_gross_margin_pct")) || defaultPricingSettings.target_gross_margin_pct,
    default_psh_hours: parseNumberField(formData.get("default_psh_hours")) || defaultPricingSettings.default_psh_hours,
    default_pr: Number(String(formData.get("default_pr") ?? "").replace(/,/g, "")) || defaultPricingSettings.default_pr,
    self_use_ratio: Number(String(formData.get("self_use_ratio") ?? "").replace(/,/g, "")) || defaultPricingSettings.self_use_ratio,
    electricity_price_vnd_per_kwh: parseNumberField(formData.get("electricity_price_vnd_per_kwh")) || defaultPricingSettings.electricity_price_vnd_per_kwh,
    feed_in_tariff_vnd_per_kwh: parseNumberField(formData.get("feed_in_tariff_vnd_per_kwh")) || defaultPricingSettings.feed_in_tariff_vnd_per_kwh,
  };

  await supabase.from("pricing_settings").upsert({ id: 1, ...payload, updated_at: new Date().toISOString() });
  revalidatePath("/settings");
}

async function resetPricingSettings() {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  await supabase.from("pricing_settings").upsert({
    id: 1,
    ...defaultPricingSettings,
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/settings");
}

async function loadPricingSettings() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ...defaultPricingSettings, updated_at: null };
  }

  const { data } = await supabase.from("pricing_settings").select("*").eq("id", 1).maybeSingle();
  return {
    ...normalizePricingSettings(data ?? defaultPricingSettings),
    updated_at: data?.updated_at ?? null,
  };
}

export default async function SettingsPage() {
  const pricingSettings = await loadPricingSettings();

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <SectionTitle eyebrow="Settings" title="Thiết lập doanh nghiệp" description="Nguồn thông tin dùng chung cho admin, PDF và nội dung liên quan." />

        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
          <ThemeCard className="p-6">
            <img src={companySettings.logoUrl} alt={companySettings.name} className="h-20 w-20 rounded-2xl bg-white object-contain p-2" />
            <div className="mt-4 text-xl font-semibold text-[color:var(--text)]">{companySettings.name}</div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">{companySettings.shortDescription}</div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Website</div>
                <div className="mt-2 text-[color:var(--text)]">{companySettings.website}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Brand site</div>
                <div className="mt-2 text-[color:var(--text)]">{companySettings.brandWebsite}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Email</div>
                <div className="mt-2 text-[color:var(--text)]">{companySettings.email}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Hotline</div>
                <div className="mt-2 text-[color:var(--text)]">{companySettings.phone}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Năm thành lập</div>
                <div className="mt-2 text-[color:var(--text)]">{companySettings.foundedYear}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Quốc gia</div>
                <div className="mt-2 text-[color:var(--text)]">{companySettings.country}</div>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 text-sm text-[color:var(--muted)]">
              {companySettings.description}
            </div>
          </ThemeCard>
        </div>

        <ThemeCard className="mt-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Rule tính giá</div>
              <h2 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Quản lý phí nhân công và rule giá bán</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Các giá trị dưới đây đang được dùng làm nguồn chuẩn cho combo, tư vấn hoàn vốn và các trang quản trị liên quan.
              </p>
              <p className="mt-3 text-xs text-[color:var(--muted)]">
                Cập nhật gần nhất: <span className="text-[color:var(--text)]">{pricingSettings.updated_at ? new Date(pricingSettings.updated_at).toLocaleString("vi-VN") : "chưa có"}</span>
              </p>
            </div>
            <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Live settings
            </div>
          </div>

          <form action={savePricingSettings} className="mt-6 grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Phí nhân công</div>
                <div className="mt-3 grid gap-4">
                  <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                    On-grid
                    <input
                      name="labor_ongrid_per_kwp"
                      type="number"
                      min={0}
                      step={1}
                      defaultValue={pricingSettings.labor_ongrid_per_kwp}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none"
                      inputMode="numeric"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                    Hybrid
                    <input
                      name="labor_hybrid_per_kwp"
                      type="number"
                      min={0}
                      step={1}
                      defaultValue={pricingSettings.labor_hybrid_per_kwp}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none"
                      inputMode="numeric"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Rule giá bán</div>
                <div className="mt-3 grid gap-4">
                  <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                    Margin gộp mục tiêu
                    <input
                      name="target_gross_margin_pct"
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      defaultValue={pricingSettings.target_gross_margin_pct}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none"
                      inputMode="numeric"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                    Công thức
                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)]">
                      Giá bán = Giá vốn ÷ (1 - margin)
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Rule hoàn vốn</div>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                    PSH mặc định
                    <input
                      name="default_psh_hours"
                      type="number"
                      min={0}
                      step={0.1}
                      defaultValue={pricingSettings.default_psh_hours}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none"
                      inputMode="numeric"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                    PR mặc định
                    <input
                      name="default_pr"
                      type="number"
                      min={0}
                      step={0.01}
                      defaultValue={pricingSettings.default_pr}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none"
                      inputMode="decimal"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                    Tự dùng
                    <input
                      name="self_use_ratio"
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      defaultValue={pricingSettings.self_use_ratio}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none"
                      inputMode="decimal"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                    Giá điện
                    <input
                      name="electricity_price_vnd_per_kwh"
                      type="number"
                      min={0}
                      step={1}
                      defaultValue={pricingSettings.electricity_price_vnd_per_kwh}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none"
                      inputMode="numeric"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                    Giá mua điện dư
                    <input
                      name="feed_in_tariff_vnd_per_kwh"
                      type="number"
                      min={0}
                      step={1}
                      defaultValue={pricingSettings.feed_in_tariff_vnd_per_kwh}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none"
                      inputMode="numeric"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Tóm tắt hiện tại</div>
                <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
                  <div className="flex items-center justify-between gap-4">
                    <span>On-grid</span>
                    <span className="text-[color:var(--text)]">{formatVnd(pricingSettings.labor_ongrid_per_kwp)} đ/kWp</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Hybrid</span>
                    <span className="text-[color:var(--text)]">{formatVnd(pricingSettings.labor_hybrid_per_kwp)} đ/kWp</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Margin mục tiêu</span>
                    <span className="text-[color:var(--text)]">{formatPct(pricingSettings.target_gross_margin_pct)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>PSH / PR</span>
                    <span className="text-[color:var(--text)]">
                      {pricingSettings.default_psh_hours} / {pricingSettings.default_pr}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Tự dùng / giá điện</span>
                    <span className="text-[color:var(--text)]">
                      {pricingSettings.self_use_ratio} / {formatVnd(pricingSettings.electricity_price_vnd_per_kwh)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="w-fit rounded-2xl bg-cyan-400 px-5 py-3 font-medium text-slate-950">
                Lưu rule tính giá
              </button>
              <button
                type="submit"
                formAction={resetPricingSettings}
                className="w-fit rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-5 py-3 font-medium text-[color:var(--text)]"
              >
                Khôi phục mặc định
              </button>
            </div>
          </form>
        </ThemeCard>
      </main>
    </AdminShell>
  );
}
