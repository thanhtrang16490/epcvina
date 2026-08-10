import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

function splitLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitComma(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function loadFacebookPages() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("content_facebook_pages")
    .select("id, page_name, page_id, is_default, is_active")
    .eq("is_active", true)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function generateDraft(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const topic = String(formData.get("topic") ?? "").trim();
  const audience = String(formData.get("audience") ?? "").trim();
  const objective = String(formData.get("objective") ?? "").trim();
  const channels = splitComma(formData.get("channels"));
  const tone = String(formData.get("tone") ?? "").trim();
  const cta = String(formData.get("cta") ?? "").trim();
  const reference = splitLines(formData.get("reference"));
  const angle = String(formData.get("angle") ?? "").trim();
  const slug = slugify(topic || objective || "content-draft");
  const title = topic ? `${topic} | EPCVINA` : "Content Draft | EPCVINA";
  const body = [
    `Mục tiêu: ${objective || "Tạo nhận biết và thúc đẩy lead."}`,
    `Audience: ${audience || "Khách hàng tiềm năng EPCVINA"}`,
    `Angle: ${angle || "Giải thích thực tế, dễ hiểu, ít giật tít."}`,
    "",
    "Dàn ý gợi ý:",
    "1. Vấn đề thị trường / bối cảnh.",
    "2. Giải pháp EPCVINA.",
    "3. Lợi ích thực tế và điều cần lưu ý.",
    `4. CTA: ${cta || "Nhận tư vấn"}`,
  ].join("\n");

  const contentId = `AI-${Date.now().toString(36).toUpperCase()}`;
  const insertResult = await supabase.from("content_posts").insert({
    content_id: contentId,
    slug: `${slug}-${Date.now().toString(36).toLowerCase()}`,
    title,
    topic,
    category: String(formData.get("category") ?? "").trim() || null,
    content_type: String(formData.get("content_type") ?? "educational"),
    target_audience: audience || null,
    pain_point: String(formData.get("pain_point") ?? "").trim() || null,
    key_message: String(formData.get("key_message") ?? "").trim() || null,
    offer: String(formData.get("offer") ?? "").trim() || null,
    cta: cta || null,
    keywords: splitComma(formData.get("keywords")),
    reference_urls: reference,
    desired_channels: channels,
    image_type: String(formData.get("image_type") ?? "").trim() || null,
    publish_strategy: String(formData.get("publish_strategy") ?? "").trim() || null,
    status: "ai_generated",
    priority: String(formData.get("priority") ?? "normal"),
    author: String(formData.get("author") ?? "").trim() || null,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    body,
    is_ai_generated: true,
    ai_model: "heuristic-draft-v1",
    ai_prompt: JSON.stringify({ topic, audience, objective, channels, tone, cta, reference, angle }, null, 2),
    ai_response: { title, body, angle, tone },
  }).select("id").single();

  const postId = insertResult.data?.id;
  if (postId && channels.length > 0) {
    await Promise.all(
      channels.map((channel) =>
        supabase.from("content_variants").insert({
          content_post_id: postId,
          channel,
          title,
          hook: topic,
          body: `${body}\n\nKênh: ${channel}`,
          cta: cta || null,
          status: "draft",
          variant_meta: { generated_from: "ai_studio" },
        }),
      ),
    );
  }

  revalidatePath("/admin/content");
  revalidatePath("/admin/content/studio");
}

export default async function ContentStudioPage() {
  const pages = await loadFacebookPages();
  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <SectionTitle eyebrow="Marketing" title="AI Studio" description="Tạo nháp bài viết theo brief, audience, mục tiêu và kênh đăng." />
        <ThemeCard className="mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Facebook</div>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Page mặc định</h3>
            </div>
            <Link href="/admin/content/settings" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Quản lý page</Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {pages.length === 0 ? (
              <div className="rounded-full border border-dashed border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--muted)]">Chưa có fanpage nào.</div>
            ) : pages.map((page: any) => (
              <span key={page.id} className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${page.is_default ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-700" : "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--muted)]"}`}>
                {page.page_name}{page.is_default ? " (default)" : ""}
              </span>
            ))}
          </div>
        </ThemeCard>
        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ThemeCard className="p-6">
            <form action={generateDraft} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">Topic<input name="topic" required className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">Audience<input name="audience" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              </div>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Objective<input name="objective" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">Channels<input name="channels" placeholder="website,facebook,tiktok" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">Tone<input name="tone" placeholder="chuyên gia, thực tế, dễ hiểu" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">CTA<input name="cta" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">Priority<select name="priority" defaultValue="normal" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">{["low","normal","high","urgent"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">Category<input name="category" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">Content type<input name="content_type" defaultValue="educational" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">Pain point<input name="pain_point" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">Key message<input name="key_message" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">Keywords<textarea name="keywords" rows={3} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
                <label className="grid gap-2 text-sm text-[color:var(--muted)]">References<textarea name="reference" rows={3} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              </div>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Angle<textarea name="angle" rows={3} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Excerpt<textarea name="excerpt" rows={3} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Generate draft</button>
                <Link href="/admin/content" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-5 py-3 text-sm text-[color:var(--text)]">Quay lại hub</Link>
              </div>
            </form>
          </ThemeCard>

          <ThemeCard className="p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Output</div>
            <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">AI sẽ tạo gì?</h3>
            <div className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">1. Một `content_post` ở trạng thái `ai_generated`.</div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">2. Nhiều `content_variants` theo từng kênh.</div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">3. Prompt và response được lưu để reviewer kiểm tra.</div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">4. Bài draft sẽ xuất hiện trong Content Hub để sửa tiếp.</div>
            </div>
          </ThemeCard>
        </div>
      </main>
    </AdminShell>
  );
}
