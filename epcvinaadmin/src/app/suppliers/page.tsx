import { AdminShell } from "@/components/AdminShell";
import { ModalShell } from "@/components/ModalShell";
import { SectionTitle } from "@/components/SectionTitle";
import { SlugField } from "@/components/SlugField";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import { slugify } from "@/lib/slug";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createSupplier(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  await supabase.from("suppliers").insert({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    contact_name: String(formData.get("contact_name") ?? "").trim() || null,
    website: String(formData.get("website") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("is_active") ?? "true") === "true",
  });
  revalidatePath("/suppliers");
  redirect("/suppliers");
}

async function updateSupplier(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  await supabase.from("suppliers").update({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    contact_name: String(formData.get("contact_name") ?? "").trim() || null,
    website: String(formData.get("website") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("is_active") ?? "true") === "true",
  }).eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/suppliers");
  redirect("/suppliers");
}

export default async function SuppliersPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const supabase = createSupabaseAdminClient();
  const rowsRes = supabase ? await supabase.from("suppliers").select("id, slug, name, phone, email, address, contact_name, website, note, sort_order, is_active, created_at", { count: "exact" }).order("sort_order", { ascending: true }).range(start, end) : { data: [], count: 0 };
  const rows = rowsRes.data ?? [];
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="CRM" title="Nhà cung cấp" description="Quản lý nhà cung cấp và ánh xạ sang sản phẩm." />
          <Link href="/supplier-products" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Ánh xạ SP</Link>
        </div>
        <div className="mb-4 flex justify-end">
          <ModalShell trigger={<span className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">Thêm nhà cung cấp</span>} title="Thêm nhà cung cấp" description="Tạo nhà cung cấp mới.">
            <form action={createSupplier} className="grid gap-3">
              <SlugField name="name" label="Tên nhà cung cấp" placeholder="Tên nhà cung cấp" />
              <input name="contact_name" placeholder="Người liên hệ" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input name="phone" placeholder="Số điện thoại" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input name="email" placeholder="Email" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input name="website" placeholder="Website" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input name="address" placeholder="Địa chỉ" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <textarea name="note" rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Tạo nhà cung cấp</button>
            </form>
          </ModalShell>
        </div>
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="space-y-3">
            {rows.map((row: any) => (
              <div key={row.id} className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-center">
                <div>
                  <div className="font-medium text-white">{row.name}</div>
                  <div className="mt-2"><span className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">{row.slug}</span></div>
                </div>
                <div className="text-sm text-slate-300">{row.contact_name || "-"}</div>
                <div className="text-sm text-slate-300">{row.phone || row.email || "-"}</div>
                <div className="flex gap-2">
                  <ModalShell trigger={<span className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">Sửa</span>} title={`Sửa nhà cung cấp: ${row.name}`} description="Chỉnh trực tiếp trong modal.">
                    <form action={updateSupplier} className="grid gap-3">
                      <input type="hidden" name="id" value={row.id} />
                      <SlugField name="name" label="Tên nhà cung cấp" defaultValue={row.name} defaultSlug={row.slug} />
                      <input name="contact_name" defaultValue={row.contact_name ?? ""} placeholder="Người liên hệ" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="phone" defaultValue={row.phone ?? ""} placeholder="Số điện thoại" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="email" defaultValue={row.email ?? ""} placeholder="Email" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="website" defaultValue={row.website ?? ""} placeholder="Website" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="address" defaultValue={row.address ?? ""} placeholder="Địa chỉ" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <textarea name="note" defaultValue={row.note ?? ""} rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lưu</button>
                    </form>
                  </ModalShell>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-slate-400">Trang {page} / {getPageCount(Number(rowsRes.count ?? 0), pageSize)}</div>
        </section>
      </main>
    </AdminShell>
  );
}
