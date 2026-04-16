import { useState } from 'react';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import PublicAssetImage from '@/components/PublicAssetImage';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import {
  groupDirectionCategories,
  groupDirections,
  type GroupDirection,
} from '@/content/groupDirections';
import { useViewportTier } from '@/hooks/useViewportTier';
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

function getTrainerInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

function TrainerAvatar({ direction, isDesktopViewport }: { direction: GroupDirection; isDesktopViewport: boolean }) {
  if (direction.trainerAvatar) {
    return (
      <PublicAssetImage
        src={direction.trainerAvatar}
        alt={direction.trainer}
        loading="lazy"
        fetchPriority="low"
        decoding="async"
        sizes="(max-width: 639px) 128px, 144px"
        variantSuffix={isDesktopViewport ? undefined : 'thumb'}
        deferUntilVisible
        pictureClassName="block h-32 w-32 overflow-hidden rounded-full border border-white/10 sm:h-36 sm:w-36"
        className="h-full w-full object-cover object-top"
        style={{ objectPosition: direction.trainerAvatarPosition ?? '50% 0%' }}
      />
    );
  }

  return (
    <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-2xl font-bold uppercase tracking-[0.08em] text-[#F5B800] sm:h-36 sm:w-36">
      {getTrainerInitials(direction.trainer)}
    </div>
  );
}

function DirectionDetails({ direction }: { direction: GroupDirection }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] lg:gap-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
            {GROUP_TRAININGS_TEXT.benefitsTitle}
          </p>
          <ul className="mt-4 space-y-3">
            {direction.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 border-b border-white/8 pb-3 text-sm leading-relaxed text-gray-100 last:border-b-0 last:pb-0"
              >
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F5B800]" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:border-l lg:border-white/10 lg:pl-8">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">О направлении</p>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-300 sm:text-base">
            {direction.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GroupTrainings({ onOpenModal }: GroupTrainingsProps) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [expandedScheduleDays, setExpandedScheduleDays] = useState<string[]>([]);
  const viewportTier = useViewportTier();
  const isDesktopViewport = viewportTier === 'desktop';

  const toggleExpanded = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((expandedKey) => expandedKey !== key) : [...prev, key]
    );
  };

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

                  <div className="space-y-5">
                    {directions.map((direction) => {
                      const isExpanded = expandedKeys.includes(direction.key);

                      return (
                        <article
                          key={direction.key}
                          id={direction.key}
                          className="scroll-mt-28 rounded-[28px] border border-white/10 bg-[#101117]/90 px-5 pt-5 pb-4 lg:px-7 lg:pt-7 lg:pb-5"
                        >
                          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center lg:gap-8">
                            <div className="space-y-5">
                              <div className="grid grid-cols-1 justify-items-center gap-y-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center sm:justify-items-start sm:gap-x-5">
                                <div className="flex justify-center sm:row-span-2 sm:justify-self-center">
                                  <TrainerAvatar direction={direction} isDesktopViewport={isDesktopViewport} />
                                </div>
                                <div className="min-w-0 text-center sm:self-center sm:text-left">
                                  <h3 className="text-lg font-bold leading-tight text-white [overflow-wrap:anywhere] sm:text-2xl lg:text-4xl">
                                    {direction.text}
                                  </h3>
                                  <p className="mt-2 text-sm text-gray-300 sm:text-lg">
                                    Тренер: {direction.trainer}
                                  </p>
                                </div>
                                <div className="flex justify-center sm:col-start-2 sm:justify-self-start">
                                  <button
                                    type="button"
                                    aria-expanded={isExpanded}
                                    onClick={() => toggleExpanded(direction.key)}
                                    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[#F5B800] transition-colors lg:hover:text-[#FFD351]"
                                  >
                                    <span>{isExpanded ? GROUP_TRAININGS_TEXT.detailsCloseCta : GROUP_TRAININGS_TEXT.detailsCta}</span>
                                    <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', isExpanded && 'rotate-180')} />
                                  </button>
                                </div>
                              </div>

                              <div
                                className={cn(
                                  'grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out lg:hidden',
                                  isExpanded ? 'mt-2 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
                                )}
                              >
                                <div className="min-h-0">
                                  <DirectionDetails direction={direction} />
                                </div>
                              </div>
                            </div>

                            <div className="order-2 flex flex-col justify-center lg:self-start lg:justify-start lg:items-center">
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
                                className="btn-primary w-full px-6 py-3.5 text-white lg:w-auto lg:min-w-[15rem]"
                              >
                                {GROUP_TRAININGS_TEXT.cardCta}
                              </button>
                            </div>
                          </div>

                          <div
                            className={cn(
                              'hidden overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out lg:grid',
                              isExpanded ? 'mt-6 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
                            )}
                          >
                            <div className="min-h-0">
                              <DirectionDetails direction={direction} />
                            </div>
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

      <section className="pb-12 sm:pb-14 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card border border-white/10 bg-white/[0.03] p-6 text-center sm:p-8 lg:p-10">
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
