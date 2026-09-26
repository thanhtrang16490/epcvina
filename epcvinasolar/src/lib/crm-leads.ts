import { trackEvent } from "./tracking";

export type CrmLeadInput = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  message?: string;
  source_form: string;
  system_type?: string;
  roof_area?: string;
  monthly_bill?: string;
  system_size_kw?: number;
  calculator_result?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  website?: string;
};

const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid", "oppref"] as const;
const DEFAULT_CRM_LEAD_ENDPOINT = "https://app.epcvina.com/api/public/leads";
const FORM_SESSION_STARTED_AT = Date.now();
const ATTRIBUTION_STORAGE_KEY = "epcvina_attribution_v1";
const LEAD_DEBUG_KEY = "epcvina_lead_debug_v1";

type Touchpoint = Partial<Record<(typeof TRACKING_KEYS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  source_channel?: string;
  captured_at?: string;
};

type Attribution = { first_touch?: Touchpoint; last_touch?: Touchpoint };

function readAttribution(): Attribution {
  try {
    return JSON.parse(window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}

function getSourceChannel(attribution: Attribution) {
  const stored = attribution.last_touch?.source_channel || attribution.first_touch?.source_channel;
  if (stored) return stored;
  try {
    const host = new URL(document.referrer).hostname.toLowerCase();
    if (/(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$|(^|\.)openai\.com$/.test(host)) return "chatgpt";
  } catch {
    // Referrer may be empty or malformed; attribution remains optional.
  }
  return undefined;
}

export function normalizeVietnamPhone(value: string) {
  const raw = value.trim();
  if (!raw || !/^[+\d\s().-]+$/.test(raw)) return "";
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("84")) digits = `0${digits.slice(2)}`;
  const isMobile = /^0(?:3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-46-9])\d{7}$/.test(digits);
  const isLandline = /^02\d{9}$/.test(digits);
  return isMobile || isLandline ? digits : "";
}

export async function submitCrmLead(input: CrmLeadInput) {
  if (typeof window === "undefined") throw new Error("Chỉ gửi lead từ trình duyệt.");
  const endpoint = import.meta.env.PUBLIC_CRM_LEAD_ENDPOINT || DEFAULT_CRM_LEAD_ENDPOINT;
  const phone = input.phone ? normalizeVietnamPhone(input.phone) : "";
  const email = input.email?.trim() || "";
  const hasValidPhone = Boolean(phone);
  const hasValidEmail = Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  if (!hasValidPhone && !hasValidEmail) {
    throw new Error("Vui lòng nhập số điện thoại hoặc email hợp lệ.");
  }

  const attribution = readAttribution();
  const params = new URLSearchParams(window.location.search);
  const tracking = Object.fromEntries(TRACKING_KEYS.map((key) => [
    key,
    params.get(key) || attribution.last_touch?.[key] || attribution.first_touch?.[key] || undefined,
  ]));
  const sourceChannel = getSourceChannel(attribution);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      phone: phone || input.phone?.trim() || email,
      email: email || undefined,
      metadata: { ...input.metadata, attribution, source_channel: sourceChannel },
      ...tracking,
      source_channel: sourceChannel,
      source: "epcvinasolar",
      form_elapsed_ms: Date.now() - FORM_SESSION_STARTED_AT,
      landing_page: window.location.href,
      referrer: document.referrer || undefined,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) throw new Error(result.message || "Không gửi được thông tin.");
  if (result.filtered) throw new Error("Yêu cầu chưa được ghi nhận. Vui lòng kiểm tra thông tin và thử lại.");
  if (result.accepted && result.lead_id && !result.duplicate) {
    try {
      window.localStorage.setItem(LEAD_DEBUG_KEY, JSON.stringify({
        captured_at: new Date().toISOString(),
        source_form: input.source_form,
        accepted: Boolean(result.accepted),
        duplicate: Boolean(result.duplicate),
        filtered: Boolean(result.filtered),
        lead_id: result.lead_id,
        endpoint,
      }));
    } catch {
      // Debug storage is best-effort only.
    }
    trackEvent("generate_lead", {
      source_form: input.source_form,
      event_id: result.lead_id,
      source_channel: sourceChannel,
    });
    trackEvent("form_submit", {
      source_form: input.source_form,
      event_id: result.lead_id,
      source_channel: sourceChannel,
    });
    window.epcTrackConversion?.("form_submit", {
      source_form: input.source_form,
      event_id: result.lead_id,
      source_channel: sourceChannel,
    });
    window.oaiq?.("measure", "lead_created", {
      type: "customer_action",
    }, {
      event_id: result.lead_id,
    });
    window.fbq?.("track", "Lead", { source_form: input.source_form }, { eventID: result.lead_id });
  }
  return result as { success: true; accepted: boolean; lead_id?: string; duplicate?: boolean };
}

export function redirectToThankYou(sourceForm: string) {
  if (typeof window === "undefined") return;
  window.location.assign(`/cam-on?nguon=${encodeURIComponent(sourceForm)}`);
}
