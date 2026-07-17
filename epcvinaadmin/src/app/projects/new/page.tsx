import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ProjectCreateForm } from "@/components/ProjectCreateForm";
import { upsertProjectWithDependencies } from "@/lib/project-form-actions";

export const dynamic = "force-dynamic";

type FormState = {
  ok: boolean;
  error: string | null;
  projectId?: string | null;
};

async function createProject(_: FormState, formData: FormData): Promise<FormState> {
  "use server";
  const projectId = await upsertProjectWithDependencies(formData);
  if (!projectId) {
    return { ok: false, error: "Không tạo được dự án. Kiểm tra dữ liệu và thử lại.", projectId: null };
  }
  return { ok: true, error: null, projectId };
}

export default async function ProjectNewPage() {
  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="CRM" title="Thêm dự án" description="Tạo dự án, khách hàng và đơn hàng từ cùng một form." />
          <Link href="/admin/projects" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Back
          </Link>
        </div>

        <ProjectCreateForm
          action={createProject}
          submitLabel="Tạo dự án"
        />
      </main>
    </AdminShell>
  );
}
