import {
  CalendarClock,
  Crown,
  Rocket,
  Sunrise,
  Ticket,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

export type MembershipTopic =
  | 'sub_1m'
  | 'sub_3m'
  | 'sub_6m'
  | 'sub_12m'
  | 'sub_12m_day'
  | 'sub_once';

export interface MembershipPlan {
  id: number;
  title: string;
  price: string;
  label: string;
  note: string;
  icon: LucideIcon;
  topicValue: MembershipTopic;
  modes: string[];
}

const commonModes = [
  'Тренажерный зал (Площадь 1800м2, 2 этажа, 50+ тренажеров)',
  'Доступ к групповым тренировкам (Оплачиваются отдельно)',
  'Сауна, полотенце, вода',
  'Кроссфит-зона',
  'Кардио-зона',
  'Зона единоборств',
];

const freezeModes = {
  month1: 'Заморозка абонемента 14 дней',
  month3: 'Заморозка абонемента 21 день',
  month6: 'Заморозка абонемента 30 дней',
  year: 'Заморозка абонемента 60 дней',
} as const;

export const memberships: MembershipPlan[] = [
  {
    id: 1,
    title: '1 месяц',
    price: '2000 Р',
    label: 'Быстрый старт',
    note: 'Оптимально, чтобы познакомиться с клубом и режимом тренировок.',
    icon: Rocket,
    topicValue: 'sub_1m',
    modes: [...commonModes, freezeModes.month1],
  },
  {
    id: 2,
    title: '3 месяца',
    price: '5400 Р',
    label: 'Стабильный ритм',
    note: 'Для тех, кто хочет закрепить привычку и видеть регулярный прогресс.',
    icon: CalendarClock,
    topicValue: 'sub_3m',
    modes: [...commonModes, freezeModes.month3],
  },
  {
    id: 3,
    title: '6 месяцев',
    price: '9000 Р',
    label: 'Системный прогресс',
    note: 'Подходит для долгосрочной работы над силой, формой и выносливостью.',
    icon: Trophy,
    topicValue: 'sub_6m',
    modes: [...commonModes, freezeModes.month6],
  },
  {
    id: 4,
    title: '12 месяцев',
    price: '14400 Р',
    label: 'Максимальный фокус',
    note: 'Годовой план для тех, кто нацелен на устойчивый спортивный результат.',
    icon: Crown,
    topicValue: 'sub_12m',
    modes: [...commonModes, freezeModes.year, '5 гостевых посещений для друзей'],
  },
  {
    id: 5,
    title: '12 месяцев (дневной)',
    price: '10900 Р',
    label: 'Дневной формат',
    note: 'Специальный формат для тренировок в первой половине дня.',
    icon: Sunrise,
    topicValue: 'sub_12m_day',
    modes: [
      'Время посещения: с 7:00 до 16:00',
      commonModes[0],
      commonModes[2],
      commonModes[1],
      commonModes[3],
      commonModes[4],
      commonModes[5],
      freezeModes.year,
      '5 гостевых посещений для друзей',
    ],
  },
  {
    id: 6,
    title: 'Разовое посещение',
    price: '500 Р',
    label: 'Без абонемента',
    note: 'Разовый вход для свободного графика и гибкого посещения.',
    icon: Ticket,
    topicValue: 'sub_once',
    modes: ['Входит все, что и в обычный абонемент'],
  },
  {
    id: 7,
    title: 'Тест-драйв',
    price: '1000 Р',
    label: 'Пробный формат',
    note: 'Недельный абонемент, чтобы попробовать клуб, оборудование и атмосферу.',
    icon: Ticket,
    topicValue: 'sub_once',
    modes: ['Входит все, что и в обычный абонемент'],
  },
];

export const getMembershipById = (membershipId?: number) =>
  memberships.find((membership) => membership.id === membershipId);

export const getMembershipByTopic = (topic: string) =>
  memberships.find((membership) => membership.topicValue === topic);
