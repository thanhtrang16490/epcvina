"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { slugify } from "@/lib/slug";

type FormState = {
  ok: boolean;
  error: string | null;
};

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const initialState: FormState = { ok: false, error: null };

export function CustomerCreateForm({ action }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
      window.location.href = "/customers";
    }
  }, [router, state.ok]);

  const slugValue = useMemo(() => slug || slugify(name), [name, slug]);

  async function checkSlug(nextSlug: string) {
    const value = nextSlug.trim();
    if (!value) {
      setSlugError(null);
      return;
    }
    const res = await fetch(`/api/customers/slug-exists?slug=${encodeURIComponent(value)}`);
    const data = await res.json().catch(() => null);
    if (data?.exists) {
      setSlugError("Slug đã tồn tại. Hãy đổi tên hoặc sửa slug.");
    } else {
      setSlugError(null);
    }
  }

  return (
    <form
      action={formAction}
      className="grid gap-3"
      onSubmit={(event) => {
        if (slugError) {
          event.preventDefault();
        }
      }}
    >
      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Tên khách hàng</span>
        <input
          name="name"
          value={name}
          onChange={(event) => {
            const next = event.target.value;
            setName(next);
            setSlug(slugify(next));
          }}
          onBlur={() => checkSlug(slugValue)}
          placeholder="Tên khách hàng"
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]"
        />
      </label>
      <input type="hidden" name="slug" value={slugValue} readOnly />
      <div className="text-[11px] text-[color:var(--muted)]">
        Slug: <span className="font-medium text-[color:var(--text)]">{slugValue || "-"}</span>
      </div>
      {slugError ? <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{slugError}</div> : null}
      {state.error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{state.error}</div> : null}
      <input name="phone" placeholder="Số điện thoại" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]" />
      <input name="email" placeholder="Email" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]" />
      <input name="tax_code" placeholder="Mã số thuế" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]" />
      <input name="address" placeholder="Địa chỉ" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]" />
      <textarea name="note" rows={4} placeholder="Ghi chú" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]" />
      <button type="submit" disabled={pending} className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 disabled:opacity-60">
        {pending ? "Đang lưu..." : "Tạo khách hàng"}
      </button>
    </form>
  );
}
