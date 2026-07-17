type Props = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function SectionTitle({ eyebrow, title, description, className = "" }: Props) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <div className="text-[10px] uppercase tracking-[0.26em] text-[color:var(--accent)] md:text-sm md:tracking-[0.28em]">{eyebrow}</div>
      <h2 className="mt-2 text-[1.15rem] font-semibold leading-tight text-[color:var(--text)] md:mt-3 md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-[58ch] text-sm leading-5 text-[color:var(--muted)] md:mt-3 md:text-base md:leading-6">{description}</p>
    </div>
  );
}
