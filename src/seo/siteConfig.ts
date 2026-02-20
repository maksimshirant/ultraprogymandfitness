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
  siteUrl: 'https://ultraprofitness.ru',
  siteName: 'Ultra Pro Gym & Fitness',
  defaultTitle: 'Ultra Pro Gym & Fitness — фитнес-клуб в Волжском',
  defaultDescription:
    'Современное оборудование. Профессиональные тренеры. Сауна. Фитнес-бар. Групповые тренировки. Бесплатное пробное занятие.',
  locale: 'ru_RU',
  ogImage: 'https://ultraprofitness.ru/og-image.jpg',
  business: {
    name: 'Ultra Pro Gym & Fitness',
    legalName: 'Ultra Pro Gym & Fitness',
    phone: '+7 (8443) 323-323',
    phoneHref: 'tel:+78443323323',
    image: 'https://ultraprofitness.ru/og-image.jpg',
    addressText: 'г. Волжский, Профсоюзов 7Б, ТЦ Радуга',
    address: {
      streetAddress: 'Профсоюзов 7Б, ТЦ Радуга',
      addressLocality: 'Волжский',
      addressRegion: 'Волгоградская область',
      postalCode: '404130',
      addressCountry: 'RU',
    },
    openingHoursText: 'Понедельник–Суббота: 07:00–00:00, Воскресенье: 07:00–22:00',
    openingHours: [
      'Mo 07:00-00:00',
      'Tu 07:00-00:00',
      'We 07:00-00:00',
      'Th 07:00-00:00',
      'Fr 07:00-00:00',
      'Sa 07:00-00:00',
      'Su 07:00-22:00',
    ],
    sameAs: [
      'https://vk.com/ultrapro_fitness_vlz',
      'https://t.me/ultrapro_fitness_vlz',
      'https://yandex.com/maps/org/ultra_pro/233756976456/reviews/?ll=44.777002%2C48.777976&z=16',
    ],
  },
};
