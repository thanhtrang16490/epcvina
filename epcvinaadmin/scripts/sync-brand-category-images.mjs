import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });

async function main() {
  const [brandsRes, productCatsRes, comboCatsRes, productsRes, combosRes] = await Promise.all([
    supabase.from("brands").select("id, name, slug, image_url, logo_url"),
    supabase.from("product_categories").select("id, name, slug, image_url"),
    supabase.from("combo_categories").select("id, name, slug, image_url"),
    supabase.from("products").select("id, name, slug, category, brand, cover_image_url, image_urls"),
    supabase.from("combos").select("id, name, slug, combo_group, combo_category_id, cover_image_url, image_urls"),
  ]);

  if (brandsRes.error) throw brandsRes.error;
  if (productCatsRes.error) throw productCatsRes.error;
  if (comboCatsRes.error) throw comboCatsRes.error;
  if (productsRes.error) throw productsRes.error;
  if (combosRes.error) throw combosRes.error;

  const products = productsRes.data ?? [];
  const combos = combosRes.data ?? [];

  const brandSources = new Map();
  for (const product of products) {
    const image = product.cover_image_url || product.image_urls?.[0];
    if (!image) continue;
    const brand = String(product.brand ?? "").trim();
    if (brand && !brandSources.has(brand)) brandSources.set(brand, image);
  }

  const productCategorySources = new Map();
  for (const product of products) {
    const image = product.cover_image_url || product.image_urls?.[0];
    if (!image) continue;
    const category = String(product.category ?? "").trim();
    if (category && !productCategorySources.has(category)) productCategorySources.set(category, image);
  }

  const comboCategorySources = new Map();
  for (const combo of combos) {
    const image = combo.cover_image_url || combo.image_urls?.[0];
    if (!image) continue;
    const key = String(combo.combo_category_id ?? combo.combo_group ?? "").trim();
    if (key && !comboCategorySources.has(key)) comboCategorySources.set(key, image);
  }

  let updatedBrands = 0;
  for (const brand of brandsRes.data ?? []) {
    const image = brandSources.get(String(brand.name ?? "").trim());
    if (!image) continue;
    const nextImage = String(brand.image_url ?? brand.logo_url ?? "");
    if (nextImage === image) continue;
    const { error } = await supabase.from("brands").update({ image_url: image, logo_url: brand.logo_url || image }).eq("id", brand.id);
    if (error) throw error;
    updatedBrands += 1;
  }

  let updatedProductCats = 0;
  for (const category of productCatsRes.data ?? []) {
    const image = productCategorySources.get(String(category.name ?? "").trim());
    if (!image) continue;
    if (String(category.image_url ?? "") === image) continue;
    const { error } = await supabase.from("product_categories").update({ image_url: image }).eq("id", category.id);
    if (error) throw error;
    updatedProductCats += 1;
  }

  let updatedComboCats = 0;
  for (const category of comboCatsRes.data ?? []) {
    const image = comboCategorySources.get(String(category.id ?? "").trim()) || comboCategorySources.get(String(category.slug ?? "").trim());
    if (!image) continue;
    if (String(category.image_url ?? "") === image) continue;
    const { error } = await supabase.from("combo_categories").update({ image_url: image }).eq("id", category.id);
    if (error) throw error;
    updatedComboCats += 1;
  }

  console.log(`Done. Brands: ${updatedBrands}, product categories: ${updatedProductCats}, combo categories: ${updatedComboCats}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
