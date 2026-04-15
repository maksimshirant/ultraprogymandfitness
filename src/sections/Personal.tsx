
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import PublicAssetImage from '@/components/PublicAssetImage';
import { trainerCategories, trainers, type TrainerCategory, type TrainerProfile } from '@/content/trainers';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
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
  placeholderPhoto: 'Фото тренера',
  showMore: 'Подробнее о тренере',
  showLess: 'Скрыть',
  cta: 'Записаться на тренировку',
  prevAria: 'Предыдущий тренер',
  nextAria: 'Следующий тренер',
  selectAriaPrefix: 'Выбрать тренера',
  selectCategoryAria: 'Выбрать категорию тренеров',
} as const;

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
  const [activeCategory, setActiveCategory] = useState<TrainerCategory>('gym');
  const [activeTrainerIndex, setActiveTrainerIndex] = useState(0);
  const [expandedTrainerId, setExpandedTrainerId] = useState<number | null>(null);

  const viewportTier = useViewportTier();
  const isMobileViewport = viewportTier === 'mobile';
  const isTabletViewport = viewportTier === 'tablet';
  const isDesktopViewport = viewportTier === 'desktop';

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

  const nextSlide = () => {
    setExpandedTrainerId(null);
    setActiveTrainerIndex((prev) => (prev + 1) % filteredTrainers.length);
  };

  const prevSlide = () => {
    setExpandedTrainerId(null);
    setActiveTrainerIndex((prev) => (prev - 1 + filteredTrainers.length) % filteredTrainers.length);
  };


  const selectTrainerIndex = (index: number) => {
    setExpandedTrainerId(null);
    setActiveTrainerIndex(index);
  };

  const selectCategory = (category: TrainerCategory) => {
    setExpandedTrainerId(null);
    setActiveCategory(category);
    setActiveTrainerIndex(0);
  };

  const scrollToTrainers = () => {
    document.getElementById('trainers')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const swipeHandlers = useSwipeNavigation({
    onNext: nextSlide,
    onPrev: prevSlide,
  });

  const getSlideOffset = (index: number) => {
    let offset = index - activeTrainerIndex;
    const half = Math.floor(filteredTrainers.length / 2);

    if (offset > half) {
      offset -= filteredTrainers.length;
    }
    if (offset < -half) {
      offset += filteredTrainers.length;
    }

    return offset;
  };

  const renderCarouselTrainerCard = (trainer: TrainerProfile, isActive = false, isActionDisabled = false) => {
    const isExpanded = expandedTrainerId === trainer.id;

    return (
      <article
        key={trainer.id}
        className={`glass-card flex flex-col overflow-hidden border border-white/10 p-0 ${
          isActive ? 'trainer-card-active' : ''
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden border-b border-white/10 bg-black/40">
          {trainer.image ? (
            <PublicAssetImage
              src={trainer.image}
              alt={trainer.name}
              loading="lazy"
              fetchPriority="low"
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 70vw, 34vw"
              variantSuffix="preview"
              deferUntilVisible
              pictureClassName="absolute inset-0 block h-full w-full"
              className={cn('h-full w-full object-cover object-center', trainer.imageClassName)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A27] via-[#111117] to-[#0A0A0F]">
              <span className="text-6xl font-black leading-none text-[#F5B800] md:text-7xl">
                {String(trainer.id).padStart(2, '0')}
              </span>
              <span className="mt-3 text-xs uppercase tracking-[0.2em] text-gray-300">
                {PERSONAL_TEXT.placeholderPhoto}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col p-5 pt-4 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-white">{trainer.name}</h3>
            {trainer.role ? (
              <span className="inline-flex shrink-0 items-center rounded-full border border-[#F5B800]/30 bg-[#F5B800]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F5B800]">
                {trainer.role}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm text-gray-300">{trainer.experience}</p>

          <button
            type="button"
            onClick={() => setExpandedTrainerId((prev) => (prev === trainer.id ? null : trainer.id))}
            disabled={isActionDisabled}
            aria-expanded={isExpanded}
            className="mt-4 inline-flex items-center gap-2 self-start text-sm font-medium text-[#F5B800] transition-opacity hover:text-[#FFD351] disabled:pointer-events-none disabled:opacity-45"
          >
            <span>{isExpanded ? PERSONAL_TEXT.showLess : PERSONAL_TEXT.showMore}</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', isExpanded && 'rotate-180')} />
          </button>

          {isExpanded ? (
            <ul className="mt-4 space-y-2 pr-1">
              {trainer.achievements.map((achievement, achievementIndex) =>
                renderAchievement(achievement, achievementIndex)
              )}
            </ul>
          ) : null}

          <button
            type="button"
            onClick={() => onOpenModal({ topic: 'personal', trainer: trainer.name })}
            disabled={isActionDisabled}
            className="btn-primary mt-5 w-full text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55"
          >
            {PERSONAL_TEXT.cta}
          </button>
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


        <div className="relative z-30 mx-auto w-full max-w-7xl px-4 pt-24 pb-14 sm:px-6 md:max-lg:flex md:max-lg:min-h-[calc(100svh-13rem)] md:max-lg:flex-col md:max-lg:justify-between md:max-lg:px-10 md:max-lg:pt-32 md:max-lg:pb-20 lg:px-8 lg:pt-32 lg:pb-16">
          <div className="space-y-8 max-md:w-full max-md:max-w-full max-md:space-y-7 md:max-lg:mx-auto md:max-lg:max-w-[min(94vw,860px)] md:max-lg:space-y-11">
            <BalancedHeading
              as="h1"
              className="section-title text-white max-md:text-[clamp(3.25rem,11.5vw,4.5rem)] max-md:leading-[0.94] md:max-lg:max-w-full md:max-lg:text-[clamp(4.4rem,9.4vw,6.2rem)] md:max-lg:leading-[0.9] lg:text-[clamp(4.6rem,6.6vw,6.8rem)] lg:leading-[0.9]"
            >
              {PERSONAL_TEXT.heroTitle} <HeadingAccent>{PERSONAL_TEXT.heroAccent}</HeadingAccent>
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
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white transition-colors md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg lg:hover:border-white/30 lg:hover:bg-white/[0.08]"
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
                  <span className="block font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-6 h-px w-20 bg-white/10" />

          {isMobileViewport ? (
            <div>
              <div className="overflow-hidden" {...swipeHandlers}>
                <div
                  className="trainer-slide-motion flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeTrainerIndex * 100}%)` }}
                >
                  {filteredTrainers.map((trainer) => (
                    <div key={trainer.id} className="w-full shrink-0">
                      {renderCarouselTrainerCard(trainer)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {isTabletViewport ? (
            <div className="relative md:-mx-6">
              <button
                type="button"
                onClick={prevSlide}
                className="trainer-control-motion absolute left-4 top-[18rem] z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#111217]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-white/35 hover:bg-[#181a22]"
                aria-label={PERSONAL_TEXT.prevAria}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="trainer-control-motion absolute right-4 top-[18rem] z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#111217]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-white/35 hover:bg-[#181a22]"
                aria-label={PERSONAL_TEXT.nextAria}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              <div
                className={cn(
                  'relative overflow-hidden transition-[height] duration-300 ease-out',
                  expandedTrainerId === null ? 'h-[760px]' : 'h-[980px]'
                )}
                {...swipeHandlers}
              >
                {filteredTrainers.map((trainer, index) => {
                  const offset = getSlideOffset(index);
                  const isActive = offset === 0;

                  return (
                    <article
                      key={trainer.id}
                      className={`trainer-slide-motion absolute left-1/2 top-8 w-[72%] max-w-[24rem] will-change-transform transition-[transform,opacity] duration-700 ease-out ${
                        isActive
                          ? 'z-20 -translate-x-1/2 scale-100 opacity-100'
                          : offset === -1
                            ? 'z-10 -translate-x-[124%] scale-92 opacity-35'
                            : offset === 1
                              ? 'z-10 translate-x-[24%] scale-92 opacity-35'
                              : 'pointer-events-none z-0 -translate-x-1/2 scale-90 opacity-0'
                      }`}
                    >
                      {renderCarouselTrainerCard(trainer, isActive, !isActive)}
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}

          {!isDesktopViewport ? (
            <div className="mt-3 flex items-center justify-center gap-6 md:-mx-6 md:mt-4 md:gap-3">
              {isMobileViewport ? (
                <button
                  type="button"
                  onClick={prevSlide}
                  className="trainer-control-motion flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                  aria-label={PERSONAL_TEXT.prevAria}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-400" />
                </button>
              ) : null}

              <div className="flex flex-wrap justify-center gap-3">
                {filteredTrainers.map((trainer, index) => (
                  <button
                    key={trainer.id}
                    type="button"
                    onClick={() => selectTrainerIndex(index)}
                    className={`trainer-control-motion h-1 rounded-full transition-[width,background-color,opacity] duration-300 ${
                      index === activeTrainerIndex
                        ? 'w-16 bg-gradient-to-r from-[#F5B800] to-[#D89B00]'
                        : 'w-8 bg-white/20'
                    }`}
                    aria-label={`${PERSONAL_TEXT.selectAriaPrefix} ${index + 1}`}
                  />
                ))}
              </div>

              {isMobileViewport ? (
                <button
                  type="button"
                  onClick={nextSlide}
                  className="trainer-control-motion flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                  aria-label={PERSONAL_TEXT.nextAria}
                >
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </button>
              ) : null}
            </div>
          ) : null}

          {isDesktopViewport ? (
            <div className="space-y-12">
              {filteredTrainers.map((trainer) => (
                <article
                  key={trainer.id}
                  className="min-h-[18.5rem] overflow-hidden rounded-[26px] border border-white/10 bg-[#111217] sm:min-h-[21rem] sm:rounded-[28px] md:min-h-[24rem] lg:min-h-0 lg:rounded-[30px]"
                >
                  <div
                    className="h-full gap-3 sm:gap-4 md:gap-6 lg:gap-10"
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}
                  >
                    <div
                      className="flex shrink-0 items-center justify-center"
                      style={{ flex: '0 0 clamp(8.5rem, 34vw, 24rem)' }}
                    >
                      <div className="relative aspect-[4/5] h-full w-full max-w-[24rem] overflow-hidden rounded-l-[26px] rounded-r-none border border-white/10 bg-black/40 sm:rounded-l-[28px] lg:rounded-l-[30px]">
                        {trainer.image ? (
                          <PublicAssetImage
                            src={trainer.image}
                            alt={trainer.name}
                            loading="lazy"
                            fetchPriority="low"
                            sizes="(max-width: 1279px) 34vw, 24rem"
                            variantSuffix="preview"
                            deferUntilVisible
                            pictureClassName="absolute inset-0 block h-full w-full"
                            className={cn('h-full w-full object-cover object-center', trainer.imageClassName)}
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A27] via-[#111117] to-[#0A0A0F]">
                            <span className="text-6xl font-black leading-none text-[#F5B800] md:text-7xl">
                              {String(trainer.id).padStart(2, '0')}
                            </span>
                            <span className="mt-3 text-xs uppercase tracking-[0.2em] text-gray-300">
                              {PERSONAL_TEXT.placeholderPhoto}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="flex min-w-0 flex-1 flex-col justify-center px-1.5 py-3 sm:px-2 sm:py-4 md:px-3 md:py-5 lg:px-0 lg:py-2"
                      style={{ flex: '1 1 auto' }}
                    >
                      <div className="min-w-0 max-w-none">
                        <div className="flex items-center gap-2">
                          <h3 className="whitespace-nowrap text-[0.95rem] font-extrabold leading-tight text-white sm:text-lg md:text-[1.55rem] lg:text-[2.75rem]">
                            {trainer.name}
                          </h3>
                          {trainer.role ? (
                            <span className="inline-flex shrink-0 items-center rounded-full border border-[#F5B800]/30 bg-[#F5B800]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F5B800] sm:text-[10px] md:text-[11px] lg:text-xs">
                              {trainer.role}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1.5 text-[11px] leading-snug text-gray-300 sm:text-xs md:text-sm lg:text-base">
                          {trainer.experience}
                        </p>
                      </div>

                      <ul className="mt-2.5 space-y-1.5 pr-1 sm:mt-3 sm:space-y-2 md:mt-4 md:space-y-2.5 lg:mt-5 lg:space-y-3">
                        {trainer.achievements.map((achievement, achievementIndex) =>
                          renderAchievement(achievement, achievementIndex)
                        )}
                      </ul>

                      <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8">
                        <button
                          type="button"
                          onClick={() => onOpenModal({ topic: 'personal', trainer: trainer.name })}
                          className="btn-primary w-full px-3 py-2.5 text-[11px] text-white sm:w-full sm:px-4 sm:py-3 sm:text-xs md:w-auto md:px-6 md:text-sm lg:px-7 lg:py-4 lg:text-base"
                        >
                          {PERSONAL_TEXT.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
