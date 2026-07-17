import { PublicShell } from "@/components/PublicShell";
import { ProductCatalogClient } from "@/components/ProductCatalogClient";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeProduct } from "@/lib/supabase/normalize";

export const dynamic = "force-dynamic";

async function loadPublicProducts(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  if (!supabase) return [];

  const publicClient = createSupabaseAdminClient() ?? supabase;

  const fallback = (await publicClient
    .from("products")
    .select("id, slug, name, category_id, category, brand_id, brand, unit, sale_price_vat, description, cover_image_url, image_urls, is_active, sort_order")
    .order("sort_order", { ascending: true })).data ?? [];
  return fallback.map(normalizeProduct);
}

export default async function PublicProductsPage() {
  const supabase = await createSupabaseServerClient();
  const products = await loadPublicProducts(supabase);
  const sourceLabel = createSupabaseAdminClient() ? "Supabase admin" : "Supabase";

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Public view</div>
            <h1 className="mt-1 text-2xl font-semibold text-[color:var(--text)] md:text-3xl">Catalog sản phẩm public</h1>
            <p className="mt-1 max-w-2xl text-sm text-[color:var(--muted)]">
              Danh sách public theo style bán hàng, chỉ hiển thị dữ liệu đã công bố từ Supabase.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ThemeLinkButton href="/combos/public" tone="secondary">
              Combo public
            </ThemeLinkButton>
            <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--muted)]">
              Nguồn: {supabase ? sourceLabel : "Empty"}
            </span>
          </div>
        </div>

        <section>
          <ProductCatalogClient products={products} />
        </section>
      </div>
    </PublicShell>
  );
}
