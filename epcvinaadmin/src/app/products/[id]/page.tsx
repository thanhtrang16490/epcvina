import { AdminShell } from "@/components/AdminShell";
import { TechnicalSpecsView } from "@/components/TechnicalSpecs";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { getCachedBrands, getCachedProductCategories } from "@/lib/reference-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeProduct } from "@/lib/supabase/normalize";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

type ProductViewData = ReturnType<typeof normalizeProduct>;

const currency = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

function formatVND(amount: number) {
  return `${currency.format(amount)} đ`;
}

function groupLabel(category: string) {
  const value = category.toLowerCase();
  if (value.includes("panel")) return "Panel";
  if (value.includes("inverter")) return "Inverter";
  if (value.includes("battery") || value.includes("pin")) return "Battery";
  return "Mounting";
}

function getProductCover(product: ProductViewData & { cover_image_url?: string; image_urls?: string[] }) {
  return product.cover_image_url || product.image_urls?.[0] || "";
}

function getProductGallery(product: ProductViewData & { cover_image_url?: string; image_urls?: string[] }) {
  const cover = getProductCover(product);
  return Array.from(new Set([cover, ...(product.image_urls ?? [])].filter(Boolean)));
}

export default async function ProductShowPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const data = supabase
    ? normalizeProduct(
        (await supabase
          .from("products")
          .select("id, slug, name, category_id, category, brand_id, brand, unit, quantity, cost_price, sale_price_vat, warranty, description, technical_specs, cover_image_url, image_urls, status, is_active, sort_order")
          .eq("id", id)
          .single()).data ?? {},
      )
    : null;
  if (!data) notFound();
  const product = data as ProductViewData;
  const [brands, categories] = supabase ? await Promise.all([getCachedBrands(), getCachedProductCategories()]) : [[], []];
  const brandName = product.brand_id ? brands.find((item: any) => String(item.id) === String(product.brand_id))?.name ?? product.brand : product.brand;
  const categoryName = product.category_id ? categories.find((item: any) => String(item.id) === String(product.category_id))?.name ?? product.category : product.category;

  return (
    <AdminShell>
      <main className="mx-auto max-w-5xl px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between gap-3">
          <SectionTitle eyebrow="Chi tiết sản phẩm" title={product.name} description={product.description || "Thông tin sản phẩm."} />
          <ThemeLinkButton href="/admin/products" tone="secondary">
            Back
          </ThemeLinkButton>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ThemeCard tone="hero" className="p-6">
            {getProductCover(product as typeof product & { cover_image_url?: string; image_urls?: string[] }) ? (
              <img
                src={getProductCover(product as typeof product & { cover_image_url?: string; image_urls?: string[] })}
                alt={product.name}
                className="mb-5 h-56 w-full rounded-3xl object-cover"
              />
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {groupLabel(String(categoryName ?? product.category ?? ""))}
              </span>
              <span className="text-xs uppercase tracking-[0.24em] text-cyan-100">{brandName || "-"}</span>
            </div>

            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">{product.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{categoryName || "-"} · {product.unit} · SL {product.quantity}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá vốn</div>
                <div className="mt-2 text-2xl font-semibold text-white">{formatVND(Number(product.cost_price ?? 0))}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá bán VAT</div>
                <div className="mt-2 text-2xl font-semibold text-white">{formatVND(Number(product.sale_price_vat ?? 0))}</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Thông số kỹ thuật</div>
              <div className="mt-3">
                <TechnicalSpecsView value={(product as typeof product & { technical_specs?: unknown }).technical_specs} />
              </div>
            </div>
            {getProductGallery(product as typeof product & { cover_image_url?: string; image_urls?: string[] }).length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {getProductGallery(product as typeof product & { cover_image_url?: string; image_urls?: string[] }).slice(0, 4).map((url) => (
                  <img key={url} src={url} alt={product.name} className="h-32 w-full rounded-2xl object-cover" />
                ))}
              </div>
            )}
          </ThemeCard>

          <ThemeCard className="space-y-4 p-6">
            <div className="text-sm text-slate-400">Thông tin nhanh</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-slate-400">Slug</span>
                <span className="text-white">{product.slug}</span>
              </div>
              <div className="flex justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-slate-400">Bảo hành</span>
                <span className="text-white">{product.warranty || "-"}</span>
              </div>
                <div className="flex justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-slate-400">Nhóm</span>
                  <span className="text-white">{groupLabel(String(categoryName ?? product.category ?? ""))}</span>
                </div>
            </div>
          </ThemeCard>
        </section>

        <ThemeCard className="mt-6 p-6 text-sm text-[color:var(--muted)]">
          <SectionTitle eyebrow="Mô tả" title="Chi tiết thêm" description="Dùng làm trang xem nhanh cho admin và public." />
          <p className="mt-4 leading-7">{product.description || "Chưa có mô tả chi tiết."}</p>
        </ThemeCard>
      </main>
    </AdminShell>
  );
}
