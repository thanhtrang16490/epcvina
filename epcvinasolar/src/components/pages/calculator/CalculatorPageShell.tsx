import type { ReactNode } from 'react';

interface Props {
  title: string;
  eyebrow?: string;
  description?: string;
  showHeader?: boolean;
  children: ReactNode;
}

export default function CalculatorPageShell({
  title,
  eyebrow,
  description,
  showHeader = true,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#FBF3E8] px-0 py-0 text-[#201A12]">
      <div className="mx-auto min-h-screen w-full max-w-md overflow-x-hidden px-0">
        <div
          className="mx-0 min-h-screen rounded-none px-5 py-5"
          style={{
            '--bg-page': '#FBF3E8',
            '--bg-card': '#FFFDF8',
            '--ink': '#201A12',
            '--ink-soft': '#433827',
            '--muted': '#756B5D',
            '--border': '#EADFCC',
            '--border-strong': '#E5D8C2',
            '--primary': '#F59E0B',
            '--primary-bright': '#FBBF24',
            '--primary-ink': '#7C4A03',
            '--primary-soft': '#FFF2D6',
            '--danger': '#EF4444',
            '--navy': '#111827',
            '--navy-2': '#0F172A',
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
