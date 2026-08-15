import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

type TechnicalSurveyRecord = {
  id: string;
  lead_id: string;
  lead_name: string | null;
  lead_phone: string | null;
  lead_status: string | null;
  house_direction: string | null;
  roof_direction: string | null;
  roof_slope: string | null;
  shadow_obstacles: string | null;
  installation_areas: string | null;
  string_count: string | null;
  structure_type: string | null;
  roof_material: string | null;
  roof_condition: string | null;
  building_height: string | null;
  access_notes: string | null;
  inverter_location: string | null;
  distribution_board_location: string | null;
  main_switchboard_location: string | null;
  main_breaker_rating: string | null;
  meter_location: string | null;
  wifi_signal: string | null;
  safety_access_notes: string | null;
  cable_route: string | null;
  distance_to_grid_point: string | null;
  dc_cable_length: string | null;
  ac_cable_length: string | null;
  house_direction_image_urls: string[] | null;
  roof_direction_image_urls: string[] | null;
  need_frame: boolean | null;
  frame_notes: string | null;
  site_images: string[] | null;
  sketch_images: string[] | null;
  youtube_video_url: string | null;
  notes: string | null;
  surveyed_at: string | null;
  created_at: string | null;
};

async function loadTechnicalSurveys() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("crm_survey_technical")
    .select(
      `
        id,
        lead_id,
        house_direction,
        roof_direction,
        roof_slope,
        shadow_obstacles,
        installation_areas,
        string_count,
        structure_type,
        roof_material,
        roof_condition,
        building_height,
        access_notes,
        inverter_location,
        distribution_board_location,
        main_switchboard_location,
        main_breaker_rating,
        meter_location,
        wifi_signal,
        safety_access_notes,
        cable_route,
        distance_to_grid_point,
        dc_cable_length,
        ac_cable_length,
        house_direction_image_urls,
        roof_direction_image_urls,
        need_frame,
        frame_notes,
        site_images,
        sketch_images,
        youtube_video_url,
        notes,
        surveyed_at,
        created_at,
        crm_leads (
          id,
          name,
          phone,
          status
        )
      `,
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => {
    const leadRow = Array.isArray(row.crm_leads) ? row.crm_leads[0] : row.crm_leads;
    const lead = leadRow && typeof leadRow === "object" && !Array.isArray(leadRow) ? (leadRow as Record<string, unknown>) : {};
    return {
      id: String(row.id ?? ""),
      lead_id: String(row.lead_id ?? ""),
      lead_name: (lead.name as string | null | undefined) ?? null,
      lead_phone: (lead.phone as string | null | undefined) ?? null,
      lead_status: (lead.status as string | null | undefined) ?? null,
      house_direction: (row.house_direction as string | null | undefined) ?? null,
      roof_direction: (row.roof_direction as string | null | undefined) ?? null,
      roof_slope: (row.roof_slope as string | null | undefined) ?? null,
      shadow_obstacles: (row.shadow_obstacles as string | null | undefined) ?? null,
      installation_areas: (row.installation_areas as string | null | undefined) ?? null,
      string_count: (row.string_count as string | null | undefined) ?? null,
      structure_type: (row.structure_type as string | null | undefined) ?? null,
      roof_material: (row.roof_material as string | null | undefined) ?? null,
      roof_condition: (row.roof_condition as string | null | undefined) ?? null,
      building_height: (row.building_height as string | null | undefined) ?? null,
      access_notes: (row.access_notes as string | null | undefined) ?? null,
      inverter_location: (row.inverter_location as string | null | undefined) ?? null,
      distribution_board_location: (row.distribution_board_location as string | null | undefined) ?? null,
      main_switchboard_location: (row.main_switchboard_location as string | null | undefined) ?? null,
      main_breaker_rating: (row.main_breaker_rating as string | null | undefined) ?? null,
      meter_location: (row.meter_location as string | null | undefined) ?? null,
      wifi_signal: (row.wifi_signal as string | null | undefined) ?? null,
      safety_access_notes: (row.safety_access_notes as string | null | undefined) ?? null,
      cable_route: (row.cable_route as string | null | undefined) ?? null,
      distance_to_grid_point: (row.distance_to_grid_point as string | null | undefined) ?? null,
      dc_cable_length: (row.dc_cable_length as string | null | undefined) ?? null,
      ac_cable_length: (row.ac_cable_length as string | null | undefined) ?? null,
      house_direction_image_urls: Array.isArray(row.house_direction_image_urls) ? (row.house_direction_image_urls as string[]) : null,
      roof_direction_image_urls: Array.isArray(row.roof_direction_image_urls) ? (row.roof_direction_image_urls as string[]) : null,
      need_frame: typeof row.need_frame === "boolean" ? row.need_frame : null,
      frame_notes: (row.frame_notes as string | null | undefined) ?? null,
      site_images: Array.isArray(row.site_images) ? (row.site_images as string[]) : null,
      sketch_images: Array.isArray(row.sketch_images) ? (row.sketch_images as string[]) : null,
      youtube_video_url: (row.youtube_video_url as string | null | undefined) ?? null,
      notes: (row.notes as string | null | undefined) ?? null,
      surveyed_at: (row.surveyed_at as string | null | undefined) ?? null,
      created_at: (row.created_at as string | null | undefined) ?? null,
    } satisfies TechnicalSurveyRecord;
  });
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function leadLabel(record: TechnicalSurveyRecord) {
  const name = record.lead_name?.trim();
  const phone = record.lead_phone?.trim();
  if (name && phone) return `${name} - ${phone}`;
  return name || phone || record.lead_id;
}

function Value({ value }: { value: unknown }) {
  if (typeof value === "boolean") return <>{value ? "Có" : "Không"}</>;
  return <>{String(value ?? "—")}</>;
}

export default async function TechnicalSurveyHistoryPage() {
  const records = await loadTechnicalSurveys();

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <SectionTitle
          eyebrow="CRM"
          title="Lịch sử khảo sát kỹ thuật"
          description="Xem toàn bộ bản ghi khảo sát kỹ thuật theo lead, kèm hình ảnh và ghi chú hiện trường."
        />

        <ThemeCard className="mt-6 p-5">
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/leads/survey" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[color:var(--text)]">
              Quay lại khảo sát
            </Link>
            <Link href="/admin/leads" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[color:var(--text)]">
              Danh sách lead
            </Link>
          </div>
        </ThemeCard>

        <div className="mt-6 grid gap-4">
          {records.length ? (
            records.map((record) => (
              <ThemeCard key={record.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Lead</div>
                    <div className="mt-1 text-lg font-semibold text-[color:var(--text)]">{leadLabel(record)}</div>
                    <div className="mt-1 text-sm text-[color:var(--muted)]">Trạng thái: {record.lead_status ?? "—"}</div>
                  </div>
                  <div className="text-sm text-[color:var(--muted)]">Khảo sát lúc: {formatDateTime(record.surveyed_at ?? record.created_at)}</div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <CardField label="Vật liệu mái" value={record.roof_material} />
                  <CardField label="Tình trạng mái" value={record.roof_condition} />
                  <CardField label="Độ cao công trình" value={record.building_height} />
                  <CardField label="Lối tiếp cận thi công" value={record.access_notes} />
                  <CardField label="Hướng nhà" value={record.house_direction} />
                  <CardField label="Hướng mái" value={record.roof_direction} />
                  <CardField label="Độ nghiêng mái" value={record.roof_slope} />
                  <CardField label="Bóng che" value={record.shadow_obstacles} />
                  <CardField label="Số khu vực lắp đặt" value={record.installation_areas} />
                  <CardField label="Số string cần lắp" value={record.string_count} />
                  <CardField label="Kiểu kết cấu" value={record.structure_type} />
                  <CardField label="Vị trí inverter" value={record.inverter_location} />
                  <CardField label="Vị trí tủ điện" value={record.distribution_board_location} />
                  <CardField label="Vị trí main switchboard" value={record.main_switchboard_location} />
                  <CardField label="Dòng CB chính" value={record.main_breaker_rating} />
                  <CardField label="Vị trí công tơ" value={record.meter_location} />
                  <CardField label="Tín hiệu Wi-Fi / 4G" value={record.wifi_signal} />
                  <CardField label="Đường đi cáp" value={record.cable_route} />
                  <CardField label="Khoảng cách đến điểm đấu nối" value={record.distance_to_grid_point} />
                  <CardField label="Độ dài dây DC" value={record.dc_cable_length} />
                  <CardField label="Độ dài dây AC" value={record.ac_cable_length} />
                  <CardField label="Có làm khung" value={record.need_frame} />
                  <CardField label="Ghi chú khung" value={record.frame_notes} />
                  <CardField label="Ghi chú an toàn thi công" value={record.safety_access_notes} />
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Panel title="Ảnh la bàn hướng nhà">
                    <MediaList items={record.house_direction_image_urls ?? []} />
                  </Panel>
                  <Panel title="Ảnh la bàn hướng mái">
                    <MediaList items={record.roof_direction_image_urls ?? []} />
                  </Panel>
                  <Panel title="Ảnh hiện trường">
                    <MediaList items={record.site_images ?? []} />
                  </Panel>
                  <Panel title="Ảnh bản vẽ tay">
                    <MediaList items={record.sketch_images ?? []} />
                  </Panel>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <CardField label="Video flycam" value={record.youtube_video_url} />
                  <CardField label="Ghi chú" value={record.notes} />
                </div>
              </ThemeCard>
            ))
          ) : (
            <ThemeCard className="p-5 text-sm text-[color:var(--muted)]">Chưa có bản ghi khảo sát kỹ thuật nào.</ThemeCard>
          )}
        </div>
      </main>
    </AdminShell>
  );
}

function CardField({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</div>
      <div className="mt-1 text-sm leading-6 text-[color:var(--text)] break-words">
        <Value value={value} />
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function MediaList({ items }: { items: string[] }) {
  if (!items.length) return <div className="text-sm text-[color:var(--muted)]">Chưa có ảnh.</div>;
  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <a key={`${item}-${index}`} href={item} target="_blank" rel="noreferrer" className="truncate rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm text-[color:var(--text)] hover:bg-[color:var(--panel)]">
          {item}
        </a>
      ))}
    </div>
  );
}
