import { PublicShell } from "@/components/PublicShell";
import { SectionTitle } from "@/components/SectionTitle";
import { PublicComboCatalog } from "@/components/PublicComboCatalog";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { getPricingSettings } from "@/lib/pricing-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeCombo } from "@/lib/supabase/normalize";

export const dynamic = "force-dynamic";

export default async function PublicCombosPage() {
  const supabase = await createSupabaseServerClient();
  const pricingSettings = await getPricingSettings(supabase);
  const combos = supabase
    ? ((await supabase.from("combos").select("*").or("status.eq.active,is_active.eq.true").order("sort_order", { ascending: true })).data ?? []).map(normalizeCombo)
    : [];
  const normalizedCombos = combos.map((combo) => ({
    ...combo,
    name: combo.name
      .replace(/Hy-Brid/gi, "Hybrid")
      .replace(/1pha/gi, "1 pha")
      .replace(/3pha/gi, "3 pha")
      .replace(/\s+/g, " ")
      .trim(),
  }));

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SectionTitle
            eyebrow="Public view"
            title="Combo card theo style EPCVINA Solar"
            description="Bố cục public-style để xem nhanh combo như trang bán hàng."
          />
          <div className="flex gap-2">
            <ThemeLinkButton href="/products/public" tone="secondary">
              Product public
            </ThemeLinkButton>
          </div>
        </div>

        <ThemeCard tone="hero" className="relative overflow-hidden p-6 md:p-10">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-orange-400/20" />
            <div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/4 translate-y-1/4 rounded-full bg-cyan-400/10" />
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100">
              <span className="text-sm">☀</span>
              EPCVINA Combo Card
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              Nguồn: {supabase ? "Supabase" : "Empty"}
            </div>
          </div>

          <div className="relative mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Tổng combo</div>
              <div className="mt-1 text-3xl font-semibold text-white">{normalizedCombos.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Đang active</div>
              <div className="mt-1 text-3xl font-semibold text-white">{normalizedCombos.filter((combo) => combo.is_active).length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Chuẩn public</div>
              <div className="mt-1 text-3xl font-semibold text-white">Card</div>
            </div>
          </div>
        </ThemeCard>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {normalizedCombos.slice(0, 4).map((combo) => (
            <ThemeCard key={combo.id} className="p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{combo.combo_type === "custom" ? "Tuỳ biến" : "Chuẩn"}</div>
              <div className="mt-2 text-base font-semibold text-[color:var(--text)]">{combo.name}</div>
              <div className="mt-1 text-xs text-[color:var(--muted)]">{combo.code}</div>
            </ThemeCard>
          ))}
        </div>

        <div className="mt-8">
          <PublicComboCatalog combos={normalizedCombos} pricingSettings={pricingSettings} />
        </div>
      </div>
    </PublicShell>
  );
}
