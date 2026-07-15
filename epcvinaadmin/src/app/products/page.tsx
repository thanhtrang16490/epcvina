import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { CrudFilterBar } from "@/components/CrudFilterBar";
import { ModalShell } from "@/components/ModalShell";
import { normalizeTechnicalSpecs } from "@/components/TechnicalSpecs";
import { TechnicalSpecsEditor } from "@/components/TechnicalSpecsEditor";
import { SectionTitle } from "@/components/SectionTitle";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeProduct } from "@/lib/supabase/normalize";
import { getCachedBrands, getCachedProductCategories } from "@/lib/reference-data";
import { slugify } from "@/lib/slug";
import { parseImageUrls, uploadMediaFiles } from "@/lib/storage-media";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { referenceDataTags } from "@/lib/reference-data";

export const dynamic = "force-dynamic";

function parseTechnicalSpecs(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return normalizeTechnicalSpecs(parsed);
  } catch {
    return [];
  }
}

function statusChip(status?: string) {
  switch (status) {
    case "active":
    case "public":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-700";
    case "inactive":
    case "archive":
    case "draft":
      return "border-slate-400/30 bg-slate-400/10 text-slate-700";
    default:
      return "border-amber-400/30 bg-amber-400/10 text-amber-700";
  }
}

function thumbnailUrl(row: { cover_image_url?: string; image_urls?: string[] }) {
  return row.cover_image_url || row.image_urls?.[0] || "";
}

function typeChip(product: { category?: string }) {
  const value = String(product.category ?? "").toLowerCase();
  if (value.includes("panel") || value.includes("tấm pin")) return "border-cyan-400/30 bg-cyan-400/10 text-cyan-700";
  if (value.includes("inverter") || value.includes("biến tần")) return "border-violet-400/30 bg-violet-400/10 text-violet-700";
  if (value.includes("pin") || value.includes("battery")) return "border-emerald-400/30 bg-emerald-400/10 text-emerald-700";
  return "border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--text)]";
}

async function createProduct(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const brandId = String(formData.get("brand_id") ?? "").trim() || null;
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const imageUrls = parseImageUrls(formData.get("image_urls"));
  const brandRow = brandId ? (await supabase.from("brands").select("name").eq("id", brandId).single()).data : null;
  const categoryRow = categoryId ? (await supabase.from("product_categories").select("name").eq("id", categoryId).single()).data : null;
  const uploadedUrls = await uploadMediaFiles(
    supabase,
    "products",
    categoryRow?.name ?? String(formData.get("category") ?? "uncategorized"),
    name,
    formData.getAll("images").filter((value): value is File => value instanceof File),
  );
  await supabase.from("products").insert({
    slug: slugify(name),
    name,
    category_id: categoryId,
    category: categoryRow?.name ?? String(formData.get("category") ?? ""),
    brand_id: brandId,
    brand: brandRow?.name ?? String(formData.get("brand") ?? ""),
    unit: String(formData.get("unit") ?? ""),
    quantity: Number(formData.get("quantity") ?? 1),
    sale_price_vat: Number(formData.get("sale_price_vat") ?? 0),
    cost_price: Number(formData.get("cost_price") ?? 0),
    warranty: String(formData.get("warranty") ?? ""),
    description: String(formData.get("description") ?? ""),
    technical_specs: parseTechnicalSpecs(formData.get("technical_specs")),
    cover_image_url: coverImageUrl || uploadedUrls[0] || null,
    image_urls: [...new Set([...imageUrls, ...uploadedUrls])],
    status: String(formData.get("status") ?? "inactive"),
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("status") ?? "inactive") === "active",
  });
  revalidatePath("/products");
  revalidateTag(referenceDataTags.products);
  redirect("/products");
}

async function updateProduct(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "");
  const brandId = String(formData.get("brand_id") ?? "").trim() || null;
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const imageUrls = parseImageUrls(formData.get("image_urls"));
  const brandRow = brandId ? (await supabase.from("brands").select("name").eq("id", brandId).single()).data : null;
  const categoryRow = categoryId ? (await supabase.from("product_categories").select("name").eq("id", categoryId).single()).data : null;
  const uploadedUrls = await uploadMediaFiles(
    supabase,
    "products",
    categoryRow?.name ?? String(formData.get("category") ?? "uncategorized"),
    name,
    formData.getAll("images").filter((value): value is File => value instanceof File),
  );
  await supabase.from("products").update({
    slug: slugify(name),
    name,
    category_id: categoryId,
    category: categoryRow?.name ?? String(formData.get("category") ?? ""),
    brand_id: brandId,
    brand: brandRow?.name ?? String(formData.get("brand") ?? ""),
    unit: String(formData.get("unit") ?? ""),
    quantity: Number(formData.get("quantity") ?? 1),
    sale_price_vat: Number(formData.get("sale_price_vat") ?? 0),
    cost_price: Number(formData.get("cost_price") ?? 0),
    warranty: String(formData.get("warranty") ?? ""),
    description: String(formData.get("description") ?? ""),
    technical_specs: parseTechnicalSpecs(formData.get("technical_specs")),
    cover_image_url: coverImageUrl || uploadedUrls[0] || null,
    image_urls: [...new Set([...imageUrls, ...uploadedUrls])],
    status: String(formData.get("status") ?? "inactive"),
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("status") ?? "inactive") === "active",
  }).eq("id", id);
  revalidatePath("/products");
  revalidateTag(referenceDataTags.products);
  redirect("/products");
}

async function bulkUpdateProductStatus(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const status = String(formData.get("bulk_status") ?? "inactive");
  const ids = formData.getAll("selected_ids").map(String).filter(Boolean);
  if (!ids.length) return;
  await supabase.from("products").update({
    status,
    is_active: status === "active",
  }).in("id", ids);
  revalidatePath("/products");
  revalidateTag(referenceDataTags.products);
  redirect("/products");
}

function normalizeQuery(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function escapeLike(value: string) {
  return value.replace(/[%_]/g, "\\$&").replace(/,/g, " ");
}

export default async function ProductsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const query = normalizeQuery(params.q).toLowerCase();
  const brandFilter = normalizeQuery(params.brand);
  const categoryFilter = normalizeQuery(params.category);
  const statusFilter = normalizeQuery(params.status);
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const searchPattern = escapeLike(query);

  const supabase = createSupabaseAdminClient();
  let productsQuery = supabase
    ? supabase
        .from("products")
        .select("id, slug, name, category_id, category, brand_id, brand, unit, quantity, sale_price_vat, cost_price, warranty, description, technical_specs, cover_image_url, image_urls, status, sort_order, is_active", {
          count: "exact",
        })
        .order("sort_order", { ascending: true })
    : null;
  if (productsQuery) {
    if (brandFilter) productsQuery = productsQuery.eq("brand_id", brandFilter);
    if (categoryFilter) productsQuery = productsQuery.eq("category_id", categoryFilter);
    if (statusFilter) productsQuery = productsQuery.eq("status", statusFilter);
    if (query) productsQuery = productsQuery.or(`name.ilike.%${searchPattern}%,brand.ilike.%${searchPattern}%,category.ilike.%${searchPattern}%,slug.ilike.%${searchPattern}%`);
  }
  const rawProductsRes = productsQuery ? await productsQuery.range(start, end) : { data: [], count: 0 };
  const rawProducts = rawProductsRes.data ?? [];
  const products = rawProducts.map(normalizeProduct);
  const [brands, categories] = supabase ? await Promise.all([getCachedBrands(), getCachedProductCategories()]) : [[], []];

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <CrudFilterBar
          subtitle="Admin / Products"
          title={`Quản lý sản phẩm (${rawProductsRes.count ?? products.length})`}
          searchLabel="Tìm theo tên, brand, danh mục"
          searchValue={query}
          searchSuggestions={products.slice(0, 8).map((product) => ({
            label: product.name,
            href: `/products/${product.id}`,
            meta: [product.brand, product.category].filter(Boolean).join(" · "),
          }))}
          secondaryLinks={[
            { href: "/", label: "Dashboard" },
            { href: "/combos", label: "Combo" },
          ]}
          filters={[
            {
              name: "category",
              label: "Danh mục",
              value: categoryFilter,
              options: categories.map((category: { id: string; name: string }) => ({ label: category.name, value: category.id })),
            },
            {
              name: "brand",
              label: "Brand",
              value: brandFilter,
              options: brands.map((brand: { id: string; name: string }) => ({ label: brand.name, value: brand.id })),
            },
            {
              name: "status",
              label: "Trạng thái",
              value: statusFilter,
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
          ]}
        />
        <div className="mt-4 flex justify-end">
          <ModalShell
            trigger={<span className="inline-flex w-full justify-center rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-white sm:w-auto">Thêm sản phẩm</span>}
            title="Thêm sản phẩm"
            description="Lưu trực tiếp vào Supabase để dùng cho BOM combo."
          >
            <form action={createProduct} encType="multipart/form-data" className="grid gap-3">
              <input name="name" placeholder="Tên sản phẩm" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
              <select name="category_id" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none">
                <option value="">Chọn danh mục</option>
                {categories.map((category: { id: string; name: string }) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select name="brand_id" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none">
                <option value="">Chọn brand</option>
                {brands.map((brand: { id: string; name: string }) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <input name="category" placeholder="Hoặc nhập danh mục mới" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
              <input name="brand" placeholder="Hoặc nhập brand mới" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="unit" placeholder="Unit" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                <FormattedNumberInput name="quantity" defaultValue={1} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormattedNumberInput name="sale_price_vat" placeholder="Giá bán VAT" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                <FormattedNumberInput name="cost_price" placeholder="Giá vốn" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </div>
              <input name="cover_image_url" placeholder="Cover image URL (Supabase public URL)" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
              <textarea name="image_urls" rows={3} placeholder="Các URL ảnh khác, ngăn cách bằng xuống dòng hoặc dấu phẩy" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
              <input name="images" type="file" multiple accept="image/*" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--accent)] file:px-4 file:py-2 file:text-white" />
              <input name="warranty" placeholder="Bảo hành" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
              <select name="status" defaultValue="inactive" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <textarea name="description" placeholder="Mô tả" rows={4} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
              <TechnicalSpecsEditor name="technical_specs" defaultValue={[]} />
              <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">Tạo sản phẩm</button>
            </form>
          </ModalShell>
        </div>

        <section className="mt-6">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
            <SectionTitle eyebrow="Danh sách" title="Bảng sản phẩm" description="Dạng bảng dày dữ liệu để thao tác nhanh như hệ quản trị e-commerce." />
            <form action={bulkUpdateProductStatus} className="mt-4 space-y-3">
              <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3 sm:flex-row sm:flex-wrap sm:items-end">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Bulk status</span>
                  <select name="bulk_status" className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] sm:w-auto">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
                <button type="submit" className="w-full rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-white sm:w-auto">
                  Cập nhật hàng loạt
                </button>
              <div className="text-sm text-[color:var(--muted)]">Chọn các dòng cần đổi trạng thái rồi bấm cập nhật.</div>
              </div>
              <div className="overflow-x-auto rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
                <table className="min-w-[1100px] divide-y divide-[color:var(--border)] text-left text-sm">
                  <thead className="bg-[color:var(--panel-strong)] text-[color:var(--muted)]">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-3">Chọn</th>
                      <th className="whitespace-nowrap px-4 py-3">Sản phẩm</th>
                      <th className="whitespace-nowrap px-4 py-3">Nhóm</th>
                      <th className="whitespace-nowrap px-4 py-3">Brand</th>
                      <th className="whitespace-nowrap px-4 py-3">Kho</th>
                      <th className="whitespace-nowrap px-4 py-3">Trạng thái</th>
                      <th className="whitespace-nowrap px-4 py-3">Giá bán</th>
                      <th className="whitespace-nowrap px-4 py-3">Giá vốn</th>
                      <th className="whitespace-nowrap px-4 py-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--border)]">
                    {products.map((product) => (
                    <tr key={product.id} className="bg-transparent align-top">
                      <td className="whitespace-nowrap px-4 py-4">
                        <input type="checkbox" name="selected_ids" value={product.id} className="h-4 w-4" />
                      </td>
                        <td className="px-4 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            {thumbnailUrl(product as typeof product & { cover_image_url?: string; image_urls?: string[] }) ? (
                              <img
                                src={thumbnailUrl(product as typeof product & { cover_image_url?: string; image_urls?: string[] })}
                                alt={product.name}
                                className="h-12 w-12 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] text-[10px] text-[color:var(--muted)]">No img</div>
                            )}
                            <div className="min-w-0">
                              <div className="truncate font-medium text-[color:var(--text)]">{product.name}</div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
                                <span className="whitespace-nowrap">{product.slug}</span>
                                {product.category_id ? (
                                  <Link
                                    href={`/product-categories/${(product as typeof product & { category_id?: string | null }).category_id}`}
                                    className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[color:var(--text)] transition hover:bg-white/10"
                                  >
                                    {product.category}
                                  </Link>
                                ) : (
                                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[color:var(--text)]">
                                    {product.category}
                                  </span>
                                )}
                                {product.brand_id ? (
                                  <Link
                                    href={`/brands/${(product as typeof product & { brand_id?: string | null }).brand_id}`}
                                    className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[color:var(--text)] transition hover:bg-white/10"
                                  >
                                    {product.brand}
                                  </Link>
                                ) : (
                                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[color:var(--text)]">
                                    {product.brand}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${typeChip(product)}`}>{product.category || "-"}</span>
                        </td>
                        <td className="px-4 py-4 text-[color:var(--text)]">{product.brand || "-"}</td>
                        <td className="px-4 py-4 text-[color:var(--text)]">{product.quantity}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusChip((product as typeof product & { status?: string }).status)}`}>
                            {(product as typeof product & { status?: string }).status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[color:var(--text)]">{Number(product.sale_price_vat ?? 0).toLocaleString("vi-VN")} đ</td>
                        <td className="px-4 py-4 text-[color:var(--text)]">{Number(product.cost_price ?? 0).toLocaleString("vi-VN")} đ</td>
                        <td className="px-4 py-4">
                          <ModalShell
                            trigger={<span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Sửa</span>}
                            title={`Sửa sản phẩm: ${product.name}`}
                            description="Chỉnh sửa trực tiếp ngay trong modal mà không rời danh sách."
                          >
                            <form action={updateProduct} encType="multipart/form-data" className="grid gap-3">
                              <input type="hidden" name="id" value={product.id} />
                              <input name="name" defaultValue={product.name} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                              <select name="category_id" defaultValue={(product as typeof product & { category_id?: string | null }).category_id ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none">
                                <option value="">Chọn danh mục</option>
                                {categories.map((category: { id: string; name: string }) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                              <select name="brand_id" defaultValue={(product as typeof product & { brand_id?: string | null }).brand_id ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none">
                                <option value="">Chọn brand</option>
                                {brands.map((brand: { id: string; name: string }) => (
                                  <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                  </option>
                                ))}
                              </select>
                              <input name="category" defaultValue={product.category} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                              <input name="brand" defaultValue={product.brand} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                              <div className="grid gap-3 sm:grid-cols-2">
                                <input name="unit" defaultValue={product.unit} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                                <FormattedNumberInput name="quantity" defaultValue={product.quantity} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <FormattedNumberInput name="sale_price_vat" defaultValue={product.sale_price_vat} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                                <FormattedNumberInput name="cost_price" defaultValue={product.cost_price} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                              </div>
                              <input name="cover_image_url" defaultValue={(product as typeof product & { cover_image_url?: string }).cover_image_url ?? ""} placeholder="Cover image URL" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                              <textarea name="image_urls" rows={3} defaultValue={((product as typeof product & { image_urls?: string[] }).image_urls ?? []).join("\n")} placeholder="Các URL ảnh khác" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                              <input name="images" type="file" multiple accept="image/*" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--accent)] file:px-4 file:py-2 file:text-white" />
                              <input name="warranty" defaultValue={product.warranty} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                              <select name="status" defaultValue={(product as typeof product & { status?: string }).status ?? "inactive"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                              <textarea name="description" defaultValue={product.description} rows={4} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                              <TechnicalSpecsEditor
                                name="technical_specs"
                                defaultValue={(product as typeof product & { technical_specs?: unknown }).technical_specs}
                              />
                              <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">Lưu</button>
                            </form>
                          </ModalShell>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pt-3 text-sm text-[color:var(--muted)]">Trang {page} / {getPageCount(Number(rawProductsRes.count ?? 0), pageSize)}</div>
            </form>
          </div>

        </section>
      </main>
    </AdminShell>
  );
}
