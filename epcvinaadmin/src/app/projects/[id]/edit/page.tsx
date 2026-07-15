import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/AdminShell";
import { ProjectCreateForm } from "@/components/ProjectCreateForm";
import { SectionTitle } from "@/components/SectionTitle";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { upsertProjectWithDependencies } from "@/lib/project-form-actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

type FormState = {
  ok: boolean;
  error: string | null;
  projectId?: string | null;
};

async function updateProject(_: FormState, formData: FormData): Promise<FormState> {
  "use server";
  const projectId = String(formData.get("id") ?? "");
  const nextId = await upsertProjectWithDependencies(formData, projectId);
  if (!nextId) {
    return { ok: false, error: "Không cập nhật được dự án. Kiểm tra lại dữ liệu và thử lại.", projectId: null };
  }
  revalidatePath("/projects");
  revalidatePath("/customers");
  revalidatePath("/orders");
  return { ok: true, error: null, projectId: nextId };
}

export default async function ProjectEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  if (!supabase) notFound();

  const projectRes = await supabase.from("projects").select("id, slug, customer_id, name, code, address, capacity, system_type, completion_date, image_url, gallery_urls, description, source_url, status, note, sort_order, is_active, created_at").eq("id", id).single();
  const project = projectRes.data;
  if (!project) notFound();

  const customerRes = project.customer_id ? await supabase.from("customers").select("id, name").eq("id", project.customer_id).maybeSingle() : { data: null };

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="CRM" title={`Sửa dự án: ${project.name}`} description="Sửa dự án, khách hàng và thông tin cơ bản." />
          <Link href="/projects" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Back
          </Link>
        </div>

        <ProjectCreateForm
          action={updateProject}
          submitLabel="Lưu dự án"
          customerLabel={customerRes.data ? String(customerRes.data.name ?? "") : ""}
          initialValues={{
            name: String(project.name ?? ""),
            customer_id: String(project.customer_id ?? ""),
            code: String(project.code ?? ""),
            address: String(project.address ?? ""),
            sort_order: Number(project.sort_order ?? 0),
            note: String(project.note ?? ""),
            status: String(project.status ?? "inactive") === "active" ? "active" : "inactive",
          }}
        />
      </main>
    </AdminShell>
  );
}
