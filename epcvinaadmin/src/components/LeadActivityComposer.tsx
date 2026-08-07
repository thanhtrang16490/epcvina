"use client";

import { useMemo, useState } from "react";

type ActivityType = "note" | "call" | "email" | "meeting" | "survey" | "quote" | "handover";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  leadId: string;
  ownerName: string;
  status: string;
  priority: string;
  followUpAt: string;
  lostReason: string;
  internalNote: string;
};

const activityTypeLabels: Record<ActivityType, string> = {
  note: "Ghi chú",
  call: "Cuộc gọi",
  email: "Email",
  meeting: "Hẹn gặp",
  survey: "Khảo sát",
  quote: "Báo giá",
  handover: "Bàn giao",
};

const quickNotes: Record<Exclude<ActivityType, "note">, string> = {
  call: "Đã gọi và cập nhật tình trạng lead.",
  email: "Đã gửi email chăm sóc / báo giá.",
  meeting: "Đã hẹn gặp để trao đổi chi tiết.",
  survey: "Đã lên lịch khảo sát thực tế.",
  quote: "Đã gửi báo giá cho khách.",
  handover: "Đã bàn giao sang bước tiếp theo.",
};

export function LeadActivityComposer({
  action,
  leadId,
  ownerName,
  status,
  priority,
  followUpAt,
  lostReason,
  internalNote,
}: Props) {
  const [activityType, setActivityType] = useState<ActivityType>("note");
  const [activityNote, setActivityNote] = useState("");
  const [currentOwnerName, setCurrentOwnerName] = useState(ownerName);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentPriority, setCurrentPriority] = useState(priority);
  const [currentFollowUpAt, setCurrentFollowUpAt] = useState(followUpAt);
  const [currentLostReason, setCurrentLostReason] = useState(lostReason);
  const [currentInternalNote, setCurrentInternalNote] = useState(internalNote);

  const draftPlaceholder = useMemo(() => quickNotes[activityType as Exclude<ActivityType, "note">] ?? "Ghi chú nhanh...", [activityType]);

  const applyQuickNote = (type: Exclude<ActivityType, "note">) => {
    setActivityType(type);
    setActivityNote((current) => current || quickNotes[type]);
  };

  return (
    <form action={action} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={leadId} />
      <input type="hidden" name="status" value={currentStatus} />
      <input type="hidden" name="priority" value={currentPriority} />
      <input type="hidden" name="follow_up_at" value={currentFollowUpAt} />
      <input type="hidden" name="lost_reason" value={currentLostReason} />
      <input type="hidden" name="internal_note" value={currentInternalNote} />
      <input type="hidden" name="owner_name" value={currentOwnerName} />
      <input type="hidden" name="activity_type" value={activityType} />

      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
        Chủ phụ trách
        <input
          value={currentOwnerName}
          onChange={(event) => setCurrentOwnerName(event.target.value)}
          placeholder="Tên nhân sự phụ trách"
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-[color:var(--muted)]">
          Trạng thái
          <select
            value={currentStatus}
            onChange={(event) => setCurrentStatus(event.target.value)}
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]"
          >
            <option value="new">Mới tiếp nhận</option>
            <option value="contacted">Đã liên hệ</option>
            <option value="qualified">Đủ điều kiện</option>
            <option value="survey_scheduled">Đặt lịch khảo sát</option>
            <option value="survey_done">Khảo sát xong</option>
            <option value="proposal_sent">Đã gửi giải pháp</option>
            <option value="negotiation">Đàm phán / chốt</option>
            <option value="won">Chốt thành công</option>
            <option value="lost">Thất bại</option>
            <option value="spam">Spam</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-[color:var(--muted)]">
          Ưu tiên
          <select
            value={currentPriority}
            onChange={(event) => setCurrentPriority(event.target.value)}
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]"
          >
            <option value="low">Thấp</option>
            <option value="normal">Bình thường</option>
            <option value="high">Cao</option>
            <option value="urgent">Khẩn cấp</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
        Nhắc liên hệ
        <input
          type="datetime-local"
          value={currentFollowUpAt}
          onChange={(event) => setCurrentFollowUpAt(event.target.value)}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {(["call", "email", "meeting"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => applyQuickNote(type)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activityType === type
                ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                : "border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--text)] hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)]"
            }`}
          >
            + {activityTypeLabels[type]}
          </button>
        ))}
      </div>

      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
        Loại hoạt động
        <select
          value={activityType}
          onChange={(event) => setActivityType(event.target.value as ActivityType)}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]"
        >
          {Object.entries(activityTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
        Hoạt động tiếp theo
        <textarea
          name="activity_note"
          rows={4}
          placeholder={draftPlaceholder}
          value={activityNote}
          onChange={(event) => setActivityNote(event.target.value)}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]"
        />
      </label>

      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
        Lý do thất bại
        <input
          value={currentLostReason}
          onChange={(event) => setCurrentLostReason(event.target.value)}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]"
        />
      </label>

      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
        Ghi chú nội bộ
        <textarea
          rows={6}
          value={currentInternalNote}
          onChange={(event) => setCurrentInternalNote(event.target.value)}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">
          Lưu cập nhật
        </button>
        <button
          type="button"
          onClick={() => {
            setActivityType("note");
            setActivityNote("");
          }}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-5 py-3 font-semibold text-[color:var(--text)]"
        >
          Xóa nháp
        </button>
      </div>
    </form>
  );
}
