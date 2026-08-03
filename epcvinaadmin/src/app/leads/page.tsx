import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statuses: Record<string, { label: string; className: string }> = {
  new: { label: "Mới", className: "bg-cyan-400/15 text-cyan-300" },
  contacted: { label: "Đã liên hệ", className: "bg-blue-400/15 text-blue-300" },
  qualified: { label: "Đủ điều kiện", className: "bg-emerald-400/15 text-emerald-300" },
  survey_scheduled: { label: "Hẹn khảo sát", className: "bg-violet-400/15 text-violet-300" },
  quoted: { label: "Đã báo giá", className: "bg-amber-400/15 text-amber-300" },
  won: { label: "Thành công", className: "bg-green-400/15 text-green-300" },
  lost: { label: "Thất bại", className: "bg-rose-400/15 text-rose-300" },
  spam: { label: "Spam", className: "bg-slate-400/15 text-slate-300" },
};

function queryValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export default async function LeadsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const status = queryValue(params.status);
  const search = queryValue(params.q).replace(/[%_,()]/g, " ").trim();
  const supabase = createSupabaseAdminClient();
  let query = supabase
    ?.from("crm_leads")
    .select("id,name,phone,email,address,source_form,status,priority,utm_source,utm_campaign,landing_page,created_at", { count: "exact" })
    .order("created_at", { ascending: false });
  if (query && status) query = query.eq("status", status);
  if (query && search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  const result = query ? await query.range(start, end) : { data: [], count: 0, error: { message: "Thiếu Supabase admin env" } };
  const rows = result.data ?? [];

  const countsResult = supabase ? await supabase.from("crm_leads").select("status") : { data: [] };
  const counts = (countsResult.data ?? []).reduce<Record<string, number>>((acc, row: any) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <SectionTitle eyebrow="CRM" title="Lead từ website" description="Tiếp nhận và theo dõi khách hàng gửi từ epcvinasolar." />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[["new", "Lead mới"], ["contacted", "Đã liên hệ"], ["qualified", "Đủ điều kiện"], ["won", "Thành công"]].map(([key, label]) => (
            <ThemeCard key={key} className="p-5">
              <div className="text-sm text-[color:var(--muted)]">{label}</div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{counts[key] ?? 0}</div>
            </ThemeCard>
          ))}
        </div>

        <ThemeCard className="mt-6 p-5">
          <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <input name="q" defaultValue={search} placeholder="Tìm tên, số điện thoại, email..." className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
            <select name="status" defaultValue={status} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
              <option value="">Tất cả trạng thái</option>
              {Object.entries(statuses).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
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
                  return (
                    <tr key={lead.id} className="border-b border-[color:var(--border)]/70 last:border-0">
                      <td className="px-5 py-4"><div className="font-semibold text-[color:var(--text)]">{lead.name || "Chưa có tên"}</div><div className="mt-1 text-[color:var(--muted)]">{lead.phone}{lead.email ? ` · ${lead.email}` : ""}</div></td>
                      <td className="px-5 py-4 text-[color:var(--muted)]">{lead.source_form}</td>
                      <td className="px-5 py-4 text-[color:var(--muted)]">{lead.utm_source || "direct"}<div className="mt-1 text-xs">{lead.utm_campaign || "—"}</div></td>
                      <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}>{badge.label}</span></td>
                      <td className="px-5 py-4 text-[color:var(--muted)]">{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(lead.created_at))}</td>
                      <td className="px-5 py-4"><Link href={`/admin/leads/${lead.id}`} className="font-medium text-cyan-500 hover:underline">Xử lý</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!rows.length ? <div className="p-10 text-center text-[color:var(--muted)]">Chưa có lead phù hợp.</div> : null}
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
