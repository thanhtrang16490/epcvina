import { AdminShell } from "@/components/AdminShell";
import { LeadDeleteConfirm } from "@/components/LeadDeleteConfirm";
import { SectionTitle } from "@/components/SectionTitle";
import { ModalShell } from "@/components/ModalShell";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import Link from "next/link";

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
  revalidatePath("/leads");
}

async function updateLeadStage(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const now = new Date().toISOString();
  const { data: current } = await supabase.from("crm_leads").select("first_contacted_at,status,metadata").eq("id", id).single();
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
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
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
}

export default async function LeadsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const status = queryValue(params.status);
  const owner = queryValue(params.owner);
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
  const rows = result.data ?? [];

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
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <SectionTitle
          eyebrow="CRM"
          title="Bảng lead chung"
          description="Bảng tổng hợp lead chung, gồm lead từ website và lead nhập thủ công trong admin."
        />

        <ThemeCard className="mt-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">CRM thủ công</div>
              <h2 className="mt-2 text-xl font-semibold text-[color:var(--text)]">Tạo lead ngay trong admin</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Bấm nút để mở popup thêm lead nhanh.</p>
            </div>
            <ModalShell
              trigger={<span className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">Thêm lead</span>}
              title="Tạo lead thủ công"
              description="Nhập nhanh lead ngoài website, Facebook, gọi điện hoặc nguồn khác."
            >
              <form action={createManualLead} className="grid gap-4">
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
              </form>
            </ModalShell>
          </div>
        </ThemeCard>

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
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/admin/leads/${lead.id}`} className="font-medium text-cyan-500 hover:underline">Xử lý</Link>
                          <ModalShell
                            trigger={<span className="font-medium text-rose-400 hover:underline">Xoá</span>}
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
          {!rows.length ? <div className="p-10 text-center text-[color:var(--muted)]">Chưa có lead phù hợp.</div> : null}
        </ThemeCard>

        <div className="mt-8 flex items-center justify-between gap-4 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] px-5 py-4">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">CRM Pipeline</div>
            <div className="mt-1 text-lg font-semibold text-[color:var(--text)]">Kanban lead</div>
            <div className="mt-1 text-sm text-[color:var(--muted)]">Đã tách sang trang riêng để kéo thả theo stage.</div>
          </div>
          <Link href="/admin/leads/pipeline" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">
            Mở CRM Pipeline
          </Link>
        </div>

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
