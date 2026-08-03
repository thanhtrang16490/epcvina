export type CrmLeadInput = {
  name?: string;
  phone: string;
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

const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"] as const;
const DEFAULT_CRM_LEAD_ENDPOINT = "https://app.epcvina.com/api/public/leads";
const FORM_SESSION_STARTED_AT = Date.now();
const ATTRIBUTION_STORAGE_KEY = "epcvina_attribution_v1";

type Touchpoint = Partial<Record<(typeof TRACKING_KEYS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
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
  const phone = normalizeVietnamPhone(input.phone);
  if (!phone) throw new Error("Số điện thoại chưa đúng. Vui lòng nhập ví dụ 0988446113 hoặc +84988446113.");

  const attribution = readAttribution();
  const params = new URLSearchParams(window.location.search);
  const tracking = Object.fromEntries(TRACKING_KEYS.map((key) => [
    key,
    params.get(key) || attribution.last_touch?.[key] || attribution.first_touch?.[key] || undefined,
  ]));
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      phone,
      metadata: { ...input.metadata, attribution },
      ...tracking,
      source: "epcvinasolar",
      form_elapsed_ms: Date.now() - FORM_SESSION_STARTED_AT,
      landing_page: window.location.href,
      referrer: document.referrer || undefined,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) throw new Error(result.message || "Không gửi được thông tin.");
  if (result.accepted && result.lead_id) {
    window.gtag?.("event", "generate_lead", {
      event_category: "conversion",
      source_form: input.source_form,
      event_id: result.lead_id,
    });
    window.fbq?.("track", "Lead", { source_form: input.source_form }, { eventID: result.lead_id });
  }
  if (result.filtered) throw new Error("Yêu cầu chưa được ghi nhận. Vui lòng kiểm tra thông tin và thử lại.");
  return result as { success: true; accepted: boolean; lead_id?: string; duplicate?: boolean };
}

export function redirectToThankYou(sourceForm: string) {
  if (typeof window === "undefined") return;
  window.location.assign(`/cam-on?nguon=${encodeURIComponent(sourceForm)}`);
}
