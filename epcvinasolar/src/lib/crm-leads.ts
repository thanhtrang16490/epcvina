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

export async function submitCrmLead(input: CrmLeadInput) {
  if (typeof window === "undefined") throw new Error("Chỉ gửi lead từ trình duyệt.");
  const endpoint = import.meta.env.PUBLIC_CRM_LEAD_ENDPOINT || DEFAULT_CRM_LEAD_ENDPOINT;

  const params = new URLSearchParams(window.location.search);
  const tracking = Object.fromEntries(TRACKING_KEYS.map((key) => [key, params.get(key) || undefined]));
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      ...tracking,
      source: "epcvinasolar",
      form_elapsed_ms: Date.now() - FORM_SESSION_STARTED_AT,
      landing_page: window.location.href,
      referrer: document.referrer || undefined,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) throw new Error(result.message || "Không gửi được thông tin.");
  return result as { success: true; lead_id: string };
}

export function redirectToThankYou(sourceForm: string) {
  if (typeof window === "undefined") return;
  window.location.assign(`/cam-on?nguon=${encodeURIComponent(sourceForm)}`);
}
