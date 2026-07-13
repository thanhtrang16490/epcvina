type Props = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function SectionTitle({ eyebrow, title, description, className = "" }: Props) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <div className="text-sm uppercase tracking-[0.28em] text-[color:var(--accent)]">{eyebrow}</div>
      <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text)] md:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)] md:text-base">{description}</p>
    </div>
  );
}
