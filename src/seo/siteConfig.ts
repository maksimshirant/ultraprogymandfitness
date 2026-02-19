export interface BusinessAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface BusinessConfig {
  name: string;
  legalName: string;
  phone: string;
  phoneHref: string;
  image: string;
  addressText: string;
  address: BusinessAddress;
  openingHoursText: string;
  openingHours: string[];
  sameAs: string[];
}

export interface SiteConfig {
  siteUrl: string;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  locale: string;
  ogImage: string;
  business: BusinessConfig;
}

export const siteConfig: SiteConfig = {
  siteUrl: 'https://example.com',
  siteName: 'Ultra Pro Gym & Fitness',
  defaultTitle: 'Ultra Pro Gym & Fitness - фитнес-клуб в Волжском',
  defaultDescription:
    'Фитнес-клуб Ultra Pro в Волжском: тренажерный зал, персональные тренировки, групповые занятия, сауна и абонементы на удобных условиях.',
  locale: 'ru_RU',
  ogImage: 'https://example.com/logo.webp',
  business: {
    name: 'Ultra Pro Gym & Fitness',
    legalName: 'Ultra Pro Gym & Fitness',
    phone: '+7 (8443) 323-323',
    phoneHref: 'tel:+78443323323',
    image: 'https://example.com/logo.webp',
    addressText: 'г. Волжский, Профсоюзов 7Б, ТЦ Радуга',
    address: {
      streetAddress: 'Профсоюзов 7Б, ТЦ Радуга',
      addressLocality: 'Волжский',
      addressRegion: 'Волгоградская область',
      postalCode: '404130',
      addressCountry: 'RU',
    },
    openingHoursText: 'Ежедневно: 07:00 - 23:00',
    openingHours: [
      'Mo 07:00-23:00',
      'Tu 07:00-23:00',
      'We 07:00-23:00',
      'Th 07:00-23:00',
      'Fr 07:00-23:00',
      'Sa 07:00-23:00',
      'Su 07:00-23:00',
    ],
    sameAs: [
      'https://vk.com/ultrapro_fitness_vlz',
      'https://t.me/ultrapro_fitness_vlz',
      'https://yandex.com/maps/org/ultra_pro/233756976456/reviews/?ll=44.777002%2C48.777976&z=16',
    ],
  },
};
