"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition, type FormEvent, type ReactNode } from "react";

export type TechnicalSurveyLeadOption = {
  id: string;
  name: string | null;
  phone: string | null;
  status?: string | null;
};

type TechnicalFormState = {
  houseDirection: string;
  houseDirectionOther: string;
  roofDirection: string;
  roofDirectionOther: string;
  roofSlope: string;
  shadowObstacles: string;
  installationAreas: string;
  stringCount: string;
  structureType: string;
  roofMaterial: string;
  roofCondition: string;
  buildingHeight: string;
  accessNotes: string;
  inverterLocation: string;
  distributionBoardLocation: string;
  mainSwitchboardLocation: string;
  mainBreakerRating: string;
  meterLocation: string;
  wifiSignal: string;
  safetyAccessNotes: string;
  cableRoute: string;
  distanceToGridPoint: string;
  dcCableLength: string;
  acCableLength: string;
  needFrame: string;
  frameNotes: string;
  youtubeVideoUrl: string;
  notes: string;
};

const initialState: TechnicalFormState = {
  houseDirection: "",
  houseDirectionOther: "",
  roofDirection: "",
  roofDirectionOther: "",
  roofSlope: "",
  shadowObstacles: "",
  installationAreas: "",
  stringCount: "",
  structureType: "",
  roofMaterial: "",
  roofCondition: "",
  buildingHeight: "",
  accessNotes: "",
  inverterLocation: "",
  distributionBoardLocation: "",
  mainSwitchboardLocation: "",
  mainBreakerRating: "",
  meterLocation: "",
  wifiSignal: "",
  safetyAccessNotes: "",
  cableRoute: "",
  distanceToGridPoint: "",
  dcCableLength: "",
  acCableLength: "",
  needFrame: "no",
  frameNotes: "",
  youtubeVideoUrl: "",
  notes: "",
};

function labelLead(lead: TechnicalSurveyLeadOption) {
  const name = lead.name?.trim();
  const phone = lead.phone?.trim();
  if (name && phone) return `${name} - ${phone}`;
  return name || phone || lead.id;
}

export function TechnicalSurveyForm({
  leads,
  initialLeadId = "",
}: {
  leads: TechnicalSurveyLeadOption[];
  initialLeadId?: string;
}) {
  const [form, setForm] = useState<TechnicalFormState>(initialState);
  const [selectedLeadId, setSelectedLeadId] = useState(initialLeadId);
  const [siteFiles, setSiteFiles] = useState<File[]>([]);
  const [sketchFiles, setSketchFiles] = useState<File[]>([]);
  const [houseDirectionFiles, setHouseDirectionFiles] = useState<File[]>([]);
  const [roofDirectionFiles, setRoofDirectionFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const selectedLead = useMemo(() => leads.find((lead) => lead.id === selectedLeadId) ?? null, [leads, selectedLeadId]);
  const leadInfo = useMemo(
    () => ({
      name: selectedLead?.name?.trim() || "Chưa có",
      phone: selectedLead?.phone?.trim() || "Chưa có",
      status: selectedLead?.status || "Chưa có",
    }),
    [selectedLead],
  );

  useEffect(() => {
    setSelectedLeadId(initialLeadId);
  }, [initialLeadId]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage(null);
    startTransition(async () => {
      try {
        if (!selectedLeadId) throw new Error("Vui lòng chọn lead đã khảo sát sơ bộ.");
        const payload = new FormData();
        payload.set("lead_id", selectedLeadId);
        payload.set("house_direction", form.houseDirection === "Khác" ? form.houseDirectionOther : form.houseDirection);
        payload.set("roof_direction", form.roofDirection === "Khác" ? form.roofDirectionOther : form.roofDirection);
        payload.set("house_direction_label", form.houseDirection);
        payload.set("roof_direction_label", form.roofDirection);
        payload.set("roof_slope", form.roofSlope);
        payload.set("shadow_obstacles", form.shadowObstacles);
        payload.set("installation_areas", form.installationAreas);
        payload.set("string_count", form.stringCount);
        payload.set("structure_type", form.structureType);
        payload.set("roof_material", form.roofMaterial);
        payload.set("roof_condition", form.roofCondition);
        payload.set("building_height", form.buildingHeight);
        payload.set("access_notes", form.accessNotes);
        payload.set("inverter_location", form.inverterLocation);
        payload.set("distribution_board_location", form.distributionBoardLocation);
        payload.set("main_switchboard_location", form.mainSwitchboardLocation);
        payload.set("main_breaker_rating", form.mainBreakerRating);
        payload.set("meter_location", form.meterLocation);
        payload.set("wifi_signal", form.wifiSignal);
        payload.set("safety_access_notes", form.safetyAccessNotes);
        payload.set("cable_route", form.cableRoute);
        payload.set("distance_to_grid_point", form.distanceToGridPoint);
        payload.set("dc_cable_length", form.dcCableLength);
        payload.set("ac_cable_length", form.acCableLength);
        payload.set("need_frame", form.needFrame === "yes" ? "1" : "0");
        payload.set("frame_notes", form.frameNotes);
        payload.set("youtube_video_url", form.youtubeVideoUrl);
        payload.set("notes", form.notes);
        for (const file of siteFiles) payload.append("site_image_files", file);
        for (const file of sketchFiles) payload.append("sketch_image_files", file);
        for (const file of houseDirectionFiles) payload.append("house_direction_image_files", file);
        for (const file of roofDirectionFiles) payload.append("roof_direction_image_files", file);
        const response = await fetch("/api/admin/leads/survey/technical", {
          method: "POST",
          body: payload,
        });
        const result = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
        if (!response.ok || !result?.success) {
          throw new Error(result?.message || "Không thể lưu khảo sát kỹ thuật.");
        }
        setStatus("success");
        setMessage("Đã lưu khảo sát kỹ thuật và cập nhật lead.");
        setForm(initialState);
        setSelectedLeadId("");
        setSiteFiles([]);
        setSketchFiles([]);
        setHouseDirectionFiles([]);
        setRoofDirectionFiles([]);
        router.refresh();
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Không thể lưu khảo sát kỹ thuật.");
      }
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-5 md:p-6">
      <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Khảo sát kỹ thuật</div>
      <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
        <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Lead đang khảo sát</div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[color:var(--text)]">
          <span className="font-medium">{selectedLead ? labelLead(selectedLead) : "Chưa chọn lead"}</span>
          {selectedLead ? <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-700">Từ khảo sát sơ bộ</span> : null}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <LeadReadOnlyField label="Tên khách" value={leadInfo.name} />
          <LeadReadOnlyField label="Số điện thoại" value={leadInfo.phone} />
          <LeadReadOnlyField label="Trạng thái lead" value={leadInfo.status} />
        </div>
      </div>

      <SectionBanner title="Kết cấu mái" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Hướng nhà">
          <input value={form.houseDirection} onChange={(event) => setForm((current) => ({ ...current, houseDirection: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Ảnh la bàn hướng nhà">
          <input
            type="file"
            multiple
            accept="image/*"
            capture="environment"
            onChange={(event) => setHouseDirectionFiles(Array.from(event.target.files ?? []))}
            className="survey-input"
          />
          {houseDirectionFiles.length ? <FilePreview files={houseDirectionFiles} /> : null}
        </Field>
        <Field label="Hướng mái">
          <input value={form.roofDirection} onChange={(event) => setForm((current) => ({ ...current, roofDirection: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Ảnh la bàn hướng mái">
          <input
            type="file"
            multiple
            accept="image/*"
            capture="environment"
            onChange={(event) => setRoofDirectionFiles(Array.from(event.target.files ?? []))}
            className="survey-input"
          />
          {roofDirectionFiles.length ? <FilePreview files={roofDirectionFiles} /> : null}
        </Field>
        <Field label="Độ nghiêng mái">
          <input value={form.roofSlope} onChange={(event) => setForm((current) => ({ ...current, roofSlope: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Bóng che">
          <textarea value={form.shadowObstacles} onChange={(event) => setForm((current) => ({ ...current, shadowObstacles: event.target.value }))} className="survey-input min-h-24" placeholder="Chưa có" />
        </Field>
        <Field label="Số khu vực lắp đặt">
          <input value={form.installationAreas} onChange={(event) => setForm((current) => ({ ...current, installationAreas: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Số string cần lắp">
          <input value={form.stringCount} onChange={(event) => setForm((current) => ({ ...current, stringCount: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Vật liệu mái">
          <input value={form.roofMaterial} onChange={(event) => setForm((current) => ({ ...current, roofMaterial: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Tình trạng mái">
          <input value={form.roofCondition} onChange={(event) => setForm((current) => ({ ...current, roofCondition: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Độ cao công trình">
          <input value={form.buildingHeight} onChange={(event) => setForm((current) => ({ ...current, buildingHeight: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Lối tiếp cận thi công">
          <input value={form.accessNotes} onChange={(event) => setForm((current) => ({ ...current, accessNotes: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
      </div>

      <SectionBanner title="Hệ thống điện hiện hữu" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Kiểu kết cấu">
          <input value={form.structureType} onChange={(event) => setForm((current) => ({ ...current, structureType: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Vị trí inverter">
          <input value={form.inverterLocation} onChange={(event) => setForm((current) => ({ ...current, inverterLocation: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Vị trí tủ điện">
          <input value={form.distributionBoardLocation} onChange={(event) => setForm((current) => ({ ...current, distributionBoardLocation: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Vị trí main switchboard">
          <input value={form.mainSwitchboardLocation} onChange={(event) => setForm((current) => ({ ...current, mainSwitchboardLocation: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Dòng CB chính">
          <input value={form.mainBreakerRating} onChange={(event) => setForm((current) => ({ ...current, mainBreakerRating: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Vị trí công tơ">
          <input value={form.meterLocation} onChange={(event) => setForm((current) => ({ ...current, meterLocation: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Tín hiệu Wi-Fi / 4G">
          <input value={form.wifiSignal} onChange={(event) => setForm((current) => ({ ...current, wifiSignal: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Đường đi cáp">
          <input value={form.cableRoute} onChange={(event) => setForm((current) => ({ ...current, cableRoute: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Khoảng cách đến điểm đấu nối">
          <input value={form.distanceToGridPoint} onChange={(event) => setForm((current) => ({ ...current, distanceToGridPoint: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Độ dài dây DC">
          <input value={form.dcCableLength} onChange={(event) => setForm((current) => ({ ...current, dcCableLength: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Độ dài dây AC">
          <input value={form.acCableLength} onChange={(event) => setForm((current) => ({ ...current, acCableLength: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Có cần làm khung không">
          <select value={form.needFrame} onChange={(event) => setForm((current) => ({ ...current, needFrame: event.target.value }))} className="survey-input">
            <option value="no">Không</option>
            <option value="yes">Có</option>
          </select>
        </Field>
        <Field label="Thông tin khác cho khung">
          <input value={form.frameNotes} onChange={(event) => setForm((current) => ({ ...current, frameNotes: event.target.value }))} className="survey-input" placeholder="Chưa có" />
        </Field>
        <Field label="Ghi chú an toàn thi công">
          <textarea value={form.safetyAccessNotes} onChange={(event) => setForm((current) => ({ ...current, safetyAccessNotes: event.target.value }))} className="survey-input min-h-24" placeholder="Chưa có" />
        </Field>
      </div>

      <Field label="Ảnh hiện trường">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(event) => setSiteFiles(Array.from(event.target.files ?? []))}
          className="survey-input"
        />
        {siteFiles.length ? <FilePreview files={siteFiles} /> : null}
      </Field>

      <Field label="Ảnh bản vẽ tay sơ bộ">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(event) => setSketchFiles(Array.from(event.target.files ?? []))}
          className="survey-input"
        />
        {sketchFiles.length ? <FilePreview files={sketchFiles} /> : null}
      </Field>

      <Field label="Video flycam YouTube">
        <input
          value={form.youtubeVideoUrl}
          onChange={(event) => setForm((current) => ({ ...current, youtubeVideoUrl: event.target.value }))}
          className="survey-input"
          placeholder="Chưa có"
        />
      </Field>

      <Field label="Ghi chú">
        <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} className="survey-input min-h-24" placeholder="Chưa có" />
      </Field>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-[color:var(--muted)]">{selectedLead ? `Đang khảo sát: ${labelLead(selectedLead)}` : "Chọn lead đã khảo sát sơ bộ để tiếp tục."}</div>
        <button disabled={status === "sending" || pending} className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          Lưu khảo sát kỹ thuật
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[color:var(--text)]">{label}</span>
      {children}
    </label>
  );
}

function FilePreview({ files }: { files: File[] }) {
  return (
    <div className="grid gap-2 rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3">
      <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">{files.length} tệp đã chọn</div>
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div key={`${file.name}-${index}`} className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1 text-xs text-[color:var(--text)]">
            {file.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionBanner({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
      <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{title}</div>
    </div>
  );
}

function LeadReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">{label}</div>
      <div className="mt-1 text-sm text-[color:var(--text)]">{value}</div>
    </div>
  );
}
