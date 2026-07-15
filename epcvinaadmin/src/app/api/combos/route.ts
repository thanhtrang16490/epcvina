import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ updatedAt: new Date().toISOString(), combos: [] });
  }

  const { data, error } = await supabase
    .from("combos")
    .select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id, cover_image_url, image_urls")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      {
        updatedAt: new Date().toISOString(),
        combos: [],
        error: error.message,
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    combos: data ?? [],
  });
}
