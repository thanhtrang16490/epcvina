import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ updatedAt: new Date().toISOString(), combos: [] });
  }

  const { data, error } = await supabase.from("combos").select("*").order("sort_order", { ascending: true });

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
