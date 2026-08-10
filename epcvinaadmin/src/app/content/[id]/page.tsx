import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { buildFacebookCaption, publishFacebookPagePost } from "@/lib/facebook-publisher";
import { suggestContentEdits } from "@/lib/content-ai";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

async function loadContentPost(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const [{ data: post }, { data: variants }] = await Promise.all([
    supabase.from("content_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("content_variants").select("*").eq("content_post_id", id).order("created_at", { ascending: true }),
  ]);
  if (!post) return null;
  return { post, variants: variants ?? [] };
}

async function loadContentSettings() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.from("content_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? null;
}

async function loadFacebookPages() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("content_facebook_pages")
    .select("id, page_name, page_id, access_token, graph_version, is_default, is_active")
    .eq("is_active", true)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getCurrentUserId() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

async function saveContentPost(id: string, formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  await supabase.from("content_posts").update({
    title,
    slug,
    topic: String(formData.get("topic") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    content_type: String(formData.get("content_type") ?? "educational"),
    target_audience: String(formData.get("target_audience") ?? "").trim() || null,
    pain_point: String(formData.get("pain_point") ?? "").trim() || null,
    key_message: String(formData.get("key_message") ?? "").trim() || null,
    offer: String(formData.get("offer") ?? "").trim() || null,
    cta: String(formData.get("cta") ?? "").trim() || null,
    keywords: String(formData.get("keywords") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    reference_urls: String(formData.get("reference_urls") ?? "").split("\n").map((item) => item.trim()).filter(Boolean),
    desired_channels: String(formData.get("desired_channels") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    image_type: String(formData.get("image_type") ?? "").trim() || null,
    publish_strategy: String(formData.get("publish_strategy") ?? "").trim() || null,
    status: String(formData.get("status") ?? "draft"),
    priority: String(formData.get("priority") ?? "normal"),
    author: String(formData.get("author") ?? "").trim() || null,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    body: String(formData.get("body") ?? "").trim() || null,
    scheduled_at: String(formData.get("scheduled_at") ?? "").trim() || null,
    published_at: String(formData.get("published_at") ?? "").trim() || null,
    utm_source: String(formData.get("utm_source") ?? "").trim() || null,
    utm_medium: String(formData.get("utm_medium") ?? "").trim() || null,
    utm_campaign: String(formData.get("utm_campaign") ?? "").trim() || null,
    utm_content: String(formData.get("utm_content") ?? "").trim() || null,
    is_ai_generated: String(formData.get("is_ai_generated") ?? "") === "on",
    ai_model: String(formData.get("ai_model") ?? "").trim() || null,
    ai_prompt: String(formData.get("ai_prompt") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${id}`);
}

async function addVariant(id: string, formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("content_variants").insert({
    content_post_id: id,
    channel: String(formData.get("channel") ?? "website").trim(),
    title: String(formData.get("variant_title") ?? "").trim() || null,
    hook: String(formData.get("hook") ?? "").trim() || null,
    body: String(formData.get("variant_body") ?? "").trim() || null,
    cta: String(formData.get("variant_cta") ?? "").trim() || null,
    status: String(formData.get("variant_status") ?? "draft"),
    scheduled_at: String(formData.get("variant_scheduled_at") ?? "").trim() || null,
  });
  revalidatePath(`/admin/content/${id}`);
}

async function publishFacebookTest(id: string, formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const [{ data: post }, { data: settings }, { data: pages }, userId] = await Promise.all([
    supabase.from("content_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("content_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("content_facebook_pages").select("id, page_name, page_id, access_token, graph_version, is_default, is_active").eq("is_active", true),
    getCurrentUserId(),
  ]);
  if (!post) return;

  const previewMode = String(formData.get("preview_mode") ?? "off") === "on";
  const selectedPageId = String(formData.get("facebook_page_id") ?? "").trim();
  const selectedPage = (pages ?? []).find((item) => item.page_id === selectedPageId) ?? (pages ?? []).find((item) => item.is_default) ?? null;
  if (!selectedPage) return;
  const isAdmin = userId
    ? Boolean((await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle()).data)
    : false;
  const isMember = userId
    ? Boolean((await supabase.from("content_facebook_page_members").select("id, role").eq("page_id", selectedPage.id).eq("user_id", userId).maybeSingle()).data)
    : false;
  if (!isAdmin && !isMember) return;
  const message =
    String(formData.get("message") ?? "").trim() ||
    buildFacebookCaption(post);
  const memberRow = isMember
    ? await supabase.from("content_facebook_page_members").select("role").eq("page_id", selectedPage.id).eq("user_id", userId as string).maybeSingle()
    : null;

  const result = await publishFacebookPagePost({
    pageId: String(selectedPage.page_id),
    pageAccessToken: String(selectedPage.access_token),
    graphVersion: String(selectedPage.graph_version ?? settings?.facebook_graph_version ?? "v23.0"),
    message,
    link: previewMode ? null : `https://epcvina.com/blog/${post.slug}`,
    published: !previewMode,
  });

  await supabase.from("content_variants").insert({
    content_post_id: id,
    channel: "facebook",
    title: post.title,
    hook: message.slice(0, 160),
    body: message,
    status: result.ok ? "published" : "failed",
    published_at: result.ok ? new Date().toISOString() : null,
    variant_meta: {
      preview_mode: previewMode,
      facebook_status: result.status,
      facebook_response: result.payload,
    },
  });
  await supabase.from("content_facebook_publish_logs").insert({
    content_post_id: id,
    page_id: selectedPage.id,
    publisher_id: userId,
    publisher_role: memberRow?.data?.role ?? (isAdmin ? "manager" : "editor"),
    status: result.ok ? "published" : "failed",
    message,
    external_post_id: result.ok ? String((result.payload as Record<string, unknown>)?.id ?? "") : null,
    response_payload: result.payload,
    published_at: result.ok ? new Date().toISOString() : null,
  });

  await supabase
    .from("content_posts")
    .update({
      status: result.ok ? "published" : "failed",
      published_at: result.ok ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath(`/admin/content/${id}`);
  revalidatePath("/admin/content");
}

async function createFacebookVariantFromPost(id: string, formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const { data: post } = await supabase.from("content_posts").select("*").eq("id", id).maybeSingle();
  if (!post) return;
  const tone = String(formData.get("tone") ?? "professional") as "professional" | "concise" | "sales";
  const caption = buildFacebookCaption({ ...post, tone });
  await supabase.from("content_variants").insert({
    content_post_id: id,
    channel: "facebook",
    title: `${post.title} - Facebook`,
    hook: caption.slice(0, 160),
    body: caption,
    cta: post.cta || null,
    status: "draft",
    variant_meta: {
      source: "content-detail",
      tone,
    },
  });
  revalidatePath(`/admin/content/${id}`);
}

async function runAiReview(id: string) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const [{ data: post }, { data: settings }, { data: brand }] = await Promise.all([
    supabase.from("content_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("content_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("content_brand_profiles").select("*").eq("id", 1).maybeSingle(),
  ]);
  if (!post) return;

  const suggestion = await suggestContentEdits(
    {
      title: String(post.title ?? ""),
      topic: String(post.topic ?? ""),
      category: String(post.category ?? ""),
      contentType: String(post.content_type ?? ""),
      excerpt: String(post.excerpt ?? ""),
      body: String(post.body ?? ""),
      cta: String(post.cta ?? ""),
      brand,
    },
    { apiKey: settings?.api_key, modelName: settings?.model_name, provider: settings?.ai_provider },
  );

  await supabase
    .from("content_posts")
    .update({
      status: "review",
      ai_response: suggestion,
      ai_model: settings?.model_name ?? "gpt-5.6",
      ai_prompt: JSON.stringify({ title: post.title, body: post.body, brand }, null, 2),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath(`/admin/content/${id}`);
  revalidatePath("/admin/content/review");
}

async function applyAiSuggestion(id: string) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const { data: post } = await supabase.from("content_posts").select("ai_response").eq("id", id).maybeSingle();
  const suggestion = (post?.ai_response && typeof post.ai_response === "object" && !Array.isArray(post.ai_response) ? post.ai_response : {}) as Record<string, unknown>;
  const update: Record<string, unknown> = { status: "review", updated_at: new Date().toISOString() };
  if (typeof suggestion.suggested_title === "string") update.title = suggestion.suggested_title;
  if (typeof suggestion.suggested_excerpt === "string") update.excerpt = suggestion.suggested_excerpt;
  if (typeof suggestion.suggested_body === "string") update.body = suggestion.suggested_body;
  if (typeof suggestion.suggested_cta === "string") update.cta = suggestion.suggested_cta;
  await supabase.from("content_posts").update(update).eq("id", id);
  revalidatePath(`/admin/content/${id}`);
}

async function deleteContentPost(id: string) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("content_posts").delete().eq("id", id);
  revalidatePath("/admin/content");
}

export default async function ContentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await loadContentPost(id);
  const settings = await loadContentSettings();
  const pages = await loadFacebookPages();
  if (!data) notFound();

  const { post, variants } = data;
  const facebookSample = buildFacebookCaption(post);

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <SectionTitle eyebrow="Marketing" title={post.title} description="Sửa bài viết, metadata UTM và channel variants tại một chỗ." />
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/content" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Quay lại hub</Link>
          <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm text-[color:var(--muted)]">{post.content_id}</div>
          <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm text-[color:var(--muted)]">{post.status}</div>
          {post.source_system === "facebook" ? (
            <div className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-700">Imported from Facebook</div>
          ) : null}
          <form action={deleteContentPost.bind(null, post.id)}>
            <button type="submit" className="rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm text-rose-700">Xoá bài</button>
          </form>
          <form action={runAiReview.bind(null, post.id)}>
            <button type="submit" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">AI review</button>
          </form>
          <form action={applyAiSuggestion.bind(null, post.id)}>
            <button type="submit" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Apply AI suggestion</button>
          </form>
        </div>

        <ThemeCard className="mt-6 p-6">
          <form action={saveContentPost.bind(null, post.id)} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Title<input name="title" defaultValue={post.title} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Slug<input name="slug" defaultValue={post.slug} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Topic<input name="topic" defaultValue={post.topic ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Category<input name="category" defaultValue={post.category ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Content type<input name="content_type" defaultValue={post.content_type} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Status<select name="status" defaultValue={post.status} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">{["draft","ai_generated","review","approved","scheduled","published","failed","archived"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Priority<select name="priority" defaultValue={post.priority} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">{["low","normal","high","urgent"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Scheduled at<input name="scheduled_at" defaultValue={post.scheduled_at ? post.scheduled_at.slice(0,16) : ""} type="datetime-local" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Desired channels<input name="desired_channels" defaultValue={(post.desired_channels ?? []).join(",")} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">UTM campaign<input name="utm_campaign" defaultValue={post.utm_campaign ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <label className="grid gap-2 text-sm text-[color:var(--muted)]">Brief / body<textarea name="body" rows={8} defaultValue={post.body ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Lưu thay đổi</button>
            </div>
          </form>
          {post.source_system === "facebook" && post.source_url ? (
            <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 text-sm text-[color:var(--muted)]">
              Nguồn gốc: <a href={post.source_url} target="_blank" rel="noreferrer" className="text-[color:var(--text)] underline">mở bài gốc trên Facebook</a>
            </div>
          ) : null}
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Variants</div>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Channel versions</h3>
            </div>
          </div>
          <div className="mt-4 grid gap-4">
            {variants.length === 0 ? <div className="text-sm text-[color:var(--muted)]">Chưa có variant nào.</div> : variants.map((variant) => (
              <div key={variant.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{variant.channel}</span>
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{variant.status}</span>
                </div>
                <div className="mt-2 text-sm font-medium text-[color:var(--text)]">{variant.title ?? "No title"}</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">{variant.hook ?? "No hook"}</div>
              </div>
            ))}
          </div>
          <form action={addVariant.bind(null, post.id)} className="mt-5 grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Channel<input name="channel" placeholder="facebook" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Variant title<input name="variant_title" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Variant status<select name="variant_status" defaultValue="draft" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">{["draft","review","approved","scheduled","published","failed","archived"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Hook<textarea name="hook" rows={3} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Variant body<textarea name="variant_body" rows={3} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <button type="submit" className="justify-self-start rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-5 py-3 text-sm text-[color:var(--text)]">Thêm variant</button>
          </form>
          <form action={createFacebookVariantFromPost.bind(null, post.id)} className="mt-5 flex flex-wrap items-end gap-3">
            <label className="grid gap-2 text-sm text-[color:var(--muted)]">
              Tone Facebook
              <select name="tone" defaultValue="professional" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
                <option value="professional">professional</option>
                <option value="concise">concise</option>
                <option value="sales">sales</option>
              </select>
            </label>
            <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Tạo Facebook variant từ bài</button>
          </form>
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Facebook test</div>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Mẫu bài viết và đăng thử</h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Bấm nút test để đăng lên Facebook Page đã cấu hình trong Settings. Nếu bạn để trống nội dung, hệ thống sẽ dùng mẫu chuẩn EPCVINA.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Mẫu bài viết</div>
              <pre className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[color:var(--text)]">{facebookSample}</pre>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <form action={publishFacebookTest.bind(null, post.id)} className="grid gap-4">
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                  Chọn fanpage
                  <select name="facebook_page_id" defaultValue={pages.find((item) => item.is_default)?.page_id ?? pages[0]?.page_id ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)]">
                    {pages.length === 0 ? <option value="">Chưa có fanpage</option> : null}
                    {pages.map((page) => (
                      <option key={page.id} value={page.page_id}>{page.page_name}{page.is_default ? " (default)" : ""}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                  Nội dung đăng test
                  <textarea name="message" rows={10} defaultValue={facebookSample} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)]" />
                </label>
                <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                  <input type="checkbox" name="preview_mode" className="h-4 w-4" />
                  Preview mode đăng nháp không public
                </label>
                <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">
                  Test đăng Facebook
                </button>
              </form>
            </div>
          </div>
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Repost</div>
          <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Đẩy bài sang fanpage khác</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Dùng cho bài import hoặc bài đã biên tập xong. Chọn page đích rồi post lại ngay từ hub.</p>
          <form action={publishFacebookTest.bind(null, post.id)} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <label className="grid gap-2 text-sm text-[color:var(--muted)]">
              Fanpage đích
              <select name="facebook_page_id" defaultValue={pages.find((item) => item.is_default)?.page_id ?? pages[0]?.page_id ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
                {pages.length === 0 ? <option value="">Chưa có fanpage</option> : null}
                {pages.map((page) => (
                  <option key={page.id} value={page.page_id}>{page.page_name}{page.is_default ? " (default)" : ""}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-[color:var(--muted)]">
              Nội dung repost
              <textarea name="message" rows={6} defaultValue={facebookSample} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            </label>
            <div className="flex items-end">
              <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Đẩy sang page</button>
            </div>
          </form>
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">AI Review</div>
          <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Đề xuất chỉnh sửa</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Kết quả review được lưu trong `ai_response` để bạn có thể apply hoặc sửa tay.</p>
          <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-[color:var(--text)]">{JSON.stringify(post.ai_response ?? {}, null, 2)}</pre>
          </div>
          <div className="mt-4 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            AI model: {post.ai_model || settings?.model_name || "gpt-5.6"}
          </div>
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Facebook logs</div>
          <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Lịch sử đăng bài</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Theo dõi ai đã đăng bài lên page nào, kèm response từ Facebook.</p>
          <div className="mt-4 grid gap-3">
            {/* logs can be added here later from a dedicated query */}
          </div>
        </ThemeCard>
      </main>
    </AdminShell>
  );
}
