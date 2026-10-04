import { localeLabels, locales, type Locale } from './messages';

const localePrefixPattern = /^\/(en|zh|ja|ko)(?=\/|$)/;

type RouteKey =
  | 'home'
  | 'news'
  | 'projects'
  | 'contact'
  | 'profile'
  | 'quote'
  | 'solarHome'
  | 'hybridBess'
  | 'solarCi'
  | 'charging'
  | 'maintenance'
  | 'brands'
  | 'policies'
  | 'privacyPolicy'
  | 'paymentPolicy'
  | 'returnsPolicy'
  | 'deliveryPolicy'
  | 'warrantyPolicy'
  | 'terms';

const localizedRoutes: Record<Locale, Record<RouteKey, string>> = {
  vi: {
    home: '/',
    news: '/tin-tuc',
    projects: '/du-an',
    contact: '/lien-he',
    profile: '/ho-so-nang-luc',
    quote: '/bao-gia',
    solarHome: '/solar-home',
    hybridBess: '/hybrid-bess',
    solarCi: '/solar-cong-nghiep',
    charging: '/ev-charging',
    maintenance: '/maintenance',
    brands: '/nhan-hang',
    policies: '/chinh-sach',
    privacyPolicy: '/chinh-sach-bao-mat',
    paymentPolicy: '/chinh-sach-thanh-toan',
    returnsPolicy: '/chinh-sach-doi-tra',
    deliveryPolicy: '/chinh-sach-giao-nhan',
    warrantyPolicy: '/bao-hanh',
    terms: '/dieu-khoan',
  },
  en: {
    home: '/en',
    news: '/en/blog',
    projects: '/en/projects',
    contact: '/en/contact',
    profile: '/en/company-profile',
    quote: '/en/quote',
    solarHome: '/en/solar-home',
    hybridBess: '/en/hybrid-bess',
    solarCi: '/en/solar-ci',
    charging: '/en/ev-charging',
    maintenance: '/en/maintenance',
    brands: '/en/brands',
    policies: '/en/policies',
    privacyPolicy: '/en/privacy-policy',
    paymentPolicy: '/en/payment-policy',
    returnsPolicy: '/en/returns-policy',
    deliveryPolicy: '/en/delivery-policy',
    warrantyPolicy: '/en/warranty-policy',
    terms: '/en/terms',
  },
  zh: {
    home: '/zh',
    news: '/zh/news',
    projects: '/zh/projects',
    contact: '/zh/contact',
    profile: '/zh/company-profile',
    quote: '/zh/quote',
    solarHome: '/zh/solar-home',
    hybridBess: '/zh/hybrid-bess',
    solarCi: '/zh/solar-ci',
    charging: '/zh/ev-charging',
    maintenance: '/zh/maintenance',
    brands: '/zh/brands',
    policies: '/zh/policies',
    privacyPolicy: '/zh/privacy-policy',
    paymentPolicy: '/zh/payment-policy',
    returnsPolicy: '/zh/returns-policy',
    deliveryPolicy: '/zh/delivery-policy',
    warrantyPolicy: '/zh/warranty-policy',
    terms: '/zh/terms',
  },
  ja: {
    home: '/ja',
    news: '/ja/news',
    projects: '/ja/projects',
    contact: '/ja/contact',
    profile: '/ja/company-profile',
    quote: '/ja/quote',
    solarHome: '/ja/solar-home',
    hybridBess: '/ja/hybrid-bess',
    solarCi: '/ja/solar-ci',
    charging: '/ja/ev-charging',
    maintenance: '/ja/maintenance',
    brands: '/ja/brands',
    policies: '/ja/policies',
    privacyPolicy: '/ja/privacy-policy',
    paymentPolicy: '/ja/payment-policy',
    returnsPolicy: '/ja/returns-policy',
    deliveryPolicy: '/ja/delivery-policy',
    warrantyPolicy: '/ja/warranty-policy',
    terms: '/ja/terms',
  },
  ko: {
    home: '/ko',
    news: '/ko/news',
    projects: '/ko/projects',
    contact: '/ko/contact',
    profile: '/ko/company-profile',
    quote: '/ko/quote',
    solarHome: '/ko/solar-home',
    hybridBess: '/ko/hybrid-bess',
    solarCi: '/ko/solar-ci',
    charging: '/ko/ev-charging',
    maintenance: '/ko/maintenance',
    brands: '/ko/brands',
    policies: '/ko/policies',
    privacyPolicy: '/ko/privacy-policy',
    paymentPolicy: '/ko/payment-policy',
    returnsPolicy: '/ko/returns-policy',
    deliveryPolicy: '/ko/delivery-policy',
    warrantyPolicy: '/ko/warranty-policy',
    terms: '/ko/terms',
  },
};

const localizedRouteAliases: Array<{ from: string; key: RouteKey }> = [
  { from: '/blog', key: 'news' },
  { from: '/tin-tuc', key: 'news' },
  { from: '/projects', key: 'projects' },
  { from: '/du-an', key: 'projects' },
  { from: '/contact', key: 'contact' },
  { from: '/lien-he', key: 'contact' },
  { from: '/company-profile', key: 'profile' },
  { from: '/ho-so-nang-luc', key: 'profile' },
  { from: '/quote', key: 'quote' },
  { from: '/bao-gia', key: 'quote' },
  { from: '/solar-home', key: 'solarHome' },
  { from: '/hybrid-bess', key: 'hybridBess' },
  { from: '/solar-cong-nghiep', key: 'solarCi' },
  { from: '/sac-ev', key: 'charging' },
  { from: '/ev-charging', key: 'charging' },
  { from: '/bao-tri', key: 'maintenance' },
  { from: '/maintenance', key: 'maintenance' },
  { from: '/nhan-hang', key: 'brands' },
  { from: '/brands', key: 'brands' },
  { from: '/chinh-sach', key: 'policies' },
  { from: '/chinh-sach-bao-mat', key: 'privacyPolicy' },
  { from: '/chinh-sach-thanh-toan', key: 'paymentPolicy' },
  { from: '/chinh-sach-doi-tra', key: 'returnsPolicy' },
  { from: '/chinh-sach-giao-nhan', key: 'deliveryPolicy' },
  { from: '/bao-hanh', key: 'warrantyPolicy' },
  { from: '/dieu-khoan', key: 'terms' },
];

export function getLocalizedRoute(locale: Locale, key: RouteKey) {
  return localizedRoutes[locale][key];
}

const hanoiLandingPath = '/dien-mat-troi-tai-ha-noi';

export function stripLocalePrefix(pathname: string) {
  const stripped = pathname.replace(localePrefixPattern, '');
  return stripped || '/';
}

export function getLocalePath(pathname: string, locale: Locale) {
  const basePath = stripLocalePrefix(pathname);
  if (basePath === hanoiLandingPath) {
    return locale === 'vi' ? basePath : `/${locale}${basePath}`;
  }
  if (basePath.startsWith('/nhan-hang/')) {
    const slug = basePath.slice('/nhan-hang/'.length);
    return getLocalizedRoute(locale, 'brands') + `/${slug}`;
  }
  const aliased = localizedRouteAliases.find((entry) => entry.from === basePath);
  if (aliased) return getLocalizedRoute(locale, aliased.key);
  if (locale === 'vi') return basePath;
  return basePath === '/' ? `/${locale}` : `/${locale}${basePath}`;
}

export function getLocalizedAlternates(pathname: string) {
  return locales.map((locale) => ({
    locale,
    label: localeLabels[locale],
    href: getLocalePath(pathname, locale),
  }));
}
