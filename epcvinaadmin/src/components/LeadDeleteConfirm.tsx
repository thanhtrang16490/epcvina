"use client";

import { useState, type ReactNode } from "react";

type Props = {
  leadLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  confirmLabel?: string;
  extraNote?: ReactNode;
};

export function LeadDeleteConfirm({ leadLabel, action, confirmLabel = "XOA", extraNote }: Props) {
  const [value, setValue] = useState("");
  const canConfirm = value.trim().toUpperCase() === confirmLabel;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="confirm" value={value} />
      <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
        Lead <span className="font-semibold">{leadLabel}</span> sẽ bị xoá vĩnh viễn khỏi CRM. Hành động này không thể hoàn tác.
      </div>
      {extraNote}
      <label className="grid gap-2 text-sm text-[color:var(--muted)]">
        Nhập <span className="font-semibold text-[color:var(--text)]">{confirmLabel}</span> để xác nhận
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder={confirmLabel}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none"
        />
      </label>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!canConfirm}
          className="rounded-full bg-rose-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Xoá lead
        </button>
      </div>
    </form>
  );
}
