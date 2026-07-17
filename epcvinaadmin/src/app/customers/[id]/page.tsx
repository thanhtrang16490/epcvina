import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function money(value: number) {
  return Number(value ?? 0).toLocaleString("vi-VN");
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  if (!supabase) notFound();

  const [customerRes, projectsRes, ordersRes, itemsRes, contactsRes, parentCompanyRes, companyOrdersRes] = await Promise.all([
    supabase.from("customers").select("id, slug, name, customer_type, parent_company_id, phone, email, tax_code, address, province, district, ward, address_detail, billing_name, billing_phone, billing_email, note, sort_order, is_active").eq("id", id).maybeSingle(),
    supabase.from("projects").select("id, slug, customer_id, name, code, address, capacity, system_type, completion_date, note, sort_order, is_active, created_at").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.from("orders").select("id, slug, customer_id, project_id, order_no, order_type, order_date, subtotal, discount, total, created_at, invoice_customer_id, invoice_contact_id").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.from("order_items").select("id, order_id, combo_id, product_id, item_name, item_type, quantity, unit_price, total_price, note, sort_order, created_at").order("created_at", { ascending: false }),
    supabase.from("customers").select("id, slug, name, customer_type, parent_company_id, phone, email, tax_code, address, province, district, ward, address_detail, billing_name, billing_phone, billing_email, note, sort_order, is_active").eq("parent_company_id", id).order("sort_order", { ascending: true }),
    supabase.from("customers").select("id, slug, name, customer_type, parent_company_id, phone, email, tax_code, address, province, district, ward, address_detail, billing_name, billing_phone, billing_email, note, sort_order, is_active").eq("id", id).maybeSingle(),
    supabase.from("orders").select("id, slug, customer_id, project_id, order_no, order_type, order_date, subtotal, discount, total, created_at, invoice_customer_id, invoice_contact_id").eq("invoice_customer_id", id).order("created_at", { ascending: false }),
  ]);

  const customer = customerRes.data;
  if (!customer) notFound();

  const projects = projectsRes.data ?? [];
  const orders = ordersRes.data ?? [];
  const contacts = contactsRes.data ?? [];
  const parentCompany = customer.parent_company_id
    ? (await supabase.from("customers").select("id, slug, name, customer_type, parent_company_id, phone, email, tax_code, address, province, district, ward, address_detail, billing_name, billing_phone, billing_email, note, sort_order, is_active").eq("id", customer.parent_company_id).maybeSingle()).data ?? null
    : null;
  const invoiceOrders = companyOrdersRes.data ?? [];
  const orderIds = new Set(orders.map((order: any) => order.id));
  const orderItems = (itemsRes.data ?? []).filter((item: any) => orderIds.has(item.order_id));
  const totalOrderValue = orders.reduce((sum: number, order: any) => sum + Number(order.total ?? 0), 0);
  const latestOrder = orders[0] ?? null;
  const projectCount = projects.length;
  const orderCount = orders.length;
  const customerType = String(customer.customer_type ?? "contact");
  const isCompany = customerType === "company";

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle
            eyebrow="CRM"
            title={customer.name}
            description={isCompany ? "Hồ sơ doanh nghiệp, danh bạ liên hệ và lịch sử giao dịch." : "Hồ sơ liên hệ, công ty liên kết và lịch sử giao dịch."}
          />
          <div className="flex gap-2">
            <ThemeLinkButton href="/admin/customers" tone="ghost">
              Quay lại
            </ThemeLinkButton>
            <ThemeLinkButton href="/admin/projects/new" tone="secondary">
              Tạo dự án
            </ThemeLinkButton>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-4">
          <ThemeCard className="p-5">
            <div className="text-sm text-[color:var(--muted)]">Loại</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{isCompany ? "Doanh nghiệp" : "Liên hệ"}</div>
          </ThemeCard>
          <ThemeCard className="p-5">
            <div className="text-sm text-[color:var(--muted)]">Dự án</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{projectCount}</div>
          </ThemeCard>
          <ThemeCard className="p-5">
            <div className="text-sm text-[color:var(--muted)]">Đơn hàng</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{orderCount}</div>
          </ThemeCard>
          <ThemeCard className="p-5">
            <div className="text-sm text-[color:var(--muted)]">Tổng giá trị</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{money(totalOrderValue)} đ</div>
          </ThemeCard>
          <ThemeCard className="p-5">
            <div className="text-sm text-[color:var(--muted)]">Liên hệ con</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{contacts.length}</div>
          </ThemeCard>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Profile" title={isCompany ? "Thông tin doanh nghiệp" : "Thông tin liên hệ"} description="Thông tin liên hệ, hóa đơn và địa chỉ." />
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="text-[color:var(--muted)]">Loại hồ sơ</div>
                <div className="mt-1 text-[color:var(--text)]">{isCompany ? "Doanh nghiệp" : "Liên hệ"}</div>
              </div>
              {parentCompany ? (
                <div>
                  <div className="text-[color:var(--muted)]">Công ty liên kết</div>
                  <Link href={`/customers/${parentCompany.id}`} className="mt-1 inline-flex text-[color:var(--accent)] underline underline-offset-2">
                    {parentCompany.name}
                  </Link>
                </div>
              ) : null}
              <div>
                <div className="text-[color:var(--muted)]">Điện thoại</div>
                <div className="mt-1 text-[color:var(--text)]">{customer.billing_phone || customer.phone || "-"}</div>
              </div>
              <div>
                <div className="text-[color:var(--muted)]">Email</div>
                <div className="mt-1 text-[color:var(--text)]">{customer.billing_email || customer.email || "-"}</div>
              </div>
              <div>
                <div className="text-[color:var(--muted)]">MST</div>
                <div className="mt-1 text-[color:var(--text)]">{customer.tax_code || "-"}</div>
              </div>
              <div>
                <div className="text-[color:var(--muted)]">Địa chỉ</div>
                <div className="mt-1 text-[color:var(--text)]">{customer.address_detail || customer.address || "-"}</div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">{[customer.ward, customer.district, customer.province].filter(Boolean).join(" · ") || "-"}</div>
              </div>
              <div>
                <div className="text-[color:var(--muted)]">Ghi chú</div>
                <div className="mt-1 whitespace-pre-wrap text-[color:var(--text)]">{customer.note || "-"}</div>
              </div>
            </div>
          </ThemeCard>

          <div className="space-y-6">
            {isCompany ? (
              <ThemeCard className="p-6">
                <SectionTitle eyebrow="Contacts" title="Danh bạ liên hệ" description="Các contact thuộc doanh nghiệp này." />
                <div className="mt-4 space-y-3">
                  {contacts.map((contact: any) => (
                    <div key={contact.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-white">{contact.name}</div>
                          <div className="mt-1 text-xs text-slate-400">{contact.phone || "-"} · {contact.email || "-"}</div>
                        </div>
                        <Link href={`/customers/${contact.id}`} className="text-sm text-cyan-300">
                          Mở
                        </Link>
                      </div>
                    </div>
                  ))}
                  {!contacts.length && <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-400">Chưa có contact liên kết.</div>}
                </div>
              </ThemeCard>
            ) : null}

            <ThemeCard className="p-6">
              <SectionTitle eyebrow="Projects" title="Dự án của khách" description="Các dự án đã gắn vào khách hàng này." />
              <div className="mt-4 space-y-3">
                {projects.map((project: any) => (
                  <div key={project.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-white">{project.name}</div>
                        <div className="mt-1 text-xs text-slate-400">{project.system_type || "-"} · {project.capacity || "-"}</div>
                      </div>
                      <Link href={`/projects/${project.id}`} className="text-sm text-cyan-300">
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
                {!projects.length && <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-400">Chưa có dự án.</div>}
              </div>
            </ThemeCard>

            <ThemeCard className="p-6">
              <SectionTitle eyebrow="Orders" title="Lịch sử đơn hàng" description="Danh sách đơn hàng của khách hàng theo thời gian." />
              <div className="mt-4 space-y-3">
                {orders.map((order: any) => {
                  const badge =
                    order.status === "active"
                      ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                      : "border-slate-400/30 bg-slate-400/15 text-slate-200";
                  const itemCount = orderItems.filter((item: any) => item.order_id === order.id).length;
                  return (
                    <div key={order.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-white">{order.order_no || order.slug}</div>
                          <div className="mt-1 text-xs text-slate-400">
                            {order.order_type} · {itemCount} item · {money(Number(order.total ?? 0))} đ
                          </div>
                        </div>
                        <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badge}`}>{order.status === "active" ? "Active" : "Inactive"}</div>
                      </div>
                      <div className="mt-3 text-xs text-slate-400">{order.created_at ? new Date(order.created_at).toLocaleDateString("vi-VN") : "-"}</div>
                      <div className="mt-4">
                        <ThemeLinkButton href={(`/orders/${order.id}`) as never} tone="secondary">
                          Mở đơn
                        </ThemeLinkButton>
                      </div>
                    </div>
                  );
                })}
                {!orders.length && <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-400">Chưa có đơn hàng.</div>}
              </div>
            </ThemeCard>

            {isCompany ? (
              <ThemeCard className="p-6">
                <SectionTitle eyebrow="Invoice" title="Đơn xuất hoá đơn" description="Các đơn đang dùng doanh nghiệp này làm thông tin hoá đơn." />
                <div className="mt-4 space-y-3">
                  {invoiceOrders.map((order: any) => (
                    <div key={order.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-white">{order.order_no || order.slug}</div>
                          <div className="mt-1 text-xs text-slate-400">{order.invoice_contact_id ? "Có contact xuất hoá đơn" : "Không có contact xuất hoá đơn"}</div>
                        </div>
                        <Link href={`/orders/${order.id}`} className="text-sm text-cyan-300">
                          Mở đơn
                        </Link>
                      </div>
                    </div>
                  ))}
                  {!invoiceOrders.length && <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-400">Chưa có đơn nào dùng doanh nghiệp này để xuất hoá đơn.</div>}
                </div>
              </ThemeCard>
            ) : null}
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
