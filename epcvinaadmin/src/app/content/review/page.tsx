import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { suggestContentEdits } from "@/lib/content-ai";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ReviewRow = {
  id: string;
  content_id: string;
  title: string;
  slug: string;
  status: string;
  content_type: string;
  priority: string;
  updated_at: string | null;
  ai_response: {
    summary?: string | null;
    issues?: string[] | null;
    actions?: string[] | null;
    [key: string]: unknown;
  } | null;
};

async function loadReviewRows() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [] as ReviewRow[];
  const { data } = await supabase
    .from("content_posts")
    .select("id, content_id, title, slug, status, content_type, priority, updated_at, ai_response")
    .in("status", ["draft", "ai_generated", "review"])
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(100);
  return (data ?? []) as ReviewRow[];
}

async function loadSettingsBundle() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const [{ data: settings }, { data: brand }] = await Promise.all([
    supabase.from("content_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("content_brand_profiles").select("*").eq("id", 1).maybeSingle(),
  ]);
  return { settings: settings ?? null, brand: brand ?? null };
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
  revalidatePath("/admin/content/review");
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
  revalidatePath("/admin/content/review");
}

async function runAiReview(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
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
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/review");
  revalidatePath(`/admin/content/${id}`);
}

export default async function ContentReviewPage() {
  const rows = await loadReviewRows();
  const bundle = await loadSettingsBundle();

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-0">
        <SectionTitle eyebrow="Marketing" title="Review Queue" description="Bài AI sinh ra, bài nhập tay và bài đang cần sửa đều đi qua đây trước khi xuất bản." />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ThemeCard className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Queue</div>
                <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Bài cần xem lại</h3>
              </div>
              <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1 text-xs text-[color:var(--muted)]">{rows.length} bài</div>
            </div>
            <div className="mt-5 grid gap-4">
              {rows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 text-sm text-[color:var(--muted)]">
                  Chưa có bài nào trong hàng đợi review.
                </div>
              ) : rows.map((row) => (
                <div key={row.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{row.status}</span>
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{row.content_type}</span>
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{row.priority}</span>
                  </div>
                  <div className="mt-3 text-lg font-semibold text-[color:var(--text)]">{row.title}</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">{row.content_id} · {row.slug}</div>
                  <div className="mt-1 text-xs text-[color:var(--muted)]">{row.updated_at ? new Date(row.updated_at).toLocaleString("vi-VN") : "Chưa cập nhật"}</div>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr]">
                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">AI summary</div>
                      <div className="mt-2 text-sm text-[color:var(--text)]">
                        {typeof row.ai_response?.summary === "string" && row.ai_response.summary.trim()
                          ? row.ai_response.summary
                          : "Chưa có kết quả AI review."}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Issues</div>
                      <div className="mt-2 text-sm text-[color:var(--text)]">
                        {Array.isArray(row.ai_response?.issues) && row.ai_response.issues.length > 0
                          ? row.ai_response.issues.filter((item): item is string => typeof item === "string").join(" • ")
                          : "Không có cảnh báo."}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/admin/content/${row.id}`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1.5 text-xs text-[color:var(--text)]">Open</Link>
                    <form action={runAiReview}>
                      <input type="hidden" name="id" value={row.id} />
                      <button type="submit" className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1.5 text-xs text-[color:var(--text)]">AI review</button>
                    </form>
                    <form action={updateContentStatus}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="status" value="approved" />
                      <button type="submit" className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1.5 text-xs text-[color:var(--text)]">Approve</button>
                    </form>
                    <form action={updateContentStatus}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="status" value="archived" />
                      <button type="submit" className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1.5 text-xs text-[color:var(--text)]">Archive</button>
                    </form>
                    <form action={deleteContentPost}>
                      <input type="hidden" name="id" value={row.id} />
                      <button type="submit" className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-700">Delete</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Guideline</div>
            <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Cách vận hành content</h3>
            <ol className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">1. Tạo bài thủ công hoặc seed bài mẫu.</li>
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">2. Nhấn AI review để hệ thống kiểm tra, gợi ý chỉnh sửa và lưu kết quả.</li>
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">3. Mở bài để sửa tay, rồi approve hoặc archive.</li>
              <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">4. Khi sẵn sàng, test đăng Facebook ngay trong detail page.</li>
            </ol>
            <div className="mt-6 grid gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">AI API</div>
                <div className="mt-2 text-sm text-[color:var(--text)]">{bundle?.settings?.api_key ? "API key đã có trong Settings." : "Chưa có API key. Hãy cấu hình ở Content Settings."}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Model</div>
                <div className="mt-2 text-sm text-[color:var(--text)]">{bundle?.settings?.model_name ?? "gpt-5.6"}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Brand profile</div>
                <div className="mt-2 text-sm text-[color:var(--text)]">{bundle?.brand?.positioning ?? "Chưa cấu hình"}</div>
              </div>
            </div>
          </ThemeCard>
        </div>
      </main>
    </AdminShell>
  );
}
