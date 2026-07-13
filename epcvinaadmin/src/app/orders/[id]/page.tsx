import { AdminShell } from "@/components/AdminShell";
import { ModalShell } from "@/components/ModalShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ThemeButton, ThemeLinkButton } from "@/components/ui/ThemeButton";
import { ComboBomAccordion } from "@/components/ComboBomAccordion";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { comboItemGroups } from "@/lib/combo-builder";
import { companySettings } from "@/lib/company-settings";
import { generateOrderPdf } from "@/lib/order-pdf";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function syncOrderTotals(supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, orderId: string) {
  const { data: items } = await supabase
    .from("order_items")
    .select("item_type, quantity, unit_price, total_price")
    .eq("order_id", orderId);
  const subtotal = (items ?? []).reduce((sum, item: any) => sum + Number(item.total_price ?? Number(item.quantity ?? 0) * Number(item.unit_price ?? 0)), 0);
  const { error } = await supabase
    .from("orders")
    .update({
      subtotal,
      total: Math.max(0, subtotal - 0),
    })
    .eq("id", orderId);
  if (error) throw error;
}

async function addItem(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const orderId = String(formData.get("order_id") ?? "");
  const productId = String(formData.get("product_id") ?? "").trim() || null;
  const comboId = String(formData.get("combo_id") ?? "").trim() || null;
  const quantity = Number(formData.get("quantity") ?? 1);
  const unitPrice = Number(formData.get("unit_price") ?? 0);
  await supabase.from("order_items").insert({
    order_id: orderId,
    combo_id: comboId,
    product_id: productId,
    item_name: String(formData.get("item_name") ?? "").trim(),
    item_type: comboId ? "combo" : "product",
    quantity,
    unit_price: unitPrice,
    total_price: quantity * unitPrice,
    note: String(formData.get("note") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  await syncOrderTotals(supabase, orderId);
  await generateOrderPdf(orderId);
  revalidatePath(`/orders/${orderId}`);
  redirect(`/orders/${orderId}`);
}

async function updateItem(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const orderId = String(formData.get("order_id") ?? "");
  const itemId = String(formData.get("item_id") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);
  const unitPrice = Number(formData.get("unit_price") ?? 0);
  await supabase
    .from("order_items")
    .update({
      item_name: String(formData.get("item_name") ?? "").trim(),
      quantity,
      unit_price: unitPrice,
      total_price: quantity * unitPrice,
      note: String(formData.get("note") ?? "").trim() || null,
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", itemId);
  await syncOrderTotals(supabase, orderId);
  await generateOrderPdf(orderId);
  revalidatePath(`/orders/${orderId}`);
  redirect(`/orders/${orderId}`);
}

async function deleteItem(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const orderId = String(formData.get("order_id") ?? "");
  const itemId = String(formData.get("item_id") ?? "");
  await supabase.from("order_items").delete().eq("id", itemId);
  await syncOrderTotals(supabase, orderId);
  await generateOrderPdf(orderId);
  revalidatePath(`/orders/${orderId}`);
  redirect(`/orders/${orderId}`);
}

async function regeneratePdf(formData: FormData) {
  "use server";
  const orderId = String(formData.get("order_id") ?? "");
  await generateOrderPdf(orderId);
  revalidatePath(`/orders/${orderId}`);
  redirect(`/orders/${orderId}`);
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  if (!supabase) notFound();

  const [orderRes, itemsRes, productsRes, combosRes] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("order_items").select("*").eq("order_id", id).order("sort_order", { ascending: true }),
    supabase.from("products").select("*").order("sort_order", { ascending: true }),
    supabase.from("combos").select("*").order("sort_order", { ascending: true }),
  ]);

  const order = orderRes.data;
  if (!order) notFound();

  const items = itemsRes.data ?? [];
  const products = (productsRes.data ?? []).map(normalizeProduct);
  const combos = (combosRes.data ?? []).map(normalizeCombo);
  const comboBomRes = await supabase.from("combo_items").select("*").order("sort_order", { ascending: true });
  const comboBoms = comboBomRes.data ?? [];

  const [customerRes, projectRes] = await Promise.all([
    order.customer_id ? supabase.from("customers").select("*").eq("id", order.customer_id).maybeSingle() : Promise.resolve({ data: null }),
    order.project_id ? supabase.from("projects").select("*").eq("id", order.project_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const customer = customerRes.data ?? null;
  const project = projectRes.data ?? null;
  const pdfVersionsRes = await supabase
    .from("order_pdf_versions")
    .select("*")
    .eq("order_id", id)
    .order("generated_at", { ascending: false })
    .limit(8);
  const pdfVersions = pdfVersionsRes.data ?? [];
  const comboItems = items.filter((item: any) => item.item_type === "combo");
  const deviceItems = items.filter((item: any) => item.item_type === "product");
  const subtotalFromItems = items.reduce((sum: number, item: any) => sum + Number(item.total_price ?? 0), 0);
  const subtotal = Number(order.subtotal ?? subtotalFromItems);
  const discount = Number(order.discount ?? 0);
  const total = Number(order.total ?? Math.max(0, subtotal - discount));
  const pdfGeneratedAt = order.pdf_generated_at ? new Date(order.pdf_generated_at).toLocaleString("vi-VN") : "-";
  const bomGroups = comboItems.length
    ? comboItemGroups.map((group) => {
        const relatedItems = comboItems
          .filter((item: any) => item.combo_id)
          .flatMap((item: any) => {
            const comboId = String(item.combo_id ?? "");
            const orderCombo = combos.find((candidate) => candidate.id === comboId);
            if (!orderCombo) return [];
            return comboBoms
              .filter((bom: any) => String(bom.combo_id ?? "") === comboId)
              .filter((bom: any) => {
                const text = `${bom.category ?? ""} ${bom.item_name ?? ""}`.toLowerCase();
                return group.id === "panel"
                  ? text.includes("pin") || text.includes("panel") || text.includes("pv")
                  : group.id === "battery"
                    ? text.includes("pin lưu trữ") || text.includes("battery") || text.includes("lithium")
                    : group.id === "inverter"
                      ? text.includes("inverter") || text.includes("biến tần")
                      : group.id === "mounting"
                        ? text.includes("khung") || text.includes("rail") || text.includes("mount")
                        : group.id === "wiring"
                          ? text.includes("dây") || text.includes("cáp") || text.includes("wire")
                          : group.id === "cabinet"
                            ? text.includes("tủ điện") || text.includes("cabinet") || text.includes("meter")
                            : text.includes("tiếp địa") || text.includes("ground");
              })
              .map((bom: any) => ({
                id: String(bom.id),
                category: String(bom.category ?? ""),
                item_name: String(bom.item_name ?? ""),
                brand: String(bom.brand ?? ""),
                unit: String(bom.unit ?? ""),
                quantity: Number(bom.quantity ?? 0),
                unit_price_vat: Number(bom.unit_price_vat ?? 0),
                total_price_vat: Number(bom.total_price_vat ?? 0),
                cost_price: Number(bom.cost_price ?? 0),
                total_cost_price: Number(bom.total_cost_price ?? 0),
                product: null,
              }));
          });
        return [group.label, relatedItems] as const;
      })
    : [];
  const orderStatusChip =
    order.status === "active"
      ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
      : "border-slate-400/30 bg-slate-400/15 text-slate-200";

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Order detail" title={order.order_no || order.slug} description="Trang tổng hợp chi tiết đơn hàng, khách hàng, dự án và item." />
          <div className="flex gap-2">
            <ThemeLinkButton href="/orders" tone="ghost">
              Quay lại
            </ThemeLinkButton>
            <ThemeLinkButton href={(project?.id ? `/projects/${project.id}` : "/projects") as never} tone="secondary">
              Mở dự án
            </ThemeLinkButton>
            <ModalShell
              trigger={<span className="inline-flex items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-sm font-medium text-[color:var(--text)] transition hover:bg-[color:var(--bg-elevated)]">Xem trước PDF</span>}
              title="Xem trước PDF"
              description="Bản preview hiển thị trực tiếp từ PDF render tạm thời, chưa ghi lịch sử mới vào Supabase."
            >
              <div className="mb-4 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Order</div>
                  <div className="mt-1 text-sm font-semibold text-[color:var(--text)]">{order.order_no || order.slug || "-"}</div>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Khách hàng</div>
                  <div className="mt-1 text-sm font-semibold text-[color:var(--text)]">{customer?.name || "-"}</div>
                  <div className="mt-1 text-xs text-[color:var(--muted)]">{customer?.phone || customer?.email || "-"}</div>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Dự án</div>
                  <div className="mt-1 text-sm font-semibold text-[color:var(--text)]">{project?.name || "-"}</div>
                  <div className="mt-1 text-xs text-[color:var(--muted)]">{project?.system_type || "-"}</div>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Tổng tiền</div>
                  <div className="mt-1 text-sm font-semibold text-[color:var(--text)]">{total.toLocaleString("vi-VN")} đ</div>
                  <div className="mt-1 text-xs text-[color:var(--muted)]">Generated: {pdfGeneratedAt}</div>
                </div>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--bg)]">
                <iframe
                  src={`/orders/${order.id}/pdf?preview=1`}
                  title={`Preview PDF ${order.order_no || order.slug || order.id}`}
                  className="h-[76vh] w-full"
                />
              </div>
            </ModalShell>
            <form action={regeneratePdf}>
              <input type="hidden" name="order_id" value={order.id} />
              <ThemeButton type="submit" tone="primary">
                Tạo lại PDF
              </ThemeButton>
            </form>
            <a href={`/orders/${order.id}/pdf`} className="inline-flex items-center justify-center rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90">
              Tải PDF
            </a>
            {order.pdf_url ? (
              <a
                href={order.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-sm font-medium text-[color:var(--text)] transition hover:bg-[color:var(--bg-elevated)]"
              >
                Mở file trên Supabase Storage
              </a>
            ) : null}
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          <ThemeCard className="p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Trạng thái</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${orderStatusChip}`}>{order.status}</span>
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1 text-xs text-[color:var(--muted)]">{order.order_type}</span>
            </div>
            <div className="mt-5 text-sm text-[color:var(--muted)]">Mã đơn</div>
            <div className="mt-1 text-xl font-semibold text-[color:var(--text)]">{order.order_no || "-"}</div>
            <div className="mt-4 text-sm text-[color:var(--muted)]">Ngày đơn</div>
            <div className="mt-1 text-base text-[color:var(--text)]">{order.order_date || "-"}</div>
            <div className="mt-4 text-sm text-[color:var(--muted)]">PDF generated at</div>
              <div className="mt-1 text-base text-[color:var(--text)]">{pdfGeneratedAt}</div>
            <div className="mt-4 text-sm text-[color:var(--muted)]">PDF history</div>
            <div className="mt-2 space-y-2">
              {pdfVersions.length ? (
                pdfVersions.map((version: any) => (
                  <div key={version.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--text)]">
                    <div className="font-medium">{new Date(version.generated_at).toLocaleString("vi-VN")}</div>
                    <div className="mt-1 text-[color:var(--muted)]">{version.storage_path || version.pdf_url || "-"}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--muted)]">
                  Chưa có lịch sử PDF.
                </div>
              )}
            </div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Khách hàng</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">{companySettings.name}</div>
            <div className="mt-3 text-xl font-semibold text-[color:var(--text)]">{customer?.name || "-"}</div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">{customer?.phone || customer?.email || customer?.address || "Chưa có thông tin liên hệ"}</div>
            {customer?.slug ? <div className="mt-4 inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">{customer.slug}</div> : null}
          </ThemeCard>

          <ThemeCard className="p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Dự án</div>
            <div className="mt-3 text-xl font-semibold text-[color:var(--text)]">{project?.name || "-"}</div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">{project?.address || project?.system_type || "Chưa có dự án liên kết"}</div>
            {project?.slug ? <div className="mt-4 inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">{project.slug}</div> : null}
          </ThemeCard>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-4">
          <ThemeCard className="p-5">
            <div className="text-sm text-[color:var(--muted)]">Tổng item</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{items.length}</div>
          </ThemeCard>
          <ThemeCard className="p-5">
            <div className="text-sm text-[color:var(--muted)]">Combo item</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{comboItems.length}</div>
          </ThemeCard>
          <ThemeCard className="p-5">
            <div className="text-sm text-[color:var(--muted)]">Thiết bị item</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{deviceItems.length}</div>
          </ThemeCard>
          <ThemeCard className="p-5">
            <div className="text-sm text-[color:var(--muted)]">Tổng tiền</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">{total.toLocaleString("vi-VN")} đ</div>
          </ThemeCard>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <ThemeCard className="p-6">
            <div className="flex items-center justify-between gap-3">
              <SectionTitle eyebrow="Items" title="Chi tiết đơn hàng" description="Có thể sửa hoặc xoá từng item ngay trên trang." />
              <ModalShell
                trigger={<span className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">Thêm item</span>}
                title="Thêm item vào đơn hàng"
                description="Chọn combo hoặc thiết bị từ catalog."
              >
                <form action={addItem} className="grid gap-3">
                  <input type="hidden" name="order_id" value={order.id} />
                  <input name="item_name" placeholder="Tên item" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <select name="combo_id" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                    <option value="">Chọn combo (nếu có)</option>
                    {combos.map((combo) => (
                      <option key={combo.id} value={combo.id}>
                        {combo.name}
                      </option>
                    ))}
                  </select>
                  <select name="product_id" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                    <option value="">Chọn thiết bị (nếu có)</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input name="quantity" type="number" defaultValue={1} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                    <input name="unit_price" type="number" defaultValue={0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  </div>
                  <input name="sort_order" type="number" defaultValue={0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <textarea name="note" rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">
                    Thêm item
                  </button>
                </form>
              </ModalShell>
            </div>

            {comboItems.length ? (
              <div className="mt-6">
                <SectionTitle eyebrow="BOM" title="BOM combo chi tiết" description="Bóc tách theo nhóm vật tư để kiểm tra nhanh số lượng và giá." />
                <ComboBomAccordion groups={bomGroups.filter(([, groupItems]) => groupItems.length > 0) as Array<[string, any[]]>} />
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              {items.map((item: any) => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-white">{item.item_name}</div>
                      <div className="mt-1 text-xs text-slate-400">
                        {item.item_type} · qty {Number(item.quantity ?? 0)} · unit {Number(item.unit_price ?? 0).toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">{Number(item.total_price ?? 0).toLocaleString("vi-VN")} đ</div>
                      <div className="mt-1 text-xs text-slate-400">sort {item.sort_order ?? 0}</div>
                    </div>
                  </div>
                  {item.note ? <div className="mt-3 text-sm text-slate-300">{item.note}</div> : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ModalShell
                      trigger={<span className="rounded-2xl bg-white/5 px-4 py-2.5 text-sm text-slate-200">Sửa item</span>}
                      title={`Sửa item: ${item.item_name}`}
                      description="Chỉnh số lượng, giá và ghi chú."
                    >
                      <form action={updateItem} className="grid gap-3">
                        <input type="hidden" name="order_id" value={order.id} />
                        <input type="hidden" name="item_id" value={item.id} />
                        <input name="item_name" defaultValue={item.item_name ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                        <div className="grid grid-cols-2 gap-3">
                          <input name="quantity" type="number" defaultValue={item.quantity ?? 1} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                          <input name="unit_price" type="number" defaultValue={item.unit_price ?? 0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                        </div>
                        <input name="sort_order" type="number" defaultValue={item.sort_order ?? 0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                        <textarea name="note" defaultValue={item.note ?? ""} rows={4} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                        <div className="flex gap-2">
                          <ThemeButton type="submit" tone="primary">
                            Lưu
                          </ThemeButton>
                          <ThemeButton formAction={deleteItem} tone="danger">
                            Xóa
                          </ThemeButton>
                        </div>
                      </form>
                    </ModalShell>
                    <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      {item.item_type}
                    </span>
                  </div>
                </div>
              ))}
              {!items.length && <div className="rounded-3xl border border-dashed border-white/10 p-6 text-sm text-slate-400">Chưa có item nào.</div>}
            </div>
          </ThemeCard>

          <div className="space-y-6">
            <ThemeCard className="p-6">
              <SectionTitle eyebrow="Totals" title="Tổng kết đơn hàng" description="Kiểm tra nhanh các con số trước khi chốt." />
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--muted)]">Subtotal</span>
                  <span className="font-medium text-[color:var(--text)]">{subtotal.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--muted)]">Discount</span>
                  <span className="font-medium text-[color:var(--text)]">{discount.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="h-px bg-[color:var(--border)]" />
                <div className="flex items-center justify-between text-base">
                  <span className="font-medium text-[color:var(--text)]">Total</span>
                  <span className="font-semibold text-[color:var(--text)]">{total.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>
            </ThemeCard>

            <ThemeCard className="p-6">
              <SectionTitle eyebrow="Catalog" title="Combo và thiết bị tham chiếu" description="Danh sách nhanh để đối chiếu khi thêm item thủ công." />
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium text-[color:var(--text)]">Combo</div>
                {combos.slice(0, 6).map((combo) => (
                  <div key={combo.id} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white">
                    {combo.name}
                  </div>
                ))}
                <div className="mt-4 text-sm font-medium text-[color:var(--text)]">Thiết bị</div>
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white">
                    {product.name}
                  </div>
                ))}
              </div>
            </ThemeCard>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
