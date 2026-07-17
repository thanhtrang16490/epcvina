import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function getProjectCover(project: { image_url?: string | null; gallery_urls?: string[] | null }) {
  return project.image_url || project.gallery_urls?.[0] || "/sample-combo.jpg";
}

export default async function PublicProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const publicClient = createSupabaseAdminClient() ?? supabase;
  if (!publicClient) notFound();

  const projectRes = await publicClient
    .from("projects")
    .select("id, slug, name, code, address, description, image_url, gallery_urls, status, is_active, created_at, sort_order")
    .eq("id", id)
    .maybeSingle();

  const project = projectRes.data;
  if (!project || !(String(project.status ?? "").toLowerCase() === "public" || String(project.status ?? "").toLowerCase() === "active" || project.is_active)) {
    notFound();
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Project public</div>
            <h1 className="mt-1 text-3xl font-semibold text-[color:var(--text)]">{project.name}</h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{project.address || project.code || "-"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ThemeLinkButton href="/projects/public" tone="secondary">
              Danh sách dự án
            </ThemeLinkButton>
            <ThemeLinkButton href="/combos/public" tone="secondary">
              Combo public
            </ThemeLinkButton>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <ThemeCard className="overflow-hidden p-0">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[color:var(--bg-elevated)]">
              <img src={getProjectCover(project)} alt={project.name} className="h-full w-full object-cover" />
            </div>
          </ThemeCard>
          <ThemeCard className="space-y-4 p-6">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent)]">{project.code || "DỰ ÁN"}</div>
              <div className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{project.name}</div>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3">
                <div className="text-[color:var(--muted)]">Địa chỉ</div>
                <div className="mt-1 text-[color:var(--text)]">{project.address || "-"}</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3">
                <div className="text-[color:var(--muted)]">Mô tả</div>
                <div className="mt-1 text-[color:var(--text)]">{project.description || "Dự án đã được công bố."}</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3">
                <div className="text-[color:var(--muted)]">Trạng thái</div>
                <div className="mt-1 text-[color:var(--text)]">{String(project.status ?? "").toLowerCase() === "public" ? "Công khai" : "Active"}</div>
              </div>
            </div>
          </ThemeCard>
        </section>
      </div>
    </PublicShell>
  );
}
