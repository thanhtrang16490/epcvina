import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { notifyTelegramAboutLead } from "@/lib/telegram-leads";
import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const MAX_BODY_BYTES = 24_000;
const DURABLE_WINDOW_MINUTES = 15;
const MAX_DURABLE_REQUESTS = 5;
const DUPLICATE_WINDOW_MINUTES = 10;
const buckets = new Map<string, { count: number; resetAt: number }>();

function allowedOrigins() {
  return (process.env.CRM_ALLOWED_ORIGINS ?? "https://epcvina.com,https://www.epcvina.com,http://localhost:3000")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string | null) {
  const configured = allowedOrigins();
  const allowedOrigin = origin && configured.includes(origin) ? origin : configured[0] ?? "https://epcvina.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function anonymousHash(value: string) {
  const secret = process.env.CRM_SPAM_HASH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return secret && value !== "unknown" ? createHmac("sha256", secret).update(value).digest("hex") : "";
}

function text(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizedPhone(value: unknown) {
  const raw = text(value, 30);
  if (!raw || !/^[+\d\s().-]+$/.test(raw)) return "";
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("84")) digits = `0${digits.slice(2)}`;
  const isMobile = /^0(?:3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-46-9])\d{7}$/.test(digits);
  const isLandline = /^02\d{9}$/.test(digits);
  return isMobile || isLandline ? digits : "";
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);
  if (origin && !allowedOrigins().includes(origin)) {
    return NextResponse.json({ success: false, message: "Nguồn gửi không được phép." }, { status: 403, headers });
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ success: false, message: "Dữ liệu gửi quá lớn." }, { status: 413, headers });
  }
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientKey = forwarded || request.headers.get("x-real-ip") || "unknown";
  const ipHash = anonymousHash(clientKey);
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
    const elapsedMs = Number(body.form_elapsed_ms);
    if (Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < 900) {
      return NextResponse.json({ success: true }, { status: 202, headers });
    }

    const phone = normalizedPhone(body.phone);
    if (!phone) {
      return NextResponse.json({ success: false, message: "Số điện thoại chưa đúng. Vui lòng nhập số Việt Nam, ví dụ 0988446113 hoặc +84988446113." }, { status: 400, headers });
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ success: false, message: "CRM chưa được cấu hình." }, { status: 503, headers });
    }

    if (ipHash) {
      const durableCutoff = new Date(now - DURABLE_WINDOW_MINUTES * 60_000).toISOString();
      const { count, error: rateError } = await supabase
        .from("crm_leads")
        .select("id", { count: "exact", head: true })
        .contains("metadata", { ip_hash: ipHash })
        .gte("created_at", durableCutoff);
      if (rateError) throw rateError;
      if ((count ?? 0) >= MAX_DURABLE_REQUESTS) {
        return NextResponse.json({ success: false, message: "Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau." }, { status: 429, headers });
      }
    }

    const duplicateCutoff = new Date(now - DUPLICATE_WINDOW_MINUTES * 60_000).toISOString();
    const { count: duplicateCount, error: duplicateError } = await supabase
      .from("crm_leads")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone)
      .gte("created_at", duplicateCutoff);
    if (duplicateError) throw duplicateError;
    if ((duplicateCount ?? 0) > 0) {
      return NextResponse.json({ success: true, duplicate: true }, { status: 202, headers });
    }

    const suspiciousText = [text(body.name, 160), text(body.address, 500), text(body.message, 3000)].join(" ");
    const linkCount = (suspiciousText.match(/https?:\/\/|www\./gi) ?? []).length;
    if (linkCount >= 3) {
      return NextResponse.json({ success: true }, { status: 202, headers });
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
      metadata: {
        ...(typeof body.metadata === "object" && body.metadata && !Array.isArray(body.metadata) ? body.metadata : {}),
        ...(ipHash ? { ip_hash: ipHash } : {}),
        spam_protection_version: 2,
      },
    };

    const { data, error } = await supabase.from("crm_leads").insert(payload).select("id").single();
    if (error) throw error;

    const telegramStatus = await notifyTelegramAboutLead({ id: data.id, ...payload });

    return NextResponse.json({ success: true, lead_id: data.id, telegram_status: telegramStatus }, { status: 201, headers });
  } catch (error) {
    console.error("CRM lead intake failed", error);
    return NextResponse.json({ success: false, message: "Chưa thể ghi nhận thông tin. Vui lòng thử lại." }, { status: 500, headers });
  }
}
