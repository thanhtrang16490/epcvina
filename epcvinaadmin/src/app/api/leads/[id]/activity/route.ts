import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const note = String(body.note ?? "").trim();
  const activityType = String(body.activity_type ?? "note").trim();
  const ownerName = String(body.owner_name ?? "").trim();
  if (!id || !note) return NextResponse.json({ success: false, message: "Thiếu nội dung." }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ success: false, message: "CRM chưa cấu hình." }, { status: 503 });

  const now = new Date().toISOString();
  const { data: current } = await supabase.from("crm_leads").select("metadata,first_contacted_at").eq("id", id).single();
  const currentMetadata = (current?.metadata && typeof current.metadata === "object" && !Array.isArray(current.metadata) ? current.metadata : {}) as Record<string, unknown>;
  const activityLog = Array.isArray(currentMetadata.activity_log) ? currentMetadata.activity_log : [];

  const values: Record<string, unknown> = {
    updated_at: now,
    last_contacted_at: now,
    metadata: {
      ...currentMetadata,
      owner_name: ownerName || currentMetadata.owner_name || null,
      last_activity_at: now,
      activity_log: [
        { at: now, type: activityType, note, author: ownerName || null },
        ...activityLog,
      ].slice(0, 20),
    },
  };
  if (!current?.first_contacted_at) values.first_contacted_at = now;

  const { error } = await supabase.from("crm_leads").update(values).eq("id", id);
  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
