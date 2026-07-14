export function parseLocaleNumber(value: FormDataEntryValue | string | number | null | undefined, fallback = 0) {
  const raw = String(value ?? "").trim().replace(/\s/g, "");
  if (!raw) return fallback;
  const normalized = raw.includes(",")
    ? raw.includes(".")
      ? raw.replace(/\./g, "").replace(/,/g, ".")
      : raw.replace(/,/g, ".")
    : raw.replace(/\./g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatLocaleNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits }).format(Number(value ?? 0));
}
