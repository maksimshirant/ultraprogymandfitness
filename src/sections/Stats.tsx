import { useEffect, useRef, useState } from 'react';
import { Activity, HeartPulse, ShieldCheck, Smile } from 'lucide-react';

const STATS_TEXT = {
  title: 'Регулярные занятия спортом',
  titleAccent: 'снижают риски',
  subtitle:
    'Усредненные показатели крупных наблюдательных исследований при регулярной физической активности.',
  sourcesButtonAria: 'Показать источники исследований',
  sourcesTitle: 'Источники:',
  practicalTip: 'Практический ориентир: от 150 минут умеренной физической активности в неделю.',
  riskReductionLabel: 'Среднее снижение риска',
} as const;

const STATS_SOURCES = [
  '1. Schuch et al., 2018 (American Journal of Psychiatry): «Физическая активность и риск развития депрессии».',
  '2. Smith et al., 2016 (Diabetologia): «Физическая активность и риск развития сахарного диабета 2 типа: систематический обзор и дозозависимый метаанализ проспективных когортных исследований».',
  '3. Sattelmair et al., 2011 (Circulation): «Дозозависимая связь между физической активностью и риском ишемической болезни сердца».',
  '4. Huai et al., 2013 (Hypertension): «Физическая активность и риск артериальной гипертонии: метаанализ проспективных исследований».',
] as const;

const sportEffects = [
  {
    id: 'depression',
    label: 'Снижает риск депрессивных симптомов',
    reduction: 22,
    icon: Smile,
  },
  {
    id: 'diabetes',
    label: 'Снижает риск диабета 2 типа',
    reduction: 26,
    icon: ShieldCheck,
  },
  {
    id: 'heart-disease',
    label: 'Снижает риск ишемической болезни сердца',
    reduction: 20,
    icon: HeartPulse,
  },
  {
    id: 'hypertension',
    label: 'Снижает риск гипертонии',
    reduction: 19,
    icon: Activity,
  },
];

export default function Stats() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth < 1024 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsVisible(true);
      return;
    }

    const isMobile = window.innerWidth < 1024;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canAnimateOnScroll = !isMobile && !prefersReducedMotion && 'IntersectionObserver' in window;

    if (!canAnimateOnScroll) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '120px 0px' }
    );

    const sectionNode = sectionRef.current;
    if (sectionNode) {
      observer.observe(sectionNode);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <h2 className="section-title text-white">
            {STATS_TEXT.title}
            <span className="relative inline-block">
              <span className="relative z-10">{STATS_TEXT.titleAccent}</span>
              <span className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 md:h-2.5 lg:h-3 bg-gradient-to-r from-[#F5B800] to-[#D89B00] -z-0" />
            </span>
          </h2>
          <div className="section-subtitle mx-auto">
            <p className="inline">{STATS_TEXT.subtitle}</p>
            <button
              type="button"
              onClick={() => setIsSourcesOpen((prev) => !prev)}
              className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-[11px] font-bold text-white/80 hover:border-[#F5B800] hover:text-[#F5B800] transition-colors align-middle"
              aria-label={STATS_TEXT.sourcesButtonAria}
              aria-expanded={isSourcesOpen}
            >
              ?
            </button>
          </div>

          {isSourcesOpen && (
            <div className="mx-auto mt-4 max-w-3xl rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left">
              <p className="text-xs font-semibold text-white">{STATS_TEXT.sourcesTitle}</p>
              <ul className="mt-2 space-y-1.5 text-xs text-gray-300">
                {STATS_SOURCES.map((source) => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className={`glass-card p-6 md:p-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            {sportEffects.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 md:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5B800] to-[#D89B00] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-white text-sm md:text-base font-medium leading-snug">
                        {item.label}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#F5B800] text-black text-xs font-bold shrink-0">
                      -{item.reduction}%
                    </span>
                  </div>
                    <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{STATS_TEXT.riskReductionLabel}</span>
                      <span>{item.reduction}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F5B800] to-[#D89B00] transition-all duration-1000"
                        style={{ width: isVisible ? `${item.reduction}%` : 0 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-xl border border-[#F5B800]/30 bg-[#F5B800]/10 px-4 py-3 text-xs text-[#FFE7A3]">
            {STATS_TEXT.practicalTip}
          </div>
        </div>
      </div>
    </section>
  );
}
