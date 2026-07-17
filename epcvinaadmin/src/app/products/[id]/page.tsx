import { AdminShell } from "@/components/AdminShell";
import { ModalShell } from "@/components/ModalShell";
import { TechnicalSpecsView } from "@/components/TechnicalSpecs";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCachedBrands, getCachedProductCategories } from "@/lib/reference-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeProduct } from "@/lib/supabase/normalize";
import { parseImageUrls, uploadMediaFiles } from "@/lib/storage-media";
import { slugify } from "@/lib/slug";
import { revalidatePath, revalidateTag } from "next/cache";
import { notFound } from "next/navigation";
import { referenceDataTags } from "@/lib/reference-data";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

type ProductViewData = ReturnType<typeof normalizeProduct>;
type ProductDetailData = ProductViewData & {
  cover_image_url?: string;
  coverImageUrl?: string;
  image_urls?: string[] | string;
  imageUrls?: string[] | string;
  technicalSpecs?: unknown;
};

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

function getPrimarySpecValue(specs: unknown, title: string) {
  if (!specs || typeof specs !== "object") return "";
  const items = Array.isArray(specs) ? specs : Object.entries(specs as Record<string, unknown>).map(([key, value]) => ({ title: key, value }));
  const found = items.find((item) => String((item as { title?: unknown }).title ?? "").toLowerCase().includes(title.toLowerCase()));
  return found ? String((found as { value?: unknown }).value ?? "").trim() : "";
}

function getStringArray(value: string[] | string | undefined) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    return String(value)
      .split(/[\n,]/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function getProductCover(product: ProductDetailData) {
  return product.cover_image_url || product.coverImageUrl || getStringArray(product.image_urls).at(0) || getStringArray(product.imageUrls).at(0) || "/sample-combo.jpg";
}

function getProductGallery(product: ProductDetailData) {
  const cover = getProductCover(product);
  return Array.from(new Set([cover, ...getStringArray(product.image_urls), ...getStringArray(product.imageUrls)].filter(Boolean)));
}

function parseTechnicalSpecs(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function groupTechnicalSpecs(value: unknown) {
  const normalized = Array.isArray(value)
    ? value
        .map((item) => ({
          title: String((item as { title?: unknown }).title ?? "").trim(),
          value: String((item as { value?: unknown }).value ?? "").trim(),
        }))
        .filter((item) => item.title || item.value)
    : typeof value === "object" && value !== null
      ? Object.entries(value as Record<string, unknown>)
          .map(([title, rawValue]) => ({
            title,
            value: Array.isArray(rawValue) || typeof rawValue === "object" ? JSON.stringify(rawValue) : String(rawValue ?? ""),
          }))
          .filter((item) => item.title || item.value)
      : [];

  return normalized.reduce<Record<string, Array<{ title: string; value: string }>>>((acc, spec) => {
    const text = spec.title.toLowerCase();
    const group =
      text.includes("công suất") || text.includes("điện áp") || text.includes("mppt") || text.includes("hiệu suất") || text.includes("dòng")
        ? "Thông số điện"
        : text.includes("kích thước") || text.includes("trọng lượng") || text.includes("cơ khí") || text.includes("kết nối")
          ? "Kích thước & kết nối"
          : text.includes("bảo hành") || text.includes("tiêu chuẩn") || text.includes("cấp bảo vệ") || text.includes("xuất xứ")
            ? "Bảo hành & tiêu chuẩn"
            : text.includes("model") || text.includes("thương hiệu") || text.includes("danh mục") || text.includes("công nghệ") || text.includes("loại cell")
              ? "Thông tin chính"
              : "Khác";
    if (!acc[group]) acc[group] = [];
    acc[group].push(spec);
    return acc;
  }, {});
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
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("status") ?? "inactive") === "active",
  }).eq("id", id);
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidateTag(referenceDataTags.products);
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
  const product = data as ProductDetailData;
  const [brands, categories] = supabase ? await Promise.all([getCachedBrands(), getCachedProductCategories()]) : [[], []];
  const brandName = product.brand_id ? brands.find((item: any) => String(item.id) === String(product.brand_id))?.name ?? product.brand : product.brand;
  const categoryName = product.category_id ? categories.find((item: any) => String(item.id) === String(product.category_id))?.name ?? product.category : product.category;
  const specsValue = product.technical_specs ?? product.technicalSpecs;
  const warrantySpec = getPrimarySpecValue(specsValue, "bảo hành");
  const modelSpec = getPrimarySpecValue(specsValue, "model");
  const sourceSpec = getPrimarySpecValue(specsValue, "nguồn");
  const originSpec = getPrimarySpecValue(specsValue, "xuất xứ");
  const efficiencySpec = getPrimarySpecValue(specsValue, "hiệu suất");
  const voltageSpec = getPrimarySpecValue(specsValue, "điện áp");
  const mpptSpec = getPrimarySpecValue(specsValue, "mppt");
  const currentSpec = getPrimarySpecValue(specsValue, "dòng");
  const groupedSpecs = groupTechnicalSpecs(specsValue);

  return (
    <AdminShell>
      <main className="mx-auto max-w-5xl px-4 py-4 md:px-0">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <SectionTitle eyebrow="Chi tiết sản phẩm" title={product.name} description={product.description || "Thông tin sản phẩm."} />
          <div className="flex flex-wrap gap-2">
            <ModalShell
              trigger={<span className="inline-flex rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white">Sửa nhanh</span>}
              title={`Sửa sản phẩm: ${product.name}`}
              description="Cập nhật nhanh thông tin sản phẩm ngay trên trang chi tiết."
            >
              <form action={updateProduct} encType="multipart/form-data" className="grid gap-3">
                <input type="hidden" name="id" value={product.id} />
                <input name="name" defaultValue={product.name} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input name="category" defaultValue={product.category} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                  <input name="brand" defaultValue={product.brand} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input name="unit" defaultValue={product.unit} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                  <FormattedNumberInput name="quantity" defaultValue={product.quantity} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormattedNumberInput name="sale_price_vat" defaultValue={product.sale_price_vat} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                  <FormattedNumberInput name="cost_price" defaultValue={product.cost_price} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                </div>
                <input name="cover_image_url" defaultValue={product.cover_image_url || product.coverImageUrl || ""} placeholder="Cover image URL" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                <textarea name="image_urls" rows={3} defaultValue={getStringArray(product.image_urls).join("\n") || getStringArray(product.imageUrls).join("\n")} placeholder="Các URL ảnh khác" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                <input name="warranty" defaultValue={product.warranty} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                <select name="status" defaultValue={product.is_active ? "active" : "inactive"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <textarea name="description" defaultValue={product.description} rows={4} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                <textarea name="technical_specs" defaultValue={JSON.stringify(specsValue ?? {}, null, 2)} rows={8} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 font-mono text-xs text-[color:var(--text)] outline-none" />
                <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">Lưu</button>
              </form>
            </ModalShell>
            <ThemeLinkButton href="/admin/products" tone="secondary">
              Back
            </ThemeLinkButton>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <ThemeCard tone="hero" className="overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
              <div className="p-4 md:p-6">
                {getProductCover(product) ? (
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
                    <img src={getProductCover(product)} alt={product.name} className="aspect-square w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 text-sm text-slate-300">
                    Chưa có ảnh
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-5 p-5 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[color:var(--accent)] px-2.5 py-1 text-xs font-bold text-white">{groupLabel(String(categoryName ?? product.category ?? ""))}</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white">{brandName || "-"}</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white">{product.unit || "-"}</span>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Product admin</div>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-5xl">{product.name}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{product.description || "Thông tin sản phẩm công bố nội bộ từ Supabase."}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá vốn</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{formatVND(Number(product.cost_price ?? 0))}</div>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá bán VAT</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{formatVND(Number(product.sale_price_vat ?? 0))}</div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1rem] bg-white/5 px-4 py-3">
                    <div className="text-sm text-slate-400">Mã slug</div>
                    <div className="mt-1 break-all text-sm font-medium text-white">{product.slug}</div>
                  </div>
                  <div className="rounded-[1rem] bg-white/5 px-4 py-3">
                    <div className="text-sm text-slate-400">Đơn vị tính</div>
                    <div className="mt-1 text-sm font-medium text-white">{product.unit || "-"}</div>
                  </div>
                </div>

                {getProductGallery(product).length > 0 && (
                  <div className="pt-1">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Bộ ảnh</div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {getProductGallery(product).slice(0, 6).map((url) => (
                        <div key={url} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                          <img src={url} alt={product.name} className="aspect-square w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ThemeCard>

          <ThemeCard className="space-y-5 p-6">
            <div className="text-sm text-slate-400">Thông tin nhanh</div>
            <div className="grid gap-3 text-sm">
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-slate-400">Ảnh chính</div>
                <div className="mt-1 break-all text-white">{product.cover_image_url || product.coverImageUrl || "-"}</div>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-slate-400">Slug</div>
                <div className="mt-1 break-words text-white">{product.slug}</div>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-slate-400">Bảo hành</div>
                <div className="mt-1 text-white">{product.warranty || "-"}</div>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-slate-400">Nhóm</div>
                <div className="mt-1 text-white">{groupLabel(String(categoryName ?? product.category ?? ""))}</div>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-slate-400">Đơn vị tính</div>
                <div className="mt-1 text-white">{product.unit || "-"}</div>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-slate-400">Danh mục</div>
                <div className="mt-1 text-white">{categoryName || "-"}</div>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-slate-400">Brand</div>
                <div className="mt-1 text-white">{brandName || "-"}</div>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-slate-400">Số ảnh phụ</div>
                <div className="mt-1 text-white">{Math.max(getStringArray(product.image_urls).length, getStringArray(product.imageUrls).length)}</div>
              </div>
            </div>
          </ThemeCard>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <ThemeCard className="p-6 text-sm text-[color:var(--muted)]">
            <SectionTitle eyebrow="Mô tả" title="Chi tiết thêm" description="Dùng làm trang xem nhanh cho admin và public." />
            <div className="mt-4 space-y-4 leading-7">
              <p>{product.description || "Chưa có mô tả chi tiết."}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[color:var(--panel)] px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Nhóm hiển thị</div>
                  <div className="mt-1 text-base font-semibold text-[color:var(--text)]">{groupLabel(String(categoryName ?? product.category ?? ""))}</div>
                </div>
                <div className="rounded-2xl bg-[color:var(--panel)] px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Brand</div>
                  <div className="mt-1 text-base font-semibold text-[color:var(--text)]">{brandName || "-"}</div>
                </div>
                <div className="rounded-2xl bg-[color:var(--panel)] px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Số MPPT</div>
                  <div className="mt-1 text-base font-semibold text-[color:var(--text)]">{mpptSpec || "-"}</div>
                </div>
                <div className="rounded-2xl bg-[color:var(--panel)] px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Điện áp / Dòng</div>
                  <div className="mt-1 text-base font-semibold text-[color:var(--text)]">{[voltageSpec, currentSpec].filter(Boolean).join(" · ") || "-"}</div>
                </div>
                <div className="rounded-2xl bg-[color:var(--panel)] px-4 py-3 sm:col-span-2">
                  <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Hiệu suất</div>
                  <div className="mt-1 text-base font-semibold text-[color:var(--text)]">{efficiencySpec || "-"}</div>
                </div>
              </div>
            </div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Thông số" title="Thông số kỹ thuật" description="Nhóm thông số theo từng cụm như public để dễ đối chiếu." />
            <div className="mt-4 space-y-4">
              {Object.keys(groupedSpecs).length > 0 ? (
                Object.entries(groupedSpecs).map(([group, items]) => (
                  <div key={group} className="overflow-hidden rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
                    <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{group}</div>
                      <div className="text-xs text-[color:var(--muted)]">{items.length} mục</div>
                    </div>
                    <table className="w-full text-left text-sm">
                      <tbody className="divide-y divide-[color:var(--border)]">
                        {items.map((spec, index) => (
                          <tr key={`${spec.title}-${index}`} className="align-top">
                            <th className="w-[42%] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">
                              {spec.title}
                            </th>
                            <td className="px-4 py-3 whitespace-pre-wrap break-words text-[color:var(--text)]">
                              {spec.value || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              ) : (
                <TechnicalSpecsView value={specsValue} />
              )}
            </div>
          </ThemeCard>
        </section>
      </main>
    </AdminShell>
  );
}
