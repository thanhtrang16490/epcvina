type GtagParams = Record<string, string | number | boolean | undefined>;

const DEFAULT_CONVERSION_ACTIONS: Record<string, string> = {
  lead_submit: "lead_submit",
  hotline_click: "hotline_click",
  zalo_click: "zalo_click",
};

const DEFAULT_CONVERSION_LABELS: Record<string, string> = {
  lead_submit: "epcvina_lead_submit",
  hotline_click: "epcvina_hotline_click",
  zalo_click: "epcvina_zalo_click",
};

export function trackEvent(eventName: string, params: GtagParams = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

export function trackConversionEvent(eventName: string, params: GtagParams = {}) {
  trackEvent(eventName, {
    event_category: "conversion",
    conversion_action: DEFAULT_CONVERSION_ACTIONS[eventName] || eventName,
    conversion_label: DEFAULT_CONVERSION_LABELS[eventName] || eventName,
    ...params,
  });
}

export function getConversionConfig(eventName: string, overrides: GtagParams = {}) {
  return {
    event_category: "conversion",
    conversion_action: overrides.conversion_action || DEFAULT_CONVERSION_ACTIONS[eventName] || eventName,
    conversion_label: overrides.conversion_label || DEFAULT_CONVERSION_LABELS[eventName] || eventName,
    ...overrides,
  };
}
