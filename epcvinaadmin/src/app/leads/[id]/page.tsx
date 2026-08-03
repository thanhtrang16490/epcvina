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

const resultSectionLabels: Record<string, string> = {
  inputs: "Dữ liệu khách nhập",
  recommendation: "Cấu hình đề xuất",
  production_and_saving: "Sản lượng & tiết kiệm",
  finance: "Tài chính & hoàn vốn",
  environment: "Hiệu quả môi trường",
};

const resultFieldLabels: Record<string, string> = {
  province: "Tỉnh/thành", region: "Vùng", region_solar_factor: "Hệ số bức xạ",
  bill_type: "Loại khách hàng", monthly_bill_vnd: "Hóa đơn tháng (VNĐ)", roof_type: "Loại mái",
  roof_area_m2: "Diện tích mái (m²)", day_usage_percent: "Dùng điện ban ngày (%)", night_usage_percent: "Dùng điện ban đêm (%)",
  load_profile: "Loại tải", phase_type: "Nguồn điện", install_timing_label: "Dự kiến triển khai",
  system_title: "Hệ thống", system_label: "Phương án", estimated_kwp: "Công suất đề xuất (kWp)",
  estimated_panels: "Số tấm pin", inverter_kw: "Công suất inverter (kW)", estimated_storage_kwh: "Pin lưu trữ (kWh)",
  required_roof_area_m2: "Diện tích mái cần dùng (m²)", roof_potential_kwp: "Tiềm năng mái (kWp)", roof_limited: "Bị giới hạn bởi mái",
  storage_decision: "Khuyến nghị pin lưu trữ", monthly_production_kwh: "Sản lượng tháng (kWh)", annual_production_kwh: "Sản lượng năm (kWh)",
  bill_offset_percent: "Tỷ lệ giảm hóa đơn (%)", monthly_saving_vnd: "Tiết kiệm tháng (VNĐ)", annual_saving_vnd: "Tiết kiệm năm (VNĐ)",
  bill_after_solar_vnd: "Hóa đơn sau Solar (VNĐ)", lifetime_saving_25_years_vnd: "Tiết kiệm 25 năm (VNĐ)",
  cost_min_million_vnd: "Đầu tư tối thiểu (triệu)", cost_max_million_vnd: "Đầu tư tối đa (triệu)",
  average_investment_million_vnd: "Đầu tư trung bình (triệu)", payback_min_years: "Hoàn vốn sớm nhất (năm)",
  payback_max_years: "Hoàn vốn dài nhất (năm)", payback_average_years: "Hoàn vốn dự kiến (năm)",
  net_gain_25_years_million_vnd: "Lợi ích ròng 25 năm (triệu)", co2_reduction_ton_per_year: "Giảm CO₂/năm (tấn)",
  tree_equivalent: "Tương đương số cây", motorbike_km_equivalent: "Tương đương km xe máy",
};

function ResultValue({ value }: { value: unknown }) {
  if (typeof value === "boolean") return <>{value ? "Có" : "Không"}</>;
  if (typeof value === "number") return <>{value.toLocaleString("vi-VN")}</>;
  return <>{String(value ?? "—")}</>;
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
            {lead.calculator_result && Object.keys(lead.calculator_result).length ? (
              <ThemeCard className="p-6">
                <h2 className="text-xl font-semibold text-[color:var(--text)]">Kết quả tính toán gửi kèm</h2>
                <div className="mt-5 space-y-6">
                  {Object.entries(lead.calculator_result as Record<string, unknown>).map(([sectionKey, sectionValue]) => {
                    if (!sectionValue || typeof sectionValue !== "object" || Array.isArray(sectionValue)) return null;
                    return (
                      <section key={sectionKey}>
                        <h3 className="text-sm font-semibold text-cyan-500">{resultSectionLabels[sectionKey] || sectionKey}</h3>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {Object.entries(sectionValue as Record<string, unknown>)
                            .filter(([key]) => !["region", "install_timing", "estimated_storage_label", "defer_storage_for_payback", "flight_equivalent", "carbon_value_million_vnd", "conservative_payback_years", "optimistic_payback_years"].includes(key))
                            .map(([key, value]) => (
                              <div key={key} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                                <div className="text-xs text-[color:var(--muted)]">{resultFieldLabels[key] || key.replaceAll("_", " ")}</div>
                                <div className="mt-1 break-words font-medium text-[color:var(--text)]"><ResultValue value={value} /></div>
                              </div>
                            ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </ThemeCard>
            ) : null}
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
