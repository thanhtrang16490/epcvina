import { PublicShell } from "@/components/PublicShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { TechnicalSpecsView } from "@/components/TechnicalSpecs";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeProduct } from "@/lib/supabase/normalize";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

type ProductData = ReturnType<typeof normalizeProduct>;

function getProductCover(product: ProductData & { cover_image_url?: string; image_urls?: string[] }) {
  return product.cover_image_url || product.image_urls?.[0] || "/sample-combo.jpg";
}

function getCategoryLabel(category: string) {
  const value = category.toLowerCase();
  if (value.includes("panel")) return "Panel";
  if (value.includes("inverter")) return "Inverter";
  if (value.includes("battery") || value.includes("pin")) return "Battery";
  return "Mounting";
}

export default async function PublicProductDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const publicClient = createSupabaseAdminClient() ?? supabase;
  const productRecord = publicClient
    ? ((await publicClient
        .from("products")
        .select("id, slug, name, category_id, category, brand_id, brand, unit, sale_price_vat, warranty, description, technical_specs, cover_image_url, image_urls, is_active, sort_order")
        .eq("id", id)
        .maybeSingle()).data ??
        (await publicClient
          .from("products")
          .select("id, slug, name, category_id, category, brand_id, brand, unit, sale_price_vat, warranty, description, technical_specs, cover_image_url, image_urls, is_active, sort_order")
          .eq("id", id)
          .maybeSingle()).data ??
        null)
    : null;
  const productData = productRecord ? normalizeProduct(productRecord) : null;
  if (!productData) notFound();
  const product = productData as ProductData;

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <ThemeCard tone="hero" className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
            <div className="p-4 md:p-6">
              <img
                src={getProductCover(product as typeof product & { cover_image_url?: string; image_urls?: string[] })}
                alt={product.name}
                className="aspect-square w-full rounded-[1.5rem] object-cover"
              />
            </div>
            <div className="flex flex-col gap-5 p-5 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[color:var(--accent)] px-2.5 py-1 text-xs font-bold text-white">{getCategoryLabel(product.category)}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white">{product.brand}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white">{product.unit}</span>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Product public</div>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-5xl">{product.name}</h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{product.description || "Thông tin sản phẩm công bố công khai từ Supabase."}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá bán</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(Number(product.sale_price_vat ?? 0))} đ</div>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Bảo hành</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{product.warranty || "-"}</div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1rem] bg-white/5 px-4 py-3">
                  <div className="text-sm text-slate-400">Mã slug</div>
                  <div className="mt-1 break-all text-sm font-medium text-white">{product.slug}</div>
                </div>
                <div className="rounded-[1rem] bg-white/5 px-4 py-3">
                  <div className="text-sm text-slate-400">Đơn vị tính</div>
                  <div className="mt-1 text-sm font-medium text-white">{product.unit}</div>
                </div>
              </div>
            </div>
          </div>
        </ThemeCard>

        <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Thông tin nhanh" title="Giá và thương hiệu" description="Khối nhanh để người xem nắm ngay dữ liệu chính của sản phẩm." />
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[color:var(--bg-elevated)] px-4 py-3">
                <span className="text-sm text-[color:var(--muted)]">Nhóm</span>
                <span className="text-sm font-medium text-[color:var(--text)]">{product.category}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[color:var(--bg-elevated)] px-4 py-3">
                <span className="text-sm text-[color:var(--muted)]">Brand</span>
                <span className="text-sm font-medium text-[color:var(--text)]">{product.brand}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[color:var(--bg-elevated)] px-4 py-3">
                <span className="text-sm text-[color:var(--muted)]">Giá bán</span>
                <span className="text-sm font-medium text-[color:var(--text)]">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(Number(product.sale_price_vat ?? 0))} đ</span>
              </div>
            </div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Technical specs" title="Thông số kỹ thuật" description="Hiển thị kỹ thuật theo nhóm, phù hợp để đối chiếu khi dựng combo." />
            <div className="mt-4">
              <TechnicalSpecsView value={(product as typeof product & { technical_specs?: unknown }).technical_specs} />
            </div>
          </ThemeCard>
        </section>
      </div>
    </PublicShell>
  );
}
