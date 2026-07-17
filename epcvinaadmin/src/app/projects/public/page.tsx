import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function statusLabel(status?: string | null) {
  const value = String(status ?? "").toLowerCase();
  if (value === "active" || value === "public") return "Công khai";
  if (value === "draft") return "Bản nháp";
  return "Đã ẩn";
}

function statusTone(status?: string | null) {
  const value = String(status ?? "").toLowerCase();
  if (value === "active" || value === "public") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-700";
  if (value === "draft") return "border-amber-400/20 bg-amber-400/10 text-amber-700";
  return "border-slate-400/20 bg-slate-400/10 text-slate-600";
}

export default async function PublicProjectsPage() {
  const supabase = await createSupabaseServerClient();
  const publicClient = createSupabaseAdminClient() ?? supabase;
  const projects = publicClient
    ? ((await publicClient
        .from("projects")
        .select("id, slug, name, code, address, description, image_url, gallery_urls, status, is_active, sort_order, created_at")
        .or("status.eq.public,status.eq.active,is_active.eq.true")
        .order("sort_order", { ascending: true })).data ?? [])
    : [];

  const visibleCount = projects.filter((project: any) => String(project.status ?? "").toLowerCase() === "public" || String(project.status ?? "").toLowerCase() === "active" || project.is_active).length;
  const activeCount = projects.filter((project: any) => String(project.status ?? "").toLowerCase() === "active" || project.is_active).length;
  const hiddenCount = Math.max(projects.length - visibleCount, 0);

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
            <ThemeCard className="p-5">
              <SectionTitle eyebrow="Public view" title="Dự án public" description="Bố cục catalog có sidebar trái, đồng bộ với kiểu combo." />
              <div className="mt-5 space-y-2">
                <ThemeLinkButton href="/combos/public" tone="secondary" className="w-full justify-start rounded-2xl">
                  Combo public
                </ThemeLinkButton>
                <ThemeLinkButton href="/products/public" tone="secondary" className="w-full justify-start rounded-2xl">
                  Sản phẩm public
                </ThemeLinkButton>
                <ThemeLinkButton href="/system-advisor" tone="secondary" className="w-full justify-start rounded-2xl">
                  System advisor
                </ThemeLinkButton>
              </div>
            </ThemeCard>

            <ThemeCard className="p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Tổng quan</div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3">
                  <div className="text-sm text-[color:var(--muted)]">Dự án hiển thị</div>
                  <div className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{visibleCount}</div>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3">
                  <div className="text-sm text-[color:var(--muted)]">Đang active</div>
                  <div className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{activeCount}</div>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3">
                  <div className="text-sm text-[color:var(--muted)]">Đã ẩn</div>
                  <div className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{hiddenCount}</div>
                </div>
              </div>
            </ThemeCard>
          </aside>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-4">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Public view</div>
                <h1 className="mt-1 text-2xl font-semibold text-[color:var(--text)] md:text-3xl">Dự án public</h1>
                <p className="mt-1 max-w-2xl text-sm text-[color:var(--muted)]">
                  Danh sách dự án đã công bố, dùng để giới thiệu năng lực và tham khảo các công trình tiêu biểu.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ThemeLinkButton href="/combos/public" tone="secondary">
                  Combo public
                </ThemeLinkButton>
                <ThemeLinkButton href="/products/public" tone="secondary">
                  Sản phẩm public
                </ThemeLinkButton>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project: any) => {
                const cover = project.image_url || project.gallery_urls?.[0] || "/sample-combo.jpg";
                return (
                  <Link key={project.id} href={`/projects/public/${project.id}`} className="block">
                    <ThemeCard className="h-full overflow-hidden p-0 transition hover:-translate-y-0.5">
                      <div className="aspect-[4/3] w-full overflow-hidden bg-[color:var(--bg-elevated)]">
                        <img src={cover} alt={project.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="space-y-3 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">{project.code || "DỰ ÁN"}</div>
                            <h2 className="mt-1 line-clamp-2 text-lg font-semibold text-[color:var(--text)]">{project.name}</h2>
                          </div>
                          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] ${statusTone(project.status)}`}>
                            {statusLabel(project.status)}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">{project.address || project.description || "Dự án đã công bố."}</p>
                      </div>
                    </ThemeCard>
                  </Link>
                );
              })}
              {!projects.length ? (
                <ThemeCard className="p-6 text-sm text-[color:var(--muted)]">Chưa có dự án public.</ThemeCard>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
