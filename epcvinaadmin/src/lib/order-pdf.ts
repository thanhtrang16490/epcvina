import PDFDocument from "pdfkit";
import fs from "node:fs/promises";
import path from "node:path";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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
  doc.roundedRect(50, y - 2, 495, 22, 6).fillAndStroke("#f8fafc", "#e2e8f0");
  doc.font("body-bold").fontSize(12).fillColor("#0f172a").text(title, 58, y + 4);
  return y + 30;
}

function drawMetricCard(doc: PDFKit.PDFDocument, x: number, y: number, width: number, label: string, value: string, accent = "#f58220") {
  doc.roundedRect(x, y, width, 52, 10).fillAndStroke("#ffffff", "#dbe3ea");
  doc.roundedRect(x, y, 5, 52, 10).fill(accent);
  doc.font("body").fontSize(8).fillColor("#64748b").text(label.toUpperCase(), x + 14, y + 9, { width: width - 22 });
  doc.font("body-bold").fontSize(12).fillColor("#0f172a").text(value, x + 14, y + 24, { width: width - 22 });
}

function drawBadge(doc: PDFKit.PDFDocument, x: number, y: number, text: string, fill = "#fff7ed", stroke = "#fdba74", color = "#9a3412") {
  const width = Math.max(54, doc.widthOfString(text, { font: "body", size: 9 }) + 18);
  doc.roundedRect(x, y, width, 18, 9).fillAndStroke(fill, stroke);
  doc.font("body").fontSize(9).fillColor(color).text(text, x + 9, y + 4);
  return width;
}

function inferGroupLabel(sheetGroup: string, itemName: string, category: string) {
  const text = `${sheetGroup} ${itemName} ${category}`.toLowerCase();
  if (text.includes("panel") || text.includes("pin") || text.includes("pv")) return "Tấm pin";
  if (text.includes("inverter") || text.includes("biến tần")) return "Inverter";
  if (text.includes("battery") || text.includes("lithium") || text.includes("pin lưu trữ")) return "Pin lưu trữ";
  if (text.includes("mount") || text.includes("rail") || text.includes("khung")) return "Khung lắp";
  if (text.includes("wire") || text.includes("cáp") || text.includes("dây") || text.includes("mc4")) return "Dây và phụ kiện";
  if (text.includes("cabinet") || text.includes("tủ điện") || text.includes("meter")) return "Tủ điện";
  if (text.includes("ground") || text.includes("tiếp địa")) return "Tiếp địa";
  if (text.includes("labor") || text.includes("nhân công") || text.includes("thi công")) return "Nhân công lắp đặt";
  return "Khác";
}

export async function generateOrderPdf(orderId: string, options?: { persist?: boolean }) {
  const persist = options?.persist ?? true;
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase admin client not available");

  const [orderRes, itemsRes] = await Promise.all([
    supabase.from("orders").select("*").eq("id", orderId).single(),
    supabase.from("order_items").select("*").eq("order_id", orderId).order("sort_order", { ascending: true }),
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

  await ensurePdfkitStandardFonts();
  const doc = new PDFDocument({ size: "A4", margin: 40, compress: true });
  registerPdfFonts(doc);
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
  const finished = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  // Header band
  doc.rect(0, 0, 595, 118).fill("#0f172a");
  await tryEmbedLogo(doc);
  doc.font("body-bold").fontSize(20).fillColor("#ffffff").text(companySettings.name, 160, 34);
  doc.font("body").fontSize(9).fillColor("#cbd5e1").text("Báo giá / Hợp đồng / Hồ sơ đơn hàng", 160, 58);
  doc.font("body-bold").fontSize(18).fillColor("#ffffff").text(safeText(order.order_no || order.slug), 160, 76);
  const issuedDate = safeText(order.order_date || new Date().toISOString().slice(0, 10));
  doc.font("body").fontSize(9).fillColor("#cbd5e1").text(`Ngày lập: ${issuedDate}`, 160, 100);
  drawBadge(doc, 430, 36, safeText(order.status || "draft"), "#fff7ed", "#fdba74", "#9a3412");
  drawBadge(doc, 430, 60, safeText(order.order_type || "combo"), "#ecfeff", "#67e8f9", "#155e75");
  drawBadge(doc, 430, 84, safeText(order.payment_policy_code || "3:6:1"), "#f0fdf4", "#86efac", "#166534");

  let y = 138;
  doc.font("body-bold").fontSize(13).fillColor("#0f172a").text("Tổng quan báo giá", 50, y);
  y += 10;
  drawMetricCard(doc, 50, y, 113, "Trước CK", money(Number(order.subtotal ?? 0)));
  drawMetricCard(doc, 170, y, 113, "Chiết khấu", money(Number(order.discount ?? 0)));
  drawMetricCard(doc, 290, y, 113, "Thanh toán", money(Number(order.total ?? 0)), "#0ea5e9");
  drawMetricCard(doc, 410, y, 135, "Chính sách", safeText(order.payment_policy_name || order.payment_policy_code || "3 : 6 : 1"), "#22c55e");
  y += 68;

  y = drawSection(doc, "Thông tin khách hàng và dự án", y);
  doc.font("body").fontSize(10).fillColor("#0f172a");
  doc.text(`Khách hàng: ${safeText(customer?.name)}`, 50, y);
  doc.text(`Số điện thoại: ${safeText(customer?.phone)}`, 290, y);
  y += 18;
  doc.text(`Dự án: ${safeText(project?.name)}`, 50, y);
  doc.text(`Địa chỉ lắp đặt: ${safeText(project?.address)}`, 290, y, { width: 250 });
  y += 24;

  y = drawSection(doc, "Thông tin thanh toán", y);
  const totalValue = Number(order.total ?? 0);
  const deposit = Number(order.deposit_amount ?? Math.round(totalValue * 0.3));
  const delivery = Number(order.delivery_amount ?? Math.round(totalValue * 0.6));
  const acceptance = Number(order.acceptance_amount ?? Math.max(totalValue - deposit - delivery, 0));
  doc.font("body").fontSize(10).fillColor("#0f172a");
  doc.text(`Chính sách: ${safeText(order.payment_policy_name || order.payment_policy_code || "3 : 6 : 1")}`, 50, y);
  doc.text(`Phương thức thanh toán: ${safeText(order.payment_method || "bank_transfer")}`, 290, y);
  y += 18;
  doc.text(`Đặt cọc: ${money(deposit)}`, 50, y);
  doc.text(`Tập kết vật tư: ${money(delivery)}`, 290, y);
  y += 18;
  doc.text(`Nghiệm thu: ${money(acceptance)}`, 50, y);
  doc.text(`Còn lại: ${money(Math.max(totalValue - deposit - delivery - acceptance, 0))}`, 290, y);
  y += 26;

  y = drawSection(doc, "Danh sách vật tư / sản phẩm", y);
  doc.font("body").fontSize(8).fillColor("#64748b");
  doc.roundedRect(50, y, 495, 18, 6).fillAndStroke("#f8fafc", "#e2e8f0");
  doc.text("Tên vật tư", 56, y + 5, { width: 240 });
  doc.text("SL", 300, y + 5, { width: 26, align: "right" });
  doc.text("Đơn giá", 345, y + 5, { width: 90, align: "right" });
  doc.text("Thành tiền", 438, y + 5, { width: 95, align: "right" });
  y += 22;
  for (const item of items as any[]) {
    if (y > 720) {
      doc.addPage();
      y = 50;
    }
    const isCombo = String(item.item_type ?? "") === "combo";
    doc.roundedRect(50, y, 495, 28, 6).fillAndStroke(isCombo ? "#fff7ed" : "#ffffff", "#e2e8f0");
    doc.font("body-bold").fontSize(9).fillColor("#0f172a").text(`${safeText(item.item_name)}`, 56, y + 6, { width: 236 });
    doc.font("body").fontSize(9).fillColor("#0f172a").text(`${Number(item.quantity ?? 0)}`, 300, y + 6, { width: 26, align: "right" });
    doc.text(`${money(Number(item.unit_price ?? 0))}`, 345, y + 6, { width: 90, align: "right" });
    doc.font("body-bold").text(`${money(Number(item.total_price ?? 0))}`, 438, y + 6, { width: 95, align: "right" });
    y += 34;
  }

  const comboItems = items.filter((item: any) => item.item_type === "combo");
  if (comboItems.length) {
    y += 4;
    y = drawSection(doc, "Chi tiết combo", y);
    for (const comboItem of comboItems as any[]) {
      const snapshot = comboItem.snapshot_data ?? {};
      const combo = snapshot.combo_snapshot ?? snapshot.combo ?? null;
      const bomRows = Array.isArray(snapshot.bom_rows) ? snapshot.bom_rows : [];
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      const comboName = safeText(combo?.name || comboItem.item_name);
      const comboQty = Number(comboItem.quantity ?? 0);
      const comboUnitPrice = Number(comboItem.unit_price ?? 0);
      const comboTotal = Number(comboItem.total_price ?? 0);
      doc.roundedRect(50, y, 495, 22, 6).fillAndStroke("#eff6ff", "#bfdbfe");
      doc.font("body-bold").fontSize(10).fillColor("#0f172a").text(comboName, 58, y + 5, { width: 240 });
      doc.font("body").fontSize(9).fillColor("#334155").text(`SL: ${comboQty}`, 314, y + 5, { width: 30, align: "right" });
      doc.text(`Đơn giá: ${money(comboUnitPrice)}`, 350, y + 5, { width: 100, align: "right" });
      doc.font("body-bold").text(`Tổng: ${money(comboTotal)}`, 452, y + 5, { width: 86, align: "right" });
      y += 28;

      const groupedRows = bomRows.reduce<Record<string, any[]>>((acc, row) => {
        const groupLabel = inferGroupLabel(String(row.sheet_group ?? ""), String(row.item_name ?? ""), String(row.category ?? ""));
        const next = acc[groupLabel] ?? [];
        next.push(row);
        acc[groupLabel] = next;
        return acc;
      }, {});

      const groupOrder = ["Tấm pin", "Inverter", "Pin lưu trữ", "Khung lắp", "Dây và phụ kiện", "Tủ điện", "Tiếp địa", "Nhân công lắp đặt", "Khác"];

      if (y > 730) {
        doc.addPage();
        y = 50;
      }
      doc.font("body").fontSize(7.8).fillColor("#64748b");
      doc.text("No.", 60, y, { width: 20 });
      doc.text("Vật tư", 84, y, { width: 268 });
      doc.text("SL", 360, y, { width: 34, align: "right" });
      doc.text("Đơn giá", 401, y, { width: 64, align: "right" });
      doc.text("Thành tiền", 472, y, { width: 60, align: "right" });
      y += 11;

      for (const groupLabel of groupOrder) {
        const rows = groupedRows[groupLabel] ?? [];
        if (!rows.length) continue;
        if (y > 730) {
          doc.addPage();
          y = 50;
        }
        const groupTotal = rows.reduce((sum, row) => sum + Number(row.total_price_vat ?? row.unit_price_vat * Number(row.quantity ?? 0) ?? 0), 0);
        doc.roundedRect(54, y, 487, 16, 5).fillAndStroke("#f8fafc", "#e2e8f0");
        doc.font("body-bold").fontSize(8.5).fillColor("#0f172a").text(groupLabel, 60, y + 4, { width: 180 });
        doc.text(money(groupTotal), 452, y + 4, { width: 82, align: "right" });
        y += 18;
        for (const row of rows) {
          if (y > 730) {
            doc.addPage();
            y = 50;
          }
          const rowQty = Number(row.quantity ?? 0);
          const rowUnitPrice = Number(row.unit_price_vat ?? 0);
          const rowTotal = Number(row.total_price_vat ?? rowUnitPrice * rowQty);
          const rowHeight = Math.max(
            18,
            doc.heightOfString(safeText(row.item_name), { width: 268, align: "left" }) + 8,
          );
          doc.roundedRect(54, y - 1, 487, rowHeight + 2, 3).fillAndStroke("#ffffff", "#eef2f7");
          doc.font("body").fontSize(7.8).fillColor("#0f172a").text(String(row.no ?? row.sort_order ?? "-"), 60, y, { width: 20, height: rowHeight, ellipsis: true });
          const itemLabel = safeText(row.item_name);
          const itemMeta = [safeText(row.category), safeText(row.brand_name || row.brand || row.manufacturer || "-"), safeText(row.unit || row.uom || "pcs")]
            .filter((part) => part !== "-")
            .join(" · ");
          doc.text(itemLabel, 84, y, { width: 268, height: rowHeight, ellipsis: true });
          if (itemMeta !== "-") {
            doc.font("body").fontSize(6.7).fillColor("#64748b").text(itemMeta, 84, y + 10, { width: 268, height: Math.max(10, rowHeight - 10), ellipsis: true });
          }
          doc.font("body").fontSize(7.8).fillColor("#0f172a").text(String(rowQty || 0), 360, y, { width: 34, align: "right", height: rowHeight });
          doc.text(money(rowUnitPrice), 401, y, { width: 64, align: "right", height: rowHeight, ellipsis: true });
          doc.text(money(rowTotal), 472, y, { width: 60, align: "right", height: rowHeight, ellipsis: true });
          y += rowHeight + 2;
        }
        y += 6;
      }
      y += 6;
    }
  }

  y += 8;
  if (y > 700) {
    doc.addPage();
    y = 50;
  }
  y = drawSection(doc, "Điều khoản thanh toán", y);
  doc.font("body").fontSize(9).fillColor("#334155").text("Đây là hồ sơ bán hàng EPCVINA Solar. Giá trị thanh toán được lưu theo chính sách và lịch sử ghi nhận riêng.", 50, y, { width: 495 });
  y += 18;
  doc.font("body").fontSize(9).fillColor("#334155").text(`Chiết khấu áp dụng: ${safeText(order.discount_name || "Không áp dụng")}`, 50, y);
  doc.text(`Tổng giá trị đơn: ${money(Number(order.total ?? 0))}`, 290, y);

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
