import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      products: [],
    });
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, category_id, category, brand_id, brand, unit, sale_price_vat, description, cover_image_url, image_urls, status, is_active, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      {
        updatedAt: new Date().toISOString(),
        products: [],
        error: error.message,
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    products: data ?? [],
  });
}
