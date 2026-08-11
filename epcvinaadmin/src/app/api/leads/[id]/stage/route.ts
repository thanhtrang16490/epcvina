import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { notifyTelegramAboutLeadAction } from "@/lib/telegram-leads";
import { NextResponse } from "next/server";

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    new: "Mới tiếp nhận",
    contacted: "Đã liên hệ",
    qualified: "Đủ điều kiện",
    survey_scheduled: "Đặt lịch khảo sát",
    survey_done: "Khảo sát xong",
    proposal_sent: "Đã gửi giải pháp",
    negotiation: "Đàm phán / chốt",
    won: "Chốt thành công",
    lost: "Thất bại",
    spam: "Spam",
  };
  return labels[status] ?? status;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const status = String(body.status ?? "");
  if (!id || !status) return NextResponse.json({ success: false, message: "Thiếu dữ liệu." }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ success: false, message: "CRM chưa cấu hình." }, { status: 503 });

  const now = new Date().toISOString();
  const { data: current } = await supabase.from("crm_leads").select("first_contacted_at,metadata,name,phone,email,address,message,source_form,system_type,roof_area,monthly_bill,system_size_kw,landing_page,utm_source,utm_campaign").eq("id", id).single();
  const currentMetadata = (current?.metadata && typeof current.metadata === "object" && !Array.isArray(current.metadata) ? current.metadata : {}) as Record<string, unknown>;
  const activityLog = Array.isArray(currentMetadata.activity_log) ? currentMetadata.activity_log : [];

  const values: Record<string, unknown> = {
    status,
    updated_at: now,
    metadata: {
      ...currentMetadata,
      last_activity_at: now,
      activity_log: [
        { at: now, type: "note", note: `Đổi stage sang ${getStatusLabel(status)}`, author: null },
        ...activityLog,
      ].slice(0, 20),
    },
  };
  if (status !== "new") values.last_contacted_at = now;
  if (status !== "new" && !current?.first_contacted_at) values.first_contacted_at = now;

  const { error } = await supabase.from("crm_leads").update(values).eq("id", id);
  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  await notifyTelegramAboutLeadAction(
    {
      id,
      name: current?.name ?? null,
      phone: current?.phone ?? "—",
      email: current?.email ?? null,
      address: current?.address ?? null,
      message: current?.message ?? null,
      source_form: current?.source_form ?? "admin/stage",
      system_type: current?.system_type ?? null,
      roof_area: current?.roof_area ?? null,
      monthly_bill: current?.monthly_bill ?? null,
      system_size_kw: current?.system_size_kw ?? null,
      landing_page: current?.landing_page ?? null,
      utm_source: current?.utm_source ?? null,
      utm_campaign: current?.utm_campaign ?? null,
    },
    { kind: "stage", label: `Đổi stage sang ${getStatusLabel(status)}` },
  );
  return NextResponse.json({ success: true });
}
