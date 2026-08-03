import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const buckets = new Map<string, { count: number; resetAt: number }>();

function corsHeaders(origin: string | null) {
  const configured = (process.env.CRM_ALLOWED_ORIGINS ?? "https://epcvina.com,https://www.epcvina.com,http://localhost:3000")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const allowedOrigin = origin && configured.includes(origin) ? origin : configured[0] ?? "https://epcvina.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function text(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizedPhone(value: unknown) {
  const raw = text(value, 30);
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15 ? raw : "";
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientKey = forwarded || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const bucket = buckets.get(clientKey);
  if (bucket && bucket.resetAt > now && bucket.count >= MAX_REQUESTS) {
    return NextResponse.json({ success: false, message: "Bạn gửi quá nhanh. Vui lòng thử lại sau." }, { status: 429, headers });
  }
  buckets.set(clientKey, bucket && bucket.resetAt > now ? { ...bucket, count: bucket.count + 1 } : { count: 1, resetAt: now + WINDOW_MS });

  try {
    const body = await request.json();
    if (text(body.website, 200)) {
      return NextResponse.json({ success: true }, { status: 202, headers });
    }

    const phone = normalizedPhone(body.phone);
    if (!phone) {
      return NextResponse.json({ success: false, message: "Số điện thoại không hợp lệ." }, { status: 400, headers });
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ success: false, message: "CRM chưa được cấu hình." }, { status: 503, headers });
    }

    const numberOrNull = (value: unknown) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    };
    const payload = {
      name: text(body.name, 160) || null,
      phone,
      email: text(body.email, 254) || null,
      address: text(body.address, 500) || null,
      message: text(body.message, 3000) || null,
      source: text(body.source, 80) || "epcvinasolar",
      source_form: text(body.source_form, 120) || "website",
      landing_page: text(body.landing_page, 1000) || null,
      referrer: text(body.referrer, 1000) || null,
      system_type: text(body.system_type, 120) || null,
      roof_area: text(body.roof_area, 120) || null,
      monthly_bill: text(body.monthly_bill, 120) || null,
      system_size_kw: numberOrNull(body.system_size_kw),
      calculator_result: typeof body.calculator_result === "object" && body.calculator_result ? body.calculator_result : {},
      utm_source: text(body.utm_source, 200) || null,
      utm_medium: text(body.utm_medium, 200) || null,
      utm_campaign: text(body.utm_campaign, 300) || null,
      utm_term: text(body.utm_term, 300) || null,
      utm_content: text(body.utm_content, 300) || null,
      gclid: text(body.gclid, 500) || null,
      gbraid: text(body.gbraid, 500) || null,
      wbraid: text(body.wbraid, 500) || null,
      fbclid: text(body.fbclid, 500) || null,
      metadata: typeof body.metadata === "object" && body.metadata ? body.metadata : {},
    };

    const { data, error } = await supabase.from("crm_leads").insert(payload).select("id").single();
    if (error) throw error;

    return NextResponse.json({ success: true, lead_id: data.id }, { status: 201, headers });
  } catch (error) {
    console.error("CRM lead intake failed", error);
    return NextResponse.json({ success: false, message: "Chưa thể ghi nhận thông tin. Vui lòng thử lại." }, { status: 500, headers });
  }
}
