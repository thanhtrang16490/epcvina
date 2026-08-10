import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

type ContentRow = {
  id: string;
  content_id: string;
  slug: string;
  title: string;
  category: string | null;
  content_type: string;
  status: string;
  priority: string;
  scheduled_at: string | null;
  published_at: string | null;
  desired_channels: string[] | null;
  updated_at: string | null;
  source_system: string | null;
  source_url: string | null;
  source_imported_at: string | null;
};

const samplePosts = [
  {
    content_id: "CNT-SAMPLE-01",
    title: "Hướng dẫn chọn giải pháp điện mặt trời cho nhà phố",
    slug: "huong-dan-chon-giai-phap-dien-mat-troi-cho-nha-pho",
    topic: "Nhà phố",
    category: "guide",
    content_type: "educational",
    target_audience: "Chủ nhà phố",
    pain_point: "Muốn chọn hệ phù hợp nhưng chưa biết bắt đầu từ đâu",
    key_message: "Chọn theo nhu cầu, tải và ngân sách thực tế",
    cta: "Nhận tư vấn",
    excerpt: "Bài viết giải thích cách chọn công suất, inverter và lưu trữ theo nhu cầu thật.",
    body: "Mở bài\nPhần 1\nPhần 2\nKết luận",
    desired_channels: ["website", "facebook"],
    status: "draft",
    priority: "normal",
  },
  {
    content_id: "CNT-SAMPLE-02",
    title: "Case study: Tối ưu chi phí điện cho nhà máy sau khi lắp solar",
    slug: "case-study-toi-uu-chi-phi-dien-cho-nha-may-sau-khi-lap-solar",
    topic: "Nhà máy",
    category: "case-study",
    content_type: "case_study",
    target_audience: "Doanh nghiệp sản xuất",
    pain_point: "Cần giảm hóa đơn điện và có case thực tế tham khảo",
    key_message: "Case thực tế giúp nhìn rõ hiệu quả vận hành",
    cta: "Đăng ký khảo sát",
    excerpt: "Một case study ngắn gọn về cách EPCVINA tối ưu cấu hình theo tải tiêu thụ.",
    body: "Bối cảnh\nGiải pháp\nKết quả\nBài học",
    desired_channels: ["website", "facebook", "linkedin"],
    status: "draft",
    priority: "normal",
  },
  {
    content_id: "CNT-SAMPLE-03",
    title: "FAQ: Những câu hỏi thường gặp khi lắp điện mặt trời",
    slug: "faq-nhung-cau-hoi-thuong-gap-khi-lap-dien-mat-troi",
    topic: "FAQ",
    category: "faq",
    content_type: "faq",
    target_audience: "Khách hàng đang cân nhắc",
    pain_point: "Có nhiều câu hỏi trước khi quyết định",
    key_message: "Trả lời rõ ràng để giảm ma sát ra quyết định",
    cta: "Nhận tư vấn",
    excerpt: "Tổng hợp các câu hỏi phổ biến nhất và trả lời ngắn, rõ, dễ hiểu.",
    body: "Câu hỏi 1\nCâu hỏi 2\nCâu hỏi 3",
    desired_channels: ["website", "facebook"],
    status: "draft",
    priority: "normal",
  },
  {
    content_id: "CNT-SAMPLE-04",
    title: "So sánh on-grid và hybrid: chọn gì cho đúng nhu cầu?",
    slug: "so-sanh-on-grid-va-hybrid-chon-gi-cho-dung-nhu-cau",
    topic: "So sánh",
    category: "comparison",
    content_type: "comparison",
    target_audience: "Khách hàng cần so sánh nhanh",
    pain_point: "Không rõ khác biệt giữa các phương án",
    key_message: "So sánh theo nhu cầu dùng điện, ngân sách và dự phòng",
    cta: "Nhận tư vấn",
    excerpt: "Bài so sánh ngắn gọn, dễ đọc và đi thẳng vào quyết định mua.",
    body: "On-grid\nHybrid\nKhuyến nghị",
    desired_channels: ["website", "facebook"],
    status: "draft",
    priority: "normal",
  },
  {
    content_id: "CNT-SAMPLE-05",
    title: "Tin tức thị trường điện mặt trời: điều cần biết tháng này",
    slug: "tin-tuc-thi-truong-dien-mat-troi-dieu-can-biet-thang-nay",
    topic: "Tin tức",
    category: "news",
    content_type: "news",
    target_audience: "Khách hàng và đối tác",
    pain_point: "Cần cập nhật nhanh xu hướng mới",
    key_message: "Nội dung trung tính, ngắn gọn, có góc nhìn EPCVINA",
    cta: "Xem chi tiết",
    excerpt: "Bài tin tức ngắn để test workflow đăng Facebook và nội dung công khai.",
    body: "Tin chính\nTác động\nKhuyến nghị",
    desired_channels: ["website", "facebook", "zalo"],
    status: "draft",
    priority: "normal",
  },
] as const;

async function createContentPost(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const contentType = String(formData.get("content_type") ?? "educational");
  const desiredChannels = String(formData.get("desired_channels") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  await supabase.from("content_posts").insert({
    content_id: `CNT-${Date.now().toString(36).toUpperCase()}`,
    title,
    slug,
    topic: String(formData.get("topic") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    content_type: contentType,
    target_audience: String(formData.get("target_audience") ?? "").trim() || null,
    pain_point: String(formData.get("pain_point") ?? "").trim() || null,
    key_message: String(formData.get("key_message") ?? "").trim() || null,
    offer: String(formData.get("offer") ?? "").trim() || null,
    cta: String(formData.get("cta") ?? "").trim() || null,
    keywords: String(formData.get("keywords") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    reference_urls: String(formData.get("reference_urls") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    desired_channels: desiredChannels,
    image_type: String(formData.get("image_type") ?? "").trim() || null,
    publish_strategy: String(formData.get("publish_strategy") ?? "").trim() || null,
    status: String(formData.get("status") ?? "draft"),
    priority: String(formData.get("priority") ?? "normal"),
    author: String(formData.get("author") ?? "").trim() || null,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    body: String(formData.get("body") ?? "").trim() || null,
    scheduled_at: String(formData.get("scheduled_at") ?? "").trim() || null,
    utm_source: String(formData.get("utm_source") ?? "").trim() || null,
    utm_medium: String(formData.get("utm_medium") ?? "").trim() || null,
    utm_campaign: String(formData.get("utm_campaign") ?? "").trim() || null,
    utm_content: String(formData.get("utm_content") ?? "").trim() || null,
    is_ai_generated: String(formData.get("is_ai_generated") ?? "") === "on",
    ai_model: String(formData.get("ai_model") ?? "").trim() || null,
    ai_prompt: String(formData.get("ai_prompt") ?? "").trim() || null,
  });
  revalidatePath("/admin/content");
}

async function updateContentStatus(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  if (!id || !status) return;
  await supabase.from("content_posts").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${id}`);
}

async function deleteContentPost(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await supabase.from("content_posts").delete().eq("id", id);
  revalidatePath("/admin/content");
}

async function seedSampleContent() {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const rows = samplePosts.map((item, index) => ({
    ...item,
    category: item.category,
    desired_channels: item.desired_channels as unknown as string[],
    is_ai_generated: false,
    author: "EPCVINA",
    body: `${item.excerpt}\n\n${item.body}`,
  }));
  await supabase.from("content_posts").upsert(rows, { onConflict: "content_id" });
  revalidatePath("/admin/content");
}

async function loadContentRows() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [] as ContentRow[];
  const { data } = await supabase
    .from("content_posts")
    .select("id, content_id, slug, title, category, content_type, status, priority, scheduled_at, published_at, desired_channels, updated_at, source_system, source_url, source_imported_at")
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as ContentRow[];
}

async function loadBrandProfile() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.from("content_brand_profiles").select("*").eq("id", 1).maybeSingle();
  return data ?? null;
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

async function loadContentStats() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { approved: 0, scheduled: 0, published: 0, linkedLeads: 0 };
  const [posts, leads] = await Promise.all([
    supabase.from("content_posts").select("status"),
    supabase.from("crm_leads").select("content_id", { count: "exact" }).not("content_id", "is", null),
  ]);
  const counts = (posts.data ?? []).reduce<Record<string, number>>((acc, row: any) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});
  return {
    approved: counts.approved ?? 0,
    scheduled: counts.scheduled ?? 0,
    published: counts.published ?? 0,
    linkedLeads: leads.count ?? 0,
  };
}

function badgeClass(status: string) {
  switch (status) {
    case "published":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-700";
    case "approved":
      return "border-cyan-400/30 bg-cyan-400/10 text-cyan-700";
    case "scheduled":
      return "border-violet-400/30 bg-violet-400/10 text-violet-700";
    case "review":
      return "border-amber-400/30 bg-amber-400/10 text-amber-700";
    case "failed":
      return "border-rose-400/30 bg-rose-400/10 text-rose-700";
    default:
      return "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--muted)]";
  }
}

export default async function ContentHubPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {};
  const sourceFilter = typeof params.source === "string" ? params.source : "";
  const [rows, brandProfile, stats, pages] = await Promise.all([loadContentRows(), loadBrandProfile(), loadContentStats(), loadFacebookPages()]);
  const visibleRows = sourceFilter === "facebook" ? rows.filter((row) => row.source_system === "facebook") : rows;

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-0">
        <SectionTitle eyebrow="Marketing" title="Content Hub" description="Quản lý bài viết, brief, lịch đăng và trạng thái duyệt nội dung ngay trong admin." />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ThemeCard className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Brand knowledge</div>
                <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Nguồn cấu hình cho AI</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">Dùng làm giọng điệu chuẩn để viết bài, tránh hard-code trong prompt.</p>
              </div>
              <Link href="/admin/content/new" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Tạo bài</Link>
              <form action={seedSampleContent}>
                <button type="submit" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Seed 5 mẫu bài</button>
              </form>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Positioning</div>
                <div className="mt-2 text-[color:var(--text)]">{brandProfile?.positioning ?? "Gốc thầu MEP 15 năm"}</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Website</div>
                <div className="mt-2 text-[color:var(--text)]">{brandProfile?.primary_website ?? "https://epcvina.com"}</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 md:col-span-2">
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Tone</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(brandProfile?.tone ?? []).map((item: string) => (
                    <span key={item} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1 text-xs text-[color:var(--text)]">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Workflow</div>
            <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Luồng bài viết</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/admin/content/studio" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">AI Studio</Link>
              <Link href="/admin/content/review" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Review Queue</Link>
              <Link href="/admin/content/calendar" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Content Calendar</Link>
              <Link href="/admin/content/settings" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Brand Knowledge</Link>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">1. Tạo brief và brief metadata.</li>
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">2. AI sinh bài và channel variants.</li>
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">3. Reviewer duyệt, lên lịch và xuất bản.</li>
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">4. Gắn `content_id` + UTM cho đo lead.</li>
            </ol>
          </ThemeCard>
        </div>

        <ThemeCard className="mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Facebook</div>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Fanpage mặc định</h3>
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

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { label: "Approved", value: stats.approved },
            { label: "Scheduled", value: stats.scheduled },
            { label: "Published", value: stats.published },
            { label: "Linked leads", value: stats.linkedLeads },
          ].map((item) => (
            <ThemeCard key={item.label} className="p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{item.label}</div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{item.value}</div>
            </ThemeCard>
          ))}
        </div>

        <ThemeCard className="mt-6 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Bài viết gần đây</div>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Danh sách content</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/content" className={`rounded-full border px-3 py-1 text-xs ${sourceFilter === "" ? "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)]" : "border-[color:var(--border)] bg-transparent text-[color:var(--muted)]"}`}>All</Link>
              <Link href="/admin/content?source=facebook" className={`rounded-full border px-3 py-1 text-xs ${sourceFilter === "facebook" ? "border-sky-400/30 bg-sky-400/10 text-sky-700" : "border-[color:var(--border)] bg-transparent text-[color:var(--muted)]"}`}>Imported Facebook</Link>
              <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1 text-xs text-[color:var(--muted)]">{visibleRows.length} bài</div>
            </div>
          </div>
          <div className="mt-5 grid gap-4">
            {visibleRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 text-sm text-[color:var(--muted)]">
                Chưa có bài viết nào. Tạo bài đầu tiên để bắt đầu quy trình content.
              </div>
            ) : visibleRows.map((row) => (
              <div key={row.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${badgeClass(row.status)}`}>{row.status}</span>
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{row.content_type}</span>
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{row.priority}</span>
                  {row.desired_channels?.slice(0, 3).map((channel) => (
                    <span key={channel} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{channel}</span>
                  ))}
                </div>
                <div className="mt-3 text-lg font-semibold text-[color:var(--text)]">{row.title}</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">
                  {row.content_id} · {row.slug} {row.category ? `· ${row.category}` : ""}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {row.source_system === "facebook" ? (
                    <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-sky-700">Imported from Facebook</span>
                  ) : null}
                  {row.source_url ? (
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">Source linked</span>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    ["review", "Send review"],
                    ["approved", "Approve"],
                    ["scheduled", "Schedule"],
                    ["published", "Publish"],
                    ["archived", "Archive"],
                  ].map(([status, label]) => (
                    <form key={status} action={updateContentStatus}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="status" value={status} />
                      <button type="submit" className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1.5 text-xs text-[color:var(--text)]">{label}</button>
                    </form>
                  ))}
                  <Link href={`/admin/content/${row.id}`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1.5 text-xs text-[color:var(--text)]">Open</Link>
                  <form action={deleteContentPost}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-700">Delete</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Form nhanh</div>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Tạo bài mới</h3>
            </div>
          </div>
          <form action={createContentPost} className="mt-5 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                Title
                <input name="title" required className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                Slug
                <input name="slug" placeholder="seo-vi-du" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                Topic
                <input name="topic" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                Category
                <input name="category" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                Content type
                <select name="content_type" defaultValue="educational" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
                  {["educational","case_study","product","calculator","faq","news","project","promotion","comparison","video"].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                Status
                <select name="status" defaultValue="draft" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
                  {["draft","ai_generated","review","approved","scheduled","published","failed","archived"].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                Desired channels, cách nhau bằng dấu phẩy
                <input name="desired_channels" placeholder="website,facebook,tiktok" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                Publish strategy
                <input name="publish_strategy" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                Audience
                <input name="target_audience" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                CTA
                <input name="cta" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                Keywords, cách nhau bằng dấu phẩy
                <input name="keywords" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                References, mỗi URL một dòng
                <textarea name="reference_urls" rows={3} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
              </label>
            </div>
            <label className="grid gap-2 text-sm text-[color:var(--muted)]">
              Brief / body
              <textarea name="body" rows={5} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Lưu bài</button>
              <Link href="/admin/content/new" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-5 py-3 text-sm text-[color:var(--text)]">Mở form đầy đủ</Link>
            </div>
          </form>
        </ThemeCard>
      </main>
    </AdminShell>
  );
}
