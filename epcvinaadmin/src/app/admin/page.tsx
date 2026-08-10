import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { RefreshDashboardButton } from "@/components/RefreshDashboardButton";
import { DashboardMetrics } from "@/components/DashboardMetrics";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-0">
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[radial-gradient(circle_at_top_right,_color-mix(in_srgb,var(--accent)_16%,transparent),_transparent_28%),linear-gradient(135deg,color-mix(in_srgb,var(--panel-strong)_92%,#fff_8%),var(--panel))] p-6 shadow-2xl md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--accent)]/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
                Magento-style Admin
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--text)] md:text-6xl">
                EPCVINA Admin
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
                Điều hành combo, sản phẩm, brand và danh mục theo kiểu dashboard enterprise. Dữ liệu đang đọc từ Supabase thật để đồng bộ cho epcvinasolar về sau.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <RefreshDashboardButton />
              <Link href="/admin/combos" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Combo</Link>
              <Link href="/admin/products" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Sản phẩm</Link>
              <Link href="/admin/brands" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Brand</Link>
              <Link href="/admin/content" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Content</Link>
            </div>
          </div>

          <DashboardMetrics />
        </section>
        <section className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
            <SectionTitle eyebrow="Tác vụ nhanh" title="Điểm vào chính" description="Đi tới module cần xử lý ngay, không cần cuộn nhiều." />
            <div className="mt-5 grid gap-3">
              <Link href="/admin/products" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-4 text-[color:var(--text)]">Quản lý sản phẩm</Link>
              <Link href="/admin/combos" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-4 text-[color:var(--text)]">Quản lý combo</Link>
              <Link href="/admin/brands" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-4 text-[color:var(--text)]">Brand</Link>
              <Link href="/admin/product-categories" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-4 text-[color:var(--text)]">Danh mục sản phẩm</Link>
              <Link href="/admin/combo-categories" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-4 text-[color:var(--text)]">Danh mục combo</Link>
              <Link href="/admin/content" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-4 text-[color:var(--text)]">Content Hub</Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
            <SectionTitle eyebrow="Tích hợp" title="API & dữ liệu" description="Các bảng này sẽ là nguồn dữ liệu cho epcvinasolar." />
            <div className="mt-4 space-y-3 text-sm text-[color:var(--text)]">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-[color:var(--accent)]">GET /api/catalog</div>
                <div className="mt-1 text-[color:var(--muted)]">Catalog tổng hợp từ Supabase.</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="text-[color:var(--accent)]">GET /api/combos</div>
                <div className="mt-1 text-[color:var(--muted)]">Danh sách combo cho public site.</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
