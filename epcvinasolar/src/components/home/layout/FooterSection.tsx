import { Phone, Envelope, MapPin, ChatCircle } from '@phosphor-icons/react';
import LanguageSwitcher from '../../layout/LanguageSwitcher';
import { getLocaleFromPathname } from '../../../i18n/messages';
import { getLocalePath, getLocalizedRoute } from '../../../i18n/routes';
import { getFooterLayoutConfig } from './localeLayoutConfig';

const BRAND_RED = '#DC2626';

export default function FooterSection({ pathname = '/' }: { pathname?: string }) {
  const locale = getLocaleFromPathname(pathname);
  const { t, titles, links } = getFooterLayoutConfig(locale);
  const newsHref = getLocalizedRoute(locale, 'news');
  const profileHref = getLocalizedRoute(locale, 'profile');
  const quoteHref = getLocalizedRoute(locale, 'quote');
  const hybridBessHref = getLocalizedRoute(locale, 'hybridBess');
  const solarCiHref = getLocalizedRoute(locale, 'solarCi');
  const salesPartnerHref = getLocalePath('/ban-hang', locale);
  const affiliateSalesHref = getLocalePath('/tiep-thi-lien-ket', locale);
  const quickLinks = [
    { href: quoteHref, label: t.footer.requestQuote },
    { href: salesPartnerHref, label: t.footer.salesPartner },
    { href: affiliateSalesHref, label: t.footer.affiliateSales },
  ];

  return (
    <footer style={{ backgroundColor: '#1A1D21' }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="mb-6 sm:mb-10 rounded-[28px] border border-white/10 bg-white/5 px-5 sm:px-6 py-5 sm:py-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                EPCVINA Solar
              </p>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-300">
                {t.footer.aboutText} {t.footer.servicesLine}.
              </p>
            </div>
            <div className="hidden sm:flex sm:flex-wrap gap-2 sm:gap-3">
              {quickLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={[
                    'inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98]',
                    index === 0
                      ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                      : 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
                  ].join(' ')}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">

          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1 pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <div className="mb-4">
              <img src="/logo-epcvina-solar-white.png" alt="EPCVINA Solar" width={1024} height={159} className="h-9 sm:h-12 w-auto" loading="lazy" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              {t.footer.aboutText}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {/* Zalo */}
              <a
                href="https://zalo.me/0368927332"
                target="_blank" rel="noopener noreferrer"

                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                style={{ backgroundColor: '#1a3a5c' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1452a0')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1a3a5c')}
                aria-label="Zalo"
              >
                <img src="/icons8-zalo.svg" alt="Zalo" width={20} height={20} className="w-5 h-5 object-contain" loading="lazy" />
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/epcvinacom/"
                target="_blank" rel="noopener noreferrer"

                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                style={{ backgroundColor: '#374151' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = BRAND_RED)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#374151')}
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@EPCVINA"
                target="_blank" rel="noopener noreferrer"

                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                style={{ backgroundColor: '#374151' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = BRAND_RED)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#374151')}
                aria-label="YouTube"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{titles.products}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href={getLocalePath('/solar-home', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.solarHome}</a></li>
              <li><a href={getLocalePath('/goi-combo', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.allCombos}</a></li>
              <li><a href={getLocalePath('/solar-home/on-grid', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.onGridCombo}</a></li>
              <li><a href={getLocalePath('/solar-home/hybrid', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.hybridCombo}</a></li>
              <li><a href={getLocalePath('/thiet-bi/panel', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.solarModules}</a></li>
              <li><a href={getLocalePath('/thiet-bi/hybrid-inverter', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.hybridInverter}</a></li>
              <li><a href={getLocalePath('/thiet-bi/hv-battery', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.bessBattery}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{titles.services}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href={getLocalePath('/calculator', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.calculator}</a></li>
              <li><a href={quoteHref} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.requestQuote}</a></li>
              <li><a href={salesPartnerHref} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.salesPartner}</a></li>
              <li><a href={affiliateSalesHref} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.affiliateSales}</a></li>
              <li><a href={hybridBessHref} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.hybridBess}</a></li>
              <li><a href={solarCiHref} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.solarCi}</a></li>
              <li><a href={getLocalePath('/ung-dung/van-phong', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.office}</a></li>
              <li><a href={profileHref} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.nav.capabilityProfile}</a></li>
              <li><a href={newsHref} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">{t.footer.news}</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{titles.policies}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href={getLocalePath('/chinh-sach-bao-mat', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">{t.footer.privacy}</a></li>
              <li><a href={getLocalePath('/chinh-sach-thanh-toan', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">{t.footer.paymentPolicy}</a></li>
              <li><a href={getLocalePath('/bao-hanh', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">{t.footer.warrantyPolicy}</a></li>
              <li><a href={getLocalePath('/chinh-sach-doi-tra', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">{t.footer.returnsPolicy}</a></li>
              <li><a href={getLocalePath('/chinh-sach-giao-nhan', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">{t.footer.deliveryPolicy}</a></li>
              <li><a href={getLocalePath('/dieu-khoan', locale)} className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">{t.footer.terms}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.contact}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" weight="fill" style={{ color: BRAND_RED }} />
                <span className="text-gray-400 leading-relaxed">{t.footer.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" weight="fill" style={{ color: BRAND_RED }} />
                <div className="leading-relaxed">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">{t.footer.consultant}</p>
                  <a href="tel:0988446113" className="hover:text-white transition-colors cursor-pointer inline-block active:scale-[0.98]">
                    0988 446 113 <span className="text-gray-400">({t.footer.salesContactName})</span>
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" weight="fill" style={{ color: BRAND_RED }} />
                <div className="leading-relaxed">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">{t.footer.technical}</p>
                  <a href="tel:0368927332" className="hover:text-white transition-colors cursor-pointer inline-block active:scale-[0.98]">
                    0368 927 332 <span className="text-gray-400">({t.footer.technicalContactName})</span>
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <ChatCircle className="h-4 w-4 flex-shrink-0" weight="fill" style={{ color: BRAND_RED }} />
                <a
                  href="https://zalo.me/0368927332"
                  target="_blank" rel="noopener noreferrer"

                  className="hover:text-white transition-colors cursor-pointer py-1 inline-block active:scale-[0.98]"
                >
                  Zalo: 0368 927 332
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Envelope className="h-4 w-4 flex-shrink-0" weight="fill" style={{ color: BRAND_RED }} />
                <a href="mailto:epcvinasolar@gmail.com" className="hover:text-white transition-colors cursor-pointer py-1 inline-block active:scale-[0.98]">
                  epcvinasolar@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 sm:mt-10 pt-4 sm:pt-6 pb-2 space-y-3 text-xs text-gray-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} EPCVINA Solar — {t.footer.legalName}. {t.footer.copyright}</p>
            <div className="flex flex-col items-center gap-3 sm:items-end">
              <LanguageSwitcher pathname={pathname} />
              <div className="flex items-center gap-4">
                <a href={getLocalePath('/chinh-sach-bao-mat', locale)} className="hover:text-gray-300 transition-colors cursor-pointer py-1">{t.footer.privacy}</a>
                <a href={getLocalePath('/dieu-khoan', locale)} className="hover:text-gray-300 transition-colors cursor-pointer py-1">{t.footer.terms}</a>
              </div>
            </div>
          </div>
          <div className="text-center sm:text-left leading-relaxed text-gray-400">
            <p>{t.footer.legalName}</p>
            <p>{t.footer.businessRegistration}</p>
          </div>
        </div>
      </div>

    </footer>
  );
}
