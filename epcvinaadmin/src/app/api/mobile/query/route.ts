import { bearerToken, createMobileSupabaseClient } from "@/lib/supabase/mobile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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

const TABLE_ALIASES: Record<string, string> = { categories: "product_categories" };
const PRODUCT_COLUMNS: Record<string, string> = {
  code: "slug",
  price: "sale_price_vat",
  stock: "quantity",
  image_url: "cover_image_url",
};

function databaseColumn(table: string, column: unknown) {
  if (typeof column !== "string") return column;
  return table === "products" ? PRODUCT_COLUMNS[column] ?? column : column;
}

function databaseColumns(table: string, columns: string) {
  if (table !== "products" || columns === "*") return columns;
  return columns
    .split(",")
    .map((column) => databaseColumn(table, column.trim()))
    .join(",");
}

function databasePayload(table: string, payload: unknown) {
  if (table !== "products" || !payload || typeof payload !== "object") return payload;
  const convert = (value: Record<string, unknown>) => Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "deleted_at")
      .map(([key, item]) => [databaseColumn(table, key) as string, item]),
  );
  return Array.isArray(payload) ? payload.map((item) => convert(item)) : convert(payload as Record<string, unknown>);
}

function mobileRows(table: string, data: unknown) {
  if (table !== "products" || data == null) return data;
  const convert = (row: Record<string, unknown>) => ({
    ...row,
    code: row.code ?? row.slug,
    price: row.price ?? row.sale_price_vat,
    stock: row.stock ?? row.quantity,
    image_url: row.image_url ?? row.cover_image_url,
    deleted_at: null,
  });
  return Array.isArray(data) ? data.map(convert) : convert(data as Record<string, unknown>);
}

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
    const userClient = createMobileSupabaseClient(token || undefined);
    const adminClient = createSupabaseAdminClient();
    const supabase = userClient;
    if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
    let authenticatedUserId = "";
    let isAdmin = false;
    if (token) {
      const { data } = await supabase.auth.getUser(token);
      if (!data.user) return NextResponse.json({ error: "Phiên đăng nhập không hợp lệ." }, { status: 401 });
      authenticatedUserId = data.user.id;
      if (adminClient) {
        const { data: adminUser } = await adminClient.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
        isAdmin = Boolean(adminUser);
      }
    }

    if (table === "profiles") {
      const profile = authenticatedUserId
        ? { id: authenticatedUserId, role: isAdmin ? "admin" : "customer", full_name: null }
        : null;
      return NextResponse.json({ data: body.single ? profile : profile ? [profile] : [], error: null });
    }

    const queryClient = (isAdmin || (action === "select" && PUBLIC_READ_TABLES.has(table))) && adminClient
      ? adminClient
      : userClient;
    const databaseTable = TABLE_ALIASES[table] ?? table;

    let query: any = queryClient.from(databaseTable);
    if (action === "select") query = query.select(databaseColumns(table, body.columns || "*"), body.selectOptions);
    if (action === "insert") query = query.insert(databasePayload(table, body.payload));
    if (action === "update") query = query.update(databasePayload(table, body.payload));
    if (action === "delete") query = query.delete();
    if (action !== "select" && body.returning) query = query.select(databaseColumns(table, body.returning));

    for (const filter of (body.filters ?? []) as Filter[]) {
      if (!FILTERS.has(filter.method) || !Array.isArray(filter.args)) continue;
      const args = [...filter.args];
      if (!["or"].includes(filter.method)) args[0] = databaseColumn(table, args[0]);
      query = query[filter.method](...args);
    }
    for (const modifier of (body.modifiers ?? []) as Modifier[]) {
      if (modifier.method === "order") {
        const args = [...modifier.args];
        args[0] = databaseColumn(table, args[0]);
        query = query.order(...args);
      }
      if (modifier.method === "limit") query = query.limit(...modifier.args);
      if (modifier.method === "range") query = query.range(...modifier.args);
    }
    if (body.single === "single") query = query.single();
    if (body.single === "maybeSingle") query = query.maybeSingle();

    const result = await query;
    return NextResponse.json({ ...result, data: mobileRows(table, result.data) }, { status: result.error ? 400 : 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Truy vấn thất bại.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
