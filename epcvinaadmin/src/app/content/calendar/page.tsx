import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function loadScheduledContent() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [] as Array<{ id: string; title: string; status: string; scheduled_at: string | null; content_type: string; desired_channels: string[] | null; }>;
  const { data } = await supabase
    .from("content_posts")
    .select("id, title, status, scheduled_at, content_type, desired_channels")
    .order("scheduled_at", { ascending: true, nullsFirst: false })
    .limit(100);
  return (data ?? []) as Array<{ id: string; title: string; status: string; scheduled_at: string | null; content_type: string; desired_channels: string[] | null; }>;
}

function formatDayKey(value: string | null) {
  if (!value) return "unscheduled";
  return new Date(value).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });
}

export default async function ContentCalendarPage() {
  const rows = await loadScheduledContent();
  const grouped = rows.reduce<Record<string, typeof rows>>((acc, row) => {
    const key = formatDayKey(row.scheduled_at);
    acc[key] = acc[key] ?? [];
    acc[key].push(row);
    return acc;
  }, {});
  const keys = Object.keys(grouped);

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <SectionTitle eyebrow="Marketing" title="Content Calendar" description="Nhìn nhanh lịch đăng, trạng thái và kênh ưu tiên của từng bài." />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/content" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Content Hub</Link>
          <Link href="/admin/content/new" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Tạo bài</Link>
        </div>

        <div className="mt-6 grid gap-6">
          {keys.length === 0 ? (
            <ThemeCard className="p-6">
              <div className="text-sm text-[color:var(--muted)]">Chưa có bài nào được lên lịch.</div>
            </ThemeCard>
          ) : keys.map((key) => (
            <ThemeCard key={key} className="p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-[color:var(--text)]">{key}</h3>
                <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1 text-xs text-[color:var(--muted)]">{grouped[key].length} items</span>
              </div>
              <div className="mt-4 grid gap-3">
                {grouped[key].map((row) => (
                  <Link key={row.id} href={`/admin/content/${row.id}`} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 transition hover:-translate-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{row.status}</span>
                      <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{row.content_type}</span>
                      {(row.desired_channels ?? []).slice(0, 3).map((channel) => (
                        <span key={channel} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{channel}</span>
                      ))}
                    </div>
                    <div className="mt-2 text-[color:var(--text)]">{row.title}</div>
                    <div className="mt-1 text-sm text-[color:var(--muted)]">{row.scheduled_at ? new Date(row.scheduled_at).toLocaleString("vi-VN") : "Chưa có lịch"}</div>
                  </Link>
                ))}
              </div>
            </ThemeCard>
          ))}
        </div>
      </main>
    </AdminShell>
  );
}
