import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { uploadSurveyMediaFiles } from "@/lib/storage-media";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ success: false, message: "CRM chưa được cấu hình." }, { status: 503 });
    }

    const leadId = text(formData, "lead_id");
    if (!leadId) {
      return NextResponse.json({ success: false, message: "Thiếu lead_id." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const siteImages = text(formData, "site_images")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const sketchImages = text(formData, "sketch_images")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const youtubeVideoUrl = text(formData, "youtube_video_url") || null;
    const siteFiles = formData.getAll("site_image_files").filter((value): value is File => value instanceof File && value.size > 0);
    const sketchFiles = formData.getAll("sketch_image_files").filter((value): value is File => value instanceof File && value.size > 0);
    const houseDirectionFiles = formData.getAll("house_direction_image_files").filter((value): value is File => value instanceof File && value.size > 0);
    const roofDirectionFiles = formData.getAll("roof_direction_image_files").filter((value): value is File => value instanceof File && value.size > 0);
    const siteUpload = siteFiles.length ? await uploadSurveyMediaFiles(supabase, leadId, "site-images", siteFiles) : { urls: [], paths: [] };
    const sketchUpload = sketchFiles.length ? await uploadSurveyMediaFiles(supabase, leadId, "sketch-images", sketchFiles) : { urls: [], paths: [] };
    const houseDirectionUpload = houseDirectionFiles.length ? await uploadSurveyMediaFiles(supabase, leadId, "house-direction", houseDirectionFiles) : { urls: [], paths: [] };
    const roofDirectionUpload = roofDirectionFiles.length ? await uploadSurveyMediaFiles(supabase, leadId, "roof-direction", roofDirectionFiles) : { urls: [], paths: [] };

    const technicalPayload = {
      lead_id: leadId,
      house_direction: text(formData, "house_direction") || null,
      house_direction_label: text(formData, "house_direction_label") || null,
      roof_direction: text(formData, "roof_direction") || null,
      roof_direction_label: text(formData, "roof_direction_label") || null,
      roof_slope: text(formData, "roof_slope") || null,
      shadow_obstacles: text(formData, "shadow_obstacles") || null,
      installation_areas: text(formData, "installation_areas") || null,
      string_count: text(formData, "string_count") || null,
      structure_type: text(formData, "structure_type") || null,
      roof_material: text(formData, "roof_material") || null,
      roof_condition: text(formData, "roof_condition") || null,
      building_height: text(formData, "building_height") || null,
      access_notes: text(formData, "access_notes") || null,
      inverter_location: text(formData, "inverter_location") || null,
      distribution_board_location: text(formData, "distribution_board_location") || null,
      main_switchboard_location: text(formData, "main_switchboard_location") || null,
      main_breaker_rating: text(formData, "main_breaker_rating") || null,
      meter_location: text(formData, "meter_location") || null,
      wifi_signal: text(formData, "wifi_signal") || null,
      safety_access_notes: text(formData, "safety_access_notes") || null,
      cable_route: text(formData, "cable_route") || null,
      distance_to_grid_point: text(formData, "distance_to_grid_point") || null,
      dc_cable_length: text(formData, "dc_cable_length") || null,
      ac_cable_length: text(formData, "ac_cable_length") || null,
      house_direction_image_urls: houseDirectionUpload.urls,
      house_direction_image_paths: houseDirectionUpload.paths,
      roof_direction_image_urls: roofDirectionUpload.urls,
      roof_direction_image_paths: roofDirectionUpload.paths,
      need_frame: text(formData, "need_frame") === "1",
      frame_notes: text(formData, "frame_notes") || null,
      site_images: [...siteImages, ...siteUpload.urls],
      site_image_paths: siteUpload.paths,
      sketch_images: [...sketchImages, ...sketchUpload.urls],
      sketch_image_paths: sketchUpload.paths,
      youtube_video_url: youtubeVideoUrl,
      notes: text(formData, "notes") || null,
      surveyed_at: now,
      created_at: now,
      updated_at: now,
    };

    const { error: insertError } = await supabase.from("crm_survey_technical").insert(technicalPayload);
    if (insertError) throw insertError;

    const { error: updateError } = await supabase
      .from("crm_leads")
      .update({
        status: "technical_survey_done",
        updated_at: now,
        internal_note: text(formData, "notes") || null,
        metadata: {
          technical_survey_completed_at: now,
          technical_survey_done: true,
        },
      })
      .eq("id", leadId);
    if (updateError) throw updateError;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Technical survey save failed", error);
    return NextResponse.json({ success: false, message: "Không thể lưu khảo sát kỹ thuật." }, { status: 500 });
  }
}
