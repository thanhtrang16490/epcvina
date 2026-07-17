import { PublicShell } from "@/components/PublicShell";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeProduct } from "@/lib/supabase/normalize";

export const dynamic = "force-dynamic";

export default async function DebugProductsImagesPage() {
  const supabase = await createSupabaseServerClient();
  const publicClient = createSupabaseAdminClient() ?? supabase;
  const products = publicClient
    ? ((await publicClient
        .from("products")
        .select("id, slug, name, category, brand, unit, cover_image_url, image_urls, is_active, sort_order")
        .order("sort_order", { ascending: true })).data ?? []).map(normalizeProduct)
    : [];

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-4">
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Debug public</div>
          <h1 className="mt-1 text-2xl font-semibold text-[color:var(--text)]">Kiểm tra ảnh sản phẩm</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Hiển thị trực tiếp `cover_image_url`, `image_urls[0]` và ảnh render để đối chiếu nhanh với Supabase.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const imageUrl = product.cover_image_url || product.image_urls?.[0] || "";
            return (
              <ThemeCard key={product.id} className="space-y-3 p-4">
                <div className="aspect-square overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[color:var(--muted)]">No image</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[color:var(--text)]">{product.name}</div>
                  <div className="mt-1 text-xs text-[color:var(--muted)]">{product.category} · {product.brand}</div>
                </div>
                <div className="space-y-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3 text-xs text-[color:var(--muted)]">
                  <div className="break-all">
                    <span className="font-semibold text-[color:var(--text)]">cover_image_url: </span>
                    {product.cover_image_url || "-"}
                  </div>
                  <div className="break-all">
                    <span className="font-semibold text-[color:var(--text)]">image_urls[0]: </span>
                    {product.image_urls?.[0] || "-"}
                  </div>
                </div>
              </ThemeCard>
            );
          })}
          {!products.length ? <ThemeCard className="p-6 text-sm text-[color:var(--muted)]">Chưa có dữ liệu.</ThemeCard> : null}
        </div>
      </div>
    </PublicShell>
  );
}
