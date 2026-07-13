type SupabaseClient = {
  from: (table: string) => {
    select: (columns: string) => any;
  };
};

function slugPart(value: string) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 18);
}

function dayStamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function nextSuffix(existing: string[]) {
  const numbers = existing
    .map((value) => {
      const match = value.match(/-(\d{3})$/);
      return match ? Number(match[1]) : 0;
    })
    .filter((value) => Number.isFinite(value));
  const max = numbers.length ? Math.max(...numbers) : 0;
  return String(max + 1).padStart(3, "0");
}

export async function generateOrderNo(
  supabase: SupabaseClient,
  input: {
    projectName?: string;
    customerName?: string;
    systemType?: string;
    orderType?: string;
    date?: Date;
  } = {},
) {
  const prefixParts = [
    "DH",
    dayStamp(input.date ?? new Date()),
    slugPart(input.orderType || "combo"),
    slugPart(input.projectName || input.customerName || input.systemType || "order"),
  ].filter(Boolean);
  const prefix = prefixParts.join("-");
  const { data } = await supabase.from("orders").select("order_no");
  const existing = (data ?? [])
    .map((row: any) => String(row.order_no ?? ""))
    .filter((value: string) => value.startsWith(prefix));
  return `${prefix}-${nextSuffix(existing)}`;
}
