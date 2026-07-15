export function getPage(value: string | string[] | undefined, defaultPage = 1) {
  const raw = typeof value === "string" ? value : "";
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : defaultPage;
}

export function getPageSize(value: string | string[] | undefined, defaultSize = 20, maxSize = 100) {
  const raw = typeof value === "string" ? value : "";
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultSize;
  return Math.min(Math.floor(parsed), maxSize);
}

export function getPageRange(page: number, pageSize: number) {
  const start = Math.max(0, (page - 1) * pageSize);
  const end = start + pageSize - 1;
  return { start, end };
}

export function getPageCount(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}
