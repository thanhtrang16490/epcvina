import { useMemo } from 'react';
import { getLocaleFromPathname, localeLabels, localeNames, messages, type Locale } from './messages';

export function useLocale(pathname: string) {
  return useMemo(() => {
    const locale = getLocaleFromPathname(pathname);
    return {
      locale,
      label: localeLabels[locale],
      name: localeNames[locale],
      t: messages[locale],
    };
  }, [pathname]);
}

