
import { useEffect, useState } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
  showMore: 'Показать больше',
  showLess: 'Скрыть',
  prevAria: 'Предыдущий абонемент',
  nextAria: 'Следующий абонемент',
  selectAriaPrefix: 'Выбрать абонемент',
} as const;

const PREVIEW_MODES_COUNT = 3;

interface AbonementsProps {
  onOpenModal: OpenModalHandler;
}

export default function Abonements({ onOpenModal }: AbonementsProps) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [expandedAbonementId, setExpandedAbonementId] = useState<number | null>(null);

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

  const nextSlide = () => {
    setExpandedAbonementId(null);
    setCurrentIndex((prev) => (prev + 1) % memberships.length);
  };

  const prevSlide = () => {
    setExpandedAbonementId(null);

    setCurrentIndex((prev) => (prev - 1 + memberships.length) % memberships.length);
  };

  const scrollToSubscriptions = () => {
    document.getElementById('subscriptions')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const selectAbonementIndex = (index: number) => {
    setCurrentIndex(index);
    setExpandedAbonementId(null);
  };

  const getSlideOffset = (index: number) => {
    let offset = index - currentIndex;
    const half = Math.floor(memberships.length / 2);

    if (offset > half) {
      offset -= memberships.length;
    }
    if (offset < -half) {
      offset += memberships.length;
    }

    return offset;
  };

  const swipeHandlers = useSwipeNavigation({
    onNext: nextSlide,
    onPrev: prevSlide,
  });

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
              className="section-title text-white max-md:text-[clamp(2.8rem,10vw,4rem)] max-md:leading-[0.94] md:max-lg:max-w-full md:max-lg:text-[clamp(4.4rem,9.4vw,6.2rem)] md:max-lg:leading-[0.9] lg:text-[clamp(4.6rem,6.6vw,6.8rem)] lg:leading-[0.9]"
            >
              {ABONEMENTS_TEXT.heroTitle} <HeadingAccent>{ABONEMENTS_TEXT.heroAccent}</HeadingAccent>
            </BalancedHeading>
            <p className="max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg md:max-lg:max-w-[48rem] md:max-lg:text-[1.6rem] md:max-lg:leading-[1.34] lg:text-xl">
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

      <section id="subscriptions" className="relative overflow-hidden scroll-mt-24 py-10 md:py-14">
        <div className="hero-glow-layer">
          <div className="hero-glow-top-right" />
          <div className="hero-glow-bottom-left" />
          <div className="hero-glow-center" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BalancedHeading as="h2" className="section-title text-white">
              {ABONEMENTS_TEXT.sectionTitle} <HeadingAccent>{ABONEMENTS_TEXT.sectionTitleAccent}</HeadingAccent>
            </BalancedHeading>
            <p className="section-subtitle mx-auto">{ABONEMENTS_TEXT.sectionSubtitle}</p>
          </div>

          <div id="subscriptions-carousel" className="relative w-full scroll-mt-24">
            {!isMobileViewport ? (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="abonement-control-motion absolute left-0 top-[21rem] z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#111217]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-white/35 hover:bg-[#181a22]"
                  aria-label={ABONEMENTS_TEXT.prevAria}
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="abonement-control-motion absolute right-0 top-[21rem] z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#111217]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-white/35 hover:bg-[#181a22]"
                  aria-label={ABONEMENTS_TEXT.nextAria}
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            ) : null}

            <div
              className={cn(
                'relative overflow-hidden transition-[height] duration-300 ease-out',
                expandedAbonementId === null
                  ? 'h-[620px] sm:h-[610px] md:h-[590px]'
                  : 'h-[820px] sm:h-[800px] md:h-[760px]'
              )}
              {...swipeHandlers}
            >
              {memberships.map((abonement, index) => {
                const offset = getSlideOffset(index);
                const Icon = abonement.icon;
                const isActive = offset === 0;
                const hasHiddenModes = abonement.modes.length > PREVIEW_MODES_COUNT;
                const isExpanded = isActive && expandedAbonementId === abonement.id;

                return (
                  <article
                    key={abonement.id}
                    className={`abonement-slide-motion absolute left-1/2 top-12 md:top-16 w-[88%] max-w-[30rem] will-change-transform transition-[transform,opacity] duration-700 ease-out sm:w-[72%] md:w-[62%] ${
                      isActive
                        ? 'z-20 -translate-x-1/2 scale-100 opacity-100'
                        : offset === -1
                          ? 'z-10 -translate-x-[122%] scale-92 opacity-35'
                          : offset === 1
                            ? 'z-10 translate-x-[22%] scale-92 opacity-35'
                            : 'pointer-events-none z-0 -translate-x-1/2 scale-90 opacity-0'
                    }`}
                  >
                    <div
                      className={`glass-card flex flex-col p-5 transition-[height] duration-300 md:p-6 ${
                        isActive
                          ? 'abonement-card-active border border-[#F5B800]/30'
                          : 'border border-white/5'
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          <Icon className="h-4 w-4 text-[#F5B800]" />
                          <span className="text-xs font-medium tracking-wide text-gray-200">{abonement.label}</span>
                        </div>
                      </div>

                      <BalancedHeading
                        as="h3"
                        className={cn(
                          'font-extrabold leading-tight text-white',
                          abonement.id === 5 ? 'whitespace-nowrap text-[1.55rem] md:text-[1.9rem]' : 'text-3xl md:text-4xl'
                        )}
                      >
                        {abonement.title}
                      </BalancedHeading>

                      <div className="mt-3">
                        <span className="relative inline-flex items-end gap-2">
                          <span className="relative z-10 text-4xl font-black text-[rgb(255,255,255,0.82)] md:text-5xl">
                            {abonement.price}
                          </span>
                          <span className="absolute bottom-1 left-0 right-0 z-0 h-1.5 bg-gradient-to-r from-[#F5B800] to-[#D89B00]" />
                        </span>
                      </div>

                      <p className="mb-4 mt-4 text-sm text-gray-300">{abonement.note}</p>

                      <div className="relative">
                        <ul
                          className={cn(
                            'space-y-2 overflow-hidden transition-[max-height] duration-300 ease-out',
                            !isExpanded && hasHiddenModes && 'pointer-events-none'
                          )}
                          style={{
                            maxHeight: isExpanded ? '32rem' : '9.5rem',
                            WebkitMaskImage:
                              !isExpanded && hasHiddenModes
                                ? 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 72%, rgba(0, 0, 0, 0) 100%)'
                                : undefined,
                            maskImage:
                              !isExpanded && hasHiddenModes
                                ? 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 72%, rgba(0, 0, 0, 0) 100%)'
                                : undefined,
                          }}
                        >
                          {abonement.modes.map((mode, modeIndex) => (
                            <li key={modeIndex} className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F5B800] to-[#D89B00]">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-sm leading-relaxed text-gray-300">{mode}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {hasHiddenModes ? (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedAbonementId((prev) => (prev === abonement.id ? null : abonement.id))
                          }
                          disabled={!isActive}
                          aria-expanded={isExpanded}
                          className="mt-3 inline-flex items-center gap-2 self-start text-sm font-medium text-[#F5B800] transition-opacity hover:text-[#FFD351] disabled:pointer-events-none disabled:opacity-45"
                        >
                          <span>{isExpanded ? ABONEMENTS_TEXT.showLess : ABONEMENTS_TEXT.showMore}</span>
                          <ChevronDown
                            className={cn('h-4 w-4 transition-transform duration-300', isExpanded && 'rotate-180')}
                          />
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => onOpenModal({ topic: abonement.topicValue, membershipId: abonement.id })}
                        disabled={!isActive}
                        className="btn-primary mt-4 w-full text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {ABONEMENTS_TEXT.cta}
                      </button>

                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-[0.88125rem] flex items-center justify-center gap-6 md:mt-[2.0125rem] md:gap-3">
              {isMobileViewport ? (
                <button
                  type="button"
                  onClick={prevSlide}
                  className="abonement-control-motion flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                  aria-label={ABONEMENTS_TEXT.prevAria}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-400" />
                </button>
              ) : null}

              <div className="flex flex-wrap justify-center gap-3">
                {memberships.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectAbonementIndex(index)}
                    className={`abonement-control-motion h-1 rounded-full transition-[width,background-color,opacity] duration-300 ${
                      index === currentIndex
                        ? 'w-16 bg-gradient-to-r from-[#F5B800] to-[#D89B00]'
                        : 'w-8 bg-white/20'
                    }`}
                    aria-label={`${ABONEMENTS_TEXT.selectAriaPrefix} ${index + 1}`}
                  />
                ))}
              </div>

              {isMobileViewport ? (
                <button
                  type="button"
                  onClick={nextSlide}
                  className="abonement-control-motion flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
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
