"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

type Lead = {
  id: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  source_form?: string | null;
  priority?: string | null;
  status: string;
  follow_up_at?: string | null;
  created_at: string;
  metadata?: Record<string, unknown> | null;
};

type Column = {
  key: string;
  label: string;
  className: string;
  items: Lead[];
};

type Props = {
  columns: Column[];
  statusLabels: Record<string, string>;
};

const quickActivities = [
  { type: "call", label: "Call", note: "Đã gọi chăm sóc lead." },
  { type: "email", label: "Email", note: "Đã gửi email chăm sóc / báo giá." },
  { type: "meeting", label: "Meeting", note: "Đã hẹn gặp trao đổi chi tiết." },
] as const;

export function LeadsKanbanBoard({ columns, statusLabels }: Props) {
  const [boardColumns, setBoardColumns] = useState(columns);
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);
  const [activeNoteLeadId, setActiveNoteLeadId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [ownerDraft, setOwnerDraft] = useState("");
  const [quickActivityType, setQuickActivityType] = useState<(typeof quickActivities)[number]["type"]>("call");
  const [isPending, startTransition] = useTransition();

  const updateLeadInBoard = (leadId: string, nextStatus: string) => {
    setBoardColumns((current) => {
      let movedLead: Lead | null = null;
      const withoutLead = current.map((column) => {
        const items = column.items.filter((item) => {
          if (item.id === leadId) {
            movedLead = { ...item, status: nextStatus };
            return false;
          }
          return true;
        });
        return { ...column, items };
      });
      if (!movedLead) return current;
      return withoutLead.map((column) =>
        column.key === nextStatus ? { ...column, items: [movedLead as Lead, ...column.items] } : column,
      );
    });
  };

  const mutate = async (endpoint: string, payload: Record<string, unknown>) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (!response.ok || !data.success) throw new Error(data.message || "Không thể cập nhật.");
  };

  const onDropLead = (leadId: string, status: string) => {
    const nextLead = boardColumns.flatMap((column) => column.items).find((item) => item.id === leadId);
    if (!nextLead || nextLead.status === status) return;
    setPendingLeadId(leadId);
    startTransition(() => {
      mutate(`/api/leads/${leadId}/stage`, { status })
        .then(() => updateLeadInBoard(leadId, status))
        .finally(() => setPendingLeadId(null));
    });
  };

  const submitQuickActivity = (leadId: string, activityType: string, ownerName: string, note: string) => {
    setPendingLeadId(leadId);
    startTransition(() => {
      mutate(`/api/leads/${leadId}/activity`, { activity_type: activityType, owner_name: ownerName, note })
        .finally(() => {
          setPendingLeadId(null);
          setActiveNoteLeadId(null);
          setNoteDraft("");
          setOwnerDraft("");
        });
    });
  };

  return (
    <div className="mt-5 grid gap-4 overflow-x-auto pb-2 [grid-auto-flow:column] [grid-auto-columns:minmax(280px,1fr)]">
      {boardColumns.map((column) => (
        <div
          key={column.key}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const leadId = event.dataTransfer.getData("text/plain");
            if (leadId) onDropLead(leadId, column.key);
          }}
          className="min-h-[340px] w-[320px] shrink-0"
        >
          <div className={`h-full rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-4 ${draggingLeadId ? "ring-1 ring-[color:var(--accent)]/30" : ""}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[color:var(--text)]">{column.label}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{column.items.length} lead</div>
              </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${column.className}`}>{statusLabels[column.key] || column.key}</span>
            </div>

            <div className="mt-4 space-y-3">
              {column.items.length ? column.items.map((lead) => {
                const isDragging = draggingLeadId === lead.id;
                return (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", lead.id);
                      event.dataTransfer.effectAllowed = "move";
                      setDraggingLeadId(lead.id);
                    }}
                    onDragEnd={() => setDraggingLeadId(null)}
                    onDragOver={(event) => event.preventDefault()}
                    className={`rounded-2xl border bg-[color:var(--bg-elevated)] p-4 transition hover:border-[color:var(--accent)]/30 hover:shadow-lg ${isDragging ? "border-[color:var(--accent)]/50 opacity-80" : "border-[color:var(--border)]"}`}
                  >
                    <Link href={`/admin/leads/${lead.id}`} className="block">
                      <div className="font-semibold text-[color:var(--text)]">{lead.name || lead.phone || "Chưa có tên"}</div>
                      <div className="mt-1 text-sm text-[color:var(--muted)]">{lead.phone || "Chưa có số"}{lead.email ? ` · ${lead.email}` : ""}</div>
                    </Link>

                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-[color:var(--muted)]">{lead.priority || "normal"}</span>
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-[color:var(--muted)]">{lead.source_form || "website"}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {quickActivities.map((activity) => (
                        <button
                          key={activity.type}
                          type="button"
                          disabled={isPending && pendingLeadId === lead.id}
                          onClick={() => {
                            setActiveNoteLeadId(lead.id);
                            setQuickActivityType(activity.type);
                            setNoteDraft(activity.note);
                          }}
                          className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--text)] transition hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)] disabled:opacity-60"
                        >
                          + {activity.label}
                        </button>
                      ))}
                    </div>

                    <form
                      className="mt-3 grid gap-2"
                      onSubmit={(event) => {
                        event.preventDefault();
                        submitQuickActivity(lead.id, quickActivityType, ownerDraft, noteDraft);
                      }}
                    >
                      <input
                        value={ownerDraft}
                        onChange={(event) => setOwnerDraft(event.target.value)}
                        placeholder="Owner"
                        className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-sm text-[color:var(--text)]"
                      />
                      <textarea
                        value={activeNoteLeadId === lead.id ? noteDraft : ""}
                        onChange={(event) => {
                          setActiveNoteLeadId(lead.id);
                          setNoteDraft(event.target.value);
                        }}
                        placeholder="Ghi chú ngắn..."
                        rows={2}
                        className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-sm text-[color:var(--text)]"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="submit"
                          className="rounded-full bg-cyan-400 px-3 py-1.5 text-[11px] font-semibold text-slate-950"
                        >
                          Lưu activity
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNoteLeadId(null);
                            setNoteDraft("");
                            setOwnerDraft("");
                          }}
                          className="rounded-full border border-[color:var(--border)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--text)]"
                        >
                          Xóa
                        </button>
                      </div>
                    </form>

                    <div
                      aria-hidden="true"
                      className="mt-2 rounded-xl border border-dashed border-[color:var(--border)] px-3 py-2 text-center text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]"
                    >
                      Kéo sang stage khác
                    </div>
                  </div>
                );
              }) : (
                <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5 text-sm text-[color:var(--muted)]">
                  Chưa có lead ở giai đoạn này.
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
