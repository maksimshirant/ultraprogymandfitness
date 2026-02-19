import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';

const TIMETABLE_TEXT = {
  title: 'Расписание',
  titleAccent: 'групповых занятий',
  subtitle: 'Выбери свое направление и приступай уже сегодня',
  imageAlt: 'Расписание групповых занятий',
  comingSoon: 'Расписание скоро будет доступно',
  signature: 'С уважением команда, Ultra Pro',
  openFullscreenAria: 'Открыть расписание на весь экран',
  closePreviewAria: 'Закрыть просмотр расписания',
} as const;

const TIMETABLE_ASSETS = {
  image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0B0B12" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)" />
  <rect x="60" y="60" width="1480" height="780" rx="30" fill="none" stroke="#F5B800" stroke-width="8" stroke-opacity="0.5" />
  <text x="800" y="420" text-anchor="middle" font-family="Inter, sans-serif" font-size="64" fill="#FFFFFF" font-weight="700">${TIMETABLE_TEXT.comingSoon}</text>
  <text x="800" y="510" text-anchor="middle" font-family="Inter, sans-serif" font-size="40" fill="#E5E7EB" opacity="0.95">${TIMETABLE_TEXT.signature}</text>
</svg>
`)}`,
} as const;

export default function Timetable() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isPreviewOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPreviewOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isPreviewOpen]);

  return (
    <section id="schedule" className="py-14 relative overflow-hidden scroll-mt-24">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <BalancedHeading as="h2" className="section-title text-white">
            {TIMETABLE_TEXT.title}{' '}
            <HeadingAccent>{TIMETABLE_TEXT.titleAccent}</HeadingAccent>
          </BalancedHeading>
          <p className="section-subtitle mx-auto">{TIMETABLE_TEXT.subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-3 md:p-4">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="block w-full rounded-2xl overflow-hidden border border-white/10"
              aria-label={TIMETABLE_TEXT.openFullscreenAria}
            >
              <img
                src={TIMETABLE_ASSETS.image}
                alt={TIMETABLE_TEXT.imageAlt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto"
              />
            </button>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 lg:hover:bg-white/20 transition-colors flex items-center justify-center"
            aria-label={TIMETABLE_TEXT.closePreviewAria}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="w-full h-full flex items-center justify-center">
            <img
              src={TIMETABLE_ASSETS.image}
              alt={TIMETABLE_TEXT.imageAlt}
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-full rounded-2xl border border-white/20"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
