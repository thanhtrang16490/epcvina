"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { slugify } from "@/lib/slug";

type FormState = {
  ok: boolean;
  error: string | null;
  projectId?: string | null;
};

const initialState: FormState = { ok: false, error: null, projectId: null };

type CustomerOption = {
  id: string;
  name: string;
};

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  customers: CustomerOption[];
  initialValues?: {
    name?: string;
    customer_id?: string;
    code?: string;
    address?: string;
    sort_order?: number;
    note?: string;
    status?: "active" | "inactive";
  };
  submitLabel: string;
};

export function ProjectCreateForm({ action, customers, initialValues, submitLabel }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [customerId, setCustomerId] = useState(initialValues?.customer_id ?? "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [customerError, setCustomerError] = useState<string | null>(null);

  const slug = useMemo(() => slugify(name), [name]);

  useEffect(() => {
    if (!state.ok) return;
    router.push(state.projectId ? `/projects/${state.projectId}` : "/projects");
    router.refresh();
  }, [router, state.ok, state.projectId]);

  return (
    <form
      action={formAction}
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
      onSubmit={(event) => {
        const nextNameError = name.trim() ? null : "Vui lòng nhập tên dự án.";
        const nextCustomerError = customerId.trim() ? null : "Vui lòng chọn khách hàng.";
        setNameError(nextNameError);
        setCustomerError(nextCustomerError);
        if (nextNameError || nextCustomerError) {
          event.preventDefault();
        }
      }}
    >
      {state.error ? (
        <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Tên dự án</span>
          <input
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Tên dự án"
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]"
          />
          {nameError ? <span className="text-xs text-rose-200">{nameError}</span> : null}
        </label>
        <input type="hidden" name="slug" value={slug} readOnly />
        <input
          name="code"
          defaultValue={initialValues?.code ?? ""}
          placeholder="Mã dự án"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
        />
        <label className="grid gap-2 md:col-span-2">
          <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Khách hàng</span>
          <select
            name="customer_id"
            value={customerId}
            onChange={(event) => {
              setCustomerId(event.target.value);
              if (customerError) setCustomerError(null);
            }}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
          >
            <option value="">Chọn khách hàng</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          {customerError ? <span className="text-xs text-rose-200">{customerError}</span> : null}
        </label>
        <input
          name="address"
          defaultValue={initialValues?.address ?? ""}
          placeholder="Địa chỉ công trình"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2"
        />
        <select name="status" defaultValue={initialValues?.status ?? "inactive"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          name="sort_order"
          type="number"
          min={0}
          defaultValue={initialValues?.sort_order ?? 0}
          placeholder="Sort order"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
        />
        <textarea
          name="note"
          rows={4}
          defaultValue={initialValues?.note ?? ""}
          placeholder="Ghi chú"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2"
        />
      </div>

      <button type="submit" disabled={pending} className="mt-6 rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 disabled:opacity-60">
        {pending ? "Đang lưu..." : submitLabel}
      </button>
    </form>
  );
}
