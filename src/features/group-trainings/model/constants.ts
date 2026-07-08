import { groupDirections, type GroupDirection } from '@/content/groupDirections';

export const CLUB_LOGO_SRC = `${import.meta.env.BASE_URL}logo.webp`;

export const GROUP_TRAININGS_TEXT = {
  heroTitle: 'Групповые тренировки',
  heroAccent: 'взрослых и детей',
  heroSubtitle:
    'Силовые, функциональные и восстановительные направления с тренерами клуба. Подберите тренировку под свои цели и уровень подготовки.',
  heroPrimaryCta: 'Расписание',
  heroSecondaryCta: 'Выбрать направление',
  heroSchedulePrefix: 'РАСПИСАНИЕ',
  heroScheduleLabel: 'по дням недели',
  heroScheduleColumnDay: 'День',
  heroScheduleColumnTime: 'Время',
  heroScheduleColumnDirection: 'Направление',
  sectionTitle: 'Направления',
  sectionTitleAccent: 'групповых тренировок',
  benefitsTitle: 'Что дает формат',
  detailsCta: 'Подробнее',
  detailsCloseCta: 'Скрыть',
  cardCta: 'Записаться на тренировку',
  finalTitle: 'Не знаете, какое направление подойдёт?',
  finalSubtitle: 'Оставьте заявку — менеджер поможет подобрать направление под ваши цели.',
  finalCta: 'Оставить заявку',
} as const;

export type HeroScheduleEntry = {
  id: string;
  time: string;
  directionKey: GroupDirection['key'];
  directionText?: string;
  trainerName?: string | null;
};

export type HeroScheduleGroup = {
  id: string;
  day: string;
  date?: string;
  rows: HeroScheduleEntry[];
};

const HERO_SCHEDULE_GROUPS: HeroScheduleGroup[] = [
  { id: 'monday', day: 'Пн', rows: [
      { id: 'mon-glute', time: '09:00 - 10:00', directionKey: 'glute_pump' },
      { id: 'mon-body-balance', time: '10:00 - 11:00', directionKey: 'smart_fitness', directionText: 'ТЕЛО В БАЛАНСЕ', trainerName: 'Надежда' },
      { id: 'mon-afk-15', time: '15:00 - 16:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'mon-crossfit-16', time: '16:00 - 17:00', directionKey: 'crossfit', trainerName: 'Александр' },
      { id: 'mon-kids-wrestling', time: '16:00 - 17:00', directionKey: 'kids_martial_arts', directionText: 'БОРЬБА для детей', trainerName: 'Антон' },
      { id: 'mon-afk-17', time: '17:00 - 18:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'mon-cycle', time: '18:00 - 19:00', directionKey: 'cycle', trainerName: 'Александр' },
      { id: 'mon-functional', time: '18:00 - 19:00', directionKey: 'functional_training', directionText: 'ФУНКЦИОНАЛЬНА ТРЕНИРОВКА', trainerName: 'Виктория' },
      { id: 'mon-crossfit-19', time: '19:00 - 20:00', directionKey: 'crossfit', trainerName: 'Александр' },
      { id: 'mon-stretching', time: '19:00 - 20:00', directionKey: 'stretching', trainerName: 'Виктория' },
  ]},
  { id: 'tuesday', day: 'Вт', rows: [
      { id: 'tue-step-cardio', time: '18:00 - 19:00', directionKey: 'cycle', directionText: 'СТЕП-КАРДИО', trainerName: 'Анастасия' },
      { id: 'tue-body-balance', time: '19:00 - 20:00', directionKey: 'smart_fitness', directionText: 'ТЕЛО В БАЛАНСЕ', trainerName: 'Надежда' },
  ]},
  { id: 'wednesday', day: 'Ср', rows: [
      { id: 'wed-glute', time: '09:00 - 10:00', directionKey: 'glute_pump' },
      { id: 'wed-body-balance', time: '10:00 - 11:00', directionKey: 'smart_fitness', directionText: 'ТЕЛО В БАЛАНСЕ', trainerName: 'Надежда' },
      { id: 'wed-afk-15', time: '15:00 - 16:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'wed-crossfit-16', time: '16:00 - 17:00', directionKey: 'crossfit', trainerName: 'Александр' },
      { id: 'wed-kids-wrestling', time: '16:00 - 17:00', directionKey: 'kids_martial_arts', directionText: 'БОРЬБА для детей', trainerName: 'Антон' },
      { id: 'wed-afk-17', time: '17:00 - 18:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'wed-cycle', time: '18:00 - 19:00', directionKey: 'cycle', trainerName: 'Александр' },
      { id: 'wed-crossfit-19', time: '19:00 - 20:00', directionKey: 'crossfit', trainerName: 'Александр' },
      { id: 'wed-stretching', time: '19:00 - 20:00', directionKey: 'stretching', trainerName: 'Виктория' },
  ]},
  { id: 'thursday', day: 'Чт', rows: [
      { id: 'thu-step-cardio', time: '18:00 - 19:00', directionKey: 'cycle', directionText: 'СТЕП-КАРДИО', trainerName: 'Анастасия' },
  ]},
  { id: 'friday', day: 'Пт', rows: [
      { id: 'fri-glute', time: '09:00 - 10:00', directionKey: 'glute_pump' },
      { id: 'fri-body-balance', time: '10:00 - 11:00', directionKey: 'smart_fitness', directionText: 'ТЕЛО В БАЛАНСЕ', trainerName: 'Надежда' },
      { id: 'fri-afk-15', time: '15:00 - 16:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'fri-crossfit-16', time: '16:00 - 17:00', directionKey: 'crossfit', trainerName: 'Александр' },
      { id: 'fri-kids-wrestling', time: '16:00 - 17:00', directionKey: 'kids_martial_arts', directionText: 'БОРЬБА для детей', trainerName: 'Антон' },
      { id: 'fri-afk-17', time: '17:00 - 18:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'fri-cycle', time: '18:00 - 19:00', directionKey: 'cycle', trainerName: 'Александр' },
      { id: 'fri-functional', time: '18:00 - 19:00', directionKey: 'functional_training', directionText: 'ФУНКЦИОНАЛЬНА ТРЕНИРОВКА', trainerName: 'Виктория' },
      { id: 'fri-crossfit-19', time: '19:00 - 20:00', directionKey: 'crossfit', trainerName: 'Александр' },
      { id: 'fri-stretching', time: '19:00 - 20:00', directionKey: 'stretching', trainerName: 'Виктория' },
  ]},
  { id: 'saturday', day: 'Сб', rows: [
      { id: 'pilates', time: '10:00 - 11:00', directionKey: 'pilates', trainerName: 'Анастасия' },
  ]},
  { id: 'sunday', day: 'Вс', rows: [
      { id: 'sun-glute', time: '11:00 - 12:00', directionKey: 'glute_pump' },
      { id: 'sun-smart-fitness', time: '12:00 - 13:00', directionKey: 'smart_fitness', trainerName: 'Анжелика' },
  ]},
];

function getDirectionByKey(directionKey: GroupDirection['key']) {
  const direction = groupDirections.find((item) => item.key === directionKey);
  if (!direction) {
    throw new Error(`Unknown group direction key: ${directionKey}`);
  }

  return direction;
}

export const HERO_SCHEDULE_ROWS = HERO_SCHEDULE_GROUPS.map((group) => ({
  ...group,
  rows: group.rows.map((entry) => {
    const direction = getDirectionByKey(entry.directionKey);

    return {
      ...entry,
      direction,
      displayText: entry.directionText ?? direction.text,
      displayTrainer: entry.trainerName === undefined ? direction.trainer : entry.trainerName,
    };
  }),
}));
