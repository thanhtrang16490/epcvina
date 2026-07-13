import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
    supabase.from("products").select("*").order("sort_order", { ascending: true }),
    supabase.from("combos").select("*").order("sort_order", { ascending: true }),
    supabase.from("combo_items").select("*").order("sort_order", { ascending: true }),
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
