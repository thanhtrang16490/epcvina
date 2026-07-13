import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com";
const SOURCE_ROOT = path.join(ROOT, "epcvinasolar");
const PROJECTS_DIR = path.join(SOURCE_ROOT, "src/content/projects");

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

function parseCustomer(raw) {
  const match = raw.match(/^customer:\s*(.*)$/m);
  if (!match) return "";
  return match[1].trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}

async function main() {
  const projectFiles = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
  const customerNames = new Set();
  const projectRecords = [];

  for (const file of projectFiles) {
    if (!file.isFile() || !/\.(md|mdx)$/i.test(file.name)) continue;
    const filePath = path.join(PROJECTS_DIR, file.name);
    const raw = await fs.readFile(filePath, "utf8");
    const customer = parseCustomer(raw);
    const slug = path.basename(file.name, path.extname(file.name));
    if (customer) customerNames.add(customer);
    projectRecords.push({ slug, customer });
  }

  const existingCustomers = (await supabase.from("customers").select("id, name, slug")).data ?? [];
  const bySlug = new Map(existingCustomers.map((row) => [String(row.slug), row]));
  const byName = new Map(existingCustomers.map((row) => [String(row.name), row]));

  for (const name of customerNames) {
    const slug = slugify(name);
    if (bySlug.has(slug) || byName.has(name)) continue;
    const insert = await supabase.from("customers").insert({
      slug,
      name,
      sort_order: 0,
      is_active: true,
    }).select("id, name, slug").single();
    if (insert.error) throw insert.error;
    bySlug.set(slug, insert.data);
    byName.set(name, insert.data);
  }

  const projects = (await supabase.from("projects").select("id, slug, name, customer_id")).data ?? [];
  const projectBySlug = new Map(projects.map((row) => [String(row.slug), row]));
  let updated = 0;

  for (const record of projectRecords) {
    const project = projectBySlug.get(record.slug);
    if (!project || !record.customer) continue;
    const customer = byName.get(record.customer) || bySlug.get(slugify(record.customer));
    if (!customer) continue;
    if (String(project.customer_id ?? "") === String(customer.id)) continue;
    const { error } = await supabase.from("projects").update({ customer_id: customer.id }).eq("id", project.id);
    if (error) throw error;
    updated += 1;
  }

  console.log(`Done. Customers ensured: ${customerNames.size}, projects relinked: ${updated}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
