import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      products: [],
      combos: [],
      comboItems: [],
    });
  }

  const [productsResult, combosResult, comboItemsResult] = await Promise.all([
    supabase.from("products").select("id, slug, name, category_id, category, brand_id, brand, unit, sale_price_vat, description, cover_image_url, image_urls, status, is_active, sort_order").order("sort_order", { ascending: true }),
    supabase.from("combos").select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id, cover_image_url, image_urls").order("sort_order", { ascending: true }),
    supabase.from("combo_items").select("id, combo_id, product_id, category, item_name, quantity, unit_price_vat, total_price_vat, cost_price, total_cost_price, sort_order, note").order("sort_order", { ascending: true }),
  ]);

  if (productsResult.error || combosResult.error || comboItemsResult.error) {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      products: [],
      combos: [],
      comboItems: [],
      error: {
        products: productsResult.error?.message ?? null,
        combos: combosResult.error?.message ?? null,
        comboItems: comboItemsResult.error?.message ?? null,
      },
    });
  }

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    products: productsResult.data ?? [],
    combos: combosResult.data ?? [],
    comboItems: comboItemsResult.data ?? [],
  });
}
