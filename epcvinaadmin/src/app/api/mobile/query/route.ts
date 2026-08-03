import { bearerToken, createMobileSupabaseClient } from "@/lib/supabase/mobile";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TABLES = new Set([
  "approval_requests", "brands", "categories", "customer_debts", "customer_special_prices",
  "customers", "discount_policies", "gift_order_items", "gift_orders", "gift_policies",
  "invoices", "notifications", "order_items", "orders", "payments", "production_requests",
  "products", "profiles", "sales_teams", "stock_movements", "team_members",
]);
const PUBLIC_READ_TABLES = new Set(["brands", "categories", "products"]);
const FILTERS = new Set(["eq", "neq", "in", "is", "gte", "gt", "lte", "lt", "like", "ilike", "or", "not"]);

type Filter = { method: string; args: unknown[] };
type Modifier = { method: string; args: unknown[] };

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 256_000) {
      return NextResponse.json({ error: "Dữ liệu gửi quá lớn." }, { status: 413 });
    }
    const body = await request.json();
    const table = String(body.table ?? "");
    const action = String(body.action ?? "select");
    if (!TABLES.has(table)) return NextResponse.json({ error: "Bảng không được phép." }, { status: 403 });
    if (!new Set(["select", "insert", "update", "delete"]).has(action)) {
      return NextResponse.json({ error: "Thao tác không được phép." }, { status: 400 });
    }

    const token = bearerToken(request);
    if ((!PUBLIC_READ_TABLES.has(table) || action !== "select") && !token) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }
    if (["update", "delete"].includes(action) && (!Array.isArray(body.filters) || body.filters.length === 0)) {
      return NextResponse.json({ error: "Thao tác ghi phải có điều kiện lọc." }, { status: 400 });
    }
    const supabase = createMobileSupabaseClient(token || undefined);
    if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
    if (token) {
      const { data } = await supabase.auth.getUser(token);
      if (!data.user) return NextResponse.json({ error: "Phiên đăng nhập không hợp lệ." }, { status: 401 });
    }

    let query: any = supabase.from(table);
    if (action === "select") query = query.select(body.columns || "*", body.selectOptions);
    if (action === "insert") query = query.insert(body.payload);
    if (action === "update") query = query.update(body.payload);
    if (action === "delete") query = query.delete();
    if (action !== "select" && body.returning) query = query.select(body.returning);

    for (const filter of (body.filters ?? []) as Filter[]) {
      if (!FILTERS.has(filter.method) || !Array.isArray(filter.args)) continue;
      query = query[filter.method](...filter.args);
    }
    for (const modifier of (body.modifiers ?? []) as Modifier[]) {
      if (modifier.method === "order") query = query.order(...modifier.args);
      if (modifier.method === "limit") query = query.limit(...modifier.args);
      if (modifier.method === "range") query = query.range(...modifier.args);
    }
    if (body.single === "single") query = query.single();
    if (body.single === "maybeSingle") query = query.maybeSingle();

    const result = await query;
    return NextResponse.json(result, { status: result.error ? 400 : 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Truy vấn thất bại.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
