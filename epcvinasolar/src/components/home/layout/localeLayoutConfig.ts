import { type Locale, messages } from '../../../i18n/messages';
import { getLocalePath, getLocalizedRoute } from '../../../i18n/routes';

export type HeaderNavItem = { label: string; href: string };
export type FooterLinkGroup = {
  requestQuote: string;
  salesPartner: string;
  affiliateSales: string;
  hybridBess: string;
  solarCi: string;
  news: string;
  paymentPolicy: string;
  warrantyPolicy: string;
  returnsPolicy: string;
  deliveryPolicy: string;
};

export function getHeaderLayoutConfig(locale: Locale, pathname: string) {
  const t = messages[locale];
  const homeHref = getLocalePath('/', locale);
  const contactHref = getLocalizedRoute(locale, 'contact');
  const profileHref = getLocalizedRoute(locale, 'profile');
  const quoteHref = getLocalizedRoute(locale, 'quote');

  const mainNavItems: HeaderNavItem[] = [
    { label: t.nav.home, href: getLocalizedRoute(locale, 'home') },
    { label: t.nav.solarHome, href: getLocalePath('/solar-home', locale) },
    { label: t.nav.hybridBess, href: getLocalePath('/hybrid-bess', locale) },
    { label: t.nav.solarCi, href: getLocalePath('/solar-cong-nghiep', locale) },
    { label: t.nav.charging, href: getLocalePath('/sac-ev', locale) },
    { label: t.nav.maintenance, href: getLocalePath('/maintenance', locale) },
    { label: t.nav.capabilityProfile, href: profileHref },
  ];

  return {
    homeHref,
    contactHref,
    profileHref,
    quoteHref,
    mainNavItems,
    secondaryNavItems: [{ label: t.nav.contact, href: contactHref }],
    labels: {
      more: t.header.more,
      toggleMenu: t.header.toggleMenu,
      quoteShort: t.header.quoteShort,
    },
    pathname,
  };
}

export function getFooterLayoutConfig(locale: Locale) {
  const t = messages[locale];
  return {
    titles: {
      products: t.footer.products,
      services: t.footer.services,
      policies: t.footer.policies,
    },
    links: {
      requestQuote: t.footer.requestQuote,
      salesPartner: t.footer.salesPartner,
      affiliateSales: t.footer.affiliateSales,
      hybridBess: t.footer.hybridBess,
      solarCi: t.footer.solarCi,
      news: t.footer.news,
      paymentPolicy: t.footer.paymentPolicy,
      warrantyPolicy: t.footer.warrantyPolicy,
      returnsPolicy: t.footer.returnsPolicy,
      deliveryPolicy: t.footer.deliveryPolicy,
    } satisfies FooterLinkGroup,
    t,
  };
}
