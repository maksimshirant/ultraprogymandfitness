
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import PublicAssetImage from '@/components/PublicAssetImage';
import { trainerCategories, trainers, type TrainerCategory, type TrainerProfile } from '@/content/trainers';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useViewportTier } from '@/hooks/useViewportTier';
import { cn } from '@/lib/utils';
import type { OpenModalHandler } from '@/types/modal';

interface PersonalProps {
  onOpenModal: OpenModalHandler;
}

const PERSONAL_TEXT = {
  heroTitle: 'Тренеры',
  heroAccent: 'Ultra Pro',
  heroSubtitle:
    'Команда специалистов по силовому тренингу, восстановлению и единоборствам. Подберите тренера под цель, уровень подготовки и удобный формат занятий.',
  heroPrimaryCta: 'Я выбрал тренера',
  heroSecondaryCta: 'Выбрать тренера',
  heroScrollHintAria: 'Прокрутить к списку тренеров',
  sectionTitle: 'Наши',
  sectionTitleAccent: 'тренеры',
  sectionSubtitle: 'Выберите специалиста по направлению и запишитесь на персональную тренировку.',
  showMore: 'Подробнее о тренере',
  showLess: 'Скрыть',
  cta: 'Записаться на тренировку',
  prevAria: 'Предыдущий тренер',
  nextAria: 'Следующий тренер',
  selectAriaPrefix: 'Выбрать тренера',
  selectCategoryAria: 'Выбрать категорию тренеров',
} as const;

const CLUB_LOGO_SRC = `${import.meta.env.BASE_URL}logo.webp`;

function renderAchievement(achievement: string, index: number) {
  const trimmedAchievement = achievement.trim();
  const isSpecializationLine = trimmedAchievement.startsWith('-');
  const isLabelLine = trimmedAchievement.endsWith(':');

  if (isSpecializationLine) {
    return (
      <li key={index} className="pl-6 text-[11px] leading-relaxed text-gray-300 sm:pl-7 sm:text-xs md:pl-8 md:text-sm">
        {achievement}
      </li>
    );
  }

  if (isLabelLine) {
    return (
      <li key={index} className="pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F5B800] sm:text-xs md:text-sm">
        {achievement}
      </li>
    );
  }

  return (
    <li key={index} className="flex items-start gap-3">
      <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F5B800] to-[#D89B00] sm:h-4.5 sm:w-4.5 md:h-5 md:w-5">
        <Check className="h-2.5 w-2.5 text-white md:h-3 md:w-3" />
      </div>
      <span className="text-[11px] leading-relaxed text-gray-300 sm:text-xs md:text-sm">{achievement}</span>
    </li>
  );
}

export default function Personal({ onOpenModal }: PersonalProps) {
  const [activeCategory, setActiveCategory] = useState<TrainerCategory>('personal');
  const [expandedTrainerId, setExpandedTrainerId] = useState<number | null>(null);
  const [isTabletHeroScrollHintVisible, setIsTabletHeroScrollHintVisible] = useState(false);

  const viewportTier = useViewportTier();
  const isMobileViewport = viewportTier === 'mobile';

  const filteredTrainers = useMemo(
    () => trainers.filter((trainer) => trainer.category === activeCategory),
    [activeCategory]
  );

  useEffect(() => {
    const syncTabletHeroScrollHintVisibility = () => {
      const isTabletViewportMatch = window.innerWidth >= 768 && window.innerWidth < 1024;
      const nextVisibility = isTabletViewportMatch && window.scrollY < 24;

      setIsTabletHeroScrollHintVisible((prev) => (prev === nextVisibility ? prev : nextVisibility));
    };

    syncTabletHeroScrollHintVisibility();
    window.addEventListener('scroll', syncTabletHeroScrollHintVisibility, { passive: true });
    window.addEventListener('resize', syncTabletHeroScrollHintVisibility);

    return () => {
      window.removeEventListener('scroll', syncTabletHeroScrollHintVisibility);
      window.removeEventListener('resize', syncTabletHeroScrollHintVisibility);
    };
  }, []);

  const selectCategory = (category: TrainerCategory) => {
    setExpandedTrainerId(null);
    setActiveCategory(category);
  };

  const scrollToTrainers = () => {
    document.getElementById('trainers')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const renderTrainerCard = (trainer: TrainerProfile) => {
    const isExpanded = expandedTrainerId === trainer.id;
    const [experienceLabel, ...experienceValueParts] = trainer.experience.split(':');
    const experienceValue = experienceValueParts.join(':').trim();
    const hasExperienceSeparator = trainer.experience.includes(':');

    return (
      <article key={trainer.id} className="glass-card flex flex-col overflow-hidden border border-white/10 p-0">
        <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
          {trainer.image ? (
            <PublicAssetImage
              src={trainer.image}
              alt={trainer.name}
              loading="lazy"
              fetchPriority="low"
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
              variantSuffix="preview"
              deferUntilVisible
              pictureClassName="absolute inset-0 block h-full w-full"
              className={cn('h-full w-full object-cover object-center', trainer.imageClassName)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A27] via-[#111117] to-[#0A0A0F]">
              <img
                src={CLUB_LOGO_SRC}
                alt="Логотип Ultra Pro Gym & Fitness"
                loading="lazy"
                decoding="async"
                className="h-28 w-28 object-contain brightness-0 invert opacity-85 md:h-32 md:w-32"
              />
            </div>
          )}
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 p-4 pt-20 sm:p-5 sm:pt-24',
              isExpanded
                ? 'bg-gradient-to-t from-black via-black/95 to-transparent'
                : 'bg-gradient-to-t from-black via-black/85 to-transparent'
            )}
          >
            {!isExpanded ? (
              <>
                <div>
                  {trainer.role ? (
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F5B800] sm:text-[11px]">
                      {trainer.role}
                    </p>
                  ) : null}
                  <h3 className="truncate whitespace-nowrap text-xl font-bold leading-tight text-white sm:text-2xl">
                    {trainer.name}
                  </h3>
                </div>
                <p className="mt-2 text-xs sm:text-sm">
                  {hasExperienceSeparator ? (
                    <>
                      <span className="font-medium text-[#F5B800]">{experienceLabel}:</span>{' '}
                      <span className="text-white">{experienceValue}</span>
                    </>
                  ) : (
                    <span className="text-white">{trainer.experience}</span>
                  )}
                </p>
              </>
            ) : (
              <ul className="max-h-[48%] space-y-2 overflow-auto pr-1">
                {trainer.achievements.map((achievement, achievementIndex) =>
                  renderAchievement(achievement, achievementIndex)
                )}
              </ul>
            )}
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onOpenModal({ topic: 'personal', trainer: trainer.name })}
                className="btn-primary min-h-[2.25rem] px-3 py-1.5 text-xs text-white sm:min-h-[2.5rem] sm:px-4 sm:py-2 sm:text-sm"
              >
                Запись на тренировку
              </button>
              <button
                type="button"
                onClick={() => setExpandedTrainerId((prev) => (prev === trainer.id ? null : trainer.id))}
                className="inline-flex min-h-[2.5rem] items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.055] px-3.5 py-2 text-xs font-semibold text-[#F5B800] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition-[transform,border-color,background-color,color] duration-200 ease-out active:scale-[0.98] motion-reduce:transition-colors sm:text-sm lg:hover:border-[#F5B800]/30 lg:hover:bg-white/[0.08]"
              >
                <span>{isExpanded ? PERSONAL_TEXT.showLess : 'Подробнее'}</span>
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <div className="hero-glow-layer">
          <div className="hero-glow-top-right" />
          <div className="hero-glow-bottom-left" />
          <div className="hero-glow-center" />
        </div>


        <div className="relative z-30 mx-auto w-full max-w-7xl px-4 pt-0 pb-20 sm:px-6 sm:pt-24 sm:pb-14 md:max-lg:flex md:max-lg:min-h-[calc(100svh-13rem)] md:max-lg:flex-col md:max-lg:justify-between md:max-lg:px-10 md:max-lg:pt-32 md:max-lg:pb-20 lg:px-8 lg:pt-32 lg:pb-16">
          <div className="space-y-8 max-md:w-full max-md:max-w-full max-md:space-y-7 md:max-lg:mx-auto md:max-lg:max-w-[min(94vw,860px)] md:max-lg:space-y-11">
            <BalancedHeading
              as="h1"
              className="section-title text-white max-md:text-[clamp(3.25rem,11.5vw,4.5rem)] max-md:leading-[0.94] md:max-lg:max-w-full md:max-lg:text-[clamp(4.4rem,9.4vw,6.2rem)] md:max-lg:leading-[0.9] lg:text-[clamp(4.6rem,6.6vw,6.8rem)] lg:leading-[0.9]"
            >
              {PERSONAL_TEXT.heroTitle} <HeadingAccent className="bg-none p-0">{PERSONAL_TEXT.heroAccent}</HeadingAccent>
            </BalancedHeading>
            <p className="max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg md:max-lg:max-w-[48rem] md:max-lg:text-[1.6rem] md:max-lg:leading-[1.34] lg:text-xl">
              {PERSONAL_TEXT.heroSubtitle}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row md:max-lg:gap-4">
              <button
                type="button"
                onClick={() => onOpenModal({ topic: 'personal' })}
                className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 text-white md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg"
              >
                {PERSONAL_TEXT.heroPrimaryCta}
                <ArrowRight className="h-4 w-4 md:max-lg:h-5 md:max-lg:w-5" />
              </button>
              <button
                type="button"
                onClick={scrollToTrainers}
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-7 py-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition-[transform,border-color,background-color,color] duration-200 ease-out active:scale-[0.98] md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg motion-reduce:transition-colors lg:hover:border-[#F5B800]/30 lg:hover:bg-white/[0.08] lg:hover:text-[#F5B800]"
              >
                {PERSONAL_TEXT.heroSecondaryCta}
              </button>
            </div>
          </div>

          <div className="hidden min-h-[5.5rem] items-end justify-center md:max-lg:flex">
            <button
              type="button"
              onClick={scrollToTrainers}
              aria-label={PERSONAL_TEXT.heroScrollHintAria}
              className={cn(
                'inline-flex items-center justify-center text-white transition-opacity duration-200',
                isTabletHeroScrollHintVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
            >
              <ChevronDown className="h-11 w-11 text-white" strokeWidth={1.85} />
            </button>
          </div>
        </div>
      </section>

      <section id="trainers" className="relative overflow-hidden scroll-mt-24 py-14">
        <div className="hero-glow-layer">
          <div className="hero-glow-top-right" />
          <div className="hero-glow-bottom-left" />
          <div className="hero-glow-center" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <BalancedHeading as="h2" className="section-title text-white">
              {PERSONAL_TEXT.sectionTitle} <HeadingAccent>{PERSONAL_TEXT.sectionTitleAccent}</HeadingAccent>
            </BalancedHeading>
            <p className="section-subtitle mx-auto">{PERSONAL_TEXT.sectionSubtitle}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
            {trainerCategories.map((category) => {
              const isActive = category.id === activeCategory;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  aria-label={`${PERSONAL_TEXT.selectCategoryAria} ${category.label}`}
                  aria-pressed={isActive}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs transition-[background-color,border-color,color] md:px-4.5 md:py-2.5 md:text-sm',
                    isActive
                      ? 'border-white/25 bg-white/10 text-white'
                      : 'border-white/8 bg-transparent text-gray-400 hover:border-white/18 hover:text-white'
                  )}
                >
                  <span className="block font-medium">
                    {isMobileViewport
                      ? category.id === 'personal'
                        ? 'Персональные'
                        : 'Групповые'
                      : category.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-6 h-px w-20 bg-white/10" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
            {filteredTrainers.map((trainer) => renderTrainerCard(trainer))}
          </div>
        </div>
      </section>

    </div>
  );
}


