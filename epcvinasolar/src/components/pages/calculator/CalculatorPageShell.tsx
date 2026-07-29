import { type ReactNode } from 'react';

interface Props {
  title: string;
  eyebrow?: string;
  description?: string;
  showHeader?: boolean;
  stats?: Array<{ label: string; value: string }>;
  sidebar?: ReactNode;
  children: ReactNode;
}

export default function CalculatorPageShell({
  title,
  eyebrow,
  description,
  showHeader = true,
  stats,
  sidebar,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] px-0 py-0 text-[#414042] lg:bg-[radial-gradient(circle_at_12%_10%,rgba(245,130,32,.12),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(229,37,42,.08),transparent_28%),#F4F5F7]">
      <div className="mx-auto min-h-screen w-full max-w-md overflow-x-hidden px-0 lg:max-w-6xl lg:px-8">
        <div
          className="mx-0 min-h-screen rounded-none px-5 py-5 pt-4 md:pt-5 lg:px-0 lg:py-8"
          style={{
            '--bg-page': '#F4F5F7',
            '--bg-card': '#FFFFFF',
            '--ink': '#414042',
            '--ink-soft': '#52525B',
            '--muted': '#71717A',
            '--border': '#E5E7EB',
            '--border-strong': '#D4D4D8',
            '--primary': '#F58220',
            '--primary-bright': '#FFB020',
            '--primary-ink': '#9A3412',
            '--primary-soft': '#FFF3E6',
            '--danger': '#E5252A',
            '--navy': '#414042',
            '--navy-2': '#2F3035',
            '--success': '#15803D',
            '--success-bright': '#34D399',
            '--success-bg': '#ECFDF3',
            '--success-border': '#BBF7D0',
            '--success-ink': '#14532D',
            '--on-dark': '#FFFFFF',
            '--on-dark-muted': '#94A3B8',
            '--on-dark-soft': '#CBD5E1',
            '--on-dark-panel': 'rgba(255,255,255,0.08)',
            '--on-dark-line': 'rgba(255,255,255,0.13)',
            '--r-pill': '999px',
            '--r-sm': '999px',
            '--r-tile': '18px',
            '--r-btn': '14px',
            '--r-card': '24px',
            '--r-hero': '28px',
            '--sh-card': '0 12px 30px -22px rgba(67,56,39,.42)',
            '--sh-btn': '0 16px 32px -20px rgba(245,158,11,.8)',
            '--sh-hero': '0 26px 60px -34px rgba(17,24,39,.85)',
            fontFamily: '"Be Vietnam Pro", system-ui, sans-serif',
            '--font-display': '"Sora", "Be Vietnam Pro", system-ui, sans-serif',
            background: 'var(--bg-page)',
            color: 'var(--ink)',
          } as React.CSSProperties}
        >
          {showHeader ? (
            <div className="mb-3">
              <h1 className="text-[15px] font-semibold leading-tight" style={{ color: 'var(--ink)' }}>
                {title}
              </h1>
              {eyebrow ? (
                <p className="mt-0.5 text-[13px] leading-tight" style={{ color: 'var(--muted)' }}>
                  {eyebrow}
                </p>
              ) : null}
              {description ? (
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {description}
                </p>
              ) : null}
              {stats ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-[18px] border border-[var(--border)] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--muted)' }}>
                        {item.label}
                      </p>
                      <p className="mt-1 text-[18px] font-black" style={{ color: 'var(--ink)' }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {sidebar ? <div className="mt-4">{sidebar}</div> : null}
              {children}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
