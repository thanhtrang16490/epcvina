import { AdminShell } from "@/components/AdminShell";
import { LeadActivityComposer } from "@/components/LeadActivityComposer";
import { LeadDeleteConfirm } from "@/components/LeadDeleteConfirm";
import { ModalShell } from "@/components/ModalShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { sendLeadQualityConversion } from "@/lib/conversion-webhook";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

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

async function deleteLead(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const supabase = createSupabaseAdminClient();
  if (!supabase || !id) return;
  const { error } = await supabase.from("crm_leads").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  redirect("/admin/leads");
}

async function updateLeadCard(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const section = String(formData.get("section") ?? "");
  const supabase = createSupabaseAdminClient();
  if (!supabase || !id || !section) return;

  const now = new Date().toISOString();
  const { data: current } = await supabase.from("crm_leads").select("metadata").eq("id", id).single();
  const currentMetadata = (current?.metadata && typeof current.metadata === "object" && !Array.isArray(current.metadata) ? current.metadata : {}) as Record<string, unknown>;
  const values: Record<string, unknown> = { updated_at: now };

  if (section === "overview") {
    values.status = String(formData.get("status") ?? "new");
    values.priority = String(formData.get("priority") ?? "normal");
    values.follow_up_at = String(formData.get("follow_up_at") ?? "") || null;
    values.internal_note = String(formData.get("internal_note") ?? "").trim() || null;
    values.metadata = {
      ...currentMetadata,
      owner_name: String(formData.get("owner_name") ?? "").trim() || currentMetadata.owner_name || null,
    };
  }

  if (section === "contact") {
    values.name = String(formData.get("name") ?? "").trim() || null;
    values.phone = String(formData.get("phone") ?? "").trim() || null;
    values.email = String(formData.get("email") ?? "").trim() || null;
    values.address = String(formData.get("address") ?? "").trim() || null;
    values.system_type = String(formData.get("system_type") ?? "").trim() || null;
    values.roof_area = String(formData.get("roof_area") ?? "").trim() || null;
    values.monthly_bill = String(formData.get("monthly_bill") ?? "").trim() || null;
    values.system_size_kw = String(formData.get("system_size_kw") ?? "").trim() || null;
    values.message = String(formData.get("message") ?? "").trim() || null;
  }

  if (section === "source") {
    values.source_form = String(formData.get("source_form") ?? "").trim() || null;
    values.landing_page = String(formData.get("landing_page") ?? "").trim() || null;
    values.content_id = String(formData.get("content_id") ?? "").trim() || null;
    values.content_slug = String(formData.get("content_slug") ?? "").trim() || null;
    values.utm_source = String(formData.get("utm_source") ?? "").trim() || null;
    values.utm_medium = String(formData.get("utm_medium") ?? "").trim() || null;
    values.utm_campaign = String(formData.get("utm_campaign") ?? "").trim() || null;
    values.utm_term = String(formData.get("utm_term") ?? "").trim() || null;
    values.gclid = String(formData.get("gclid") ?? "").trim() || null;
    values.fbclid = String(formData.get("fbclid") ?? "").trim() || null;
    values.metadata = {
      ...currentMetadata,
      source_tag: String(formData.get("source_tag") ?? "").trim() || currentMetadata.source_tag || null,
    };
  }

  const { error } = await supabase.from("crm_leads").update(values).eq("id", id);
  if (error) throw error;
  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  redirect(`/admin/leads/${id}?saved=1`);
}

function Field({ label, value }: { label: string; value: unknown }) {
  return <div><div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</div><div className="mt-1 break-words text-[color:var(--text)]">{String(value || "—")}</div></div>;
}

function formatMoneyVnd(value: unknown) {
  const amount = typeof value === "number" ? value : Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(amount)) return String(value ?? "—");
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(amount)} đ`;
}

function formatRoofType(value: unknown) {
  const normalized = String(value ?? "").trim().toLowerCase();
  const labels: Record<string, string> = {
    flat: "Mái phẳng",
    gable: "Mái dốc 2 phía",
    hip: "Mái chóp",
    shed: "Mái dốc 1 phía",
    mixed: "Mái hỗn hợp",
  };
  return labels[normalized] || String(value ?? "—");
}

function formatPhaseType(value: unknown) {
  const normalized = String(value ?? "").trim().toLowerCase();
  const labels: Record<string, string> = {
    one: "1 pha",
    single: "1 pha",
    three: "3 pha",
    "3phase": "3 pha",
    "1phase": "1 pha",
  };
  return labels[normalized] || String(value ?? "—");
}

function formatLoadProfile(value: unknown) {
  const normalized = String(value ?? "").trim().toLowerCase();
  const labels: Record<string, string> = {
    light: "Nhẹ",
    medium: "Trung bình",
    normal: "Bình thường",
    heavy: "Nặng",
    "very-heavy": "Rất nặng",
    residential: "Sinh hoạt",
    commercial: "Thương mại",
    industrial: "Công nghiệp",
  };
  return labels[normalized] || String(value ?? "—");
}

function formatBillType(value: unknown) {
  const normalized = String(value ?? "").trim().toLowerCase();
  const labels: Record<string, string> = {
    family: "Hộ gia đình",
    household: "Hộ gia đình",
    residential: "Nhà ở",
    business: "Kinh doanh",
    commercial: "Thương mại",
    factory: "Nhà máy",
    industrial: "Công nghiệp",
  };
  return labels[normalized] || String(value ?? "—");
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

function ResultFieldValue({ fieldKey, value }: { fieldKey: string; value: unknown }) {
  if (fieldKey === "monthly_bill_vnd" || fieldKey === "bill_after_solar_vnd" || fieldKey.endsWith("_vnd")) {
    return <>{formatMoneyVnd(value)}</>;
  }
  if (fieldKey === "roof_type") return <>{formatRoofType(value)}</>;
  if (fieldKey === "phase_type") return <>{formatPhaseType(value)}</>;
  if (fieldKey === "load_profile") return <>{formatLoadProfile(value)}</>;
  if (fieldKey === "bill_type") return <>{formatBillType(value)}</>;
  return <ResultValue value={value} />;
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

function getLeadHeatScore(lead: any) {
  const priority = String(lead.priority ?? "normal").toLowerCase();
  const rank = ({ low: 1, normal: 2, high: 3, urgent: 4 } as Record<string, number>)[priority] ?? 2;
  let score = 25 + rank * 8;
  if (lead.follow_up_at && new Date(lead.follow_up_at).getTime() < Date.now()) score += 18;
  if (lead.status === "new") score += 6;
  if (lead.status === "contacted") score += 12;
  if (lead.status === "qualified") score += 8;
  if (lead.last_contacted_at) {
    const daysSince = getLeadAge(lead.last_contacted_at) ?? 0;
    score += Math.max(0, 14 - daysSince);
  } else {
    score += 10;
  }
  return Math.min(100, score);
}

function tabClass(active: boolean) {
  return active
    ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
    : "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)] hover:bg-white/10";
}

function CardTitle({
  title,
  description,
  editLabel,
  editContent,
}: {
  title: string;
  description?: string;
  editLabel: string;
  editContent: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-[color:var(--text)]">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{description}</p> : null}
      </div>
      <ModalShell
        trigger={<span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-xs font-medium text-[color:var(--text)] transition hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)]">Sửa</span>}
        title={editLabel}
        description="Chỉnh trực tiếp trên từng card."
      >
        {editContent}
      </ModalShell>
    </div>
  );
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

const leadStages = [
  { key: "new", label: "Mới", group: "incoming" },
  { key: "contacted", label: "Đã liên hệ", group: "progress" },
  { key: "qualified", label: "Đủ điều kiện", group: "progress" },
  { key: "survey_scheduled", label: "Đặt lịch", group: "survey" },
  { key: "survey_done", label: "Khảo sát xong", group: "survey" },
  { key: "proposal_sent", label: "Đã gửi báo giá", group: "proposal" },
  { key: "negotiation", label: "Đàm phán", group: "proposal" },
  { key: "won", label: "Chốt thành công", group: "closed" },
  { key: "lost", label: "Thất bại", group: "closed" },
  { key: "spam", label: "Spam", group: "blocked" },
] as const;

function getLeadStageIndex(status: string) {
  const index = leadStages.findIndex((stage) => stage.key === status);
  return index >= 0 ? index : 0;
}

function LeadProgressBar({ status }: { status: string }) {
  const currentIndex = getLeadStageIndex(status);
  const completed = currentIndex + 1;
  const progressPercent = (completed / leadStages.length) * 100;
  return (
    <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Thanh tiến trình bán hàng</div>
          <div className="mt-1 text-sm font-medium text-[color:var(--text)]">
            Hiện tại: <span className="text-[color:var(--accent)]">{leadStages[currentIndex]?.label ?? "Mới"}</span>
          </div>
        </div>
        <div className="text-sm text-[color:var(--muted)]">
          {completed}/{leadStages.length} bước
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[color:var(--panel)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-orange-400 to-emerald-400 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {leadStages.map((stage, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div
              key={stage.key}
              className={`rounded-2xl border px-3 py-2 text-sm transition ${
                isCurrent
                  ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 text-[color:var(--text)]"
                  : isDone
                    ? "border-emerald-400/25 bg-emerald-400/10 text-[color:var(--text)]"
                    : "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--muted)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{stage.label}</span>
                <span className="text-[10px] uppercase tracking-[0.18em]">
                  {isCurrent ? "Hiện tại" : isDone ? "Đã qua" : "Sắp tới"}
                </span>
              </div>
              <div className="mt-1 text-xs opacity-75">
                {stage.group === "survey" ? "Giai đoạn khảo sát" : stage.group === "proposal" ? "Giai đoạn báo giá" : stage.group === "closed" ? "Kết thúc" : "Đầu phễu"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
      <main className="mx-auto w-full max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionTitle eyebrow="CRM · Chi tiết lead" title={lead.name || lead.phone} description={`Nhận lúc ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.created_at))}`} />
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/leads" className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm text-[color:var(--text)]">← Danh sách lead</Link>
            <ModalShell
              trigger={<span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm text-rose-300">Xoá lead</span>}
              title="Xác nhận xoá lead"
              description={`Bạn có chắc muốn xoá lead "${lead.name || lead.phone || lead.id}"? Hành động này không thể hoàn tác.`}
            >
              <LeadDeleteConfirm
                leadLabel={lead.name || lead.phone || lead.id}
                action={deleteLead}
                extraNote={<input type="hidden" name="id" value={lead.id} />}
              />
            </ModalShell>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/leads" className={`rounded-full border px-4 py-2 text-sm font-medium transition ${tabClass(false)}`}>
            Bảng lead
          </Link>
          <Link href="/admin/leads/pipeline" className={`rounded-full border px-4 py-2 text-sm font-medium transition ${tabClass(false)}`}>
            CRM Pipeline
          </Link>
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
          <div className="space-y-6">
            <LeadProgressBar status={lead.status} />
            <ThemeCard className="p-6">
              <CardTitle
                title="Tổng quan CRM"
                description={`Nhận lúc ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.created_at))}`}
                editLabel={`Sửa tổng quan: ${lead.name || lead.phone}`}
                editContent={
                  <form action={updateLeadCard} className="grid gap-4">
                    <input type="hidden" name="id" value={lead.id} />
                    <input type="hidden" name="section" value="overview" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Trạng thái
                        <select name="status" defaultValue={lead.status || "new"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
                          <option value="new">Mới tiếp nhận</option>
                          <option value="contacted">Đã liên hệ</option>
                          <option value="qualified">Đủ điều kiện</option>
                          <option value="survey_scheduled">Đặt lịch khảo sát</option>
                          <option value="survey_done">Khảo sát xong</option>
                          <option value="proposal_sent">Đã gửi giải pháp</option>
                          <option value="negotiation">Đàm phán / chốt</option>
                          <option value="won">Chốt thành công</option>
                          <option value="lost">Thất bại</option>
                          <option value="spam">Spam</option>
                        </select>
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Ưu tiên
                        <select name="priority" defaultValue={lead.priority || "normal"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
                          <option value="low">Thấp</option>
                          <option value="normal">Bình thường</option>
                          <option value="high">Cao</option>
                          <option value="urgent">Khẩn</option>
                        </select>
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Chủ phụ trách
                        <input name="owner_name" defaultValue={ownerName} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Hẹn tiếp theo
                        <input type="datetime-local" name="follow_up_at" defaultValue={lead.follow_up_at ? new Date(lead.follow_up_at).toISOString().slice(0, 16) : ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                    </div>
                    <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                      Ghi chú nội bộ
                      <textarea name="internal_note" rows={4} defaultValue={lead.internal_note || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                    </label>
                    <div className="flex justify-end gap-3">
                      <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-white">
                        Lưu tổng quan
                      </button>
                    </div>
                  </form>
                }
              />
              <div className="mt-5">
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
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-amber-200">Độ nóng lead</div>
                  <div className="mt-1 font-semibold text-amber-100">{getLeadHeatScore(lead)}/100</div>
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
              <CardTitle
                title="Thông tin lead"
                description="Sửa trực tiếp các trường liên hệ và nhu cầu."
                editLabel={`Sửa thông tin lead: ${lead.name || lead.phone}`}
                editContent={
                  <form action={updateLeadCard} className="grid gap-4">
                    <input type="hidden" name="id" value={lead.id} />
                    <input type="hidden" name="section" value="contact" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Họ tên
                        <input name="name" defaultValue={lead.name || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Điện thoại
                        <input name="phone" defaultValue={lead.phone || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Email
                        <input name="email" defaultValue={lead.email || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Địa chỉ
                        <input name="address" defaultValue={lead.address || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Loại hệ thống
                        <input name="system_type" defaultValue={lead.system_type || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Diện tích mái
                        <input name="roof_area" defaultValue={lead.roof_area || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Hóa đơn/tháng
                        <input name="monthly_bill" defaultValue={lead.monthly_bill || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Công suất đề xuất
                        <input name="system_size_kw" defaultValue={lead.system_size_kw || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                    </div>
                    <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                      Nhu cầu / nội dung
                      <textarea name="message" rows={4} defaultValue={lead.message || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                    </label>
                    <div className="flex justify-end gap-3">
                      <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-white">
                        Lưu thông tin
                      </button>
                    </div>
                  </form>
                }
              />
              <Field label="Họ tên" value={lead.name} /><Field label="Điện thoại" value={lead.phone} />
              <Field label="Email" value={lead.email} /><Field label="Địa chỉ" value={lead.address} />
              <Field label="Loại hệ thống" value={lead.system_type} /><Field label="Diện tích mái" value={lead.roof_area} />
              <Field label="Hóa đơn/tháng" value={formatMoneyVnd(lead.monthly_bill)} /><Field label="Công suất đề xuất" value={lead.system_size_kw ? `${lead.system_size_kw} kWp` : null} />
              <div className="sm:col-span-2"><Field label="Nhu cầu / nội dung" value={lead.message} /></div>
            </ThemeCard>
            <ThemeCard className="grid gap-5 p-6 sm:grid-cols-2">
              <CardTitle
                title="Nguồn lead"
                description="Chỉnh thông tin tracking và nguồn vào."
                editLabel={`Sửa nguồn lead: ${lead.name || lead.phone}`}
                editContent={
                  <form action={updateLeadCard} className="grid gap-4">
                    <input type="hidden" name="id" value={lead.id} />
                    <input type="hidden" name="section" value="source" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Form nguồn
                        <input name="source_form" defaultValue={lead.source_form || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Landing page
                        <input name="landing_page" defaultValue={lead.landing_page || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Content ID
                        <input name="content_id" defaultValue={lead.content_id || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        Content slug
                        <input name="content_slug" defaultValue={lead.content_slug || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        UTM source
                        <input name="utm_source" defaultValue={lead.utm_source || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        UTM medium
                        <input name="utm_medium" defaultValue={lead.utm_medium || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        UTM campaign
                        <input name="utm_campaign" defaultValue={lead.utm_campaign || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        UTM term
                        <input name="utm_term" defaultValue={lead.utm_term || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        GCLID
                        <input name="gclid" defaultValue={lead.gclid || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
                        FBCLID
                        <input name="fbclid" defaultValue={lead.fbclid || ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
                      </label>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button type="submit" className="rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-white">
                        Lưu nguồn
                      </button>
                    </div>
                  </form>
                }
              />
              <Field label="Form nguồn" value={lead.source_form} /><Field label="Landing page" value={lead.landing_page} />
              <Field label="Content ID" value={lead.content_id} /><Field label="Content slug" value={lead.content_slug} />
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
                                <div className="mt-1 break-words font-medium text-[color:var(--text)]"><ResultFieldValue fieldKey={key} value={value} /></div>
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
          <ThemeCard className="h-fit p-6 xl:sticky xl:top-6">
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
