import { revalidatePath } from "next/cache";
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ConnectFacebookPageButton } from "@/components/ConnectFacebookPageButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchFacebookPagePosts } from "@/lib/facebook-oauth";

export const dynamic = "force-dynamic";

async function saveBrandProfile(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("content_brand_profiles").upsert({
    id: 1,
    brand_name: String(formData.get("brand_name") ?? "").trim() || "EPCVINA Solar",
    positioning: String(formData.get("positioning") ?? "").trim() || "Gốc thầu MEP 15 năm",
    primary_website: String(formData.get("primary_website") ?? "").trim() || "https://epcvina.com",
    notes: String(formData.get("notes") ?? "").trim() || null,
    core_products: String(formData.get("core_products") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    core_cta: String(formData.get("core_cta") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    tone: String(formData.get("tone") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/settings");
}

async function saveContentSettings(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("content_settings").upsert({
    id: 1,
    ai_provider: String(formData.get("ai_provider") ?? "openai").trim() || "openai",
    api_key: String(formData.get("api_key") ?? "").trim() || null,
    model_name: String(formData.get("model_name") ?? "").trim() || "gpt-5.6",
    publish_webhook_url: String(formData.get("publish_webhook_url") ?? "").trim() || null,
    publish_webhook_secret: String(formData.get("publish_webhook_secret") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/settings");
}

async function saveFacebookPage(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "").trim() || undefined;
  const pageName = String(formData.get("page_name") ?? "").trim();
  const pageId = String(formData.get("page_id") ?? "").trim();
  if (!pageName || !pageId) return;
  await supabase.from("content_facebook_pages").upsert({
    id,
    page_name: pageName,
    page_id: pageId,
    access_token: String(formData.get("access_token") ?? "").trim(),
    graph_version: String(formData.get("graph_version") ?? "v23.0").trim() || "v23.0",
    is_default: String(formData.get("is_default") ?? "") === "on",
    is_active: String(formData.get("is_active") ?? "") !== "off",
    notes: String(formData.get("notes") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "page_id" });
  revalidatePath("/admin/content/settings");
}

async function saveFacebookPageMember(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const pageId = String(formData.get("page_id") ?? "").trim();
  const userId = String(formData.get("user_id") ?? "").trim();
  const role = String(formData.get("role") ?? "editor").trim();
  if (!pageId || !userId) return;
  await supabase.from("content_facebook_page_members").upsert({
    page_id: pageId,
    user_id: userId,
    role,
    updated_at: new Date().toISOString(),
  }, { onConflict: "page_id,user_id" });
  revalidatePath("/admin/content/settings");
}

async function deleteFacebookPageMember(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await supabase.from("content_facebook_page_members").delete().eq("id", id);
  revalidatePath("/admin/content/settings");
}

async function deleteFacebookPage(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await supabase.from("content_facebook_pages").delete().eq("id", id);
  revalidatePath("/admin/content/settings");
}

async function importFacebookPagePosts(formData: FormData) {
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
    .map((item, index) => {
      const title = item.story || item.message?.split("\n")[0] || `Facebook post ${index + 1}`;
      const slugBase = `${page.page_name}-${String(item.id).replace(/[^a-zA-Z0-9]+/g, "-")}`.toLowerCase();
      return {
        content_id: `FB-${String(item.id).replace(/[^a-zA-Z0-9]+/g, "").slice(-20).toUpperCase()}`,
        slug: slugBase.slice(0, 120),
        title,
        topic: page.page_name,
        category: "facebook-import",
        content_type: "news",
        target_audience: null,
        pain_point: null,
        key_message: null,
        offer: null,
        cta: null,
        keywords: [],
        reference_urls: item.permalink_url ? [item.permalink_url] : [],
        desired_channels: ["facebook", "website"],
        image_type: item.full_picture ? "image" : null,
        publish_strategy: "facebook-import",
        status: "published",
        priority: "normal",
        author: page.page_name,
        excerpt: item.message ? item.message.slice(0, 300) : null,
        body: item.message || item.story || "",
        scheduled_at: null,
        published_at: item.created_time || new Date().toISOString(),
        source_system: "facebook",
        source_external_id: item.id,
        source_url: item.permalink_url || null,
        source_imported_at: new Date().toISOString(),
        is_ai_generated: false,
        ai_model: null,
        ai_prompt: JSON.stringify({ source: "facebook-import", page_id: page.page_id }, null, 2),
        ai_response: {
          imported_from: page.page_name,
          permalink_url: item.permalink_url || null,
        },
        updated_at: new Date().toISOString(),
      };
    });

  if (rows.length > 0) {
    await supabase.from("content_posts").upsert(rows, { onConflict: "content_id" });
  }
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/settings");
}

async function loadBrandProfile() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.from("content_brand_profiles").select("*").eq("id", 1).maybeSingle();
  return data;
}

async function loadContentSettings() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.from("content_settings").select("*").eq("id", 1).maybeSingle();
  return data;
}

async function loadFacebookPages() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("content_facebook_pages")
    .select("*, content_facebook_page_members(id, page_id, user_id, role, updated_at)")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function ContentSettingsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {};
  const [profile, settings, pages] = await Promise.all([loadBrandProfile(), loadContentSettings(), loadFacebookPages()]);
  const fbStatus = typeof params.fb === "string" ? params.fb : "";
  const fbPages = typeof params.pages === "string" ? params.pages : "";

  return (
    <AdminShell>
      <main className="mx-auto max-w-5xl px-4 py-4 md:px-0">
        <SectionTitle eyebrow="Marketing" title="Brand Knowledge" description="Chỉnh nguồn kiến thức chuẩn để AI giữ đúng giọng điệu EPCVINA." />
        {fbStatus ? (
          <ThemeCard className="mt-4 border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <div className="text-sm text-[color:var(--text)]">
              {fbStatus === "connected"
                ? `Kết nối Facebook Page thành công${fbPages ? `, đã import ${fbPages} page.` : "."}`
                : fbStatus === "missing_code"
                  ? "Kết nối chưa hoàn tất: Facebook chưa trả về code."
                  : fbStatus === "bad_state"
                    ? "Kết nối không hợp lệ: state không khớp."
                    : fbStatus === "token_failed"
                      ? "Không đổi được Facebook code sang access token."
                      : fbStatus === "supabase_missing"
                        ? "Thiếu cấu hình Supabase để lưu page."
                        : "Đã có phản hồi từ Facebook connect."}
            </div>
          </ThemeCard>
        ) : null}
        <ThemeCard className="mt-6 p-6">
          <form action={saveBrandProfile} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Brand name<input name="brand_name" defaultValue={profile?.brand_name ?? "EPCVINA Solar"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Primary website<input name="primary_website" defaultValue={profile?.primary_website ?? "https://epcvina.com"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <label className="grid gap-2 text-sm text-[color:var(--muted)]">Positioning<input name="positioning" defaultValue={profile?.positioning ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm text-[color:var(--muted)] md:col-span-1">Core products<textarea name="core_products" rows={8} defaultValue={(profile?.core_products ?? []).join("\n")} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)] md:col-span-1">Core CTA<textarea name="core_cta" rows={8} defaultValue={(profile?.core_cta ?? []).join("\n")} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)] md:col-span-1">Tone<textarea name="tone" rows={8} defaultValue={(profile?.tone ?? []).join("\n")} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <label className="grid gap-2 text-sm text-[color:var(--muted)]">Notes<textarea name="notes" rows={4} defaultValue={profile?.notes ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Lưu brand knowledge</button>
              <Link href="/admin/content" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-5 py-3 text-sm text-[color:var(--text)]">Quay lại hub</Link>
            </div>
          </form>
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">AI settings</div>
          <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">API key và model</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Lưu key để AI Studio và các job tự động có thể gọi provider phù hợp.</p>
          <form action={saveContentSettings} className="mt-5 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">AI provider<input name="ai_provider" defaultValue={settings?.ai_provider ?? "openai"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Model name<input name="model_name" defaultValue={settings?.model_name ?? "gpt-5.6"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <label className="grid gap-2 text-sm text-[color:var(--muted)]">API key<input name="api_key" type="password" defaultValue={settings?.api_key ?? ""} placeholder="sk-..." className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Publish webhook URL<input name="publish_webhook_url" defaultValue={settings?.publish_webhook_url ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Webhook secret<input name="publish_webhook_secret" defaultValue={settings?.publish_webhook_secret ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Lưu AI settings</button>
            </div>
          </form>
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Facebook pages</div>
          <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Quản lý nhiều fanpage</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Mỗi page có token riêng và có thể gán user nào được phép quản lý page đó.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ConnectFacebookPageButton />
            <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--muted)]">
              Bấm để mở Facebook Login và tự import page.
            </div>
          </div>
          <div className="mt-5 grid gap-4">
            {pages.map((page: any) => (
              <div key={page.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{page.page_name}</span>
                  {page.is_default ? <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-700">Default</span> : null}
                  {page.is_active ? null : <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-rose-700">Inactive</span>}
                </div>
                <div className="mt-2 text-sm text-[color:var(--muted)]">{page.page_id} · Graph {page.graph_version}</div>
                {page.notes ? <div className="mt-2 text-sm text-[color:var(--text)]">{page.notes}</div> : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(page.content_facebook_page_members ?? []).map((member: any) => (
                    <span key={member.id} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      {member.user_id.slice(0, 8)} · {member.role}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <form action={deleteFacebookPage}>
                    <input type="hidden" name="id" value={page.id} />
                    <button type="submit" className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-700">Delete page</button>
                  </form>
                  <form action={importFacebookPagePosts} className="flex items-center gap-2">
                    <input type="hidden" name="page_id" value={page.page_id} />
                    <input type="number" name="limit" min={1} max={50} defaultValue={10} className="w-20 rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1.5 text-xs text-[color:var(--text)]" />
                    <button type="submit" className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1.5 text-xs text-[color:var(--text)]">Kéo bài về hub</button>
                  </form>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Members</div>
                    <div className="mt-2 grid gap-2 text-sm text-[color:var(--text)]">
                      {(page.content_facebook_page_members ?? []).length === 0 ? <div className="text-[color:var(--muted)]">Chưa có user nào được gán.</div> : (page.content_facebook_page_members ?? []).map((member: any) => (
                        <div key={member.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2">
                          <span>{member.user_id}</span>
                          <span className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">{member.role}</span>
                          <form action={deleteFacebookPageMember}>
                            <input type="hidden" name="id" value={member.id} />
                            <button type="submit" className="text-xs text-rose-700">Remove</button>
                          </form>
                        </div>
                      ))}
                    </div>
                  </div>
                  <form action={saveFacebookPageMember} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3 grid gap-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Gán quyền user</div>
                    <input type="hidden" name="page_id" value={page.id} />
                    <label className="grid gap-2 text-sm text-[color:var(--muted)]">User ID<input name="user_id" placeholder="UUID từ auth.users" className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-[color:var(--text)]" /></label>
                    <label className="grid gap-2 text-sm text-[color:var(--muted)]">Role<select name="role" defaultValue="editor" className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-[color:var(--text)]"><option value="viewer">viewer</option><option value="editor">editor</option><option value="publisher">publisher</option><option value="manager">manager</option></select></label>
                    <button type="submit" className="justify-self-start rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white">Add member</button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          <form action={saveFacebookPage} className="mt-6 grid gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <div className="text-sm font-medium text-[color:var(--text)]">Thêm / cập nhật page</div>
            <div className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="id" />
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Page name<input name="page_name" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Page ID<input name="page_id" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Access token<input name="access_token" type="password" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Graph version<input name="graph_version" defaultValue="v23.0" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Notes<input name="notes" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-[color:var(--muted)]">
              <label className="flex items-center gap-2"><input type="checkbox" name="is_default" className="h-4 w-4" /> Default page</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked className="h-4 w-4" /> Active</label>
            </div>
            <button type="submit" className="justify-self-start rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Lưu page</button>
          </form>
        </ThemeCard>
      </main>
    </AdminShell>
  );
}
