import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") ?? "").trim();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ items: [] });
  let query = supabase.from("products").select("id, name, brand, category, sale_price_vat").order("sort_order", { ascending: true }).limit(25);
  if (q) query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,category.ilike.%${q}%`);
  const { data } = await query;
  return NextResponse.json({ items: (data ?? []).map((row: any) => ({ id: String(row.id), label: String(row.name ?? ""), meta: [row.brand, row.category].filter(Boolean).join(" · ") })) });
}
