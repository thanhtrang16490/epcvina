"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { deleteSurveyMediaPaths, uploadSurveyMediaFiles } from "@/lib/storage-media";
import { notifyTelegramAboutLeadAction } from "@/lib/telegram-leads";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const leadSourceTags = [
  { value: "website", label: "Website" },
  { value: "manual", label: "Tạo tay" },
  { value: "call", label: "Gọi điện" },
  { value: "facebook", label: "Facebook" },
  { value: "zalo", label: "Zalo" },
  { value: "referral", label: "Giới thiệu" },
  { value: "event", label: "Sự kiện" },
  { value: "other", label: "Khác" },
] as const;

export async function createSurveyLead(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const now = new Date().toISOString();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const ownerName = String(formData.get("owner_name") ?? "").trim();
  const sourceTag = String(formData.get("source_tag") ?? "manual").trim();
  const sourceLabel = leadSourceTags.find((item) => item.value === sourceTag)?.label ?? "Tạo tay";
  if (!name && !phone) return;

  const { data, error } = await supabase
    .from("crm_leads")
    .insert({
      name: name || null,
      phone: phone || null,
      email: email || null,
      source: "admin",
      source_form: "admin/manual",
      status: "new",
      priority: "normal",
      created_at: now,
      updated_at: now,
      metadata: {
        owner_name: ownerName || null,
        source_tag: sourceTag,
        source_label: sourceLabel,
        last_activity_at: now,
        activity_log: [{ at: now, type: "note", note: "Lead được tạo thủ công từ admin.", author: ownerName || null }],
      },
    })
    .select("id")
    .single();
  if (error) throw error;

  await notifyTelegramAboutLeadAction(
    {
      id: data.id,
      name: name || null,
      phone: phone || "—",
      email: email || null,
      address: null,
      message: null,
      source_form: "admin/manual",
      system_type: null,
      roof_area: null,
      monthly_bill: null,
      system_size_kw: null,
      landing_page: null,
      utm_source: null,
      utm_campaign: null,
    },
    { kind: "admin_manual", label: "Tạo lead thủ công trong admin", author: ownerName || null },
  );

  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/survey");
  redirect(`/admin/leads/survey?lead_id=${data.id}`);
}

export async function completeSurveyLead(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const leadId = String(formData.get("lead_id") ?? "").trim();
  if (!leadId) return;

  const now = new Date().toISOString();
  const payload = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    projectAddress: String(formData.get("projectAddress") ?? "").trim(),
    projectType: String(formData.get("projectType") ?? "").trim(),
    roofType: String(formData.get("roofType") ?? "").trim(),
    monthlyBill: String(formData.get("monthlyBill") ?? "").trim(),
    roofArea: String(formData.get("roofArea") ?? "").trim(),
    systemSize: String(formData.get("systemSize") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };

  const { data: current, error: fetchError } = await supabase.from("crm_leads").select("metadata").eq("id", leadId).single();
  if (fetchError) throw fetchError;

  const currentMetadata = (current?.metadata && typeof current.metadata === "object" && !Array.isArray(current.metadata) ? current.metadata : {}) as Record<string, unknown>;
  const currentSurvey = (currentMetadata.survey && typeof currentMetadata.survey === "object" && !Array.isArray(currentMetadata.survey) ? currentMetadata.survey : {}) as Record<string, unknown>;

  const { error: updateError } = await supabase
    .from("crm_leads")
    .update({
      status: "survey_done",
      updated_at: now,
      name: payload.fullName || null,
      phone: payload.phone || null,
      email: payload.email || null,
      address: payload.projectAddress || null,
      system_type: payload.projectType || null,
      roof_area: payload.roofArea || null,
      monthly_bill: payload.monthlyBill || null,
      system_size_kw: payload.systemSize ? Number.parseFloat(payload.systemSize.replace(",", ".")) || null : null,
      internal_note: payload.notes || null,
      metadata: {
        ...currentMetadata,
        survey: {
          ...currentSurvey,
          company: payload.company || null,
          roof_type: payload.roofType || null,
          completed_at: now,
          status: "survey_done",
        },
        last_activity_at: now,
      },
    })
    .eq("id", leadId);
  if (updateError) throw updateError;

  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/survey");
  revalidatePath(`/admin/leads/${leadId}`);
  redirect("/admin/leads/survey?updated=1");
}

export async function completeTechnicalSurvey(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const leadId = String(formData.get("lead_id") ?? "").trim();
  if (!leadId) return;

  const now = new Date().toISOString();
  const siteImages = String(formData.get("site_images") ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const sketchImages = String(formData.get("sketch_images") ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const youtubeVideoUrl = String(formData.get("youtube_video_url") ?? "").trim() || null;
  const siteFiles = formData.getAll("site_image_files").filter((value): value is File => value instanceof File && value.size > 0);
  const sketchFiles = formData.getAll("sketch_image_files").filter((value): value is File => value instanceof File && value.size > 0);
  const siteUpload = siteFiles.length ? await uploadSurveyMediaFiles(supabase, leadId, "site-images", siteFiles) : { urls: [], paths: [] };
  const sketchUpload = sketchFiles.length ? await uploadSurveyMediaFiles(supabase, leadId, "sketch-images", sketchFiles) : { urls: [], paths: [] };

  const technicalPayload = {
    lead_id: leadId,
    house_direction: String(formData.get("house_direction") ?? "").trim() || null,
    roof_direction: String(formData.get("roof_direction") ?? "").trim() || null,
    roof_slope: String(formData.get("roof_slope") ?? "").trim() || null,
    shadow_obstacles: String(formData.get("shadow_obstacles") ?? "").trim() || null,
    installation_areas: String(formData.get("installation_areas") ?? "").trim() || null,
    structure_type: String(formData.get("structure_type") ?? "").trim() || null,
    inverter_location: String(formData.get("inverter_location") ?? "").trim() || null,
    distribution_board_location: String(formData.get("distribution_board_location") ?? "").trim() || null,
    cable_route: String(formData.get("cable_route") ?? "").trim() || null,
    distance_to_grid_point: String(formData.get("distance_to_grid_point") ?? "").trim() || null,
    need_frame: String(formData.get("need_frame") ?? "") === "1",
    frame_notes: String(formData.get("frame_notes") ?? "").trim() || null,
    site_images: [...siteImages, ...siteUpload.urls],
    site_image_paths: siteUpload.paths,
    sketch_images: sketchImages,
    sketch_image_paths: sketchUpload.paths,
    youtube_video_url: youtubeVideoUrl,
    notes: String(formData.get("notes") ?? "").trim() || null,
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
      internal_note: String(formData.get("notes") ?? "").trim() || null,
      metadata: {
        technical_survey_completed_at: now,
        technical_survey_done: true,
      },
    })
    .eq("id", leadId);
  if (updateError) throw updateError;

  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/survey");
  revalidatePath(`/admin/leads/${leadId}`);
  redirect("/admin/leads/survey?technical_updated=1");
}

export async function deleteLeadWithMedia(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const { data: technicalRows } = await supabase
    .from("crm_survey_technical")
    .select("site_image_paths,sketch_image_paths")
    .eq("lead_id", id);

  const mediaPaths = (technicalRows ?? []).flatMap((row: any) => [
    ...(Array.isArray(row.site_image_paths) ? row.site_image_paths : []),
    ...(Array.isArray(row.sketch_image_paths) ? row.sketch_image_paths : []),
  ]).filter((value): value is string => typeof value === "string" && value.length > 0);

  if (mediaPaths.length) {
    await deleteSurveyMediaPaths(supabase, mediaPaths);
  }

  await supabase.from("crm_survey_technical").delete().eq("lead_id", id);
  await supabase.from("crm_leads").delete().eq("id", id);

  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/survey");
  redirect("/admin/leads?deleted=1");
}
