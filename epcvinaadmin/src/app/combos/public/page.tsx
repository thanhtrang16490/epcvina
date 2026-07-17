import { PublicShell } from "@/components/PublicShell";
import { PublicComboCatalog } from "@/components/PublicComboCatalog";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { getPricingSettings } from "@/lib/pricing-settings";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeCombo } from "@/lib/supabase/normalize";

export const dynamic = "force-dynamic";

export default async function PublicCombosPage() {
  const supabase = await createSupabaseServerClient();
  const publicClient = createSupabaseAdminClient() ?? supabase;
  const pricingSettings = await getPricingSettings(publicClient ?? supabase);
  const combos = publicClient
    ? ((await publicClient
        .from("combos")
        .select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id, cover_image_url, image_urls")
        .eq("status", "public")
        .order("sort_order", { ascending: true })).data ?? []).map(normalizeCombo)
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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Public view</div>
            <h1 className="mt-1 text-2xl font-semibold text-[color:var(--text)] md:text-3xl">Combo card public</h1>
            <p className="mt-1 max-w-2xl text-sm text-[color:var(--muted)]">
              Bố cục public để xem nhanh combo theo kiểu catalog, đồng bộ với trang sản phẩm public.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ThemeLinkButton href="/products/public" tone="secondary">
              Product public
            </ThemeLinkButton>
            <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--muted)]">
              Nguồn: {supabase ? "Supabase" : "Empty"}
            </span>
          </div>
        </div>

        <div className="mt-2">
          <PublicComboCatalog combos={normalizedCombos} pricingSettings={pricingSettings} />
        </div>
      </div>
    </PublicShell>
  );
}
