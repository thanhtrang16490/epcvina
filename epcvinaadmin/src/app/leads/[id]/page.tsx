import { AdminShell } from "@/components/AdminShell";
import { LeadActivityComposer } from "@/components/LeadActivityComposer";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { sendLeadQualityConversion } from "@/lib/conversion-webhook";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type LeadActivityItem = {
  at?: string | null;
  note?: string | null;
  author?: string | null;
  type?: string | null;
};

async function updateLead(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  const activityNote = String(formData.get("activity_note") ?? "").trim();
  const activityType = String(formData.get("activity_type") ?? "note").trim();
  const ownerName = String(formData.get("owner_name") ?? "").trim();
  const supabase = createSupabaseAdminClient();
  if (!supabase || !id) return;
  const now = new Date().toISOString();
  const { data: current } = await supabase.from("crm_leads").select("first_contacted_at,status,metadata").eq("id", id).single();
  const currentMetadata = (current?.metadata && typeof current.metadata === "object" && !Array.isArray(current.metadata) ? current.metadata : {}) as Record<string, unknown>;
  const activityLog = Array.isArray(currentMetadata.activity_log) ? (currentMetadata.activity_log as LeadActivityItem[]) : [];
  const nextActivityLog = activityNote
    ? [
        {
          at: now,
          note: activityNote,
          author: ownerName || null,
          type: activityType || "note",
        },
        ...activityLog,
      ].slice(0, 20)
    : activityLog;
  const values: Record<string, unknown> = {
    status,
    priority: String(formData.get("priority") ?? "normal"),
    follow_up_at: String(formData.get("follow_up_at") ?? "") || null,
    lost_reason: String(formData.get("lost_reason") ?? "").trim() || null,
    internal_note: String(formData.get("internal_note") ?? "").trim() || null,
    metadata: {
      ...currentMetadata,
      owner_name: ownerName || currentMetadata.owner_name || null,
      activity_log: nextActivityLog,
      last_activity_at: activityNote ? now : currentMetadata.last_activity_at || now,
    },
    updated_at: now,
  };
  if (status !== "new") values.last_contacted_at = now;
  if (status !== "new" && !current?.first_contacted_at) values.first_contacted_at = now;
  const { error } = await supabase.from("crm_leads").update(values).eq("id", id);
  if (error) throw error;
  if (current?.status !== status && ["qualified", "survey_scheduled", "survey_done", "proposal_sent", "negotiation", "won"].includes(status)) {
    const { data: conversionLead } = await supabase
      .from("crm_leads")
      .select("id,status,source_form,phone,email,gclid,gbraid,wbraid,fbclid,utm_source,utm_campaign,created_at")
      .eq("id", id)
      .single();
    if (conversionLead) await sendLeadQualityConversion(conversionLead);
  }
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

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function getLeadAge(value: string | null | undefined) {
  if (!value) return null;
  const diff = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diff) || diff < 0) return null;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getNextAction(lead: any) {
  if (lead.follow_up_at) return { label: "Nhắc liên hệ", value: formatDateTime(lead.follow_up_at) };
  if (lead.last_contacted_at) return { label: "Đã liên hệ gần nhất", value: formatDateTime(lead.last_contacted_at) };
  return { label: "Cần liên hệ", value: "Chưa có hoạt động" };
}

function getMetadata(lead: any) {
  return lead?.metadata && typeof lead.metadata === "object" && !Array.isArray(lead.metadata) ? (lead.metadata as Record<string, unknown>) : {};
}

const activityTypeLabels: Record<string, string> = {
  note: "Ghi chú",
  call: "Cuộc gọi",
  email: "Email",
  meeting: "Hẹn gặp",
  survey: "Khảo sát",
  quote: "Báo giá",
  handover: "Bàn giao",
};

const activityTypeTones: Record<string, string> = {
  note: "bg-slate-400/15 text-slate-300",
  call: "bg-cyan-400/15 text-cyan-300",
  email: "bg-blue-400/15 text-blue-300",
  meeting: "bg-violet-400/15 text-violet-300",
  survey: "bg-amber-400/15 text-amber-300",
  quote: "bg-emerald-400/15 text-emerald-300",
  handover: "bg-green-400/15 text-green-300",
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const result = supabase ? await supabase.from("crm_leads").select("*").eq("id", id).maybeSingle() : { data: null };
  const lead: any = result.data;
  if (!lead) notFound();
  const metadata = getMetadata(lead);
  const ownerName = typeof metadata.owner_name === "string" ? metadata.owner_name : "";
  const activityLog = Array.isArray(metadata.activity_log) ? (metadata.activity_log as LeadActivityItem[]) : [];
  const activityFeed = [...activityLog].sort((left, right) => new Date(String(right.at ?? 0)).getTime() - new Date(String(left.at ?? 0)).getTime());
  const leadAge = getLeadAge(lead.created_at);
  const nextAction = getNextAction(lead);
  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionTitle eyebrow="CRM · Chi tiết lead" title={lead.name || lead.phone} description={`Nhận lúc ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.created_at))}`} />
          <Link href="/admin/leads" className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm text-[color:var(--text)]">← Danh sách lead</Link>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.82fr]">
          <div className="space-y-6">
            <ThemeCard className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">Tổng quan CRM</div>
                  <h2 className="mt-2 text-2xl font-semibold text-[color:var(--text)]">{lead.name || lead.phone}</h2>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-[color:var(--muted)]">
                    <span>Trạng thái: {lead.status}</span>
                    <span>•</span>
                    <span>Ưu tiên: {lead.priority || "normal"}</span>
                    {leadAge !== null ? <>
                      <span>•</span>
                      <span>{leadAge} ngày kể từ khi nhận</span>
                    </> : null}
                  </div>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">{nextAction.label}</div>
                  <div className="mt-1 font-semibold text-[color:var(--text)]">{nextAction.value}</div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">Lần liên hệ đầu</div>
                  <div className="mt-1 font-medium text-[color:var(--text)]">{formatDateTime(lead.first_contacted_at)}</div>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">Lần liên hệ gần nhất</div>
                  <div className="mt-1 font-medium text-[color:var(--text)]">{formatDateTime(lead.last_contacted_at)}</div>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">Hẹn tiếp theo</div>
                  <div className="mt-1 font-medium text-[color:var(--text)]">{formatDateTime(lead.follow_up_at)}</div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">Chủ phụ trách</div>
                  <div className="mt-1 font-medium text-[color:var(--text)]">{ownerName || "Chưa phân công"}</div>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">Số hoạt động</div>
                  <div className="mt-1 font-medium text-[color:var(--text)]">{activityLog.length}</div>
                </div>
              </div>
            </ThemeCard>
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
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                Cập nhật lead theo mô hình CRM: trạng thái, ưu tiên, hẹn hoạt động tiếp theo và ghi chú nội bộ.
              </p>
            <LeadActivityComposer
              action={updateLead}
              leadId={lead.id}
              ownerName={ownerName}
              status={lead.status}
              priority={lead.priority || "normal"}
              followUpAt={lead.follow_up_at ? new Date(lead.follow_up_at).toISOString().slice(0, 16) : ""}
              lostReason={lead.lost_reason || ""}
              internalNote={lead.internal_note || ""}
            />
          </ThemeCard>
          <ThemeCard className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-[color:var(--text)]">Lịch sử hoạt động</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Tương tự chatter trong CRM: ghi nhận các lần cập nhật để không mất ngữ cảnh.</p>
            <div className="mt-5 space-y-3">
              {activityFeed.length ? activityFeed.map((item, index) => {
                const typeKey = String(item.type ?? "note");
                const typeLabel = activityTypeLabels[typeKey] ?? typeKey;
                const typeTone = activityTypeTones[typeKey] ?? activityTypeTones.note;
                return (
                  <div key={`${String(item.at ?? index)}-${index}`} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-[color:var(--text)]">{String(item.note ?? "—")}</div>
                        <div className="mt-2 text-sm text-[color:var(--muted)]">
                          {formatDateTime(String(item.at ?? null))}
                          {item.author ? ` · ${String(item.author)}` : ""}
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${typeTone}`}>{typeLabel}</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 text-sm text-[color:var(--muted)]">
                  Chưa có hoạt động nào.
                </div>
              )}
            </div>
          </ThemeCard>
        </div>
      </main>
    </AdminShell>
  );
}
