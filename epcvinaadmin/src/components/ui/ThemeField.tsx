import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const base =
  "w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 text-[color:var(--text)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]/50 focus:ring-2 focus:ring-[color:var(--accent)]/10";

type FieldProps = {
  className?: string;
};

export function ThemeInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & FieldProps) {
  return <input {...props} className={`${base} ${className}`} />;
}

export function ThemeSelect({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement> & FieldProps) {
  return <select {...props} className={`${base} ${className}`} />;
}

export function ThemeTextarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps) {
  return <textarea {...props} className={`${base} ${className}`} />;
}
