"use client";

import { useState } from "react";

import { slugify } from "@/lib/slug";

type Props = {
  name: string;
  slugName?: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  defaultSlug?: string;
  className?: string;
};

export function SlugField({
  name,
  slugName = "slug",
  label,
  placeholder,
  defaultValue = "",
  defaultSlug = "",
  className = "",
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [slug, setSlug] = useState(defaultSlug || slugify(defaultValue));

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{label}</label>
      <input
        name={name}
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);
          setSlug(slugify(next));
        }}
        placeholder={placeholder}
        className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]/50 focus:ring-2 focus:ring-[color:var(--accent)]/10"
      />
      <input type="hidden" name={slugName} value={slug} readOnly />
      <div className="text-[11px] text-[color:var(--muted)]">
        Slug: <span className="font-medium text-[color:var(--text)]">{slug || "-"}</span>
      </div>
    </div>
  );
}
