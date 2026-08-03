import { createHmac } from "crypto";

const CONVERSION_STATUSES = new Set(["qualified", "survey_scheduled", "quoted", "won"]);
const CONVERSION_EVENT_NAMES: Record<string, string> = {
  qualified: "qualified_lead",
  survey_scheduled: "survey_scheduled",
  quoted: "quotation_sent",
  won: "sale_won",
};

type ConversionLead = {
  id: string;
  status: string;
  source_form: string | null;
  phone: string;
  email: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  fbclid: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  created_at: string;
};

export async function sendLeadQualityConversion(lead: ConversionLead) {
  const url = process.env.CRM_CONVERSION_WEBHOOK_URL;
  if (!url || !CONVERSION_STATUSES.has(lead.status)) return "not_configured" as const;

  const payload = JSON.stringify({
    event_id: `${lead.id}:${lead.status}`,
    event_name: CONVERSION_EVENT_NAMES[lead.status] || lead.status,
    event_time: new Date().toISOString(),
    lead,
  });
  const secret = process.env.CRM_CONVERSION_WEBHOOK_SECRET;
  const signature = secret ? createHmac("sha256", secret).update(payload).digest("hex") : "";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(signature ? { "X-EPCVINA-Signature": signature } : {}),
      },
      body: payload,
      signal: controller.signal,
      cache: "no-store",
    });
    return response.ok ? "sent" as const : `webhook_${response.status}`;
  } catch (error) {
    return error instanceof Error && error.name === "AbortError" ? "timeout" as const : "network_error" as const;
  } finally {
    clearTimeout(timeout);
  }
}
