import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { LeadsKanbanBoard } from "@/components/LeadsKanbanBoard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPage, getPageRange, getPageSize } from "@/lib/pagination";

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

export default async function LeadPipelinePage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 200, 500);
  const { start, end } = getPageRange(page, pageSize);
  const status = typeof params.status === "string" ? params.status.trim() : "";
  const search = typeof params.q === "string" ? params.q.trim().replace(/[%_,()]/g, " ") : "";
  const supabase = createSupabaseAdminClient();
  let query = supabase
    ?.from("crm_leads")
    .select("id,name,phone,email,source_form,status,priority,follow_up_at,created_at,metadata", { count: "exact" })
    .order("follow_up_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (query && status) query = query.eq("status", status);
  if (query && search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  const result = query ? await query.range(start, end) : { data: [], error: { message: "Thiếu Supabase admin env" } };
  const rows = result.data ?? [];
  const boardColumns = pipelineStatuses.map((statusKey) => ({
    key: statusKey,
    label: statuses[statusKey]?.label ?? statusKey,
    className: statuses[statusKey]?.className ?? "bg-slate-400/15 text-slate-300",
    items: rows.filter((lead: any) => lead.status === statusKey),
  }));

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <SectionTitle
          eyebrow="CRM Pipeline"
          title="Kanban lead"
          description="Trang riêng để kéo thả lead theo stage, tập trung cho đội sales xử lý pipeline."
        />
        <LeadsKanbanBoard columns={boardColumns} statusLabels={Object.fromEntries(pipelineStatuses.map((key) => [key, statuses[key]?.label ?? key]))} />
      </main>
    </AdminShell>
  );
}
