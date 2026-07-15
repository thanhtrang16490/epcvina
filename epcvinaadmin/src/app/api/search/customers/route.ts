import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") ?? "").trim();
  const type = String(url.searchParams.get("type") ?? "").trim();
  const parentCompanyId = String(url.searchParams.get("parentCompanyId") ?? "").trim();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ items: [] });
  let query = supabase.from("customers").select("id, name, customer_type, parent_company_id, phone, email").order("sort_order", { ascending: true }).limit(20);
  if (type) query = query.eq("customer_type", type);
  if (parentCompanyId) query = query.eq("parent_company_id", parentCompanyId);
  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`);
  const { data } = await query;
  return NextResponse.json({ items: (data ?? []).map((row: any) => ({ id: String(row.id), label: String(row.name ?? ""), meta: [row.phone, row.email].filter(Boolean).join(" · ") })) });
}
