import { createClient } from "@supabase/supabase-js";

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });

async function normalizeTable(table, keyField = "name") {
  const { data, error } = await supabase.from(table).select("id, name, slug");
  if (error) throw error;
  let changed = 0;
  for (const row of data ?? []) {
    const nextSlug = slugify(row[keyField] || row.name || row.slug);
    if (nextSlug && nextSlug !== row.slug) {
      const { error: updateError } = await supabase.from(table).update({ slug: nextSlug }).eq("id", row.id);
      if (updateError) throw updateError;
      changed += 1;
    }
  }
  return changed;
}

const results = await Promise.all([
  normalizeTable("brands"),
  normalizeTable("product_categories"),
  normalizeTable("combo_categories"),
]);

console.log(JSON.stringify({ brands: results[0], product_categories: results[1], combo_categories: results[2] }, null, 2));
