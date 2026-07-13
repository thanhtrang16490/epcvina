import PDFDocument from "pdfkit";
import fs from "node:fs/promises";
import path from "node:path";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCombo } from "@/lib/supabase/normalize";
import { companySettings } from "@/lib/company-settings";
import { MEDIA_BUCKET, buildOrderPdfPath } from "@/lib/storage-media";

function money(value: number) {
  return value.toLocaleString("vi-VN") + " đ";
}

function safeText(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim() || "-";
}

async function ensurePdfkitStandardFonts() {
  const targetDir = path.join(process.cwd(), ".next", "server", "vendor-chunks", "data");
  const sourceDir = path.join(process.cwd(), "node_modules", "pdfkit", "js", "data");
  const filenames = [
    "Courier-Bold.afm",
    "Courier-BoldOblique.afm",
    "Courier-Oblique.afm",
    "Courier.afm",
    "Helvetica-Bold.afm",
    "Helvetica-BoldOblique.afm",
    "Helvetica-Oblique.afm",
    "Helvetica.afm",
    "Symbol.afm",
    "Times-Bold.afm",
    "Times-BoldItalic.afm",
    "Times-Italic.afm",
    "Times-Roman.afm",
    "ZapfDingbats.afm",
  ];
  await fs.mkdir(targetDir, { recursive: true });
  await Promise.all(
    filenames.map(async (filename) => {
      const sourcePath = path.join(sourceDir, filename);
      const targetPath = path.join(targetDir, filename);
      try {
        await fs.access(targetPath);
      } catch {
        await fs.copyFile(sourcePath, targetPath);
      }
    }),
  );
}

async function tryEmbedLogo(doc: PDFKit.PDFDocument) {
  try {
    const logoPath = path.join(process.cwd(), "public", "brands", "epcvina-solar.png");
    const logo = await fs.readFile(logoPath);
    doc.image(logo, 50, 40, { width: 90 });
  } catch {
    // ignore
  }
}

function registerPdfFonts(doc: PDFKit.PDFDocument) {
  const fontPath = path.join(process.cwd(), "public", "fonts", "arial-unicode.ttf");
  doc.registerFont("body", fontPath);
  doc.registerFont("body-bold", fontPath);
  doc.font("body");
}

function drawSection(doc: PDFKit.PDFDocument, title: string, y: number) {
  doc.font("body-bold").fontSize(13).fillColor("#0f172a").text(title, 50, y);
  doc.moveTo(50, y + 18).lineTo(545, y + 18).strokeColor("#cbd5e1").lineWidth(1).stroke();
  return y + 28;
}

export async function generateOrderPdf(orderId: string, options?: { persist?: boolean }) {
  const persist = options?.persist ?? true;
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase admin client not available");

  const [orderRes, itemsRes, combosRes, comboItemsRes] = await Promise.all([
    supabase.from("orders").select("*").eq("id", orderId).single(),
    supabase.from("order_items").select("*").eq("order_id", orderId).order("sort_order", { ascending: true }),
    supabase.from("combos").select("*").order("sort_order", { ascending: true }),
    supabase.from("combo_items").select("*").order("sort_order", { ascending: true }),
  ]);

  const order = orderRes.data;
  if (!order) throw new Error("Order not found");
  const orderPdfPath = buildOrderPdfPath(String(order.order_no ?? order.slug ?? "order"), order.id);

  const [customerRes, projectRes] = await Promise.all([
    order.customer_id ? supabase.from("customers").select("*").eq("id", order.customer_id).maybeSingle() : Promise.resolve({ data: null }),
    order.project_id ? supabase.from("projects").select("*").eq("id", order.project_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  const customer = customerRes.data ?? null;
  const project = projectRes.data ?? null;
  const items = itemsRes.data ?? [];
  const combos = (combosRes.data ?? []).map(normalizeCombo);
  const comboBoms = comboItemsRes.data ?? [];

  await ensurePdfkitStandardFonts();
  const doc = new PDFDocument({ size: "A4", margin: 40, compress: true });
  registerPdfFonts(doc);
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
  const finished = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  await tryEmbedLogo(doc);
  doc.font("body-bold").fontSize(20).fillColor("#0f172a").text("ORDER DETAIL", 160, 45);
  doc.moveDown(0.4);
  doc.font("body-bold").fontSize(12).fillColor("#0f172a").text(companySettings.name, 160, 72);
  doc.font("body").fontSize(11).fillColor("#475569").text(`Mã đơn: ${safeText(order.order_no || order.slug)}`, 160, 90);
  doc.text(`Ngày: ${safeText(order.order_date || new Date().toISOString().slice(0, 10))}`, 160, 106);
  doc.moveDown(1);

  let y = 130;
  y = drawSection(doc, "Thông tin đơn hàng", y);
  doc.font("body").fontSize(10).fillColor("#0f172a");
  doc.text(`Trạng thái: ${safeText(order.status)}`, 50, y);
  doc.text(`Loại đơn: ${safeText(order.order_type)}`, 290, y);
  y += 18;
  doc.text(`Subtotal: ${money(Number(order.subtotal ?? 0))}`, 50, y);
  doc.text(`Discount: ${money(Number(order.discount ?? 0))}`, 290, y);
  y += 18;
  doc.text(`Total: ${money(Number(order.total ?? 0))}`, 50, y);
  y += 28;

  y = drawSection(doc, "Khách hàng & dự án", y);
  doc.font("body").fontSize(10).fillColor("#0f172a");
  doc.text(`Khách hàng: ${safeText(customer?.name)}`, 50, y);
  doc.text(`Điện thoại: ${safeText(customer?.phone)}`, 290, y);
  y += 18;
  doc.text(`Dự án: ${safeText(project?.name)}`, 50, y);
  doc.text(`Hệ thống: ${safeText(project?.system_type)}`, 290, y);
  y += 28;

  y = drawSection(doc, "Danh sách item", y);
  doc.font("body").fontSize(9).fillColor("#0f172a");
  for (const item of items as any[]) {
    if (y > 720) {
      doc.addPage();
      y = 50;
    }
    doc.rect(50, y, 495, 34).strokeColor("#e2e8f0").lineWidth(0.8).stroke();
    doc.text(`${safeText(item.item_name)}`, 56, y + 5, { width: 260 });
    doc.text(`SL: ${Number(item.quantity ?? 0)}`, 320, y + 5);
    doc.text(`Đơn giá: ${money(Number(item.unit_price ?? 0))}`, 380, y + 5);
    doc.text(`Thành tiền: ${money(Number(item.total_price ?? 0))}`, 450, y + 5, { align: "right", width: 88 });
    y += 42;
  }

  const comboItems = items.filter((item: any) => item.item_type === "combo");
  if (comboItems.length) {
    y += 4;
    y = drawSection(doc, "BOM combo", y);
    for (const comboItem of comboItems as any[]) {
      const comboId = String(comboItem.combo_id ?? "");
      const combo = combos.find((candidate) => candidate.id === comboId);
      const bomRows = comboBoms.filter((row: any) => String(row.combo_id ?? "") === comboId);
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      doc.font("body-bold").fontSize(10).fillColor("#0f172a").text(`${safeText(combo?.name || comboItem.item_name)}`, 50, y);
      y += 16;
      for (const row of bomRows) {
        if (y > 730) {
          doc.addPage();
          y = 50;
        }
        doc.font("body").fontSize(9).fillColor("#334155").text(`- ${safeText(row.item_name)} x${Number(row.quantity ?? 0)} | ${money(Number(row.total_price_vat ?? 0))}`, 60, y, { width: 485 });
        y += 13;
      }
      y += 6;
    }
  }

  doc.end();
  const pdf = await finished;
  if (!persist) {
    return { pdf, publicUrl: null, orderPdfPath, generatedAt: null };
  }
  const upload = await supabase.storage.from(MEDIA_BUCKET).upload(orderPdfPath, pdf, {
    upsert: true,
    contentType: "application/pdf",
  });
  if (upload.error) throw upload.error;
  const publicUrl = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(orderPdfPath).data.publicUrl;
  const generatedAt = new Date().toISOString();
  const { error: versionError } = await supabase.from("order_pdf_versions").insert({
    order_id: order.id,
    storage_path: orderPdfPath,
    pdf_url: publicUrl,
    generated_at: generatedAt,
    generated_by: "system",
  });
  if (versionError) throw versionError;
  const { error: orderUpdateError } = await supabase
    .from("orders")
    .update({
      pdf_url: publicUrl,
      pdf_storage_path: orderPdfPath,
      pdf_generated_at: generatedAt,
      updated_at: generatedAt,
    })
    .eq("id", order.id);
  if (orderUpdateError) throw orderUpdateError;
  return { pdf, publicUrl, orderPdfPath, generatedAt };
}
