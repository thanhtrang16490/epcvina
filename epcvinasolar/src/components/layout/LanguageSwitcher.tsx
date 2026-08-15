import { localeLabels, locales, type Locale } from '../../i18n/messages';
import { getLocalePath } from '../../i18n/routes';

export default function LanguageSwitcher({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {locales.map((locale) => {
        const active = (pathname === '/' && locale === 'vi') || pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
        return (
          <a
            key={locale}
            href={getLocalePath(pathname, locale)}
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
              active
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 bg-white/70 text-gray-700 hover:border-gray-300 hover:bg-white'
            }`}
            aria-label={locale}
          >
            {localeLabels[locale]}
          </a>
        );
      })}
    </div>
  );
}
