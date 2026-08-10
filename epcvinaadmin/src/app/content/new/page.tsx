import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

const contentPresets: Record<string, { title: string; topic: string; category: string; excerpt: string; body: string; cta: string; desired_channels: string; keywords: string }> = {
  educational: {
    title: "Hướng dẫn chọn giải pháp điện mặt trời phù hợp cho nhà phố",
    topic: "Chọn hệ điện mặt trời cho nhà phố",
    category: "guide",
    excerpt: "Giải thích cách chọn công suất, loại inverter và tiêu chí an toàn theo nhu cầu thực tế.",
    body: [
      "Mở bài: Nêu vấn đề thực tế của khách hàng.",
      "Phần 1: Khi nào nên chọn on-grid, hybrid hoặc có lưu trữ.",
      "Phần 2: Các tiêu chí cần kiểm tra trước khi lắp đặt.",
      "Phần 3: Lời khuyên từ góc nhìn EPCVINA.",
    ].join("\n"),
    cta: "Nhận tư vấn",
    desired_channels: "website,facebook",
    keywords: "điện mặt trời, nhà phố, tư vấn, on-grid, hybrid",
  },
  case_study: {
    title: "Case study: Tối ưu chi phí điện cho nhà máy sau khi lắp solar",
    topic: "Case study solar nhà máy",
    category: "case-study",
    excerpt: "Một ví dụ thực tế về cách EPCVINA tối ưu hệ thống theo tải tiêu thụ và mục tiêu hoàn vốn.",
    body: [
      "Bối cảnh dự án: quy mô, tải, mục tiêu tiết kiệm.",
      "Giải pháp triển khai: cấu hình hệ thống, tiến độ, các điểm cần lưu ý.",
      "Kết quả: mức tiết kiệm, vận hành, kinh nghiệm rút ra.",
    ].join("\n"),
    cta: "Đăng ký khảo sát",
    desired_channels: "website,facebook,linkedin",
    keywords: "case study, nhà máy, tiết kiệm điện, solar C&I",
  },
  promotion: {
    title: "Ưu đãi tháng này cho khách hàng đăng ký khảo sát solar",
    topic: "Khuyến mãi khảo sát solar",
    category: "promotion",
    excerpt: "Mẫu bài nhấn vào ưu đãi, giữ giọng điệu rõ ràng, không giật tít quá đà.",
    body: [
      "Nêu ưu đãi ngắn gọn và điều kiện áp dụng.",
      "Chỉ rõ giá trị khách hàng nhận được.",
      "Kết thúc bằng CTA rõ ràng.",
    ].join("\n"),
    cta: "Đăng ký khảo sát",
    desired_channels: "website,facebook,zalo",
    keywords: "ưu đãi, khảo sát, điện mặt trời, EPCVINA",
  },
  faq: {
    title: "FAQ: Những câu hỏi thường gặp khi lắp điện mặt trời",
    topic: "FAQ solar",
    category: "faq",
    excerpt: "Tập trung giải đáp các câu hỏi thực tế, giúp giảm ma sát khi khách hàng ra quyết định.",
    body: [
      "Câu hỏi 1: Thời gian hoàn vốn là bao lâu?",
      "Câu hỏi 2: Mái nào phù hợp để lắp?",
      "Câu hỏi 3: Cần chuẩn bị gì trước khi thi công?",
    ].join("\n"),
    cta: "Nhận tư vấn",
    desired_channels: "website,facebook",
    keywords: "faq, hỏi đáp, điện mặt trời, tư vấn",
  },
  news: {
    title: "Tin tức mới về thị trường điện mặt trời",
    topic: "Tin tức solar",
    category: "news",
    excerpt: "Mẫu tin tức giữ giọng trung tính, ngắn gọn, cập nhật tình hình thị trường.",
    body: [
      "Tóm tắt tin tức chính.",
      "Điểm đáng chú ý đối với khách hàng EPCVINA.",
      "Khuyến nghị thực tế hoặc tác động đến quyết định đầu tư.",
    ].join("\n"),
    cta: "Xem chi tiết",
    desired_channels: "website,facebook,zalo",
    keywords: "tin tức, thị trường, điện mặt trời",
  },
  project: {
    title: "Dự án EPCVINA: một công trình tiêu biểu",
    topic: "Project highlight",
    category: "project",
    excerpt: "Mẫu bài giới thiệu dự án theo hướng thực tế, cho thấy năng lực triển khai và kết quả.",
    body: [
      "Thông tin dự án: quy mô, địa điểm, mục tiêu.",
      "Giải pháp và điểm kỹ thuật nổi bật.",
      "Kết quả bàn giao / vận hành.",
    ].join("\n"),
    cta: "Xem dự án",
    desired_channels: "website,facebook,linkedin",
    keywords: "dự án, thi công, EPCVINA, solar",
  },
  comparison: {
    title: "So sánh on-grid và hybrid: chọn gì cho đúng nhu cầu?",
    topic: "So sánh on-grid hybrid",
    category: "comparison",
    excerpt: "Mẫu bài so sánh giúp khách hàng hiểu rõ trade-off trước khi chốt phương án.",
    body: [
      "Bảng so sánh ngắn về mục tiêu sử dụng.",
      "Ưu nhược điểm từng phương án.",
      "Khuyến nghị theo nhu cầu thực tế.",
    ].join("\n"),
    cta: "Nhận tư vấn",
    desired_channels: "website,facebook",
    keywords: "so sánh, on-grid, hybrid, điện mặt trời",
  },
};

function buildPresetPayload(type: string) {
  return contentPresets[type] ?? contentPresets.educational;
}

async function createContentPost(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const contentId = `CNT-${Date.now().toString(36).toUpperCase()}`;
  await supabase.from("content_posts").insert({
    content_id: contentId,
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

async function createPresetContent(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const contentType = String(formData.get("preset_type") ?? "educational");
  const preset = buildPresetPayload(contentType);
  const title = preset.title;
  const slug = slugify(title);
  await supabase.from("content_posts").insert({
    content_id: `CNT-${Date.now().toString(36).toUpperCase()}`,
    title,
    slug,
    topic: preset.topic,
    category: preset.category,
    content_type: contentType,
    target_audience: String(formData.get("target_audience") ?? "Khách hàng EPCVINA").trim() || "Khách hàng EPCVINA",
    pain_point: String(formData.get("pain_point") ?? "Cần lựa chọn giải pháp phù hợp").trim() || "Cần lựa chọn giải pháp phù hợp",
    key_message: String(formData.get("key_message") ?? "Giải pháp thực tế, an toàn, hiệu quả").trim() || "Giải pháp thực tế, an toàn, hiệu quả",
    offer: String(formData.get("offer") ?? "").trim() || null,
    cta: preset.cta,
    keywords: preset.keywords.split(",").map((item) => item.trim()).filter(Boolean),
    reference_urls: String(formData.get("reference_urls") ?? "").split("\n").map((item) => item.trim()).filter(Boolean),
    desired_channels: preset.desired_channels.split(",").map((item) => item.trim()).filter(Boolean),
    image_type: "hero",
    publish_strategy: "website-first",
    status: "draft",
    priority: "normal",
    author: String(formData.get("author") ?? "").trim() || null,
    excerpt: preset.excerpt,
    body: preset.body,
    is_ai_generated: false,
  });
  revalidatePath("/admin/content");
}

async function createFacebookVariantFromPreset(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const contentType = String(formData.get("preset_type") ?? "educational");
  const tone = String(formData.get("tone") ?? "professional") as "professional" | "concise" | "sales";
  const preset = buildPresetPayload(contentType);
  const message = [
    tone === "concise"
      ? `Đi nhanh vào trọng tâm: ${preset.title}.`
      : tone === "sales"
        ? `Nếu bạn đang cân nhắc ${preset.title.toLowerCase()}, đây là điểm cần lưu ý.`
        : `EPCVINA chia sẻ góc nhìn thực tế về ${preset.title}.`,
    preset.excerpt,
    `CTA: ${preset.cta}`,
  ].join("\n\n");
  const inserted = await supabase.from("content_posts").insert({
    content_id: `CNT-${Date.now().toString(36).toUpperCase()}`,
    title: preset.title,
    slug: `${slugify(preset.title)}-${Date.now().toString(36).toLowerCase()}`,
    topic: preset.topic,
    category: preset.category,
    content_type: contentType,
    target_audience: String(formData.get("target_audience") ?? "Khách hàng EPCVINA").trim() || "Khách hàng EPCVINA",
    pain_point: String(formData.get("pain_point") ?? "Cần lựa chọn giải pháp phù hợp").trim() || "Cần lựa chọn giải pháp phù hợp",
    key_message: String(formData.get("key_message") ?? "Giải pháp thực tế, an toàn, hiệu quả").trim() || "Giải pháp thực tế, an toàn, hiệu quả",
    cta: preset.cta,
    keywords: preset.keywords.split(",").map((item) => item.trim()).filter(Boolean),
    desired_channels: ["facebook"],
    image_type: "social",
    publish_strategy: "facebook-first",
    status: "draft",
    priority: "normal",
    excerpt: preset.excerpt,
    body: preset.body,
    is_ai_generated: false,
  }).select("id").single();

  const postId = inserted.data?.id;
  if (postId) {
    await supabase.from("content_variants").insert({
      content_post_id: postId,
      channel: "facebook",
      title: preset.title,
      hook: message.slice(0, 160),
      body: message,
      cta: preset.cta,
      status: "draft",
      variant_meta: { source: "preset", tone },
    });
  }
  revalidatePath("/admin/content");
}

export default function NewContentPage() {
  return (
    <AdminShell>
      <main className="mx-auto max-w-5xl px-4 py-4 md:px-0">
        <SectionTitle eyebrow="Marketing" title="Tạo bài viết mới" description="Nhập brief, nội dung và metadata để chuẩn bị cho AI, review và lịch đăng." />
        <ThemeCard className="mt-6 p-6">
          <div className="mb-5">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Presets</div>
            <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Mẫu bài viết theo loại nội dung</h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">Chọn preset để tạo nhanh khung bài chuẩn, rồi chỉnh lại cho đúng chiến dịch.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(contentPresets).map(([type, preset]) => (
              <form key={type} action={createPresetContent} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <input type="hidden" name="preset_type" value={type} />
                <input type="hidden" name="tone" value="professional" />
                <div className="text-sm font-medium text-[color:var(--text)]">{type}</div>
                <div className="mt-2 text-sm text-[color:var(--muted)]">{preset.excerpt}</div>
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1">{preset.category}</span>
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1">{preset.desired_channels}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="submit" className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white">Tạo từ preset</button>
                </div>
              </form>
            ))}
          </div>
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <div className="mb-5">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Facebook presets</div>
            <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Tạo variant Facebook từ preset</h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">Chọn tone và tạo luôn một bài Facebook draft gắn vào content mới.</p>
          </div>
          <form action={createFacebookVariantFromPreset} className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
            <select name="preset_type" defaultValue="educational" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
              {Object.keys(contentPresets).map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <select name="tone" defaultValue="professional" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
              <option value="professional">professional</option>
              <option value="concise">concise</option>
              <option value="sales">sales</option>
            </select>
            <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Tạo Facebook variant</button>
          </form>
        </ThemeCard>

        <ThemeCard className="mt-6 p-6">
          <form action={createContentPost} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Title<input name="title" required className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Slug<input name="slug" placeholder="auto nếu bỏ trống" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Topic<input name="topic" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Category<input name="category" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Content type<select name="content_type" defaultValue="educational" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">{["educational","case_study","product","calculator","faq","news","project","promotion","comparison","video"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Status<select name="status" defaultValue="draft" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">{["draft","ai_generated","review","approved","scheduled","published","failed","archived"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Priority<select name="priority" defaultValue="normal" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">{["low","normal","high","urgent"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Scheduled at<input name="scheduled_at" type="datetime-local" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Desired channels<input name="desired_channels" placeholder="website,facebook,tiktok" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">CTA<input name="cta" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            </div>
            <label className="grid gap-2 text-sm text-[color:var(--muted)]">Brief / body<textarea name="body" rows={8} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white">Lưu bài</button>
              <Link href="/admin/content" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-5 py-3 text-sm text-[color:var(--text)]">Quay lại hub</Link>
            </div>
          </form>
        </ThemeCard>
      </main>
    </AdminShell>
  );
}
