import { CheckCircle, ClipboardText } from '@phosphor-icons/react';
import { getLocaleFromPathname, messages } from '../../../i18n/messages';
import { getLocalizedRoute, getLocalePath } from '../../../i18n/routes';

const RED = '#DC2626';

export default function HeroSection({ pathname = '/' }: { pathname?: string }) {
  const locale = getLocaleFromPathname(pathname);
  const t = messages[locale]?.home ?? messages.vi.home;
  const quoteHref = getLocalizedRoute(locale, 'quote');
  const solarHomeHref = getLocalizedRoute(locale, 'solarHome');
  const solarCiHref = getLocalizedRoute(locale, 'solarCi');
  const calculatorHref = getLocalePath('/calculator', locale);
  const promoTag = locale === 'vi' ? 'Dự Án Tối Ưu' : locale === 'en' ? 'Optimized Projects' : locale === 'zh' ? '优化项目' : locale === 'ja' ? '最適化案件' : '최적화 프로젝트';
  const designTag = locale === 'vi' ? 'Thiết Kế Theo Nhu Cầu' : locale === 'en' ? 'Built Around Your Needs' : locale === 'zh' ? '按需定制设计' : locale === 'ja' ? 'ニーズに合わせた設計' : '수요 맞춤 설계';
  const consultingTag = locale === 'vi' ? 'Đang sẵn sàng tư vấn' : locale === 'en' ? 'Ready to consult' : locale === 'zh' ? '可立即咨询' : locale === 'ja' ? 'ご相談受付中' : '상담 가능';
  const hubLabel = locale === 'vi' ? 'Trọng tâm' : locale === 'en' ? 'Focus' : locale === 'zh' ? '重点' : locale === 'ja' ? '重点' : '핵심';
  const highlightLabel = locale === 'vi' ? 'Điểm chốt' : locale === 'en' ? 'Key point' : locale === 'zh' ? '关键点' : locale === 'ja' ? '要点' : '핵심 포인트';
  const quoteCardLabel = locale === 'vi' ? 'Báo giá' : locale === 'en' ? 'Quote' : locale === 'zh' ? '报价' : locale === 'ja' ? '見積' : '견적';
  const calculatorCardLabel = locale === 'vi' ? 'Máy tính ROI' : locale === 'en' ? 'ROI calculator' : locale === 'zh' ? 'ROI 计算器' : locale === 'ja' ? 'ROI 計算' : 'ROI 계산기';
  return (
    <section
      data-header-theme="dark"
      className="relative w-full overflow-hidden flex flex-col"
      style={{ height: '100dvh', minHeight: '600px' }}
    >
      <picture>
        <source media="(max-width: 768px)" srcSet="/hero-bg-mobile.webp" />
        <source media="(max-width: 1280px)" srcSet="/hero-bg-1280.webp" />
        <source media="(min-width: 1281px)" srcSet="/hero-bg-1920.webp" />
        <img
          src="/hero-bg.webp"
          alt={locale === 'vi' ? 'EPCVINA Solar - Giải pháp điện mặt trời trọn gói' : locale === 'en' ? 'EPCVINA Solar - turnkey solar solutions' : locale === 'zh' ? 'EPCVINA Solar - 太阳能交钥匙方案' : locale === 'ja' ? 'EPCVINA Solar - 太陽光の一括導入ソリューション' : 'EPCVINA Solar - 태양광 턴키 솔루션'}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'translateY(0)' }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1882"
          height="836"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12 lg:py-0">
          <div className="w-full max-w-7xl grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-sm mb-4 sm:mb-5 lg:self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
                  {t.heroBadge}
                </span>
              </div>

              <h1
                className="text-[28px] sm:text-3xl md:text-4xl lg:text-[2.95rem] xl:text-[3.25rem] font-extrabold text-white mb-3 sm:mb-4 max-w-2xl leading-[1.06] tracking-tight text-balance lg:self-start"
              >
                <span className="block">{t.heroTitle1}</span>
                <span className="block">{t.heroTitle2}</span>
              </h1>

              <p
                className="text-base sm:text-lg md:text-xl font-semibold text-white/90 mb-3 max-w-2xl leading-snug text-pretty lg:self-start"
              >
                {t.heroLead}
              </p>

              <p
                className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 mb-5 leading-relaxed lg:self-start"
              >
                {t.heroSub}
              </p>

              <div
                className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-4xl mx-auto lg:mx-0"
              >
                {[
                  [t.heroStat1, locale === 'vi' ? 'Tư vấn đúng cụm giải pháp' : locale === 'en' ? 'Solution-first consulting' : locale === 'zh' ? '方案优先咨询' : locale === 'ja' ? '用途起点のご提案' : '솔루션 우선 상담'],
                  [t.heroStat2, locale === 'vi' ? 'Đội ngũ kỹ sư EPCVINA' : locale === 'en' ? 'EPCVINA engineering team' : locale === 'zh' ? 'EPCVINA 工程团队' : locale === 'ja' ? 'EPCVINA 技術チーム' : 'EPCVINA 엔지니어 팀'],
                  [t.heroStat3, locale === 'vi' ? 'Hỗ trợ vận hành trọn vòng đời' : locale === 'en' ? 'Lifecycle support' : locale === 'zh' ? '全生命周期支持' : locale === 'ja' ? 'ライフサイクル支援' : '전 생애 지원'],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm px-4 py-3 text-left flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/15 ring-1 ring-amber-400/25">
                      <CheckCircle className="h-4.5 w-4.5 text-amber-300" weight="fill" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-extrabold text-white leading-tight">{value}</p>
                      <p className="mt-1 text-[11px] sm:text-xs text-white/70 leading-tight">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2 sm:gap-3 w-full max-w-2xl lg:mx-0"
              >
                <a
                  href="/calculator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white font-bold text-sm sm:text-[15px] shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200 w-full sm:w-auto"
                  style={{ backgroundColor: RED }}
                >
                  <ClipboardText className="w-4 h-4" weight="bold" />
                  {t.heroCtaCalc}
                </a>
                <a
                  href={solarCiHref}
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/85 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/70 w-full sm:w-auto py-1.5"
                >
                  {t.heroCtaSolarCi}
                </a>
              </div>

              <p className="mt-4 text-[11px] sm:text-sm text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {locale === 'vi' ? 'Báo giá trong 24h | Hỗ trợ kỹ thuật trọn vòng đời dự án.' : locale === 'en' ? 'Quote within 24 hours | lifecycle technical support.' : locale === 'zh' ? '24 小时内报价 | 全生命周期技术支持。' : locale === 'ja' ? '24時間以内にお見積り | ライフサイクル技術支援。' : '24시간 내 견적 | 생애주기 기술 지원.'}
              </p>
            </div>

            <div
              className="hidden lg:block relative"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-white/8 backdrop-blur-md shadow-2xl shadow-black/30">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-amber-300/10" />
                <div className="relative p-6 xl:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/55">{promoTag}</p>
                      <p className="mt-1 text-2xl font-extrabold text-white">{designTag}</p>
                    </div>
                    <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/25">
                      {consultingTag}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <a href={solarHomeHref} className="rounded-3xl border border-white/10 bg-black/20 p-4 transition-colors hover:bg-black/30">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">{hubLabel}</p>
                      <p className="mt-2 text-lg font-bold text-white">Solar Home</p>
                      <p className="mt-1 text-sm text-white/70 leading-relaxed">{locale === 'vi' ? 'Gia đình, nhà phố, biệt thự.' : locale === 'en' ? 'Homes, townhouses, villas.' : locale === 'zh' ? '住宅、联排别墅、独栋别墅。' : locale === 'ja' ? '住宅、町家、別荘。' : '주택, 타운하우스, 빌라.'}</p>
                    </a>
                    <a href={solarCiHref} className="rounded-3xl border border-white/10 bg-black/20 p-4 transition-colors hover:bg-black/30">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">{hubLabel}</p>
                      <p className="mt-2 text-lg font-bold text-white">Solar C&I</p>
                      <p className="mt-1 text-sm text-white/70 leading-relaxed">{locale === 'vi' ? 'Nhà xưởng, văn phòng, doanh nghiệp.' : locale === 'en' ? 'Factories, offices, and enterprises.' : locale === 'zh' ? '工厂、办公室与企业。' : locale === 'ja' ? '工場、オフィス、企業。' : '공장, 오피스, 기업.'}</p>
                    </a>
                    <a href={quoteHref} className="rounded-3xl border border-white/10 bg-black/20 p-4 transition-colors hover:bg-black/30">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">{highlightLabel}</p>
                      <p className="mt-2 text-lg font-bold text-white">{quoteCardLabel}</p>
                      <p className="mt-1 text-sm text-white/70 leading-relaxed">{locale === 'vi' ? 'Nhận đề xuất trọn gói theo nhu cầu thực tế.' : locale === 'en' ? 'Get a proposal tailored to your real needs.' : locale === 'zh' ? '根据实际需求获取完整方案。' : locale === 'ja' ? '実需に合わせた提案を受け取る。' : '실제 수요에 맞는 제안을 받아보세요.'}</p>
                    </a>
                    <a href={calculatorHref} className="rounded-3xl border border-white/10 bg-black/20 p-4 transition-colors hover:bg-black/30">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">{highlightLabel}</p>
                      <p className="mt-2 text-lg font-bold text-white">{calculatorCardLabel}</p>
                      <p className="mt-1 text-sm text-white/70 leading-relaxed">{locale === 'vi' ? 'Tính nhanh chi phí và hiệu quả đầu tư.' : locale === 'en' ? 'Estimate cost and ROI quickly.' : locale === 'zh' ? '快速估算成本与回报。' : locale === 'ja' ? '費用と投資回収を素早く試算。' : '비용과 ROI를 빠르게 계산.'}</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
