import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';

interface HeroProps {
  onOpenModal: () => void;
}

const HERO_ASSETS = {
  card: `${import.meta.env.BASE_URL}card.png`,
  cardAlt: 'Fitness Card',
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
      <section className="relative min-h-screen flex items-center overflow-hidden gradient-bg-radial">
        <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none lg:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(245,184,0,0.26)_0%,rgba(245,184,0,0.12)_34%,transparent_72%)]" />
          <div className="absolute top-[-110px] right-[-70px] w-[360px] h-[360px] rounded-full bg-[#F5B800]/20 blur-[80px]" />
          <div className="absolute bottom-[-140px] left-[-90px] w-[420px] h-[420px] rounded-full bg-[#F5B800]/18 blur-[90px]" />
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#F5B800]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#F5B800]/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F5B800]/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[4.5rem] md:py-[5.6rem]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 slide-up">
              <BalancedHeading as="h1" className="section-title text-white">
                {HERO_TEXT.titleStart}{' '}
                <HeadingAccent>{HERO_TEXT.titleAccent}</HeadingAccent>
              </BalancedHeading>

              <p className="text-lg md:text-xl text-gray-400 max-w-lg">
                {HERO_TEXT.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onOpenModal}
                  className="btn-white inline-flex items-center justify-center gap-2 group"
                >
                  {HERO_TEXT.cta}
                  <ArrowRight className="w-4 h-4 lg:group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="relative pb-10 lg:pb-14">
              <div className="relative z-10 float-animation flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsCardInfoOpen(true)}
                  aria-label={HERO_TEXT.openCardInfoAria}
                  className="group relative inline-flex w-[148%] max-w-none justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
                >
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-3 w-[62%] h-10 rounded-full bg-black/55 blur-md opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 w-[52%] h-6 rounded-full bg-gradient-to-r from-transparent via-[#F5B800]/45 to-transparent blur-sm opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute -top-4 right-[8%] w-20 h-20 bg-[#F5B800]/30 rounded-full blur-xl opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute -bottom-8 left-[10%] w-32 h-32 bg-[#F5B800]/20 rounded-full blur-xl opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <img
                    src={HERO_ASSETS.card}
                    alt={HERO_ASSETS.cardAlt}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-auto object-contain drop-shadow-[0_18px_48px_rgba(0,0,0,0.55)]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isCardInfoOpen && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsCardInfoOpen(false)}
          />

          <div
            className="relative w-full max-w-md mx-4 rounded-2xl border border-white/10 bg-[#111117] p-6 sm:p-7"
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
              <img
                src={HERO_ASSETS.card}
                alt={HERO_ASSETS.cardAlt}
                loading="lazy"
                decoding="async"
                className="w-full max-w-[260px] sm:max-w-[300px] h-auto object-contain"
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
