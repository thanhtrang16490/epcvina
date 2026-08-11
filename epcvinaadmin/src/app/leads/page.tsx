import { AdminShell } from "@/components/AdminShell";
import { LeadCreateModal } from "@/components/LeadCreateModal";
import { LeadDeleteConfirm } from "@/components/LeadDeleteConfirm";
import { PageToast } from "@/components/PageToast";
import { SectionTitle } from "@/components/SectionTitle";
import { ModalShell } from "@/components/ModalShell";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { notifyTelegramAboutLeadAction } from "@/lib/telegram-leads";
import { revalidatePath } from "next/cache";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const statuses: Record<string, { label: string; className: string }> = {
  new: { label: "Mới tiếp nhận", className: "bg-cyan-400/15 text-cyan-300" },
  contacted: { label: "Đã liên hệ", className: "bg-blue-400/15 text-blue-300" },
  qualified: { label: "Đủ điều kiện", className: "bg-sky-400/15 text-sky-300" },
  survey_scheduled: { label: "Đặt lịch khảo sát", className: "bg-violet-400/15 text-violet-300" },
  survey_done: { label: "Khảo sát xong", className: "bg-indigo-400/15 text-indigo-300" },
  proposal_sent: { label: "Đã gửi giải pháp", className: "bg-amber-400/15 text-amber-300" },
  negotiation: { label: "Đàm phán / chốt", className: "bg-orange-400/15 text-orange-300" },
  won: { label: "Chốt thành công", className: "bg-green-400/15 text-green-300" },
  lost: { label: "Thất bại", className: "bg-rose-400/15 text-rose-300" },
  spam: { label: "Spam", className: "bg-slate-400/15 text-slate-300" },
};
const pipelineStatuses = ["new", "contacted", "qualified", "survey_scheduled", "survey_done", "proposal_sent", "negotiation", "won", "lost", "spam"];
const leadSourceTags = [
  { value: "website", label: "Website" },
  { value: "manual", label: "Tạo tay" },
  { value: "call", label: "Gọi điện" },
  { value: "facebook", label: "Facebook" },
  { value: "zalo", label: "Zalo" },
  { value: "referral", label: "Giới thiệu" },
  { value: "event", label: "Sự kiện" },
  { value: "other", label: "Khác" },
] as const;

function queryValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function getStatusLabel(status: string) {
  return statuses[status]?.label ?? "Mới";
}

function getDaysSince(value: string | null | undefined) {
  if (!value) return null;
  const diff = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diff) || diff < 0) return null;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getFollowUpState(lead: any) {
  const followUpAt = lead.follow_up_at ? new Date(lead.follow_up_at).getTime() : null;
  if (!followUpAt) return { label: "Chưa hẹn", className: "bg-slate-400/15 text-slate-300" };
  if (followUpAt < Date.now()) return { label: "Quá hạn", className: "bg-rose-400/15 text-rose-300" };
  return { label: "Sắp tới", className: "bg-emerald-400/15 text-emerald-300" };
}

function getLeadPriorityRank(priority: string | null | undefined) {
  const value = String(priority ?? "normal").toLowerCase();
  return ({ low: 1, normal: 2, high: 3, urgent: 4 } as Record<string, number>)[value] ?? 2;
}

function getLeadHeatScore(lead: any) {
  let score = 25;
  score += getLeadPriorityRank(lead.priority) * 8;
  if (lead.follow_up_at && new Date(lead.follow_up_at).getTime() < Date.now()) score += 18;
  if (lead.status === "new") score += 6;
  if (lead.status === "contacted") score += 12;
  if (lead.status === "qualified") score += 8;
  if (lead.last_contacted_at) {
    const daysSinceContact = getDaysSince(lead.last_contacted_at) ?? 0;
    score += Math.max(0, 14 - daysSinceContact);
  } else {
    score += 10;
  }
  return Math.min(100, score);
}

function getLeadTabClass(active: boolean) {
  return active
    ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
    : "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)] hover:bg-white/10";
}

function ActionIcon({ type }: { type: "process" | "call" | "email" | "remind" | "delete" }) {
  if (type === "process") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7h16M4 12h10M4 17h16" />
      </svg>
    );
  }
  if (type === "call") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 6.5c0 7.2 5.8 13 13 13l2-2.8c.2-.3.1-.7-.2-.9l-3-1.9c-.3-.2-.7-.2-1 0l-1.2 1c-2.2-1-4-2.8-5-5l1-1.2c.2-.3.2-.7 0-1l-1.9-3c-.2-.3-.6-.4-.9-.2l-2.8 2z" />
      </svg>
    );
  }
  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }
  if (type === "remind") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 3v3M16 3v3M4 8h16" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M12 11v4l3 2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 14h10l1-14" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

function getLeadOwner(lead: any) {
  return typeof lead?.metadata?.owner_name === "string" ? lead.metadata.owner_name : "";
}

async function createManualLead(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const now = new Date().toISOString();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const ownerName = String(formData.get("owner_name") ?? "").trim();
  const sourceTag = String(formData.get("source_tag") ?? "manual").trim();
  const sourceLabel = leadSourceTags.find((item) => item.value === sourceTag)?.label ?? "Tạo tay";
  if (!name && !phone) return;
  const { error } = await supabase.from("crm_leads").insert({
    name: name || null,
    phone: phone || null,
    email: email || null,
    source: "admin",
    source_form: "admin/manual",
    status: "new",
    priority: "normal",
    created_at: now,
    updated_at: now,
    metadata: {
      owner_name: ownerName || null,
      source_tag: sourceTag,
      source_label: sourceLabel,
      last_activity_at: now,
      activity_log: [{ at: now, type: "note", note: "Lead được tạo thủ công từ admin.", author: ownerName || null }],
    },
  });
  if (error) throw error;
  await notifyTelegramAboutLeadAction(
    {
      id: "admin-manual",
      name: name || null,
      phone: phone || "—",
      email: email || null,
      address: null,
      message: null,
      source_form: "admin/manual",
      system_type: null,
      roof_area: null,
      monthly_bill: null,
      system_size_kw: null,
      landing_page: null,
      utm_source: null,
      utm_campaign: null,
    },
    { kind: "admin_manual", label: "Tạo lead thủ công trong admin", author: ownerName || null },
  );
  revalidatePath("/leads");
  redirect("/admin/leads?created=1");
}

async function updateLeadStage(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const now = new Date().toISOString();
  const { data: current } = await supabase.from("crm_leads").select("first_contacted_at,status,metadata,name,phone,email,address,message,source_form,system_type,roof_area,monthly_bill,system_size_kw,landing_page,utm_source,utm_campaign").eq("id", id).single();
  const currentMetadata = (current?.metadata && typeof current.metadata === "object" && !Array.isArray(current.metadata) ? current.metadata : {}) as Record<string, unknown>;
  const values: Record<string, unknown> = {
    status,
    updated_at: now,
    metadata: {
      ...currentMetadata,
      last_activity_at: now,
      activity_log: [
        { at: now, type: "note", note: `Đổi stage sang ${getStatusLabel(status)}`, author: null },
        ...(Array.isArray(currentMetadata.activity_log) ? currentMetadata.activity_log : []),
      ].slice(0, 20),
    },
  };
  if (status !== "new") values.last_contacted_at = now;
  if (status !== "new" && !current?.first_contacted_at) values.first_contacted_at = now;
  await supabase.from("crm_leads").update(values).eq("id", id);
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
}

async function addLeadQuickActivity(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const activityType = String(formData.get("activity_type") ?? "note");
  const note = String(formData.get("note") ?? "").trim();
  if (!id || !note) return;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const now = new Date().toISOString();
  const { data: current } = await supabase.from("crm_leads").select("metadata,status,first_contacted_at").eq("id", id).single();
  const currentMetadata = (current?.metadata && typeof current.metadata === "object" && !Array.isArray(current.metadata) ? current.metadata : {}) as Record<string, unknown>;
  const activityLog = Array.isArray(currentMetadata.activity_log) ? currentMetadata.activity_log : [];
  const values: Record<string, unknown> = {
    updated_at: now,
    last_contacted_at: now,
    metadata: {
      ...currentMetadata,
      last_activity_at: now,
      activity_log: [
        { at: now, type: activityType, note, author: null },
        ...activityLog,
      ].slice(0, 20),
    },
  };
  if (!current?.first_contacted_at) values.first_contacted_at = now;
  await supabase.from("crm_leads").update(values).eq("id", id);
  await notifyTelegramAboutLeadAction(
    {
      id,
      name: current?.name ?? null,
      phone: current?.phone ?? "—",
      email: current?.email ?? null,
      address: current?.address ?? null,
      message: current?.message ?? null,
      source_form: current?.source_form ?? "admin/update",
      system_type: current?.system_type ?? null,
      roof_area: current?.roof_area ?? null,
      monthly_bill: current?.monthly_bill ?? null,
      system_size_kw: current?.system_size_kw ?? null,
      landing_page: current?.landing_page ?? null,
      utm_source: current?.utm_source ?? null,
      utm_campaign: current?.utm_campaign ?? null,
    },
    { kind: "stage", label: `Cập nhật trạng thái ${getStatusLabel(status)}` },
  );
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  redirect("/admin/leads?updated=1");
}

async function deleteLead(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const { error } = await supabase.from("crm_leads").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  redirect("/admin/leads?deleted=1");
}

export default async function LeadsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const status = queryValue(params.status);
  const owner = queryValue(params.owner);
  const overdue = queryValue(params.overdue) === "1";
  const created = queryValue(params.created) === "1";
  const deleted = queryValue(params.deleted) === "1";
  const updated = queryValue(params.updated) === "1";
  const search = queryValue(params.q).replace(/[%_,()]/g, " ").trim();
  const supabase = createSupabaseAdminClient();
  let query = supabase
    ?.from("crm_leads")
    .select("id,name,phone,email,address,source,source_form,status,priority,follow_up_at,last_contacted_at,first_contacted_at,lost_reason,utm_source,utm_campaign,landing_page,created_at,metadata", { count: "exact" })
    .order("follow_up_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (query && status) query = query.eq("status", status);
  if (query && search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  if (query && owner) query = query.contains("metadata", { owner_name: owner });
  const result = query ? await query.range(start, end) : { data: [], count: 0, error: { message: "Thiếu Supabase admin env" } };
  const rows = (result.data ?? []).filter((lead: any) => {
    if (!overdue) return true;
    return lead.follow_up_at && new Date(lead.follow_up_at).getTime() < Date.now();
  });

  const countsResult = supabase ? await supabase.from("crm_leads").select("status") : { data: [] };
  const counts = (countsResult.data ?? []).reduce<Record<string, number>>((acc, row: any) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});
  const ownerOptions = Array.from(
    new Set(
      rows
        .map((lead: any) => getLeadOwner(lead))
        .filter(Boolean),
    ),
  ).sort((left, right) => left.localeCompare(right));

  const kpiCards = [
    { label: "Lead mới", value: counts.new ?? 0 },
    { label: "Đã liên hệ", value: counts.contacted ?? 0 },
    { label: "Đủ điều kiện", value: counts.qualified ?? 0 },
    { label: "Quá hạn follow-up", value: rows.filter((lead: any) => lead.follow_up_at && new Date(lead.follow_up_at).getTime() < Date.now()).length },
  ];
  const activeFilters = [
    search ? { label: "Từ khóa", value: search } : null,
    status ? { label: "Trạng thái", value: statuses[status]?.label ?? status } : null,
    owner ? { label: "Owner", value: owner } : null,
    overdue ? { label: "Hẹn", value: "Quá hạn follow-up" } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;
  const resetHref = "/admin/leads";
  const quickFilterLinks = [
    { label: "Tất cả", href: "/admin/leads", active: !status && !owner && !overdue && !search },
    { label: "Mới", href: "/admin/leads?status=new", active: status === "new" },
    { label: "Đã liên hệ", href: "/admin/leads?status=contacted", active: status === "contacted" },
    { label: "Đang quá hạn", href: "/admin/leads?overdue=1", active: overdue },
    { label: "Chưa có owner", href: "/admin/leads?owner=", active: false },
  ];
  const ownerQuickLinks = ownerOptions.slice(0, 8).map((name) => ({
    label: name,
    href: `/admin/leads?${new URLSearchParams({ ...(search ? { q: search } : {}), ...(status ? { status } : {}), owner: name, ...(overdue ? { overdue: "1" } : {}) })}`,
    active: owner === name,
  }));
  const hotLeadCount = rows.filter((lead: any) => getLeadHeatScore(lead) >= 65).length;
  return (
    <AdminShell>
      {created ? <PageToast title="Tạo lead thành công" description="Lead mới đã được lưu vào CRM." tone="success" /> : null}
      {deleted ? <PageToast title="Đã xoá lead" description="Lead đã được xoá khỏi danh sách." tone="info" /> : null}
      {updated ? <PageToast title="Đã lưu cập nhật" description="Trạng thái hoặc ghi chú lead đã được cập nhật." tone="success" /> : null}
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <SectionTitle
          eyebrow="CRM"
          title="Bảng lead chung"
          description="Bảng tổng hợp lead chung, gồm lead từ website và lead nhập thủ công trong admin."
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/leads" className={`rounded-full border px-4 py-2 text-sm font-medium transition ${getLeadTabClass(true)}`}>
            Bảng lead
          </Link>
          <Link href="/admin/leads/pipeline" className={`rounded-full border px-4 py-2 text-sm font-medium transition ${getLeadTabClass(false)}`}>
            CRM Pipeline
          </Link>
        </div>

        <ThemeCard className="mt-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">CRM thủ công</div>
              <h2 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Tạo lead ngay trong admin</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Bấm nút để mở popup thêm lead nhanh.</p>
            </div>
            <LeadCreateModal
              trigger={<span className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">Thêm lead</span>}
              title="Tạo lead thủ công"
              description="Nhập nhanh lead ngoài website, Facebook, gọi điện hoặc nguồn khác."
              onSubmit={createManualLead}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm text-[color:var(--muted)]">Tên khách hàng</label>
                  <input name="name" placeholder="Tên khách hàng" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-[color:var(--muted)]">Số điện thoại</label>
                  <input name="phone" placeholder="Số điện thoại" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-[color:var(--muted)]">Email</label>
                  <input name="email" placeholder="Email" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-[color:var(--muted)]">Owner</label>
                  <input name="owner_name" list="lead-owner-options" placeholder="Owner" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                  <datalist id="lead-owner-options">
                    {ownerOptions.map((name) => <option key={name} value={name} />)}
                  </datalist>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-[color:var(--muted)]">Nguồn lead</label>
                <select name="source_tag" defaultValue="manual" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
                  {leadSourceTags.map((tag) => <option key={tag.value} value={tag.value}>{tag.label}</option>)}
                </select>
                <div className="flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
                  {leadSourceTags.slice(0, 5).map((tag) => (
                    <span key={tag.value} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1">{tag.label}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Tạo lead</button>
              </div>
            </LeadCreateModal>
          </div>
        </ThemeCard>

        <ThemeCard className="mt-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Tổng quan danh sách</div>
              <div className="mt-1 text-sm text-[color:var(--text)]">
                Đang hiển thị <span className="font-semibold">{rows.length}</span> lead trên tổng <span className="font-semibold">{Number(result.count ?? 0)}</span> lead.
              </div>
              <div className="mt-2 text-xs text-[color:var(--muted)]">
                {hotLeadCount ? (
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-amber-200">
                    {hotLeadCount} lead nóng
                  </span>
                ) : (
                  <span>Chưa có lead nóng nổi bật.</span>
                )}
              </div>
            </div>
            {activeFilters.length ? (
              <a href={resetHref} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm text-[color:var(--text)] transition hover:bg-white/10">
                Xoá bộ lọc
              </a>
            ) : null}
          </div>
          {activeFilters.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <span key={`${filter.label}-${filter.value}`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-xs text-[color:var(--muted)]">
                  {filter.label}: {filter.value}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-3 text-xs text-[color:var(--muted)]">Chưa áp dụng bộ lọc nào.</div>
          )}
        </ThemeCard>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickFilterLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                item.active
                  ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                  : "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)] hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {ownerQuickLinks.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Owner
            </span>
            {ownerQuickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${getLeadTabClass(item.active)}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => (
            <ThemeCard key={card.label} className="p-5">
              <div className="text-sm text-[color:var(--muted)]">{card.label}</div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{card.value}</div>
            </ThemeCard>
          ))}
        </div>

        <ThemeCard className="mt-6 p-5">
          <form className="grid gap-3 md:grid-cols-[1fr_200px_220px_auto]">
            <input name="q" defaultValue={search} placeholder="Tìm tên, số điện thoại, email..." className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
            <select name="status" defaultValue={status} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
              <option value="">Tất cả trạng thái</option>
              {Object.entries(statuses).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
            </select>
            <select name="owner" defaultValue={owner} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
              <option value="">Tất cả owner</option>
              {ownerOptions.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <button className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Lọc lead</button>
          </form>
        </ThemeCard>

        <ThemeCard className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-[color:var(--border)] text-[color:var(--muted)]">
                <tr>{["Khách hàng", "Nguồn", "Chiến dịch", "Trạng thái", "Thời gian", ""].map((item) => <th key={item} className="px-5 py-4 font-medium">{item}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((lead: any) => {
                  const badge = statuses[lead.status] ?? statuses.new;
                  const followUp = getFollowUpState(lead);
                  const daysSince = getDaysSince(lead.created_at);
                  return (
                    <tr key={lead.id} className="border-b border-[color:var(--border)]/70 last:border-0">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[color:var(--text)]">{lead.name || "Chưa có tên"}</div>
                        <div className="mt-1 text-[color:var(--muted)]">{lead.phone}{lead.email ? ` · ${lead.email}` : ""}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                          <span className={`rounded-full px-2.5 py-1 ${followUp.className}`}>{followUp.label}</span>
                          <span className="rounded-full bg-white/5 px-2.5 py-1 text-[color:var(--muted)]">{daysSince ?? 0} ngày</span>
                          <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-amber-200">Score {getLeadHeatScore(lead)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[color:var(--muted)]">
                        <div>{lead.source_form || lead.source || "—"}</div>
                        <div className="mt-1 text-xs">{lead.landing_page || "—"}</div>
                        <div className="mt-2 inline-flex rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-[color:var(--muted)]">
                          {typeof lead.metadata?.source_label === "string"
                            ? lead.metadata.source_label
                            : typeof lead.metadata?.source_tag === "string"
                              ? lead.metadata.source_tag
                              : "Nguồn"}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[color:var(--muted)]">
                        {lead.utm_source || "direct"}
                        <div className="mt-1 text-xs">{lead.utm_campaign || "—"}</div>
                      </td>
                      <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}>{badge.label}</span></td>
                      <td className="px-5 py-4 text-[color:var(--muted)]">
                        <div>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(lead.created_at))}</div>
                        <div className="mt-1 text-xs">{lead.follow_up_at ? `Hẹn: ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(lead.follow_up_at))}` : "Chưa có hẹn"}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/15"
                            aria-label={`Xử lý lead ${lead.name || lead.phone || lead.id}`}
                          >
                            <ActionIcon type="process" />
                            Xử lý
                          </Link>
                          <form action={addLeadQuickActivity}>
                            <input type="hidden" name="id" value={lead.id} />
                            <input type="hidden" name="activity_type" value="call" />
                            <input type="hidden" name="note" value="Đã gọi nhanh từ danh sách lead." />
                            <button
                              type="submit"
                              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 text-xs font-semibold text-sky-300 transition hover:border-sky-400/40 hover:bg-sky-400/15"
                              aria-label={`Gọi lead ${lead.name || lead.phone || lead.id}`}
                            >
                              <ActionIcon type="call" />
                            </button>
                          </form>
                          <form action={addLeadQuickActivity}>
                            <input type="hidden" name="id" value={lead.id} />
                            <input type="hidden" name="activity_type" value="email" />
                            <input type="hidden" name="note" value="Đã gửi email nhanh từ danh sách lead." />
                            <button
                              type="submit"
                              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 text-xs font-semibold text-violet-300 transition hover:border-violet-400/40 hover:bg-violet-400/15"
                              aria-label={`Gửi email cho lead ${lead.name || lead.phone || lead.id}`}
                            >
                              <ActionIcon type="email" />
                            </button>
                          </form>
                          <form action={addLeadQuickActivity}>
                            <input type="hidden" name="id" value={lead.id} />
                            <input type="hidden" name="activity_type" value="meeting" />
                            <input type="hidden" name="note" value="Đã tạo nhắc hẹn nhanh từ danh sách lead." />
                            <button
                              type="submit"
                              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/40 hover:bg-emerald-400/15"
                              aria-label={`Tạo nhắc hẹn cho lead ${lead.name || lead.phone || lead.id}`}
                            >
                              <ActionIcon type="remind" />
                            </button>
                          </form>
                          <ModalShell
                            trigger={
                              <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 text-xs font-semibold text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-400/15">
                                <ActionIcon type="delete" />
                                Xoá
                              </span>
                            }
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!rows.length ? (
            <div className="p-10 text-center text-[color:var(--muted)]">
              <div className="mx-auto max-w-md">
                <div className="text-lg font-semibold text-[color:var(--text)]">Chưa có lead phù hợp</div>
                <p className="mt-2 text-sm leading-6">Thử bỏ bớt bộ lọc hoặc tạo thêm lead mới để danh sách có dữ liệu hiển thị.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <a href={resetHref} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm text-[color:var(--text)] transition hover:bg-white/10">
                    Xoá bộ lọc
                  </a>
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--muted)]">
                    Dùng nút Thêm lead ở đầu trang
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </ThemeCard>

        <div className="mt-5 flex items-center justify-between text-sm text-[color:var(--muted)]">
          <span>Trang {page} / {getPageCount(Number(result.count ?? 0), pageSize)}</span>
          <div className="flex gap-2">
            {page > 1 ? <Link href={`?${new URLSearchParams({ ...(search ? { q: search } : {}), ...(status ? { status } : {}), page: String(page - 1) })}`} className="rounded-xl border border-[color:var(--border)] px-4 py-2">Trước</Link> : null}
            {Number(result.count ?? 0) > end + 1 ? <Link href={`?${new URLSearchParams({ ...(search ? { q: search } : {}), ...(status ? { status } : {}), page: String(page + 1) })}`} className="rounded-xl border border-[color:var(--border)] px-4 py-2">Sau</Link> : null}
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
