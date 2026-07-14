import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article";
  tone?: "default" | "subtle" | "hero";
  children: ReactNode;
};

const base = "theme-card rounded-[2rem] border shadow-[var(--surface-shadow)]";

const tones = {
  default: "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)]",
  subtle: "border-[color:var(--border)]/80 bg-[color:var(--bg-elevated)] text-[color:var(--text)]",
  hero:
    "theme-card-hero border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(8,18,33,0.97),rgba(10,26,45,0.84))] text-white shadow-2xl shadow-cyan-950/20",
};

export function ThemeCard({ as: Tag = "div", tone = "default", className = "", children, ...props }: Props) {
  return (
    <Tag className={`${base} ${tones[tone]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
