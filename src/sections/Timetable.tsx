import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';

const TIMETABLE_ASSETS = {
  image: `${import.meta.env.BASE_URL}timetable.jpg`,
} as const;

const TIMETABLE_TEXT = {
  title: 'Рассписание',
  titleAccent: 'групповых занятий',
  imageAlt: 'Рассписание групповых занятий',
  openFullscreenAria: 'Открыть расписание на весь экран',
  closePreviewAria: 'Закрыть просмотр расписания',
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
