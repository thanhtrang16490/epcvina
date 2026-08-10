import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { fetchFacebookPagePosts } from "@/lib/facebook-oauth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function loadFacebookPages() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("content_facebook_pages")
    .select("id, page_name, page_id, access_token, graph_version, is_default, is_active, content_facebook_page_members(id, user_id, role)")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function importPagePosts(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const pageId = String(formData.get("page_id") ?? "").trim();
  const limit = Math.max(1, Math.min(50, Number(formData.get("limit") ?? 10) || 10));
  if (!pageId) return;
  const { data: page } = await supabase
    .from("content_facebook_pages")
    .select("id, page_name, page_id, access_token, graph_version")
    .eq("page_id", pageId)
    .maybeSingle();
  if (!page?.access_token) return;

  const posts = await fetchFacebookPagePosts(page.page_id, page.access_token, limit);
  const rows = (posts?.data ?? [])
    .filter((item) => item.id)
    .map((item, index) => ({
      content_id: `FB-${String(item.id).replace(/[^a-zA-Z0-9]+/g, "").slice(-20).toUpperCase()}`,
      slug: `${page.page_name}-${String(item.id).replace(/[^a-zA-Z0-9]+/g, "-")}`.toLowerCase().slice(0, 120),
      title: item.story || item.message?.split("\n")[0] || `Facebook post ${index + 1}`,
      topic: page.page_name,
      category: "facebook-import",
      content_type: "news",
      status: "published",
      priority: "normal",
      author: page.page_name,
      excerpt: item.message ? item.message.slice(0, 300) : null,
      body: item.message || item.story || "",
      desired_channels: ["facebook", "website"],
      reference_urls: item.permalink_url ? [item.permalink_url] : [],
      image_type: item.full_picture ? "image" : null,
      content_meta: {
        source_full_picture: item.full_picture || null,
      },
      publish_strategy: "facebook-import",
      published_at: item.created_time || new Date().toISOString(),
      source_system: "facebook",
      source_external_id: item.id,
      source_url: item.permalink_url || null,
      source_imported_at: new Date().toISOString(),
      is_ai_generated: false,
      ai_response: { imported_from: page.page_name, permalink_url: item.permalink_url || null },
      ai_prompt: JSON.stringify({ source: "facebook-import", page_id: page.page_id }, null, 2),
      updated_at: new Date().toISOString(),
    }));

  if (rows.length > 0) {
    await supabase.from("content_posts").upsert(rows, { onConflict: "content_id" });
  }
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/facebook-sync");
}

export default async function FacebookSyncPage() {
  const pages = await loadFacebookPages();

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <SectionTitle eyebrow="Marketing" title="Facebook Sync" description="Kéo bài từ fanpage về Content Hub để quản lý tập trung, sửa tay và tái sử dụng." />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <ThemeCard className="p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Pages</div>
            <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Chọn page để đồng bộ</h3>
            <div className="mt-4 grid gap-4">
              {pages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 text-sm text-[color:var(--muted)]">Chưa có fanpage nào được kết nối.</div>
              ) : pages.map((page: any) => (
                <div key={page.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{page.page_name}</span>
                    {page.is_default ? <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-700">Default</span> : null}
                  </div>
                  <div className="mt-2 text-sm text-[color:var(--muted)]">{page.page_id}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(page.content_facebook_page_members ?? []).map((member: any) => (
                      <span key={member.id} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                        {member.user_id.slice(0, 8)} · {member.role}
                      </span>
                    ))}
                  </div>
                  <form action={importPagePosts} className="mt-4 flex flex-wrap items-end gap-3">
                    <input type="hidden" name="page_id" value={page.page_id} />
                    <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                      Số bài
                      <input type="number" name="limit" min={1} max={50} defaultValue={10} className="w-24 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)]" />
                    </label>
                    <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Kéo bài về hub</button>
                  </form>
                </div>
              ))}
            </div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Flow</div>
            <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Quy trình sync tập trung</h3>
            <ol className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">1. Kết nối page bằng Facebook Login.</li>
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">2. Chọn page và bấm kéo bài về hub.</li>
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">3. Bài import được gắn nhãn Facebook và giữ link nguồn.</li>
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">4. Mở bài import để sửa tay hoặc đẩy sang page khác.</li>
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin/content" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-5 py-3 text-sm text-[color:var(--text)]">Quay lại hub</Link>
              <Link href="/admin/content/settings" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-5 py-3 text-sm text-[color:var(--text)]">Facebook settings</Link>
            </div>
          </ThemeCard>
        </div>
      </main>
    </AdminShell>
  );
}
