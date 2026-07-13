import { slugify } from "@/lib/slug";

export const MEDIA_BUCKET = "catalog-media";

function extensionFor(file: File) {
  const name = file.name.toLowerCase();
  const ext = name.includes(".") ? name.split(".").pop() : "";
  if (ext && ext.length <= 5) return `.${ext}`;
  const type = file.type.toLowerCase();
  if (type.includes("png")) return ".png";
  if (type.includes("webp")) return ".webp";
  if (type.includes("gif")) return ".gif";
  if (type.includes("jpeg") || type.includes("jpg")) return ".jpg";
  return ".bin";
}

export function buildMediaPath(scope: "products" | "combos" | "brands" | "categories", category: string, title: string, file: File, index: number) {
  const safeCategory = slugify(category || "uncategorized");
  const safeTitle = slugify(title || "item");
  const safeFile = slugify(file.name.replace(/\.[^.]+$/, "")) || `image-${index + 1}`;
  return `${scope}/${safeCategory}/${safeTitle}/${String(index + 1).padStart(2, "0")}-${safeFile}${extensionFor(file)}`;
}

export function buildOrderPdfPath(orderNo: string, orderId: string) {
  const safeOrderNo = slugify(orderNo || "order");
  const safeOrderId = slugify(orderId || "unknown");
  return `orders/${safeOrderNo}/${safeOrderId}/order-detail.pdf`;
}

export async function uploadMediaFiles(
  supabase: {
    storage: {
      from: (bucket: string) => {
        upload: (path: string, file: File, options?: { upsert?: boolean; contentType?: string }) => Promise<{ data: { path: string } | null; error: unknown }>;
        getPublicUrl: (path: string) => { data: { publicUrl: string } };
      };
    };
  },
  scope: "products" | "combos" | "brands" | "categories",
  category: string,
  title: string,
  files: File[],
) {
  const bucket = supabase.storage.from(MEDIA_BUCKET);
  const urls: string[] = [];
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    if (!file || file.size === 0) continue;
    const path = buildMediaPath(scope, category, title, file, index);
    const { error } = await bucket.upload(path, file, { upsert: true, contentType: file.type || "application/octet-stream" });
    if (error) throw error;
    urls.push(bucket.getPublicUrl(path).data.publicUrl);
  }
  return urls;
}

export function parseImageUrls(value: FormDataEntryValue | null) {
  const raw = String(value ?? "")
    .split(/[\n,]/g)
    .map((item) => item.trim())
    .filter(Boolean);
  return Array.from(new Set(raw));
}
