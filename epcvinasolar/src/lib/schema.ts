type FaqItem = { q?: unknown; a?: unknown; question?: unknown; answer?: unknown };

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    if (normalized) {
      const parsed = Number(normalized[0]);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

function toAbsoluteUrl(value: unknown, baseUrl = "https://epcvina.com") {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return undefined;
  }
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

/** Google merchant listings require a stable, compact SKU string. */
export function normalizeProductSku(value: unknown, fallback = "epcvina-product") {
  const source = cleanText(value) || fallback;
  const normalized = source
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "")
    .slice(0, 70);
  return normalized || fallback;
}

/** Shared offer enhancements used by both equipment and solar-combo pages. */
export function buildMerchantOfferDetails() {
  return {
    validFrom: new Date().toISOString().split("T")[0],
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "VN",
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "VN",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 7,
      url: "https://epcvina.com/chinh-sach-doi-tra",
    },
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  const mainEntity = items
    .map((item) => ({
      "@type": "Question",
      name: cleanText(item.q ?? item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: cleanText(item.a ?? item.answer),
      },
    }))
    .filter((item) => item.name && item.acceptedAnswer.text);

  if (!mainEntity.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export function buildProductSchema(input: {
  name: string;
  description?: string;
  brandName?: string;
  lowPrice?: unknown;
  highPrice?: unknown;
  offerCount?: unknown;
  price?: unknown;
  priceCurrency?: string;
  url?: string;
}) {
  const priceCurrency = input.priceCurrency || "VND";
  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: cleanText(input.name),
    description: cleanText(input.description),
    brand: input.brandName
      ? { "@type": "Brand", name: cleanText(input.brandName) }
      : undefined,
    url: toAbsoluteUrl(input.url),
  };

  const aggregateOffer: Record<string, unknown> = {
    "@type": "AggregateOffer",
    priceCurrency,
  };

  const lowPrice = toNumber(input.lowPrice);
  const highPrice = toNumber(input.highPrice);
  const offerCount = toNumber(input.offerCount);
  const price = toNumber(input.price);

  if (lowPrice !== undefined) aggregateOffer.lowPrice = lowPrice;
  if (highPrice !== undefined) aggregateOffer.highPrice = highPrice;
  if (offerCount !== undefined) aggregateOffer.offerCount = offerCount;
  if (price !== undefined) aggregateOffer.price = price;

  product.offers = aggregateOffer;
  return product;
}

export function buildLocalBusinessSchema(input: {
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  image?: string;
  telephone?: string;
  email?: string;
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
  latitude?: unknown;
  longitude?: unknown;
  geoMidLatitude?: unknown;
  geoMidLongitude?: unknown;
  geoRadius?: unknown;
  openingHours?: string;
  priceRange?: string;
  sameAs?: Array<string | undefined>;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: cleanText(input.name),
    description: cleanText(input.description),
    url: toAbsoluteUrl(input.url),
    logo: toAbsoluteUrl(input.logo),
    image: toAbsoluteUrl(input.image),
    telephone: cleanText(input.telephone),
    email: cleanText(input.email),
    openingHours: cleanText(input.openingHours),
    priceRange: cleanText(input.priceRange),
    sameAs: (input.sameAs || []).map((value) => toAbsoluteUrl(value)).filter(Boolean),
  };

  const latitude = toNumber(input.latitude);
  const longitude = toNumber(input.longitude);
  const geoMidLatitude = toNumber(input.geoMidLatitude);
  const geoMidLongitude = toNumber(input.geoMidLongitude);
  const geoRadius = toNumber(input.geoRadius);

  if (input.streetAddress || input.addressLocality || input.addressRegion || input.addressCountry) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: cleanText(input.streetAddress),
      addressLocality: cleanText(input.addressLocality),
      addressRegion: cleanText(input.addressRegion),
      addressCountry: cleanText(input.addressCountry),
    };
  }

  if (latitude !== undefined && longitude !== undefined) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    };
  }

  if (geoMidLatitude !== undefined && geoMidLongitude !== undefined && geoRadius !== undefined) {
    schema.serviceArea = {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: geoMidLatitude,
        longitude: geoMidLongitude,
      },
      geoRadius,
    };
  }

  return schema;
}
