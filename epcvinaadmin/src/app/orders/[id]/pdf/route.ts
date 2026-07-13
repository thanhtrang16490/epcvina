import { NextRequest } from "next/server";
import { generateOrderPdf } from "@/lib/order-pdf";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const preview = _req.nextUrl.searchParams.get("preview") === "1";
  const { pdf, publicUrl, orderPdfPath } = await generateOrderPdf(id, { persist: !preview });
  const filename = `order-${id}.pdf`;
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="${filename}"`,
      "Content-Length": String(pdf.length),
      "X-Content-Type-Options": "nosniff",
      "X-PDF-Public-Url": publicUrl ?? "",
      "X-PDF-Storage-Path": orderPdfPath,
    },
  });
}
