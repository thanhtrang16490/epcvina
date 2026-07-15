import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") ?? "").trim();
  const customerId = String(url.searchParams.get("customerId") ?? "").trim();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ items: [] });
  let query = supabase.from("projects").select("id, name, customer_id, status, address").order("sort_order", { ascending: true }).limit(20);
  if (customerId) query = query.eq("customer_id", customerId);
  if (q) query = query.or(`name.ilike.%${q}%,address.ilike.%${q}%`);
  const { data } = await query;
  return NextResponse.json({ items: (data ?? []).map((row: any) => ({ id: String(row.id), label: String(row.name ?? ""), meta: [row.address, row.status].filter(Boolean).join(" · ") })) });
}
