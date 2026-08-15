"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { CreateLeadModalTrigger } from "@/components/CreateLeadModalTrigger";

export type SurveyLeadOption = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  source_form: string | null;
  created_at: string | null;
  status?: string | null;
  metadata?: Record<string, unknown> | null;
  system_type: string | null;
  roof_area: string | null;
  monthly_bill: string | null;
  system_size_kw: number | null;
};

type SurveyFormState = {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  projectAddress: string;
  projectType: string;
  roofType: string;
  monthlyBill: string;
  roofArea: string;
  systemSize: string;
  notes: string;
};

const initialState: SurveyFormState = {
  fullName: "",
  phone: "",
  email: "",
  company: "",
  projectAddress: "",
  projectType: "Nhà ở",
  roofType: "Mái tôn",
  monthlyBill: "",
  roofArea: "",
  systemSize: "",
  notes: "",
};

const projectTypeOptions = ["Nhà ở", "Nhà xưởng", "Doanh nghiệp", "Trang trại", "Công trình khác"];
const roofTypeOptions = ["Mái tôn", "Mái ngói", "Mái bê tông", "Mặt đất", "Chưa xác định"];
export function PublicSurveyForm({
  leads,
  onCreateLead,
  onCompleteSurvey,
  initialLeadId = "",
}: {
  leads: SurveyLeadOption[];
  onCreateLead: (formData: FormData) => void | Promise<void>;
  onCompleteSurvey: (formData: FormData) => void | Promise<void>;
  initialLeadId?: string;
}) {
  const [form, setForm] = useState<SurveyFormState>(initialState);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialLeadId);
  const [leadSearch, setLeadSearch] = useState("");
  const [isLeadPickerOpen, setIsLeadPickerOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mountedAt] = useState(() => Date.now());
  const elapsedMs = Date.now() - mountedAt;
  const selectedLead = useMemo(() => leads.find((lead) => lead.id === selectedLeadId) ?? null, [leads, selectedLeadId]);
  const selectedLeadStatus = String(selectedLead?.status ?? "");
  const selectedLeadStatusLabel = selectedLeadStatus === "survey_done" ? "Đã khảo sát" : "Chưa khảo sát";
  const filteredLeads = useMemo(() => {
    const query = leadSearch.trim().toLowerCase();
    const available = leads.filter((lead) => String(lead.status ?? "") !== "survey_done");
    if (!query) return available;
    return available.filter((lead) => [lead.name, lead.phone, lead.email].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [leadSearch, leads]);
  const getLeadLabel = (lead: SurveyLeadOption) => {
    const name = lead.name?.trim();
    const phone = lead.phone?.trim();
    if (name && phone) return `${name} - ${phone}`;
    return name || phone || lead.id;
  };
  const leadDefaults = useMemo(
    () => ({
      fullName: selectedLead?.name ?? "",
      phone: selectedLead?.phone ?? "",
      email: selectedLead?.email ?? "",
      projectAddress: selectedLead?.address ?? "",
      projectType:
        (typeof selectedLead?.metadata?.project_type === "string" && selectedLead.metadata.project_type) ||
        selectedLead?.system_type ||
        "",
      roofType: (typeof selectedLead?.metadata?.roof_type === "string" && selectedLead.metadata.roof_type) || "",
      monthlyBill: selectedLead?.monthly_bill ?? "",
      roofArea: selectedLead?.roof_area ?? "",
      systemSize: selectedLead?.system_size_kw != null ? `${selectedLead.system_size_kw}` : "",
    }),
    [selectedLead],
  );
  const hasLead = Boolean(selectedLead);
  const missing = {
    fullName: !leadDefaults.fullName,
    phone: !leadDefaults.phone,
    email: !leadDefaults.email,
    projectAddress: !leadDefaults.projectAddress,
    projectType: !leadDefaults.projectType,
    roofType: !leadDefaults.roofType,
    monthlyBill: !leadDefaults.monthlyBill,
    roofArea: !leadDefaults.roofArea,
    systemSize: !leadDefaults.systemSize,
  };

  useEffect(() => {
    if (!selectedLead) return;
    setForm((current) => ({
      ...current,
      fullName: selectedLead.name ?? current.fullName,
      phone: selectedLead.phone ?? current.phone,
      email: selectedLead.email ?? current.email,
      projectAddress: selectedLead.address ?? current.projectAddress,
      projectType:
        (typeof selectedLead.metadata?.project_type === "string" && selectedLead.metadata.project_type) ||
        (selectedLead.system_type ?? current.projectType),
      roofType:
        (typeof selectedLead.metadata?.roof_type === "string" && selectedLead.metadata.roof_type) ||
        current.roofType,
      monthlyBill: selectedLead.monthly_bill ?? current.monthlyBill,
      roofArea: selectedLead.roof_area ?? current.roofArea,
      systemSize:
        selectedLead.system_size_kw != null ? `${selectedLead.system_size_kw}` : current.systemSize,
    }));
  }, [selectedLead]);

  useEffect(() => {
    if (initialLeadId && initialLeadId !== selectedLeadId) {
      setSelectedLeadId(initialLeadId);
    }
  }, [initialLeadId, selectedLeadId]);

  useEffect(() => {
    if (!selectedLead) return;
    setLeadSearch(getLeadLabel(selectedLead));
    setIsLeadPickerOpen(false);
  }, [selectedLead]);

  const updateField = (key: keyof SurveyFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage(null);

    startTransition(async () => {
      try {
        if (!selectedLeadId) {
          throw new Error("Vui lòng chọn một lead chưa khảo sát.");
        }
        const surveyForm = new FormData();
        surveyForm.set("lead_id", selectedLeadId);
        surveyForm.set("fullName", (leadDefaults.fullName || form.fullName).trim());
        surveyForm.set("phone", (leadDefaults.phone || form.phone).trim());
        surveyForm.set("email", (leadDefaults.email || form.email).trim());
        surveyForm.set("company", form.company.trim());
        surveyForm.set("projectAddress", (leadDefaults.projectAddress || form.projectAddress).trim());
        surveyForm.set("projectType", leadDefaults.projectType || form.projectType);
        surveyForm.set("roofType", leadDefaults.roofType || form.roofType);
        surveyForm.set("monthlyBill", (leadDefaults.monthlyBill || form.monthlyBill).trim());
        surveyForm.set("roofArea", (leadDefaults.roofArea || form.roofArea).trim());
        surveyForm.set("systemSize", (leadDefaults.systemSize || form.systemSize).trim());
        surveyForm.set("notes", form.notes.trim());
        await onCompleteSurvey(surveyForm);

        setStatus("success");
        setMessage("Đã hoàn tất khảo sát và cập nhật trạng thái lead.");
        setForm(initialState);
        setSelectedLeadId("");
        setLeadSearch("");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Chưa thể gửi form.");
      }
    });
  };

  const disabled = status === "sending" || isPending;

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-[var(--surface-shadow)] md:p-6">
      {leads.length === 0 ? (
        <div className="rounded-[1.5rem] border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
          Chưa có lead nào để chọn. Bạn có thể quay về trang CRM để tạo lead trước khi khảo sát.
          <div className="mt-3">
            <Link href="/admin/leads" className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
              Quay về tạo lead
            </Link>
          </div>
        </div>
      ) : null}

      <Field label="Chọn lead đã có">
        <div className="relative">
          <input
            value={leadSearch}
            onChange={(event) => {
              const value = event.target.value;
              setLeadSearch(value);
              setIsLeadPickerOpen(true);
              if (!value.trim()) setSelectedLeadId("");
            }}
            onFocus={() => setIsLeadPickerOpen(true)}
            onBlur={() => {
              window.setTimeout(() => setIsLeadPickerOpen(false), 140);
            }}
            className="survey-input pr-28"
            placeholder="Tìm theo tên hoặc số điện thoại"
            role="combobox"
            aria-expanded={isLeadPickerOpen}
            aria-controls="lead-picker-list"
          />
          <button
            type="button"
            onClick={() => setIsLeadPickerOpen((current) => !current)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-xs font-semibold text-[color:var(--text)]"
          >
            Chọn
          </button>
          {isLeadPickerOpen ? (
            <div
              id="lead-picker-list"
              className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-2 shadow-[var(--surface-shadow)]"
            >
              {filteredLeads.length ? (
                filteredLeads.map((lead) => {
                  const active = lead.id === selectedLeadId;
                  return (
                    <button
                      key={lead.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setSelectedLeadId(lead.id);
                        setLeadSearch(getLeadLabel(lead));
                        setIsLeadPickerOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                        active
                          ? "bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                          : "text-[color:var(--text)] hover:bg-[color:var(--bg-elevated)]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span>{getLeadLabel(lead)}</span>
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-700">
                          Chưa khảo sát
                        </span>
                      </span>
                      {active ? <span className="text-xs uppercase tracking-[0.2em]">Đã chọn</span> : null}
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl px-4 py-3 text-sm text-[color:var(--muted)]">Không tìm thấy lead phù hợp.</div>
              )}
            </div>
          ) : null}
          <CreateLeadModalTrigger
            trigger={<span className="mt-2 inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2.5 text-sm font-semibold text-[color:var(--text)]">Tạo lead mới</span>}
            onSubmit={onCreateLead}
          />
        </div>
      </Field>

      {hasLead ? (
        <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Thông tin đã có</div>
            <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${
              selectedLeadStatus === "survey_done"
                ? "border-slate-400/20 bg-slate-400/10 text-slate-600"
                : "border-emerald-400/20 bg-emerald-400/10 text-emerald-700"
            }`}>
              {selectedLeadStatusLabel}
            </span>
          </div>
          <div className="mt-3 grid gap-2 text-sm text-[color:var(--text)] md:grid-cols-2">
            <InfoRow label="Tên" value={leadDefaults.fullName} />
            <InfoRow label="Điện thoại" value={leadDefaults.phone} />
            <InfoRow label="Email" value={leadDefaults.email} />
            <InfoRow label="Địa chỉ" value={leadDefaults.projectAddress} />
            <InfoRow label="Loại công trình" value={leadDefaults.projectType} />
            <InfoRow label="Loại mái" value={leadDefaults.roofType} />
            <InfoRow label="Hóa đơn/tháng" value={leadDefaults.monthlyBill} />
            <InfoRow label="Diện tích mái" value={leadDefaults.roofArea} />
            <InfoRow label="Công suất" value={leadDefaults.systemSize ? `${leadDefaults.systemSize} kWp` : ""} />
          </div>
        </div>
      ) : null}

      <section className="grid gap-3 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 md:p-5">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Khách hàng</div>
          <div className="mt-1 text-sm text-[color:var(--muted)]">Thông tin liên hệ và đại diện khách hàng.</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {missing.fullName ? (
            <Field label="Họ và tên" required>
              <input value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} required className="survey-input" placeholder="Nguyễn Văn A" />
            </Field>
          ) : null}
          {missing.phone ? (
            <Field label="Số điện thoại" required>
              <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} required className="survey-input" placeholder="09xx xxx xxx" />
            </Field>
          ) : null}
          {missing.email ? (
            <Field label="Email">
              <input value={form.email} onChange={(event) => updateField("email", event.target.value)} className="survey-input" placeholder="name@company.com" />
            </Field>
          ) : null}
          <Field label="Đơn vị / Công ty">
            <input value={form.company} onChange={(event) => updateField("company", event.target.value)} className="survey-input" placeholder="Tên doanh nghiệp" />
          </Field>
        </div>
      </section>

      <section className="grid gap-3 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 md:p-5">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Công trình</div>
          <div className="mt-1 text-sm text-[color:var(--muted)]">Những dữ liệu nền về địa điểm và loại mặt bằng.</div>
        </div>
        {missing.projectAddress ? (
          <Field label="Địa chỉ công trình" required>
            <input value={form.projectAddress} onChange={(event) => updateField("projectAddress", event.target.value)} required className="survey-input" placeholder="Số nhà, phường/xã, quận/huyện, tỉnh/thành" />
          </Field>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          {missing.projectType ? <SelectField label="Loại công trình" value={form.projectType} onChange={(value) => updateField("projectType", value)} options={projectTypeOptions} /> : null}
          {missing.roofType ? <SelectField label="Loại mái / mặt bằng" value={form.roofType} onChange={(value) => updateField("roofType", value)} options={roofTypeOptions} /> : null}
        </div>
      </section>

      <section className="grid gap-3 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 md:p-5">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Kỹ thuật</div>
          <div className="mt-1 text-sm text-[color:var(--muted)]">Các thông tin phục vụ thiết kế và đánh giá sơ bộ.</div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {missing.monthlyBill ? (
            <Field label="Hóa đơn điện trung bình / tháng">
              <input value={form.monthlyBill} onChange={(event) => updateField("monthlyBill", event.target.value)} className="survey-input" placeholder="10-30 triệu / tháng" />
            </Field>
          ) : null}
          {missing.roofArea ? (
            <Field label="Diện tích mái ước tính">
              <input value={form.roofArea} onChange={(event) => updateField("roofArea", event.target.value)} className="survey-input" placeholder="Ví dụ: 300 m2" />
            </Field>
          ) : null}
          {missing.systemSize ? (
            <Field label="Công suất dự kiến">
              <input value={form.systemSize} onChange={(event) => updateField("systemSize", event.target.value)} className="survey-input" placeholder="Ví dụ: 50 kWp" />
            </Field>
          ) : null}
        </div>
      </section>

      <Field label="Ghi chú thêm">
        <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} className="survey-input min-h-32 resize-y" placeholder="Bạn có thể ghi chú về bóng che, kết cấu mái, yêu cầu tiến độ, hay các vấn đề cần khảo sát trước..." />
      </Field>

      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-[color:var(--muted)]">
          Form này sẽ gửi về CRM public lead của EPCVINA.
        </div>
        <button disabled={disabled} className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
          {status === "sending" || isPending ? "Đang gửi..." : "Gửi yêu cầu khảo sát"}
        </button>
      </div>

      {message ? (
        <div className={`rounded-2xl px-4 py-3 text-sm ${status === "success" ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700" : "border border-red-500/20 bg-red-500/10 text-red-700"}`}>
          {message}
        </div>
      ) : null}
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[color:var(--text)]">
        {label} {required ? <span className="text-[color:var(--accent)]">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[color:var(--text)]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="survey-input">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">{label}</div>
      <div className="mt-1 font-medium text-[color:var(--text)]">{value || "Chưa có"}</div>
    </div>
  );
}
