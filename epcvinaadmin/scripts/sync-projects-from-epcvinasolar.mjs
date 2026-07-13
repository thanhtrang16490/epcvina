import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com";
const SOURCE_ROOT = path.join(ROOT, "epcvinasolar");
const PROJECTS_DIR = path.join(SOURCE_ROOT, "src/content/projects");
const SOURCE_PUBLIC_DIR = path.join(SOURCE_ROOT, "public");
const BUCKET_NAME = "catalog-media";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });

function slugify(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed === "[]") return [];
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
  return trimmed;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  const lines = match[1].split("\n");
  let currentKey = null;
  for (const line of lines) {
    if (!line.trim()) continue;
    if (/^\s*-\s+/.test(line) && currentKey && Array.isArray(data[currentKey])) {
      data[currentKey].push(parseValue(line.replace(/^\s*-\s+/, "")));
      continue;
    }
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const rest = line.slice(idx + 1).trim();
    if (rest === "") {
      data[key] = [];
      currentKey = key;
    } else {
      data[key] = parseValue(rest);
      currentKey = key;
    }
  }
  return data;
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}

async function ensureBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;
  const exists = (buckets ?? []).some((bucket) => bucket.name === BUCKET_NAME);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, { public: true, fileSizeLimit: 20 * 1024 * 1024 });
    if (error) throw error;
  }
}

async function uploadProjectImage(relativeImagePath, projectSlug, projectName, index = 1) {
  const sourceFilePath = path.join(SOURCE_PUBLIC_DIR, relativeImagePath.replace(/^\//, ""));
  const fileBuffer = await fs.readFile(sourceFilePath);
  const ext = path.extname(sourceFilePath) || ".png";
  const base = path.basename(sourceFilePath, ext);
  const storagePath = `projects/${slugify(projectName || "project")}/${slugify(projectSlug || base)}/${String(index).padStart(2, "0")}-${slugify(base) || "image"}${ext}`;
  const { error } = await supabase.storage.from(BUCKET_NAME).upload(storagePath, fileBuffer, {
    upsert: true,
    contentType: contentTypeFor(sourceFilePath),
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath).data.publicUrl;
}

async function main() {
  await ensureBucket();
  const { data: projectRows, error: projectError } = await supabase.from("projects").select("id, slug, name");
  if (projectError) throw projectError;
  const { data: customerRows, error: customerError } = await supabase.from("customers").select("id, name, slug");
  if (customerError) throw customerError;

  const customersByName = new Map((customerRows ?? []).map((row) => [String(row.name), row]));
  const customersBySlug = new Map((customerRows ?? []).map((row) => [String(row.slug), row]));
  const projectsBySlug = new Map((projectRows ?? []).map((row) => [String(row.slug), row]));

  const files = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    if (!file.isFile() || !/\.(md|mdx)$/i.test(file.name)) continue;
    const filePath = path.join(PROJECTS_DIR, file.name);
    const raw = await fs.readFile(filePath, "utf8");
    const fm = parseFrontmatter(raw);
    const slug = path.basename(file.name, path.extname(file.name));
    const name = String(fm.title ?? fm.name ?? slug);
    const customerName = String(fm.customer ?? "").trim();
    const customer = customersByName.get(customerName) || customersBySlug.get(slugify(customerName));
    const image = String(fm.image ?? "").trim();
    const gallery = Array.isArray(fm.gallery) ? fm.gallery.map(String).filter(Boolean) : [];
    const uploaded = [];

    if (image && image.startsWith("/")) {
      try {
        uploaded.push(await uploadProjectImage(image, slug, name, 1));
      } catch (error) {
        if (error?.code !== "ENOENT") throw error;
      }
    } else if (image) {
      uploaded.push(image);
    }

    for (const [idx, item] of gallery.entries()) {
      if (!item) continue;
      if (item.startsWith("/")) {
        try {
          uploaded.push(await uploadProjectImage(item, slug, name, idx + 2));
        } catch (error) {
          if (error?.code !== "ENOENT") throw error;
        }
      } else {
        uploaded.push(item);
      }
    }

    const payload = {
      slug,
      customer_id: customer?.id ?? null,
      name,
      code: String(fm.capacity ?? "").trim() || null,
      address: String(fm.location ?? "").trim() || null,
      capacity: String(fm.capacity ?? "").trim() || null,
      system_type: String(fm.system_type ?? "").trim() || null,
      completion_date: String(fm.completion_date ?? "").trim() || null,
      image_url: uploaded[0] ?? null,
      gallery_urls: uploaded,
      description: String(fm.description ?? "").trim() || null,
      source_url: null,
      status: "public",
      note: [String(fm.equipment ?? "").trim(), String(fm.special_notes ?? "").trim()].filter(Boolean).join("\n\n") || null,
      is_active: true,
    };

    const existing = projectsBySlug.get(slug);
    if (existing) {
      const { error } = await supabase.from("projects").update(payload).eq("id", existing.id);
      if (error) throw error;
      updated += 1;
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) throw error;
      created += 1;
    }
  }

  console.log(`Done. Created ${created}, updated ${updated}, skipped ${skipped}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
