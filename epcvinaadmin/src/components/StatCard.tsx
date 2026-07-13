type Props = {
  label: string;
  value: string;
  hint: string;
};

export function StatCard({ label, value, hint }: Props) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-[var(--surface-shadow)] backdrop-blur">
      <div className="text-sm uppercase tracking-[0.24em] text-[color:var(--muted)]">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-[color:var(--text)]">{value}</div>
      <div className="mt-2 text-sm text-[color:var(--muted)]">{hint}</div>
    </div>
  );
}
