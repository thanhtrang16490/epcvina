import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCachedComboCategories } from "@/lib/reference-data";

export const dynamic = "force-dynamic";

function isHiddenComboCategory(category: { name?: string; slug?: string }) {
  const name = String(category.name ?? "").toLowerCase();
  const slug = String(category.slug ?? "").toLowerCase();
  return slug === "hybrid-inverter" || name.includes("hybrid inverter");
}

function statusLabel(status?: string, isActive?: boolean) {
  const raw = String(status ?? "").toLowerCase();
  if (raw === "active" || raw === "public" || isActive) return "Active";
  if (raw === "inactive" || raw === "draft" || raw === "archive") return "Inactive";
  return "Draft";
}

function statusChip(status?: string, isActive?: boolean) {
  const raw = String(status ?? "").toLowerCase();
  if (raw === "active" || raw === "public" || isActive) return "border-emerald-400/30 bg-emerald-400/10 text-emerald-700";
  if (raw === "inactive" || raw === "draft" || raw === "archive") return "border-slate-400/30 bg-slate-400/10 text-slate-700";
  return "border-amber-400/30 bg-amber-400/10 text-amber-700";
}

export default async function ComboCategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryId = String(id ?? "");
  const supabase = createSupabaseAdminClient();
  if (!supabase || !categoryId) notFound();

  const [categoryRes, combosRes, categories] = await Promise.all([
    supabase.from("combo_categories").select("id, slug, name, description, image_url, status, is_active, sort_order").eq("id", categoryId).maybeSingle(),
    supabase.from("combos").select("id, code, name, slug, phase, battery_kwh, battery_type, reference_price, status, is_active, combo_category_id, sort_order").order("sort_order", { ascending: true }),
    getCachedComboCategories(),
  ]);

  const category = categoryRes.data;
  if (!category || isHiddenComboCategory(category)) notFound();
  const siblings = categories.filter((item: any) => !isHiddenComboCategory(item) && String(item.id) !== String(category.id)).slice(0, 8);
  const combos = (combosRes.data ?? []).filter((combo: any) => String(combo.combo_category_id ?? "") === String(category.id));
  const activeCount = combos.filter((combo: any) => String(combo.status ?? "").toLowerCase() === "active" || combo.is_active).length;

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-0">
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[radial-gradient(circle_at_top_right,_color-mix(in_srgb,var(--accent)_14%,transparent),_transparent_28%),linear-gradient(135deg,color-mix(in_srgb,var(--panel-strong)_94%,#fff_6%),var(--panel))] p-6 shadow-2xl md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--accent)]/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
                Danh mục combo
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--text)] md:text-6xl">{category.name}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
                Trang chi tiết nhóm combo, thống kê nhanh và danh sách combo thuộc nhóm này.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/combo-categories" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">
                Danh mục
              </Link>
              <Link href="/admin/combos" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">
                Combo
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Combo</div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{combos.length}</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Active</div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{activeCount}</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Nhóm khác</div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{siblings.length}</div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
                {category.image_url ? <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Thông tin nhóm</div>
                <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{category.name}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 text-xs font-medium text-[color:var(--text)]">{category.slug}</span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusChip(category.status, category.is_active)}`}>{statusLabel(category.status, category.is_active)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Mô tả</div>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[color:var(--text)]">{category.description || "Chưa có mô tả."}</div>
            </div>
            <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Nhóm khác</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {siblings.map((item: any) => (
                  <Link key={item.id} href={`/combo-categories/${item.id}`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1.5 text-xs text-[color:var(--text)] transition hover:bg-white/10">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Combo trong nhóm</div>
                <h2 className="mt-2 text-2xl font-semibold text-[color:var(--text)]">Danh sách combo</h2>
              </div>
              <div className="text-sm text-[color:var(--muted)]">{combos.length} combo</div>
            </div>
            <div className="mt-5 grid gap-3">
              {combos.map((combo: any) => (
                <Link key={combo.id} href={`/combos/${combo.id}`} className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 transition hover:bg-white/10 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium text-[color:var(--text)]">{combo.name}</div>
                    <div className="mt-1 text-sm text-[color:var(--muted)]">
                      {combo.code} · {combo.phase === 1 ? "1 pha" : "3 pha"} · {Number(combo.reference_price ?? 0).toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusChip(combo.status, combo.is_active)}`}>{statusLabel(combo.status, combo.is_active)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
