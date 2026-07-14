import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";

type SupabaseClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

export async function upsertProjectWithDependencies(formData: FormData, projectId?: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const name = String(formData.get("name") ?? "").trim();
  const projectPayload = {
    slug: String(formData.get("slug") ?? "").trim(),
    name,
    customer_id: String(formData.get("customer_id") ?? "").trim() || null,
    code: String(formData.get("code") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: true,
  };
  const result = projectId
    ? await supabase.from("projects").update(projectPayload).eq("id", projectId).select("id").single()
    : await supabase.from("projects").insert(projectPayload).select("id").single();
  return result.data?.id ?? null;
}
