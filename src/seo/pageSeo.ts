import { siteConfig } from '@/seo/siteConfig';

export type PageSeoConfig = {
  title: string;
  description: string;
  path: string;
  robots?: string;
  ogType?: 'website' | 'article';
};

export const pageSeo = {
  home: {
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    path: '/',
    ogType: 'website',
  },
  schedule: {
    title: 'Расписание групповых занятий | Ultra Pro Gym & Fitness',
    description:
      'Актуальное расписание групповых занятий Ultra Pro Gym & Fitness в Волжском. Выберите направление и удобное время для тренировок.',
    path: '/schedule',
    ogType: 'website',
  },
  trainers: {
    title: 'Тренеры фитнес-клуба | Ultra Pro Gym & Fitness',
    description:
      'Тренеры Ultra Pro Gym & Fitness в Волжском. Выберите специалиста для персональных тренировок, силовой подготовки, кроссфита и единоборств.',
    path: '/trainers',
    ogType: 'website',
  },
  memberships: {
    title: 'Абонементы в фитнес-клуб | Ultra Pro Gym & Fitness',
    description:
      'Абонементы Ultra Pro Gym & Fitness в Волжском. Сравните форматы посещения, цены и выберите подходящий вариант для тренировок.',
    path: '/memberships',
    ogType: 'website',
  },
  contacts: {
    title: 'О нас, отзывы и контакты | Ultra Pro Gym & Fitness',
    description:
      'Отзывы гостей, контакты, график работы и способы быстро связаться с фитнес-клубом Ultra Pro Gym & Fitness в Волжском.',
    path: '/contacts',
    ogType: 'website',
  },
  notFound: {
    title: 'Страница не найдена | Ultra Pro Gym & Fitness',
    description:
      'Запрашиваемая страница не найдена. Перейдите на главную страницу Ultra Pro Gym & Fitness и выберите нужный раздел.',
    path: '/',
    robots: 'noindex,nofollow',
    ogType: 'website',
  },
} satisfies Record<string, PageSeoConfig>;
