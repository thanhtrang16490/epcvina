import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = String(url.searchParams.get("slug") ?? "").trim();
  if (!slug) {
    return NextResponse.json({ exists: false });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ exists: false, error: "Missing Supabase admin env" }, { status: 500 });
  }

  const { data, error } = await supabase.from("customers").select("id").eq("slug", slug).maybeSingle();
  if (error) {
    return NextResponse.json({ exists: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exists: Boolean(data) });
}
