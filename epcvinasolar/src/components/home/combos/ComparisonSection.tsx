import {
  Lightning,
  Building,
  Clock,
  Sun,
  TrendUp,
  XCircle,
  CheckCircle,
} from '@phosphor-icons/react';
import { getLocaleFromPathname, messages } from '../../../i18n/messages';
import { getLocalizedRoute } from '../../../i18n/routes';

const ORANGE = '#ea580c';

export default function ComparisonSection({ pathname = '/' }: { pathname?: string }) {
  const locale = getLocaleFromPathname(pathname);
  const t = messages[locale]?.home ?? messages.vi.home;
  const hybridHref = getLocalizedRoute(locale, 'hybridBess');
  const solarHomeHref = getLocalizedRoute(locale, 'solarHome');
  return (
    <section className="bg-white" data-header-theme="dark">
      {/* Visual hero cards — inherits hero background */}
      <div className="relative py-12 sm:py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-background Large.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/75" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section label + headline */}
          <div
            className="text-center mb-8 sm:mb-10"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3 font-display">
              {t.compareLabel}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight font-display">
              <span style={{ color: '#60a5fa' }}>{t.compareTitlePrefix}</span>{' '}
              <span className="text-white/60">{locale === 'vi' ? 'hay' : ''}</span>{' '}
              <span style={{ color: ORANGE }}>{t.compareTitleSuffix}</span>
              {locale === 'vi' ? <span className="text-white">?</span> : null}
            </h2>
            <p className="mt-3 text-white text-sm sm:text-base max-w-xl mx-auto">
              {t.compareDesc}
            </p>
          </div>

          {/* Side-by-side hero cards + VS badge */}
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 max-w-3xl mx-auto"
          >
            {/* HYBRID Card */}
            <div
              className="flex-1 overflow-hidden rounded-2xl sm:rounded-r-none border border-blue-300/20 text-white flex flex-col shadow-2xl"
              style={{ backgroundColor: 'rgba(10, 29, 58, 0.96)', backdropFilter: 'blur(12px)' }}
            >
              {/* Real SAJ inverter + GENIXGREEN battery */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#071a36]">
                <img
                  src="/images/home/he-thong-hybrid-saj-genixgreen.webp"
                  alt="Hệ thống Hybrid gồm biến tần SAJ và pin lưu trữ GENIXGREEN"
                  width={1536}
                  height={1152}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a1d3a] to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-blue-300/30 bg-blue-950/75 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-blue-200 backdrop-blur-sm">
                  {t.hybridPill}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold mb-1 tracking-wide text-blue-300 font-display">
                  {t.hybridLabel}
                  </h3>
                <p className="mb-4 text-xs text-blue-100/70">SAJ Hybrid + GENIXGREEN Battery</p>
                <ul className="space-y-2.5 flex-1">
                  <li className="flex items-start gap-2">
                    <Lightning className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" weight="fill" />
                    <span className="text-xs sm:text-sm">{t.hybridPoints[0]}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightning className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" weight="fill" />
                    <span className="text-xs sm:text-sm">{t.hybridPoints[1]}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendUp className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" weight="fill" />
                    <span className="text-xs sm:text-sm">{t.hybridPoints[2]}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Building className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" weight="fill" />
                    <span className="text-xs sm:text-sm">{t.hybridPoints[3]}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" weight="fill" />
                    <span className="text-xs sm:text-sm">{t.hybridPoints[4]}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* VS divider */}
            <div className="flex items-center justify-center z-10 sm:-mx-5 relative my-[-0.75rem] sm:my-0">
              <div
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-lg font-black shadow-2xl border-4 border-white/20 z-20 relative"
                style={{ background: 'linear-gradient(135deg, #1a365d 50%, #ea580c 50%)', color: '#fff' }}
              >
                VS
              </div>
            </div>

            {/* ON-GRID Card */}
            <div
              className="flex-1 overflow-hidden rounded-2xl sm:rounded-l-none border border-orange-300/20 text-white flex flex-col shadow-2xl"
              style={{ backgroundColor: 'rgba(124, 45, 18, 0.96)', backdropFilter: 'blur(12px)' }}
            >
              {/* Real SAJ inverter */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#b94708]">
                <img
                  src="/images/home/he-thong-on-grid-saj.webp"
                  alt="Biến tần hòa lưới SAJ cho hệ thống On-Grid"
                  width={1536}
                  height={1152}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#7c2d12] to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-orange-200/30 bg-orange-950/70 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-orange-100 backdrop-blur-sm">
                  {t.onGridPill}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold mb-1 tracking-wide text-orange-300 font-display">
                  {t.onGridLabel}
                </h3>
                <p className="mb-4 text-xs text-orange-100/70">SAJ On-Grid Inverter</p>
                <ul className="space-y-2.5 flex-1">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" weight="fill" />
                    <span className="text-xs sm:text-sm">{t.onGridPoints[0]}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightning className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" weight="fill" />
                    <span className="text-xs sm:text-sm">{t.onGridPoints[1]}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Building className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" weight="fill" />
                    <span className="text-xs sm:text-sm">{t.onGridPoints[2]}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" weight="fill" />
                    <span className="text-xs sm:text-sm">{t.onGridPoints[3]}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-200" weight="fill" />
                    <span className="text-xs sm:text-sm">{t.onGridPoints[4]}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div
            className="mt-8 pb-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={hybridHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A4F56] hover:bg-[#3A3F45] text-white font-semibold rounded-full active:scale-[0.98] transition-colors shadow-lg"
            >
              <Lightning className="h-4 w-4" weight="bold" />
              {t.compareCtaHybrid}
            </a>
            <a
              href={solarHomeHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full active:scale-[0.98] transition-colors shadow-lg"
            >
              <Sun className="h-4 w-4" weight="bold" />
              {t.compareCtaHome}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
