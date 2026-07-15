import { PublicShell } from "@/components/PublicShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ProductCatalogClient } from "@/components/ProductCatalogClient";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeProduct } from "@/lib/supabase/normalize";

export const dynamic = "force-dynamic";

async function loadPublicProducts(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  if (!supabase) return [];

  const query = supabase
    .from("products")
    .select("id, slug, name, category_id, category, brand_id, brand, unit, sale_price_vat, description, cover_image_url, image_urls, status, is_active, sort_order")
    .or("status.eq.active,is_active.eq.true")
    .order("sort_order", { ascending: true });
  const primary = (await query).data ?? [];
  if (primary.length > 0) return primary.map(normalizeProduct);

  const fallback = (await supabase
    .from("products")
    .select("id, slug, name, category_id, category, brand_id, brand, unit, sale_price_vat, description, cover_image_url, image_urls, status, is_active, sort_order")
    .order("sort_order", { ascending: true })).data ?? [];
  return fallback.map(normalizeProduct);
}

export default async function PublicProductsPage() {
  const supabase = await createSupabaseServerClient();
  const products = await loadPublicProducts(supabase);

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SectionTitle
            eyebrow="Public view"
            title="Catalog sản phẩm public"
            description="Danh sách public theo style bán hàng, chỉ hiển thị dữ liệu đã công bố từ Supabase."
          />
          <div className="flex gap-2">
            <ThemeLinkButton href="/combos/public" tone="secondary">
              Combo public
            </ThemeLinkButton>
          </div>
        </div>

        <ThemeCard tone="hero" className="p-6 md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100">
                <span>▣</span>
                EPCVINA Product Card
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">Sản phẩm công bố công khai</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Bộ catalog public chỉ hiển thị thông tin đã chọn lọc từ Supabase, phù hợp cho người xem nhanh và dẫn sang combo có liên quan.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ThemeLinkButton href="/combos/public" tone="secondary">
                  Xem combo public
                </ThemeLinkButton>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  Nguồn: {supabase ? "Supabase" : "Empty"}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-slate-400">Tổng sản phẩm</div>
                <div className="mt-1 text-3xl font-semibold text-white">{products.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-slate-400">Nhóm catalog</div>
                <div className="mt-1 text-3xl font-semibold text-white">{new Set(products.map((product) => product.category)).size}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-slate-400">Chuẩn public</div>
                <div className="mt-1 text-3xl font-semibold text-white">Card</div>
              </div>
            </div>
          </div>
        </ThemeCard>

        <section className="mt-8">
          <ProductCatalogClient products={products} />
        </section>
      </div>
    </PublicShell>
  );
}
