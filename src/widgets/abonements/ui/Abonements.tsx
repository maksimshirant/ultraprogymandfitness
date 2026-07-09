import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CircleHelp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  HeartPulse,
  Snowflake,
  Swords,
  Users,
} from 'lucide-react';
import { memberships } from '@/content/memberships';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useViewportTier } from '@/hooks/useViewportTier';
import { cn } from '@/lib/utils';
import type { OpenModalHandler } from '@/types/modal';

const ABONEMENTS_TEXT = {
  heroTitle: 'Абонементы',
  heroAccent: 'Ultra Pro',
  heroSubtitle:
    'Форматы посещения под быстрый старт, стабильный тренировочный ритм и долгий системный прогресс. Сравните условия и выберите удобный режим занятий.',
  heroPrimaryCta: 'Я знаю что мне нужно',
  heroSecondaryCta: 'Показать все абонементы',
  heroScrollHintAria: 'Прокрутить к списку абонементов',
  sectionTitle: '',
  sectionTitleAccent: 'Абонементы',
  sectionSubtitle: 'Выберите формат посещения под ваш график, цель и темп тренировок.',
  cta: 'Приобрести абонемент',
  prevAria: 'Предыдущий абонемент',
  nextAria: 'Следующий абонемент',
  selectAriaPrefix: 'Выбрать абонемент',
} as const;

interface AbonementsProps {
  onOpenModal: OpenModalHandler;
}

function getModeIcon(mode: string) {
  const value = mode.toLowerCase();
  if (value.includes('тренажер')) return Dumbbell;
  if (value.includes('группов')) return Users;
  if (value.includes('сауна')) return Flame;
  if (value.includes('кроссфит')) return Dumbbell;
  if (value.includes('кардио')) return HeartPulse;
  if (value.includes('единоборств')) return Swords;
  if (value.includes('замороз')) return Snowflake;
  return Dumbbell;
}

export default function Abonements({ onOpenModal }: AbonementsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTabletHeroScrollHintVisible, setIsTabletHeroScrollHintVisible] = useState(false);
  const viewportTier = useViewportTier();
  const isMobileViewport = viewportTier === 'mobile';

  useEffect(() => {
    const syncTabletHeroScrollHintVisibility = () => {
      const isTabletViewport = window.innerWidth >= 768 && window.innerWidth < 1024;
      const nextVisibility = isTabletViewport && window.scrollY < 24;
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

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % memberships.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + memberships.length) % memberships.length);

  const scrollToSubscriptions = () => {
    document.getElementById('subscriptions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectAbonementIndex = (index: number) => setCurrentIndex(index);

  const getSlideOffset = (index: number) => {
    let offset = index - currentIndex;
    const half = Math.floor(memberships.length / 2);
    if (offset > half) offset -= memberships.length;
    if (offset < -half) offset += memberships.length;
    return offset;
  };

  const swipeHandlers = useSwipeNavigation({ onNext: nextSlide, onPrev: prevSlide });

  return (
    <div className="relative overflow-x-clip">
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <div className="hero-glow-layer">
          <div className="hero-glow-top-right" />
          <div className="hero-glow-bottom-left" />
          <div className="hero-glow-center" />
        </div>

        <div className="relative z-30 mx-auto w-full max-w-7xl px-4 pb-14 pt-24 sm:px-6 md:max-lg:flex md:max-lg:min-h-[calc(100svh-13rem)] md:max-lg:flex-col md:max-lg:justify-between md:max-lg:px-10 md:max-lg:pb-20 md:max-lg:pt-32 lg:px-8 lg:pb-16 lg:pt-32">
          <div className="space-y-8 max-md:w-full max-md:max-w-full max-md:space-y-7 md:max-lg:mx-auto md:max-lg:max-w-[min(94vw,860px)] md:max-lg:space-y-11">
            <BalancedHeading
              as="h1"
              className="section-title text-white max-md:text-[clamp(2.1rem,8.8vw,3.3rem)] max-md:leading-[0.98] md:max-lg:max-w-full md:max-lg:text-[clamp(4.4rem,9.4vw,6.2rem)] md:max-lg:leading-[0.9] lg:text-[clamp(4.6rem,6.6vw,6.8rem)] lg:leading-[0.9]"
            >
              {ABONEMENTS_TEXT.heroTitle} <HeadingAccent>{ABONEMENTS_TEXT.heroAccent}</HeadingAccent>
            </BalancedHeading>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-200 sm:text-lg md:max-lg:max-w-[48rem] md:max-lg:text-[1.6rem] md:max-lg:leading-[1.34] lg:text-xl">
              {ABONEMENTS_TEXT.heroSubtitle}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row md:max-lg:gap-4">
              <button
                type="button"
                onClick={() => onOpenModal({ topic: 'membership' })}
                className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 text-white md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg"
              >
                {ABONEMENTS_TEXT.heroPrimaryCta}
                <ArrowRight className="h-4 w-4 md:max-lg:h-5 md:max-lg:w-5" />
              </button>
              <button
                type="button"
                onClick={scrollToSubscriptions}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white transition-colors md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg lg:hover:border-white/30 lg:hover:bg-white/[0.08]"
              >
                {ABONEMENTS_TEXT.heroSecondaryCta}
              </button>
            </div>
          </div>

          <div className="hidden min-h-[5.5rem] items-end justify-center md:max-lg:flex">
            <button
              type="button"
              onClick={scrollToSubscriptions}
              aria-label={ABONEMENTS_TEXT.heroScrollHintAria}
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

      <section id="subscriptions" className="relative overflow-x-clip scroll-mt-24 pt-10 pb-20 md:pt-14 md:pb-24 lg:pb-28">
        <div className="hero-glow-layer">
          <div className="hero-glow-top-right" />
          <div className="hero-glow-bottom-left" />
          <div className="hero-glow-center" />
        </div>

        <div className="relative mx-auto max-w-7xl px-0 lg:px-8">
          <div className="text-center">
            <BalancedHeading as="h2" className="section-title text-white">
              {ABONEMENTS_TEXT.sectionTitle} <HeadingAccent>{ABONEMENTS_TEXT.sectionTitleAccent}</HeadingAccent>
            </BalancedHeading>
            <p className="section-subtitle mx-auto">{ABONEMENTS_TEXT.sectionSubtitle}</p>
          </div>

          <div
            id="subscriptions-carousel"
            className="relative w-full overflow-x-clip scroll-mt-24"
            style={{ contain: 'layout paint', isolation: 'isolate' }}
          >
            {!isMobileViewport ? (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="abonement-control-motion absolute left-3 top-[21rem] z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#111217]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-white/35 hover:bg-[#181a22] lg:left-0"
                  aria-label={ABONEMENTS_TEXT.prevAria}
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="abonement-control-motion absolute right-3 top-[21rem] z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#111217]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-white/35 hover:bg-[#181a22] lg:right-0"
                  aria-label={ABONEMENTS_TEXT.nextAria}
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            ) : null}

            <div className="relative h-[760px] overflow-hidden sm:h-[700px] md:max-lg:h-[840px] lg:h-[760px] 2xl:h-[860px]" {...swipeHandlers}>
              {memberships.map((abonement, index) => {
                const offset = getSlideOffset(index);
                const isActive = offset === 0;
                const standardBenefitsLabel = 'Все преимущества стандартного абонемента';
                const standardModes = memberships[0]?.modes ?? [];
                const standardModesSet = new Set(standardModes);
                const additionalModes = index === 0 ? [] : abonement.modes.filter((mode) => !standardModesSet.has(mode));
                const displayModes = index === 0 ? abonement.modes : [standardBenefitsLabel, ...additionalModes];

                return (
                  <article
                    key={abonement.id}
                    className={`abonement-slide-motion absolute left-1/2 top-12 w-[88%] max-w-[30rem] will-change-transform transition-[transform,opacity] duration-700 ease-out sm:w-[72%] md:top-16 md:w-[56%] lg:w-[52%] ${
                      isActive
                        ? 'z-20 -translate-x-1/2 scale-100 opacity-100'
                        : offset === -1
                          ? 'z-10 -translate-x-[118%] scale-92 opacity-35'
                          : offset === 1
                            ? 'z-10 translate-x-[14%] scale-92 opacity-35'
                            : 'pointer-events-none z-0 -translate-x-1/2 scale-90 opacity-0'
                    }`}
                  >
                    <div
                      className={`glass-card flex flex-col p-4 md:p-6 ${
                        isActive
                          ? 'abonement-card-active border border-[#F5B800]/70 shadow-[0_0_28px_rgba(245,184,0,0.26)]'
                          : 'border border-white/5'
                      }`}
                    >
                      <BalancedHeading
                        as="h3"
                        className={cn(
                          'font-extrabold leading-tight text-white',
                          abonement.id === 5 ? 'whitespace-nowrap text-[1.3rem] md:text-[1.9rem]' : 'text-[2rem] md:text-4xl'
                        )}
                      >
                        {abonement.title}
                      </BalancedHeading>

                      <div className="mt-3">
                        <span className="relative inline-flex items-end gap-2">
                          <span className="relative z-10 text-[2.2rem] font-black text-[rgb(255,255,255,0.82)] md:text-5xl">{abonement.price}</span>
                          <span className="absolute bottom-1 left-0 right-0 z-0 h-1.5 bg-gradient-to-r from-[#F5B800] to-[#D89B00]" />
                        </span>
                      </div>

                      <p className="mb-3 mt-3 text-[0.95rem] text-gray-300 md:mb-4 md:mt-4 md:text-sm">{abonement.note}</p>

                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {displayModes.map((mode, modeIndex) => {
                          const isStandardBenefitsChip = index > 0 && mode === standardBenefitsLabel;
                          const ModeIcon = getModeIcon(mode);

                          return (
                            <span
                              key={`${abonement.id}-${modeIndex}-${mode}`}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#F5B800]/35 bg-[#0e1118]/88 px-2.5 py-1.5 text-[10px] leading-tight text-gray-200 sm:text-xs"
                            >
                              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0b0e14] text-[#F5B800]">
                                <ModeIcon className="h-3 w-3" />
                              </span>
                              <span className="text-left">{mode}</span>
                              {isStandardBenefitsChip ? (
                                <button
                                  type="button"
                                  onClick={() => setCurrentIndex(0)}
                                  aria-label="Перейти к абонементу 1 месяц"
                                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-300 transition-colors hover:text-white"
                                >
                                  <CircleHelp className="h-4 w-4" />
                                </button>
                              ) : null}
                            </span>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenModal({ topic: abonement.topicValue, membershipId: abonement.id })}
                        disabled={!isActive}
                        className="btn-primary mt-3 w-full text-white transition-none hover:shadow-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {ABONEMENTS_TEXT.cta}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="relative z-40 -mt-[7rem] flex items-center justify-center gap-4 md:-mt-[8.5rem] md:gap-3 lg:-mt-[6.5rem] 2xl:mt-10">
              {isMobileViewport ? (
                <button
                  type="button"
                  onClick={prevSlide}
                  className="abonement-control-motion ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                  aria-label={ABONEMENTS_TEXT.prevAria}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-400" />
                </button>
              ) : null}

              <div className="flex flex-wrap justify-center gap-2">
                {memberships.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectAbonementIndex(index)}
                    className={`abonement-control-motion rounded-full transition-[transform,background-color,opacity] duration-300 ${
                      index === currentIndex
                        ? 'h-2.5 w-2.5 scale-110 bg-gradient-to-r from-[#F5B800] to-[#D89B00]'
                        : 'h-2 w-2 bg-white/35'
                    }`}
                    aria-label={`${ABONEMENTS_TEXT.selectAriaPrefix} ${index + 1}`}
                  />
                ))}
              </div>

              {isMobileViewport ? (
                <button
                  type="button"
                  onClick={nextSlide}
                  className="abonement-control-motion mr-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                  aria-label={ABONEMENTS_TEXT.nextAria}
                >
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
