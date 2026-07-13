import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      products: [],
    });
  }

  const { data, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true });

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
