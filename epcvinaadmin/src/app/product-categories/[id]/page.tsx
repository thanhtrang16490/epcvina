import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCachedProductCategories } from "@/lib/reference-data";

export const dynamic = "force-dynamic";

function isHiddenProductCategory(category: { name?: string; slug?: string }) {
  const name = String(category.name ?? "").toLowerCase();
  const slug = String(category.slug ?? "").toLowerCase();
  return slug === "hidden" || name.includes("hidden");
}

function statusLabel(status?: string, isActive?: boolean) {
  const raw = String(status ?? "").toLowerCase();
  if (raw === "active" || raw === "public" || isActive) return "Active";
  if (raw === "inactive" || raw === "draft" || raw === "archive") return "Inactive";
  return "Draft";
}

function statusChip(status?: string, isActive?: boolean) {
  const raw = String(status ?? "").toLowerCase();
  if (raw === "active" || raw === "public" || isActive) return "border-emerald-400/30 bg-emerald-400/10 text-emerald-700";
  if (raw === "inactive" || raw === "draft" || raw === "archive") return "border-slate-400/30 bg-slate-400/10 text-slate-700";
  return "border-amber-400/30 bg-amber-400/10 text-amber-700";
}

function thumbnailUrl(row: { cover_image_url?: string; image_urls?: string[] }) {
  return row.cover_image_url || row.image_urls?.[0] || "";
}

function normalizeId(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function ProductCategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryId = normalizeId(id);
  const supabase = createSupabaseAdminClient();
  if (!supabase || !categoryId) notFound();

  const [categoryRes, productsRes, parentCategoriesRes] = await Promise.all([
    supabase.from("product_categories").select("id, slug, name, description, image_url, status, is_active, sort_order, parent_id").eq("id", categoryId).maybeSingle(),
    supabase.from("products").select("id, name, slug, brand_id, brand, category_id, category, unit, sale_price_vat, status, is_active, cover_image_url, image_urls, sort_order").order("sort_order", { ascending: true }),
    getCachedProductCategories(),
  ]);

  const category = categoryRes.data;
  if (!category || isHiddenProductCategory(category)) notFound();

  const allCategories = (parentCategoriesRes ?? []).filter((row: any) => !isHiddenProductCategory(row));
  const parentCategory = allCategories.find((row: any) => String(row.id) === String(category.parent_id ?? ""));
  const childCategories = allCategories.filter((row: any) => String(row.parent_id ?? "") === String(category.id));
  const products = (productsRes.data ?? []).filter((product: any) => {
    const productCategoryId = String(product.category_id ?? "");
    const productCategoryName = String(product.category ?? "");
    return productCategoryId === category.id || productCategoryName === category.name || productCategoryName === category.slug;
  });
  const productCount = products.length;
  const childCount = childCategories.length;
  const activeCount = products.filter((product: any) => String(product.status ?? "").toLowerCase() === "active" || product.is_active).length;
  const avgPrice = productCount ? products.reduce((sum: number, product: any) => sum + Number(product.sale_price_vat ?? 0), 0) / productCount : 0;

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-0">
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[radial-gradient(circle_at_top_right,_color-mix(in_srgb,var(--accent)_14%,transparent),_transparent_28%),linear-gradient(135deg,color-mix(in_srgb,var(--panel-strong)_94%,#fff_6%),var(--panel))] p-6 shadow-2xl md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--accent)]/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
                Danh mục sản phẩm
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--text)] md:text-6xl">
                {category.name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
                Thông tin nhóm sản phẩm, các nhóm con và toàn bộ sản phẩm đang thuộc danh mục này.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/product-categories" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">
                Danh mục
              </Link>
              <Link href="/products" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">
                Sản phẩm
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Sản phẩm</div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{productCount}</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Active</div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{activeCount}</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Nhóm con</div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{childCount}</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Giá TB</div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{avgPrice.toLocaleString("vi-VN")} đ</div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
                {category.image_url ? <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Thông tin nhóm</div>
                <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{category.name}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-xs font-medium text-[color:var(--text)]">
                    {category.slug}
                  </span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusChip(category.status, category.is_active)}`}>
                    {statusLabel(category.status, category.is_active)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Sort order</div>
                <div className="mt-2 text-2xl font-semibold text-[color:var(--text)]">{category.sort_order ?? 0}</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Parent</div>
                <div className="mt-2 text-sm font-medium text-[color:var(--text)]">{parentCategory?.name ?? "-"}</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Sản phẩm</div>
                <div className="mt-2 text-2xl font-semibold text-[color:var(--text)]">{products.length}</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Slug</div>
                <div className="mt-2 break-all text-sm font-medium text-[color:var(--text)]">{category.slug}</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Mô tả</div>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[color:var(--text)]">
                {category.description || "Chưa có mô tả."}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Nhóm con</div>
              <div className="mt-3 grid gap-2">
                {childCategories.length ? (
                  childCategories.map((child: any) => (
                    <Link
                      key={child.id}
                      href={`/product-categories/${child.id}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 transition hover:bg-white/10"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-[color:var(--text)]">{child.name}</div>
                        <div className="mt-1 text-xs text-[color:var(--muted)]">{child.slug}</div>
                      </div>
                      <span className="text-xs text-[color:var(--muted)]">Mở</span>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[color:var(--border)] px-4 py-3 text-sm text-[color:var(--muted)]">
                    Chưa có nhóm con.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Sản phẩm trong nhóm</div>
                <h2 className="mt-2 text-2xl font-semibold text-[color:var(--text)]">Danh sách sản phẩm</h2>
              </div>
              <div className="text-sm text-[color:var(--muted)]">{products.length} sản phẩm</div>
            </div>

            <div className="mt-5 grid gap-3">
              {products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 transition hover:bg-white/10 sm:grid-cols-[72px_1fr_auto] sm:items-center"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)]">
                    {thumbnailUrl(product) ? <img src={thumbnailUrl(product)} alt={product.name} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium text-[color:var(--text)]">{product.name}</div>
                    <div className="mt-1 text-sm text-[color:var(--muted)]">
                      {product.brand || "-"} · {product.unit || "-"} · {product.category || category.name}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        {product.slug}
                      </span>
                      <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        {product.category_id || "no category_id"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusChip(product.status, product.is_active)}`}>
                      {statusLabel(product.status, product.is_active)}
                    </span>
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] font-medium text-[color:var(--text)]">
                      {Number(product.sale_price_vat ?? 0).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </Link>
              ))}

              {!products.length ? (
                <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 text-sm text-[color:var(--muted)]">
                  Chưa có sản phẩm nào trong nhóm này.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
