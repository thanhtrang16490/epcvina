import { PublicShell } from "@/components/PublicShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const supabase = createSupabaseAdminClient();

  const [productsResult, combosResult] = supabase
    ? await Promise.all([
        supabase.from("products").select("id, slug, name, category, brand, unit, sale_price_vat, description, cover_image_url, image_urls, is_active, sort_order").order("sort_order", { ascending: true }),
        supabase.from("combos").select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, combo_type, source_kind, combo_category_id, cover_image_url, image_urls").order("sort_order", { ascending: true }),
      ])
    : [{ data: [] }, { data: [] }];

  const allProducts = (productsResult.data ?? []).map(normalizeProduct);
  const allCombos = (combosResult.data ?? []).map(normalizeCombo);
  const products = allProducts.slice(0, 8);
  const combos = allCombos.slice(0, 6);
  const publicProductsTotal = allProducts.filter((product) => product.status !== "inactive").length;
  const publicCombosTotal = allCombos.filter((combo) => combo.status !== "inactive").length;
  const publicVisibleTotal = publicProductsTotal + publicCombosTotal;

  return (
    <PublicShell>
      <div className="space-y-8">
        <ThemeCard tone="hero" className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100">
                <span>▣</span>
                EPCVINA Public
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">
                Giải pháp điện mặt trời cho nhà ở và doanh nghiệp
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Xem catalog công khai theo phong cách EPCVINA Solar, với combo, sản phẩm và các điểm vào tư vấn rõ ràng.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ThemeLinkButton href="/combos/public" tone="primary">
                  Xem combo
                </ThemeLinkButton>
                <ThemeLinkButton href="/products/public" tone="secondary">
                  Xem sản phẩm
                </ThemeLinkButton>
                <ThemeLinkButton href="/system-advisor" tone="ghost">
                  Tư vấn hệ thống
                </ThemeLinkButton>
              </div>
            </div>
            <div className="grid gap-4 p-6 md:p-10 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <ThemeCard className="p-4">
                <div className="text-sm text-[color:var(--muted)]">Combo public</div>
                <div className="mt-1 text-3xl font-semibold text-[color:var(--text)]">{publicCombosTotal}</div>
              </ThemeCard>
              <ThemeCard className="p-4">
                <div className="text-sm text-[color:var(--muted)]">Sản phẩm public</div>
                <div className="mt-1 text-3xl font-semibold text-[color:var(--text)]">{publicProductsTotal}</div>
              </ThemeCard>
              <ThemeCard className="p-4">
                <div className="text-sm text-[color:var(--muted)]">Tổng hiển thị</div>
                <div className="mt-1 text-3xl font-semibold text-[color:var(--text)]">{publicVisibleTotal}</div>
              </ThemeCard>
            </div>
          </div>
        </ThemeCard>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Điểm vào nhanh" title="Đi tới ngay" description="Các trang public cần xem nhanh nhất." />
            <div className="mt-5 grid gap-3">
              <ThemeLinkButton href="/products/public" tone="secondary" className="w-full justify-start rounded-2xl">
                Catalog sản phẩm
              </ThemeLinkButton>
              <ThemeLinkButton href="/combos/public" tone="secondary" className="w-full justify-start rounded-2xl">
                Catalog combo
              </ThemeLinkButton>
              <ThemeLinkButton href="/system-advisor" tone="secondary" className="w-full justify-start rounded-2xl">
                System advisor
              </ThemeLinkButton>
            </div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Catalog" title="Sản phẩm nổi bật" description="Dữ liệu đang đọc trực tiếp từ Supabase." />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {products.map((product) => (
                <ThemeCard key={product.id} className="p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent)]">{product.brand || "EPCVINA"}</div>
                  <div className="mt-2 text-base font-semibold text-[color:var(--text)]">{product.name}</div>
                  <div className="mt-1 text-xs text-[color:var(--muted)]">{product.category || "-"}</div>
                </ThemeCard>
              ))}
            </div>
          </ThemeCard>
        </section>
      </div>
    </PublicShell>
  );
}
