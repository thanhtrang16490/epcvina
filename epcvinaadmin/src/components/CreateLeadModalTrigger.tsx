"use client";

import { LeadCreateModal } from "@/components/LeadCreateModal";

type Props = {
  trigger: React.ReactNode;
  onSubmit: (formData: FormData) => void | Promise<void>;
};

export function CreateLeadModalTrigger({ trigger, onSubmit }: Props) {
  return (
    <LeadCreateModal trigger={trigger} title="Tạo lead thủ công" description="Nhập nhanh lead chưa có trong CRM và quay lại khảo sát ngay." onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm text-[color:var(--muted)]">Tên khách hàng</label>
          <input name="name" placeholder="Tên khách hàng" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-[color:var(--muted)]">Số điện thoại</label>
          <input name="phone" placeholder="Số điện thoại" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-[color:var(--muted)]">Email</label>
          <input name="email" placeholder="Email" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-[color:var(--muted)]">Owner</label>
          <input name="owner_name" placeholder="Owner" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">
          Tạo lead
        </button>
      </div>
    </LeadCreateModal>
  );
}
