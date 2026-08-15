import { AdminShell } from "@/components/AdminShell";
import { PublicSurveyForm, type SurveyLeadOption } from "@/components/PublicSurveyForm";
import { CreateLeadModalTrigger } from "@/components/CreateLeadModalTrigger";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { TechnicalSurveyForm, type TechnicalSurveyLeadOption } from "@/components/TechnicalSurveyForm";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { completeSurveyLead, completeTechnicalSurvey, createSurveyLead } from "./actions";

export const dynamic = "force-dynamic";

async function loadLeads() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("crm_leads")
    .select("id,name,phone,email,address,source_form,created_at,metadata,system_type,roof_area,monthly_bill,system_size_kw,status")
    .order("created_at", { ascending: false })
    .limit(100);
  return ((data ?? []) as Array<Record<string, unknown>>).map(
      (lead) =>
        ({
          id: String(lead.id ?? ""),
          name: (lead.name as string | null | undefined) ?? null,
          phone: (lead.phone as string | null | undefined) ?? null,
          email: (lead.email as string | null | undefined) ?? null,
          address: (lead.address as string | null | undefined) ?? null,
          source_form: (lead.source_form as string | null | undefined) ?? null,
          created_at: (lead.created_at as string | null | undefined) ?? null,
          status: (lead.status as string | null | undefined) ?? null,
          metadata:
            lead.metadata && typeof lead.metadata === "object" && !Array.isArray(lead.metadata)
              ? (lead.metadata as Record<string, unknown>)
              : null,
          system_type: (lead.system_type as string | null | undefined) ?? null,
          roof_area: (lead.roof_area as string | null | undefined) ?? null,
          monthly_bill: (lead.monthly_bill as string | null | undefined) ?? null,
          system_size_kw: lead.system_size_kw == null ? null : Number(lead.system_size_kw),
        }) satisfies SurveyLeadOption,
    );
}

export default async function AdminLeadSurveyPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const leads = await loadLeads();
  const params = (await searchParams) ?? {};
  const initialLeadId = typeof params.lead_id === "string" ? params.lead_id : "";

  const sơBoLeads = leads.filter((lead) => String(lead.status ?? "") !== "survey_done" && String(lead.status ?? "") !== "technical_survey_done");
  const kyThuatLeads = leads.filter((lead) => String(lead.status ?? "") === "survey_done") as TechnicalSurveyLeadOption[];

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <SectionTitle
          eyebrow="CRM"
          title="Khảo sát theo lead đã có"
        />

        <ThemeCard className="mt-6 p-5">
          <div className="mt-5 flex flex-wrap gap-2">
            <ThemeLinkButton href="/admin/leads" tone="secondary">
              Quay về lead để tạo mới
            </ThemeLinkButton>
            <ThemeLinkButton href="/admin/leads/pipeline" tone="secondary">
              Xem pipeline CRM
            </ThemeLinkButton>
            <ThemeLinkButton href="/admin/leads/survey/technical" tone="secondary">
              Lịch sử khảo sát kỹ thuật
            </ThemeLinkButton>
            <CreateLeadModalTrigger
              trigger={<span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2.5 text-sm font-medium text-[color:var(--text)]">Tạo lead mới</span>}
              onSubmit={createSurveyLead}
            />
          </div>
        </ThemeCard>

        <div className="mt-6">
          <PublicSurveyForm leads={sơBoLeads} onCreateLead={createSurveyLead} onCompleteSurvey={completeSurveyLead} initialLeadId={initialLeadId} />
        </div>

        <div className="mt-8">
          <SectionTitle
            eyebrow="CRM"
            title="Khảo sát kỹ thuật"
          />
          <ThemeCard className="mt-4 p-5">
            <TechnicalSurveyForm leads={kyThuatLeads} initialLeadId={initialLeadId} />
          </ThemeCard>
        </div>
      </main>
    </AdminShell>
  );
}
