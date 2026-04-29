import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Images, X } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useViewportTier } from '@/hooks/useViewportTier';

import { cn } from '@/lib/utils';
import type { OpenModalHandler } from '@/types/modal';

interface HeroProps {
  onOpenModal: OpenModalHandler;
}

const HERO_ASSETS = {
  background: {
    avif: `${import.meta.env.BASE_URL}mainhero/hbg.avif`,
    webp: `${import.meta.env.BASE_URL}mainhero/hbg.webp`,
    png: `${import.meta.env.BASE_URL}mainhero/hbg.png`,
    avifSrcSet: [
      `${import.meta.env.BASE_URL}mainhero/hbg-w480.avif 480w`,
      `${import.meta.env.BASE_URL}mainhero/hbg-w768.avif 768w`,
      `${import.meta.env.BASE_URL}mainhero/hbg-w1024.avif 1024w`,
      `${import.meta.env.BASE_URL}mainhero/hbg-w1280.avif 1280w`,
      `${import.meta.env.BASE_URL}mainhero/hbg.avif 1536w`,
    ].join(', '),
    webpSrcSet: [
      `${import.meta.env.BASE_URL}mainhero/hbg-w480.webp 480w`,
      `${import.meta.env.BASE_URL}mainhero/hbg-w768.webp 768w`,
      `${import.meta.env.BASE_URL}mainhero/hbg-w1024.webp 1024w`,
      `${import.meta.env.BASE_URL}mainhero/hbg-w1280.webp 1280w`,
      `${import.meta.env.BASE_URL}mainhero/hbg.webp 1536w`,
    ].join(', '),
  },
  card: {
    avif: `${import.meta.env.BASE_URL}mainhero/card.avif`,
    webp: `${import.meta.env.BASE_URL}mainhero/card.webp`,
    png: `${import.meta.env.BASE_URL}mainhero/card.png`,
    avifSrcSet: [
      `${import.meta.env.BASE_URL}mainhero/card-w480.avif 480w`,
      `${import.meta.env.BASE_URL}mainhero/card-w768.avif 768w`,
      `${import.meta.env.BASE_URL}mainhero/card-w1024.avif 1024w`,
      `${import.meta.env.BASE_URL}mainhero/card.avif 1280w`,
    ].join(', '),
    webpSrcSet: [
      `${import.meta.env.BASE_URL}mainhero/card-w480.webp 480w`,
      `${import.meta.env.BASE_URL}mainhero/card-w768.webp 768w`,
      `${import.meta.env.BASE_URL}mainhero/card-w1024.webp 1024w`,
      `${import.meta.env.BASE_URL}mainhero/card.webp 1280w`,
    ].join(', '),
  },
  cardAlt: 'Клубная карта Ultra Pro',
} as const;

const HERO_TEXT = {
  titleStart: 'ФИТНЕСС-КЛУБ',
  titleAccent: 'НОВОГО УРОВНЯ',
  description:
    'Современное оборудование, профессиональные тренеры и программы для любого уровня подготовки',
  cta: 'Первое занятие бесплатно',
  galleryCta: 'Галерея клуба',
  scrollHintAria: 'Прокрутить к разделам',
  cardInfoTitle: 'КАРТА КЛУБА',
  cardInfoDescription:
    'Эта карта является вашим пропуском в фитнес-клуб Ultra Pro и подтверждает доступ к выбранному формату посещения. Пожалуйста, бережно храните карту и берите ее с собой при каждом визите.',
  cardInfoDetails:
    'Не теряйте карту: в случае утери или повреждения обратитесь к администратору на ресепшене для восстановления и повторной активации доступа.',
  openCardInfoAria: 'Открыть информацию о клубной карте',
  cardRestoreNote: '*стоимость восстановления карты после утери - 500 рублей',
} as const;

export default function Hero({ onOpenModal }: HeroProps) {
  const [isCardInfoOpen, setIsCardInfoOpen] = useState(false);
  const [isTabletHeroScrollHintVisible, setIsTabletHeroScrollHintVisible] = useState(false);
  const viewportTier = useViewportTier();
  const isDesktopViewport = viewportTier === 'desktop';

  const handleScrollToGallery = () => {
    document.getElementById('flors-anchor')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleScrollToSections = () => {
    document.getElementById('home-previews')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

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

  useEffect(() => {
    if (!isCardInfoOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCardInfoOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCardInfoOpen]);

  return (
    <>
      <section className="relative flex min-h-[100svh] items-center overflow-hidden gradient-bg-radial">
        <picture className="hero-media-layer absolute inset-0 z-0">
          {!isDesktopViewport ? <source type="image/avif" srcSet={HERO_ASSETS.background.avifSrcSet} sizes="100vw" /> : null}
          {!isDesktopViewport ? <source type="image/webp" srcSet={HERO_ASSETS.background.webpSrcSet} sizes="100vw" /> : null}
          <img
            src={HERO_ASSETS.background.png}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </picture>
        <div className="hero-overlay-layer absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(5,6,10,0.78)_0%,rgba(6,7,11,0.68)_42%,rgba(5,6,10,0.8)_100%)]" />
        <div className="hero-glow-layer">
          <div className="hero-glow-top-right" />
          <div className="hero-glow-bottom-left" />
          <div className="hero-glow-center" />
        </div>

        <div className="relative z-30 mx-auto w-full max-w-7xl px-4 pt-24 pb-14 sm:px-6 md:max-lg:flex md:max-lg:min-h-[calc(100svh-13rem)] md:max-lg:flex-col md:max-lg:justify-between md:max-lg:px-10 md:max-lg:pt-32 md:max-lg:pb-20 lg:px-8 lg:pt-32 lg:pb-16">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="space-y-8 slide-up max-md:w-full max-md:max-w-full max-md:space-y-7 md:max-lg:mx-auto md:max-lg:max-w-[min(94vw,860px)] md:max-lg:space-y-11 lg:max-w-[40rem]">
              <BalancedHeading
                as="h1"
                className="section-title text-white max-md:max-w-full max-md:text-[clamp(2.35rem,9vw,3.2rem)] max-md:leading-[0.96] md:max-lg:max-w-full md:max-lg:text-[clamp(4.4rem,9.4vw,6.2rem)] md:max-lg:leading-[0.9] lg:text-[clamp(3.45rem,4.15vw,4.55rem)] lg:leading-[0.94]"
              >
                <span className="block whitespace-nowrap">{HERO_TEXT.titleStart}</span>
                <HeadingAccent className="inline-block whitespace-nowrap">{HERO_TEXT.titleAccent}</HeadingAccent>
              </BalancedHeading>

              <p className="max-w-lg text-lg text-gray-400 leading-relaxed max-md:max-w-full max-md:text-[1.12rem] max-md:leading-[1.42] md:text-xl md:max-lg:max-w-[48rem] md:max-lg:text-[1.6rem] md:max-lg:leading-[1.34]">
                {HERO_TEXT.description}
              </p>


              <div className="flex flex-col gap-4 sm:flex-row md:max-lg:gap-4">
                <button
                  type="button"
                  onClick={() => onOpenModal({ topic: 'free_trial' })}
                  className="btn-white inline-flex items-center justify-center gap-2 group md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg"
                >
                  {HERO_TEXT.cta}
                  <ArrowRight className="w-4 h-4 transition-transform md:max-lg:h-5 md:max-lg:w-5 lg:group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={handleScrollToGallery}
                  className="btn-primary inline-flex items-center justify-center gap-2 text-white group md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg"
                >
                  {HERO_TEXT.galleryCta}
                  <Images className="w-4 h-4 transition-transform md:max-lg:h-5 md:max-lg:w-5 lg:group-hover:scale-110" />
                </button>
              </div>
            </div>

            {isDesktopViewport ? (
              <div className="relative pb-10 lg:pb-14">
                <div className="relative z-10 float-animation flex justify-end lg:pr-2">
                  <button
                    type="button"
                    onClick={() => setIsCardInfoOpen(true)}
                    aria-label={HERO_TEXT.openCardInfoAria}
                    className="group relative inline-flex w-[116%] max-w-[42rem] justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
                  >
                    <picture className="block w-full">
                      {!isDesktopViewport ? (
                        <source
                          type="image/avif"
                          srcSet={HERO_ASSETS.card.avifSrcSet}
                          sizes="(min-width: 1024px) 54vw, 100vw"
                        />
                      ) : null}
                      {!isDesktopViewport ? (
                        <source
                          type="image/webp"
                          srcSet={HERO_ASSETS.card.webpSrcSet}
                          sizes="(min-width: 1024px) 54vw, 100vw"
                        />
                      ) : null}
                      <img
                        src={HERO_ASSETS.card.png}
                        alt={HERO_ASSETS.cardAlt}
                        width={1280}
                        height={853}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full object-contain drop-shadow-[0_18px_48px_rgba(0,0,0,0.55)]"
                      />
                    </picture>
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="hidden min-h-[5.5rem] items-end justify-center md:max-lg:flex">
            <button
              type="button"
              onClick={handleScrollToSections}
              aria-label={HERO_TEXT.scrollHintAria}
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

      {isCardInfoOpen && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsCardInfoOpen(false)}
          />

          <div
            className="relative mx-auto my-auto max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#111117] p-6 sm:max-h-[calc(100vh-3rem)] sm:max-h-[calc(100dvh-3rem)] sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsCardInfoOpen(false)}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors lg:hover:bg-white/20"
              aria-label="Закрыть информацию о карте"
            >
              <X className="h-4 w-4 text-white" />
            </button>

            <BalancedHeading as="h3" className="pr-10 text-xl font-bold text-white">
              {HERO_TEXT.cardInfoTitle}
            </BalancedHeading>

            <div className="mt-2 flex justify-center py-1">
              <picture className="block w-full max-w-[260px] sm:max-w-[300px]">
                <source
                  type="image/avif"
                  srcSet={HERO_ASSETS.card.avifSrcSet}
                  sizes="(max-width: 639px) 70vw, 300px"
                />
                <source
                  type="image/webp"
                  srcSet={HERO_ASSETS.card.webpSrcSet}
                  sizes="(max-width: 639px) 70vw, 300px"
                />
                <img
                  src={HERO_ASSETS.card.png}
                  alt={HERO_ASSETS.cardAlt}
                  width={1280}
                  height={853}
                  loading="lazy"
                  decoding="async"

                  className="h-auto w-full object-contain"
                />
              </picture>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">{HERO_TEXT.cardInfoDescription}</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">{HERO_TEXT.cardInfoDetails}</p>
            <p className="mt-4 text-xs text-gray-500">{HERO_TEXT.cardRestoreNote}</p>
          </div>
        </div>
      )}
    </>
  );
}
