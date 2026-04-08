import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import PublicAssetImage from '@/components/PublicAssetImage';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useViewportTier } from '@/hooks/useViewportTier';

interface HeroProps {
  onOpenModal: () => void;
}

const HERO_ASSETS = {
  background: `${import.meta.env.BASE_URL}фон.png`,
  card: `${import.meta.env.BASE_URL}card.png`,
  cardAlt: 'Клубная карта Ultra Pro',
} as const;

const HERO_TEXT = {
  titleStart: 'ТВОЙ ПРОГРЕСС -',
  titleAccent: 'НАША СИСТЕМА',
  description:
    'Сделайте первый шаг к своей цели уже сегодня. Наша команда тренеров и оснащение зала создадут условия для уверенного прогресса.',
  cta: 'Стать клиентом Ultra Pro',
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
  const viewportTier = useViewportTier();
  const isDesktopViewport = viewportTier === 'desktop';

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
      <section className="relative min-h-[100svh] flex items-center overflow-hidden gradient-bg-radial">
        <PublicAssetImage
          src={HERO_ASSETS.background}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          pictureClassName="hero-media-layer absolute inset-0 z-0"
          className="h-full w-full object-cover object-center"
        />
        <div className="hero-overlay-layer absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(5,6,10,0.78)_0%,rgba(6,7,11,0.68)_42%,rgba(5,6,10,0.8)_100%)]" />

        <div className="relative z-30 max-w-7xl mx-auto px-4 pt-24 pb-14 sm:px-6 md:pt-28 md:pb-16 md:max-lg:px-8 md:max-lg:pt-28 md:max-lg:pb-16 lg:px-8 lg:pt-32 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 slide-up max-md:w-full max-md:max-w-full max-md:space-y-7 md:max-lg:mx-auto md:max-lg:max-w-[min(90vw,700px)] md:max-lg:space-y-9">
              <BalancedHeading
                as="h1"
                className="section-title text-white max-md:max-w-full max-md:text-[clamp(2.35rem,9vw,3.2rem)] max-md:leading-[0.96] md:max-lg:max-w-full md:max-lg:text-[clamp(3.8rem,8.6vw,5.6rem)] md:max-lg:leading-[0.92]"
              >
                <span className="block">{HERO_TEXT.titleStart}</span>
                <HeadingAccent className="inline-block whitespace-nowrap">{HERO_TEXT.titleAccent}</HeadingAccent>
              </BalancedHeading>

              <p className="text-lg md:text-xl text-gray-400 max-w-lg max-md:max-w-full max-md:text-[1.12rem] max-md:leading-[1.42] md:max-lg:max-w-[44rem] md:max-lg:text-[1.65rem] md:max-lg:leading-[1.35]">
                {HERO_TEXT.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onOpenModal}
                  className="btn-white inline-flex items-center justify-center gap-2 group md:max-lg:px-9 md:max-lg:py-5 md:max-lg:text-lg"
                >
                  {HERO_TEXT.cta}
                  <ArrowRight className="w-4 h-4 lg:group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            {isDesktopViewport ? (
              <div className="relative pb-10 lg:pb-14">
                <div className="relative z-10 float-animation flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsCardInfoOpen(true)}
                    aria-label={HERO_TEXT.openCardInfoAria}
                    className="group relative inline-flex w-[148%] max-w-none justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] md:max-lg:w-[170%]"
                  >
                    <PublicAssetImage
                      src={HERO_ASSETS.card}
                      alt={HERO_ASSETS.cardAlt}
                      loading="lazy"
                      sizes="(min-width: 1024px) 54vw, 100vw"
                      showPlaceholder={false}
                      pictureClassName="block w-full"
                      className="w-full h-auto object-contain drop-shadow-[0_18px_48px_rgba(0,0,0,0.55)]"
                    />
                  </button>
                </div>
              </div>
            ) : null}
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
            className="relative w-full max-w-md mx-auto my-auto overflow-y-auto max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100vh-3rem)] sm:max-h-[calc(100dvh-3rem)] rounded-2xl border border-white/10 bg-[#111117] p-6 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsCardInfoOpen(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 lg:hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Закрыть информацию о карте"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <BalancedHeading as="h3" className="text-xl font-bold text-white pr-10">
              {HERO_TEXT.cardInfoTitle}
            </BalancedHeading>
            <div className="flex justify-center py-1 mt-2">
              <PublicAssetImage
                src={HERO_ASSETS.card}
                alt={HERO_ASSETS.cardAlt}
                loading="lazy"
                sizes="(max-width: 639px) 70vw, 300px"
                showPlaceholder={false}
                pictureClassName="block w-full max-w-[260px] sm:max-w-[300px]"
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {HERO_TEXT.cardInfoDescription}
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mt-3">
              {HERO_TEXT.cardInfoDetails}
            </p>
            <p className="text-xs text-gray-500 mt-4">
              {HERO_TEXT.cardRestoreNote}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
