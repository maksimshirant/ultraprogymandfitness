import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import {
  groupDirectionCategories,
  groupDirections,
  type GroupDirection,
} from '@/content/groupDirections';
import { cn } from '@/lib/utils';
import type { OpenModalHandler } from '@/types/modal';

interface GroupTrainingsProps {
  onOpenModal: OpenModalHandler;
}


const GROUP_TRAININGS_TEXT = {
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
const GROUP_TRAININGS_MODAL_TEXT = {
  closeAria: '\u0417\u0430\u043a\u0440\u044b\u0442\u044c',
  trainerLabel: '\u0422\u0440\u0435\u043d\u0435\u0440',
  descriptionTitle: '\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435',
  benefitsTitle: '\u0427\u0442\u043e \u0434\u0430\u0435\u0442 \u0444\u043e\u0440\u043c\u0430\u0442',
  cta: '\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0443',
} as const;

type HeroScheduleEntry = {
  id: string;
  time: string;
  directionKey: GroupDirection['key'];
  directionText?: string;
  trainerName?: string | null;
};

type HeroScheduleGroup = {
  id: string;
  day: string;
  date?: string;
  rows: HeroScheduleEntry[];
};

const HERO_SCHEDULE_GROUPS: HeroScheduleGroup[] = [
  {
    id: 'monday',
    day: 'Пн',
    rows: [
      { id: 'mon-glute', time: '09:00 - 10:00', directionKey: 'glute_pump' },
      {
        id: 'mon-body-balance',
        time: '10:00 - 11:00',
        directionKey: 'smart_fitness',
        directionText: 'ТЕЛО В БАЛАНСЕ',
        trainerName: 'Надежда',
      },
      { id: 'mon-afk-15', time: '15:00 - 16:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'mon-crossfit-16', time: '16:00 - 17:00', directionKey: 'crossfit', trainerName: 'Александр' },
      {
        id: 'mon-kids-wrestling',
        time: '16:00 - 17:00',
        directionKey: 'kids_martial_arts',
        directionText: 'БОРЬБА для детей',
        trainerName: 'Антон',
      },
      { id: 'mon-afk-17', time: '17:00 - 18:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'mon-cycle', time: '18:00 - 19:00', directionKey: 'cycle', trainerName: 'Александр' },
      {
        id: 'mon-functional',
        time: '18:00 - 19:00',
        directionKey: 'functional_training',
        directionText: 'ФУНКЦИОНАЛЬНА ТРЕНИРОВКА',
        trainerName: 'Виктория',
      },
      { id: 'mon-crossfit-19', time: '19:00 - 20:00', directionKey: 'crossfit', trainerName: 'Александр' },
      { id: 'mon-stretching', time: '19:00 - 20:00', directionKey: 'stretching', trainerName: 'Виктория' },
    ],
  },
  {
    id: 'tuesday',
    day: 'Вт',
    rows: [
      {
        id: 'tue-tabata',
        time: '09:00 - 10:00',
        directionKey: 'circuit_strength',
        directionText: 'ТАБАТА',
        trainerName: 'Жанна',
      },
      {
        id: 'tue-soft-strength',
        time: '10:00 - 11:00',
        directionKey: 'circuit_strength',
        directionText: 'МЯГКАЯ СИЛА',
        trainerName: 'Анна',
      },
      {
        id: 'tue-step-cardio',
        time: '18:00 - 19:00',
        directionKey: 'cycle',
        directionText: 'СТЕП-КАРДИО',
        trainerName: 'Анастасия',
      },
      {
        id: 'tue-body-balance',
        time: '19:00 - 20:00',
        directionKey: 'smart_fitness',
        directionText: 'ТЕЛО В БАЛАНСЕ',
        trainerName: 'Надежда',
      },
    ],
  },
  {
    id: 'wednesday',
    day: 'Ср',
    rows: [
      { id: 'wed-glute', time: '09:00 - 10:00', directionKey: 'glute_pump' },
      {
        id: 'wed-body-balance',
        time: '10:00 - 11:00',
        directionKey: 'smart_fitness',
        directionText: 'ТЕЛО В БАЛАНСЕ',
        trainerName: 'Надежда',
      },
      { id: 'wed-afk-15', time: '15:00 - 16:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'wed-crossfit-16', time: '16:00 - 17:00', directionKey: 'crossfit', trainerName: 'Александр' },
      {
        id: 'wed-kids-wrestling',
        time: '16:00 - 17:00',
        directionKey: 'kids_martial_arts',
        directionText: 'БОРЬБА для детей',
        trainerName: 'Антон',
      },
      { id: 'wed-afk-17', time: '17:00 - 18:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'wed-cycle', time: '18:00 - 19:00', directionKey: 'cycle', trainerName: 'Александр' },
      {
        id: 'wed-strong-core',
        time: '18:00 - 19:00',
        directionKey: 'functional_training',
        directionText: 'СИЛЬНЫЙ КОР',
        trainerName: 'Анна',
      },
      { id: 'wed-crossfit-19', time: '19:00 - 20:00', directionKey: 'crossfit', trainerName: 'Александр' },
      { id: 'wed-stretching', time: '19:00 - 20:00', directionKey: 'stretching', trainerName: 'Виктория' },
    ],
  },
  {
    id: 'thursday',
    day: 'Чт',
    rows: [
      {
        id: 'thu-tabata',
        time: '09:00 - 10:00',
        directionKey: 'circuit_strength',
        directionText: 'ТАБАТА',
        trainerName: 'Жанна',
      },
      {
        id: 'thu-strong-core',
        time: '10:00 - 11:00',
        directionKey: 'functional_training',
        directionText: 'СИЛЬНЫЙ КОР',
        trainerName: 'Анна',
      },
      {
        id: 'thu-step-cardio',
        time: '18:00 - 19:00',
        directionKey: 'cycle',
        directionText: 'СТЕП-КАРДИО',
        trainerName: 'Анастасия',
      },
    ],
  },
  {
    id: 'friday',
    day: 'Пт',
    rows: [
      { id: 'fri-glute', time: '09:00 - 10:00', directionKey: 'glute_pump' },
      {
        id: 'fri-body-balance',
        time: '10:00 - 11:00',
        directionKey: 'smart_fitness',
        directionText: 'ТЕЛО В БАЛАНСЕ',
        trainerName: 'Надежда',
      },
      { id: 'fri-afk-15', time: '15:00 - 16:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'fri-crossfit-16', time: '16:00 - 17:00', directionKey: 'crossfit', trainerName: 'Александр' },
      {
        id: 'fri-kids-wrestling',
        time: '16:00 - 17:00',
        directionKey: 'kids_martial_arts',
        directionText: 'БОРЬБА для детей',
        trainerName: 'Антон',
      },
      { id: 'fri-afk-17', time: '17:00 - 18:00', directionKey: 'afk', trainerName: 'Александр' },
      { id: 'fri-cycle', time: '18:00 - 19:00', directionKey: 'cycle', trainerName: 'Александр' },
      {
        id: 'fri-functional',
        time: '18:00 - 19:00',
        directionKey: 'functional_training',
        directionText: 'ФУНКЦИОНАЛЬНА ТРЕНИРОВКА',
        trainerName: 'Виктория',
      },
      { id: 'fri-crossfit-19', time: '19:00 - 20:00', directionKey: 'crossfit', trainerName: 'Александр' },
      { id: 'fri-stretching', time: '19:00 - 20:00', directionKey: 'stretching', trainerName: 'Виктория' },
    ],
  },
    {
    id: 'saturday',
    day: 'Сб',
    rows: [
      { id: 'pilates', time: '10:00 - 11:00', directionKey: 'pilates', trainerName: 'Анастасия' },
    ],
  },
  {
    id: 'sunday',
    day: 'Вс',
    rows: [
      { id: 'sun-glute', time: '11:00 - 12:00', directionKey: 'glute_pump' },
      { id: 'sun-smart-fitness', time: '12:00 - 13:00', directionKey: 'smart_fitness', trainerName: 'Анжелика' },
    ],
  },
];

function getDirectionByKey(directionKey: GroupDirection['key']) {
  const direction = groupDirections.find((item) => item.key === directionKey);

  if (!direction) {
    throw new Error(`Unknown group direction key: ${directionKey}`);
  }

  return direction;
}

const DIRECTION_CARD_GRADIENTS: Record<string, string> = {
  glute_pump: 'linear-gradient(145deg, rgba(70, 56, 50, 0.58) 0%, rgba(14, 15, 18, 0.96) 78%)',
  body_balance: 'linear-gradient(145deg, rgba(46, 56, 66, 0.54) 0%, rgba(14, 15, 18, 0.96) 78%)',
  afk: 'linear-gradient(145deg, rgba(50, 54, 62, 0.54) 0%, rgba(14, 15, 18, 0.96) 78%)',
  kids_martial_arts: 'linear-gradient(145deg, rgba(74, 60, 50, 0.58) 0%, rgba(14, 15, 18, 0.96) 78%)',
  afk_kids: 'linear-gradient(145deg, rgba(44, 56, 60, 0.54) 0%, rgba(14, 15, 18, 0.96) 78%)',
  crossfit: 'linear-gradient(145deg, rgba(80, 54, 52, 0.6) 0%, rgba(14, 15, 18, 0.96) 78%)',
  crossfit_kids: 'linear-gradient(145deg, rgba(72, 54, 50, 0.58) 0%, rgba(14, 15, 18, 0.96) 78%)',
  martial_arts_adults: 'linear-gradient(145deg, rgba(84, 62, 50, 0.6) 0%, rgba(14, 15, 18, 0.96) 78%)',
  cycle: 'linear-gradient(145deg, rgba(42, 58, 70, 0.58) 0%, rgba(14, 15, 18, 0.96) 78%)',
  functional_training: 'linear-gradient(145deg, rgba(46, 62, 52, 0.54) 0%, rgba(14, 15, 18, 0.96) 78%)',
  stretching: 'linear-gradient(145deg, rgba(54, 52, 70, 0.52) 0%, rgba(14, 15, 18, 0.96) 80%)',
  step_cardio: 'linear-gradient(145deg, rgba(74, 62, 48, 0.58) 0%, rgba(14, 15, 18, 0.96) 78%)',
  smart_fitness: 'linear-gradient(145deg, rgba(42, 58, 56, 0.54) 0%, rgba(14, 15, 18, 0.96) 78%)',
  strong_core: 'linear-gradient(145deg, rgba(52, 52, 62, 0.54) 0%, rgba(14, 15, 18, 0.96) 78%)',
  tabata: 'linear-gradient(145deg, rgba(80, 52, 52, 0.6) 0%, rgba(14, 15, 18, 0.96) 78%)',
  soft_strength: 'linear-gradient(145deg, rgba(48, 58, 62, 0.54) 0%, rgba(14, 15, 18, 0.96) 78%)',
  circuit_strength: 'linear-gradient(145deg, rgba(66, 50, 60, 0.58) 0%, rgba(14, 15, 18, 0.96) 78%)',
  lfk: 'linear-gradient(145deg, rgba(48, 56, 64, 0.52) 0%, rgba(14, 15, 18, 0.96) 80%)',
  pilates: 'linear-gradient(145deg, rgba(48, 54, 64, 0.52) 0%, rgba(14, 15, 18, 0.96) 80%)',
};

const DEFAULT_DIRECTION_CARD_GRADIENT = 'linear-gradient(145deg, rgba(50, 54, 60, 0.52) 0%, rgba(14, 15, 18, 0.96) 80%)';

const HERO_SCHEDULE_ROWS = HERO_SCHEDULE_GROUPS.map((group) => ({
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

export default function GroupTrainings({ onOpenModal }: GroupTrainingsProps) {
  const [expandedScheduleDays, setExpandedScheduleDays] = useState<string[]>([]);
  const [detailsDirection, setDetailsDirection] = useState<GroupDirection | null>(null);

  const toggleScheduleDay = (dayId: string) => {
    setExpandedScheduleDays((prev) =>
      prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
    );
  };

  const scrollToDirections = () => {
    document.getElementById('group-directions')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const scrollToSchedule = () => {
    document.getElementById('group-schedule')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const renderSchedulePreview = () => (
    <div className="relative">
      <div className="relative p-3 sm:p-5 lg:px-0 lg:py-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-white sm:text-base">
          <span>{GROUP_TRAININGS_TEXT.heroSchedulePrefix}</span>
          <span className="text-gray-300">{GROUP_TRAININGS_TEXT.heroScheduleLabel}</span>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4 sm:mt-5 sm:pt-5">
          <div className="grid grid-cols-[3.5rem_5.25rem_minmax(0,1fr)] gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 sm:grid-cols-[4.25rem_6.5rem_minmax(0,1fr)] sm:gap-3 sm:px-4 sm:py-3 sm:text-[11px] sm:tracking-[0.18em] lg:grid-cols-[5.5rem_8.75rem_minmax(0,1fr)] lg:px-5 lg:py-3.5">
            <span>{GROUP_TRAININGS_TEXT.heroScheduleColumnDay}</span>
            <span>{GROUP_TRAININGS_TEXT.heroScheduleColumnTime}</span>
            <span>{GROUP_TRAININGS_TEXT.heroScheduleColumnDirection}</span>
          </div>

          <div className="divide-y divide-white/8">
            {HERO_SCHEDULE_ROWS.map((group) => (
              <div
                key={group.id}
                className="grid grid-cols-[4.75rem_minmax(0,1fr)] sm:grid-cols-[5.5rem_minmax(0,1fr)] lg:grid-cols-[6.5rem_minmax(0,1fr)]"
              >
                {(() => {
                  const isDayExpanded = expandedScheduleDays.includes(group.id);

                  return (
                    <>
                      <button
                        type="button"
                        aria-expanded={isDayExpanded}
                        onClick={() => toggleScheduleDay(group.id)}
                        className="flex flex-col items-center justify-center gap-1 border-r border-white/8 bg-white/[0.03] px-2 py-3 text-center transition-colors sm:px-3 sm:py-4 lg:hover:bg-white/[0.06]"
                      >
                        <span className="whitespace-pre-line text-[11px] font-semibold leading-[1.15] text-white sm:text-sm">
                          {group.day}
                        </span>
                        <ChevronDown className={cn('h-4 w-4 text-gray-300 transition-transform duration-300', isDayExpanded && 'rotate-180')} />
                        {group.date ? (
                          <span className="text-[11px] text-gray-400 sm:text-xs">{group.date}</span>
                        ) : null}
                      </button>

                      <div className="divide-y divide-white/8">
                        {isDayExpanded ? (
                          group.rows.map((row) => (
                            <div
                              key={row.id}
                              className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-2 px-3 py-3 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-3 sm:px-4 sm:py-3 lg:grid-cols-[8.75rem_minmax(0,1fr)] lg:px-5 lg:py-3.5"
                            >
                              <span className="text-xs text-gray-300 sm:text-sm">{row.time}</span>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white sm:text-sm lg:text-[0.95rem]">
                                  {row.displayText}
                                </p>
                                {row.displayTrainer ? (
                                  <p className="mt-1 text-[11px] text-gray-400 sm:text-xs lg:text-[0.85rem]">
                                    {row.displayTrainer}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          ))
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleScheduleDay(group.id)}
                            className="w-full px-3 py-3 text-left text-xs text-gray-400 transition-colors sm:px-4 sm:py-3 sm:text-sm lg:px-5 lg:py-3.5 lg:hover:text-gray-200"
                          >
                            Нажмите, чтобы раскрыть
                          </button>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <div className="hero-glow-layer">
          <div className="hero-glow-top-right" />
          <div className="hero-glow-bottom-left" />
          <div className="hero-glow-center" />
        </div>

        <div className="relative z-30 mx-auto w-full max-w-7xl px-4 pt-24 pb-14 sm:px-6 md:max-lg:flex md:max-lg:min-h-[calc(100svh-13rem)] md:max-lg:flex-col md:max-lg:justify-center md:max-lg:px-10 md:max-lg:pt-32 md:max-lg:pb-20 lg:px-8 lg:pt-32 lg:pb-16">
          <div className="space-y-8 max-md:w-full max-md:max-w-full max-md:space-y-7 md:max-lg:mx-auto md:max-lg:max-w-[min(94vw,860px)] md:max-lg:space-y-11">
            <BalancedHeading
              as="h1"
              className="section-title text-white max-md:text-[clamp(2.8rem,10vw,4rem)] max-md:leading-[0.94] md:max-lg:max-w-full md:max-lg:text-[clamp(4rem,8.6vw,5.8rem)] md:max-lg:leading-[0.92] lg:text-[clamp(4.4rem,6vw,6.4rem)] lg:leading-[0.92]"
            >
              <span className="block">{GROUP_TRAININGS_TEXT.heroTitle}</span>
              <span className="block">
                для {GROUP_TRAININGS_TEXT.heroAccent}
              </span>
            </BalancedHeading>

            <p className="max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg md:max-lg:max-w-[48rem] md:max-lg:text-[1.45rem] md:max-lg:leading-[1.34] lg:text-xl">
              {GROUP_TRAININGS_TEXT.heroSubtitle}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row md:max-lg:gap-4">
              <button
                type="button"
                onClick={scrollToSchedule}
                className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 text-white md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg"
              >
                {GROUP_TRAININGS_TEXT.heroPrimaryCta}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={scrollToDirections}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white transition-colors md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg lg:hover:border-white/30 lg:hover:bg-white/[0.08]"
              >
                {GROUP_TRAININGS_TEXT.heroSecondaryCta}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="group-schedule" className="relative overflow-hidden scroll-mt-24 pt-2 pb-8 sm:pt-4 sm:pb-10 lg:pt-6 lg:pb-12">
        <div className="hero-glow-layer">
          <div className="hero-glow-top-right" />
          <div className="hero-glow-bottom-left" />
          <div className="hero-glow-center" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {renderSchedulePreview()}
        </div>
      </section>

      <section id="group-directions" className="relative scroll-mt-24 py-10 sm:py-12 lg:py-14">
        <div className="hero-glow-layer">
          <div className="hero-glow-top-right" />
          <div className="hero-glow-bottom-left" />
          <div className="hero-glow-center" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BalancedHeading as="h2" className="section-title text-white">
              {GROUP_TRAININGS_TEXT.sectionTitle}{' '}
              <HeadingAccent>{GROUP_TRAININGS_TEXT.sectionTitleAccent}</HeadingAccent>
            </BalancedHeading>
          </div>

          <div className="mt-10 space-y-12 lg:space-y-14">
            {groupDirectionCategories.map((category) => {
              const directions = groupDirections.filter((direction) => direction.category === category.key);

              return (
                <section key={category.key} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[2.2rem]">
                      {category.title}
                    </h2>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {directions.map((direction) => {
                      const cardBackgroundGradient = DIRECTION_CARD_GRADIENTS[direction.key] ?? DEFAULT_DIRECTION_CARD_GRADIENT;

                      return (
                        <article
                          key={direction.key}
                          id={direction.key}
                          className={cn(
                            'relative flex h-[138px] flex-col overflow-hidden scroll-mt-28 rounded-[28px] bg-[#101117]/70 px-5 pt-2 pb-0.5 sm:h-[138px] md:h-[185px] lg:h-[230px] sm:pb-1.5 lg:px-6 lg:pt-3 lg:pb-1.5',
                            'bg-[length:100%_100%]'
                          )}
                          style={{ backgroundImage: cardBackgroundGradient }}
                        >
                          <div className="flex-1 space-y-1">
                            <div className="grid grid-cols-1 items-center gap-y-1 pr-1 sm:pr-0">
                              <div className="min-w-0 self-center text-left">
                                <h3 className="max-w-full whitespace-normal text-lg font-bold uppercase leading-tight text-white md:text-[1.75rem] lg:text-3xl">
                                  {direction.text}
                                </h3>
                                <p className="mt-0.5 text-sm text-gray-300 md:text-lg lg:text-lg">
                                  <span className="text-[#F5B800]">Тренер:</span> {direction.trainer}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="relative z-30 mt-auto pb-1 flex items-center justify-between">
                            <button
                              type="button"
                              data-action={direction.action}
                              data-booking-action={direction.bookingAction}
                              data-confirm-booking-action={direction.confirmBookingAction}
                              data-group-direction={direction.key}
                              onClick={() =>
                                onOpenModal({
                                  topic: 'group',
                                  groupDirection: direction.text,
                                })
                              }
                              aria-label="���������� �� ����������"
                              className="btn-primary inline-flex h-10 w-10 items-center justify-center rounded-full !p-0 text-white leading-none md:h-12 md:w-12"
                            >
                              <Plus className="h-3.5 w-3.5 md:h-4.5 md:w-4.5" />
                            </button>

                            <button type="button" onClick={() => setDetailsDirection(direction)}
                              className="inline-flex w-[120px] items-center justify-end gap-2 text-sm font-medium text-[#F5B800] transition-colors hover:text-[#FFD351] md:w-[145px] md:text-base"
                            >
                              <span>{GROUP_TRAININGS_TEXT.detailsCta}</span>
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {detailsDirection ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={detailsDirection.text}
        >
          <button
            type="button"
            aria-label={GROUP_TRAININGS_MODAL_TEXT.closeAria}
            onClick={() => setDetailsDirection(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
          />

          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[26px] border border-white/10 bg-[#101117]/95 p-5 text-left shadow-[0_20px_80px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out md:scale-100 md:p-7 md:[transform-origin:center] lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold uppercase leading-tight text-white sm:text-2xl md:text-3xl">
                {detailsDirection.text}
              </h3>
              <button
                type="button"
                onClick={() => setDetailsDirection(null)}
                className="inline-flex h-9 w-9 min-h-9 min-w-9 max-h-9 max-w-9 shrink-0 aspect-square items-center justify-center rounded-full border border-white/15 p-0 text-white leading-none transition-colors hover:border-white/35 hover:bg-white/10"
                aria-label={GROUP_TRAININGS_MODAL_TEXT.closeAria}
              >
                &times;
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-200 sm:text-base"><span className="text-[#F5B800]">{GROUP_TRAININGS_MODAL_TEXT.trainerLabel}:</span> {detailsDirection.trainer}</p>

            <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-gray-400">{GROUP_TRAININGS_MODAL_TEXT.descriptionTitle}</p>
                <div className="mt-3 space-y-3">
                  {detailsDirection.description.split('\n\n').map((paragraph, index) => (
                    <p key={`${detailsDirection.key}-desc-${index}`} className="text-sm leading-relaxed text-gray-200 sm:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-gray-400">{GROUP_TRAININGS_MODAL_TEXT.benefitsTitle}</p>
                <ul className="mt-3 space-y-2">
                  {detailsDirection.benefits.map((benefit) => (
                    <li key={benefit} className="text-sm leading-relaxed text-gray-200 sm:text-base">
                      - {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="pb-12 sm:pb-14 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="p-6 text-center sm:p-8 lg:p-10">
            <BalancedHeading as="h2" className="section-title text-white">
              {GROUP_TRAININGS_TEXT.finalTitle}
            </BalancedHeading>
            <p className="mx-auto mt-4 max-w-3xl text-base text-gray-200 sm:text-lg">
              {GROUP_TRAININGS_TEXT.finalSubtitle}
            </p>
            <button
              type="button"
              onClick={() => onOpenModal({ topic: 'group', groupRecommendation: true })}
              className="btn-primary mt-6 w-full px-8 py-4 text-white sm:w-auto sm:min-w-[22rem]"
            >
              {GROUP_TRAININGS_TEXT.finalCta}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}










































