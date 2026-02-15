import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenModal: () => void;
}

const HERO_ASSETS = {
  card: `${import.meta.env.BASE_URL}card.png`,
  cardAlt: 'Fitness Card',
} as const;

const HERO_TEXT = {
  titleStart: 'Твой прогресс -',
  titleAccent: 'наша система',
  description:
    'Сделайте первый шаг к своей цели уже сегодня. Наша команда тренеров и оснащение зала создадут условия для уверенного прогресса.',
  cta: 'Узнать подробности',
} as const;

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-bg-radial">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#F5B800]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#F5B800]/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F5B800]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[4.5rem] md:py-[5.6rem]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 slide-up">
            <h1 className="section-title text-white">
              {HERO_TEXT.titleStart}{' '}
              <span className="relative inline-block">
                <span className="relative z-10">{HERO_TEXT.titleAccent}</span>
                <span className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 md:h-2.5 lg:h-3 bg-gradient-to-r from-[#F5B800] to-[#F5B800] -z-0" />
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-lg">
              {HERO_TEXT.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onOpenModal}
                className="btn-white inline-flex items-center justify-center gap-2 group"
              >
                {HERO_TEXT.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="relative pb-10 lg:pb-14">
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-[80%] h-10 rounded-full bg-black/55 blur-md" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-[70%] h-6 rounded-full bg-gradient-to-r from-transparent via-[#F5B800]/45 to-transparent blur-sm" />
            <div className="relative z-10 float-animation flex justify-center">
              <img
                src={HERO_ASSETS.card}
                alt={HERO_ASSETS.cardAlt}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-[140%] max-w-none h-auto object-contain drop-shadow-[0_18px_48px_rgba(0,0,0,0.55)]"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#F5B800]/30 rounded-full blur-xl pulse-glow" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#F5B800]/20 rounded-full blur-xl pulse-glow" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
