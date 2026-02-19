import { FAQ_ITEMS } from '@/content/faq';
import { siteConfig } from '@/seo/siteConfig';

type JsonLdObject = Record<string, unknown>;

const HEALTH_CLUB_SCRIPT_ID = 'ld-json-health-club';
const ORGANIZATION_SCRIPT_ID = 'ld-json-organization';
const FAQ_SCRIPT_ID = 'ld-json-faq';

const toAbsoluteUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${siteConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

const upsertJsonLdScript = (id: string, payload: JsonLdObject) => {
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.text = JSON.stringify(payload);
};

const createHealthClubSchema = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'HealthClub',
  '@id': `${siteConfig.siteUrl}/#healthclub`,
  name: siteConfig.business.name,
  legalName: siteConfig.business.legalName,
  url: `${siteConfig.siteUrl}/`,
  image: toAbsoluteUrl(siteConfig.business.image),
  description: siteConfig.defaultDescription,
  telephone: siteConfig.business.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.business.address.streetAddress,
    addressLocality: siteConfig.business.address.addressLocality,
    addressRegion: siteConfig.business.address.addressRegion,
    postalCode: siteConfig.business.address.postalCode,
    addressCountry: siteConfig.business.address.addressCountry,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.777976,
    longitude: 44.777002,
  },
  areaServed: [
    {
      '@type': 'City',
      name: siteConfig.business.address.addressLocality,
    },
    {
      '@type': 'AdministrativeArea',
      name: siteConfig.business.address.addressRegion,
    },
  ],
  openingHours: siteConfig.business.openingHours,
  sameAs: siteConfig.business.sameAs,
});

const createOrganizationSchema = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.siteUrl}/#organization`,
  name: siteConfig.siteName,
  description: siteConfig.defaultDescription,
  url: `${siteConfig.siteUrl}/`,
  logo: toAbsoluteUrl('/logo.webp'),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: siteConfig.business.phone,
      areaServed: 'RU',
      availableLanguage: ['ru'],
    },
  ],
  sameAs: siteConfig.business.sameAs,
});

const createFaqSchema = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const syncStructuredData = () => {
  upsertJsonLdScript(HEALTH_CLUB_SCRIPT_ID, createHealthClubSchema());
  upsertJsonLdScript(ORGANIZATION_SCRIPT_ID, createOrganizationSchema());
  upsertJsonLdScript(FAQ_SCRIPT_ID, createFaqSchema());
};
