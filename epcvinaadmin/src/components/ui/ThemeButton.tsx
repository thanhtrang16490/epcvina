import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import type { LinkProps } from "next/link";

type CommonProps = {
  children: ReactNode;
  tone?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
};

const base = "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40";

const tones = {
  primary: "border-transparent bg-[color:var(--accent)] text-white hover:brightness-110",
  secondary: "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)] hover:bg-white/10",
  ghost: "border-[color:var(--border)] bg-transparent text-[color:var(--text)] hover:bg-white/10",
  danger: "border-transparent bg-[color:var(--danger)] text-white hover:brightness-110",
};

export function ThemeButton({ tone = "secondary", className = "", children, ...props }: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`${base} ${tones[tone]} ${className}`}>
      {children}
    </button>
  );
}

export function ThemeLinkButton({ tone = "secondary", className = "", children, ...props }: CommonProps & LinkProps<string> & { className?: string }) {
  return (
    <Link {...props} className={`${base} ${tones[tone]} ${className}`}>
      {children}
    </Link>
  );
}
