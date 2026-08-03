import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function updateLead(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  const supabase = createSupabaseAdminClient();
  if (!supabase || !id) return;
  const now = new Date().toISOString();
  const values: Record<string, unknown> = {
    status,
    priority: String(formData.get("priority") ?? "normal"),
    follow_up_at: String(formData.get("follow_up_at") ?? "") || null,
    lost_reason: String(formData.get("lost_reason") ?? "").trim() || null,
    internal_note: String(formData.get("internal_note") ?? "").trim() || null,
    updated_at: now,
  };
  if (status !== "new") values.last_contacted_at = now;
  const { data: current } = await supabase.from("crm_leads").select("first_contacted_at").eq("id", id).single();
  if (status !== "new" && !current?.first_contacted_at) values.first_contacted_at = now;
  const { error } = await supabase.from("crm_leads").update(values).eq("id", id);
  if (error) throw error;
  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  redirect(`/admin/leads/${id}?saved=1`);
}

function Field({ label, value }: { label: string; value: unknown }) {
  return <div><div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</div><div className="mt-1 break-words text-[color:var(--text)]">{String(value || "—")}</div></div>;
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const result = supabase ? await supabase.from("crm_leads").select("*").eq("id", id).maybeSingle() : { data: null };
  const lead: any = result.data;
  if (!lead) notFound();
  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionTitle eyebrow="CRM · Chi tiết lead" title={lead.name || lead.phone} description={`Nhận lúc ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.created_at))}`} />
          <Link href="/admin/leads" className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm text-[color:var(--text)]">← Danh sách lead</Link>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.82fr]">
          <div className="space-y-6">
            <ThemeCard className="grid gap-5 p-6 sm:grid-cols-2">
              <Field label="Họ tên" value={lead.name} /><Field label="Điện thoại" value={lead.phone} />
              <Field label="Email" value={lead.email} /><Field label="Địa chỉ" value={lead.address} />
              <Field label="Loại hệ thống" value={lead.system_type} /><Field label="Diện tích mái" value={lead.roof_area} />
              <Field label="Hóa đơn/tháng" value={lead.monthly_bill} /><Field label="Công suất đề xuất" value={lead.system_size_kw ? `${lead.system_size_kw} kWp` : null} />
              <div className="sm:col-span-2"><Field label="Nhu cầu / nội dung" value={lead.message} /></div>
            </ThemeCard>
            <ThemeCard className="grid gap-5 p-6 sm:grid-cols-2">
              <Field label="Form nguồn" value={lead.source_form} /><Field label="Landing page" value={lead.landing_page} />
              <Field label="UTM source / medium" value={[lead.utm_source, lead.utm_medium].filter(Boolean).join(" / ")} /><Field label="UTM campaign" value={lead.utm_campaign} />
              <Field label="UTM term" value={lead.utm_term} /><Field label="GCLID / FBCLID" value={lead.gclid || lead.fbclid} />
            </ThemeCard>
          </div>
          <ThemeCard className="h-fit p-6">
            <h2 className="text-xl font-semibold text-[color:var(--text)]">Cập nhật xử lý</h2>
            <form action={updateLead} className="mt-5 grid gap-4">
              <input type="hidden" name="id" value={lead.id} />
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Trạng thái<select name="status" defaultValue={lead.status} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">{[["new","Mới"],["contacted","Đã liên hệ"],["qualified","Đủ điều kiện"],["survey_scheduled","Hẹn khảo sát"],["quoted","Đã báo giá"],["won","Thành công"],["lost","Thất bại"],["spam","Spam"]].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Ưu tiên<select name="priority" defaultValue={lead.priority} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]"><option value="low">Thấp</option><option value="normal">Bình thường</option><option value="high">Cao</option><option value="urgent">Khẩn cấp</option></select></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Nhắc liên hệ<input type="datetime-local" name="follow_up_at" defaultValue={lead.follow_up_at ? new Date(lead.follow_up_at).toISOString().slice(0,16) : ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Lý do thất bại<input name="lost_reason" defaultValue={lead.lost_reason || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <label className="grid gap-2 text-sm text-[color:var(--muted)]">Ghi chú nội bộ<textarea name="internal_note" rows={6} defaultValue={lead.internal_note || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" /></label>
              <button className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Lưu cập nhật</button>
            </form>
          </ThemeCard>
        </div>
      </main>
    </AdminShell>
  );
}
