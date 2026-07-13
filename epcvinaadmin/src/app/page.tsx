import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { RefreshDashboardButton } from "@/components/RefreshDashboardButton";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-0">
        <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.18),_transparent_28%),linear-gradient(135deg,rgba(9,14,24,0.98),rgba(12,24,40,0.92))] p-6 shadow-2xl shadow-slate-950/40 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-orange-200">
                Magento-style Admin
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
                EPCVINA Admin
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Điều hành combo, sản phẩm, brand và danh mục theo kiểu dashboard enterprise. Dữ liệu đang đọc từ Supabase thật để đồng bộ cho epcvinasolar về sau.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <RefreshDashboardButton />
              <Link href="/combos" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Combo</Link>
              <Link href="/products" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Sản phẩm</Link>
              <Link href="/brands" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Brand</Link>
            </div>
          </div>

          <DashboardMetrics />
        </section>
        <section className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <SectionTitle eyebrow="Tác vụ nhanh" title="Điểm vào chính" description="Đi tới module cần xử lý ngay, không cần cuộn nhiều." />
            <div className="mt-5 grid gap-3">
              <Link href="/products" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white">Quản lý sản phẩm</Link>
              <Link href="/combos" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white">Quản lý combo</Link>
              <Link href="/brands" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white">Brand</Link>
              <Link href="/product-categories" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white">Danh mục sản phẩm</Link>
              <Link href="/combo-categories" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white">Danh mục combo</Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <SectionTitle eyebrow="Tích hợp" title="API & dữ liệu" description="Các bảng này sẽ là nguồn dữ liệu cho epcvinasolar." />
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-orange-300">GET /api/catalog</div>
                <div className="mt-1 text-slate-400">Catalog tổng hợp từ Supabase.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-orange-300">GET /api/combos</div>
                <div className="mt-1 text-slate-400">Danh sách combo cho public site.</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
