import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { Client } from "pg";
import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type SourceProduct = {
  slug: string;
  main_image: string;
};

const EPCVINA_SOLAR_ROOT = "/Users/thanhtrang/Documents/epcvina.com/epcvinasolar";
const PRODUCTS_DIR = resolve(EPCVINA_SOLAR_ROOT, "src/content/products");

function toHandle(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseScalar(value: string) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("Missing frontmatter block.");

  const lines = match[1].split("\n");
  const data: Record<string, any> = {};
  let currentKey: string | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const listMatch = line.match(/^(\s*)-\s+(.*)$/);
    if (listMatch && currentKey) {
      const value = listMatch[2];
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(parseScalar(value));
      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyValueMatch) continue;

    const [, key, rawValue] = keyValueMatch;
    currentKey = key;

    if (rawValue === "") {
      data[key] = "";
      continue;
    }

    data[key] = parseScalar(rawValue);
  }

  return data;
}

function collectMarkdownFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function loadSourceProducts(): Promise<SourceProduct[]> {
  return collectMarkdownFiles(PRODUCTS_DIR)
    .map((filePath) => {
      const source = readFileSync(filePath, "utf8");
      const frontmatter = parseFrontmatter(source);
      const slugSource = filePath.replace(PRODUCTS_DIR, "").replace(/\.(md|mdx)$/, "");
      return {
        slug: toHandle(slugSource) || toHandle(String(frontmatter.name ?? "")),
        main_image: String(frontmatter.main_image ?? ""),
      };
    })
    .filter((product) => product.slug && product.main_image);
}

export default async function backfillEpcvinaProductImages({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  const localProducts = await loadSourceProducts();
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  let updatedCount = 0;

  try {
    logger.info(`Backfilling thumbnails for ${localProducts.length} source products...`);

    for (const product of localProducts) {
      const result = await client.query(
        `update product
         set thumbnail = $1,
             updated_at = now()
         where handle = $2
           and (thumbnail is distinct from $1 or thumbnail is null)
         returning id`,
        [product.main_image, product.slug]
      );

      updatedCount += result.rowCount ?? 0;
    }

    logger.info(`Backfill completed. Updated ${updatedCount} products.`);
  } finally {
    await client.end();
  }
}
