import { slugify } from "@/lib/slug";

export type ProjectLineInput = {
  combo_id?: string;
  product_id?: string;
  quantity: number;
};

function readJsonRows(formData: FormData, name: string) {
  const raw = String(formData.get(name) ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readProjectComboRows(formData: FormData) {
  return readJsonRows(formData, "project_combo_rows") as ProjectLineInput[];
}

export function readProjectProductRows(formData: FormData) {
  return readJsonRows(formData, "project_product_rows") as ProjectLineInput[];
}

export function getProjectSlug(name: string, fallback = "") {
  return slugify(name || fallback);
}
