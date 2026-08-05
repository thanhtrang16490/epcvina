import { createHash } from "crypto";

type MetaLeadEvent = {
  eventId: string;
  eventSourceUrl?: string | null;
  phone: string;
  email?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbclid?: string | null;
};

const META_GRAPH_VERSION = "v23.0";

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalizePhoneForMeta(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("0") ? `84${digits.slice(1)}` : digits;
}

export async function sendMetaLeadEvent(input: MetaLeadEvent) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return { configured: false, delivered: false };

  const userData: Record<string, string | string[]> = {
    ph: [sha256(normalizePhoneForMeta(input.phone))],
  };
  if (input.email) userData.em = [sha256(input.email)];
  if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;
  if (input.fbclid) userData.fbc = `fb.1.${Math.floor(Date.now() / 1000)}.${input.fbclid}`;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl || "https://epcvina.com/",
        user_data: userData,
      },
    ],
  };
  if (process.env.META_CAPI_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4_000),
      },
    );
    if (!response.ok) {
      const detail = await response.text();
      console.error("Meta CAPI lead delivery failed", response.status, detail.slice(0, 500));
      return { configured: true, delivered: false };
    }
    return { configured: true, delivered: true };
  } catch (error) {
    console.error("Meta CAPI lead delivery failed", error);
    return { configured: true, delivered: false };
  }
}
