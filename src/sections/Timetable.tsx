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
  image: `${import.meta.env.BASE_URL}фонмороз.png`,
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

  const renderTimetablePreview = (isFullscreen = false) => (
    <div
      className={`relative overflow-hidden ${
        isFullscreen ? 'max-w-full max-h-full rounded-2xl border border-white/20' : 'w-full'
      }`}
    >
      <img
        src={TIMETABLE_ASSETS.image}
        alt={TIMETABLE_TEXT.imageAlt}
        loading="lazy"
        decoding="async"
        className="w-full h-auto object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.2)_0%,rgba(5,7,12,0.72)_58%,rgba(5,7,12,0.88)_100%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-2xl font-bold text-white sm:text-4xl md:text-5xl">{TIMETABLE_TEXT.comingSoon}</p>
        <p className="mt-4 text-sm text-gray-200 sm:text-lg md:text-xl">{TIMETABLE_TEXT.signature}</p>
      </div>
    </div>
  );

  return (
    <section id="schedule" className="deferred-section relative overflow-hidden py-14 scroll-mt-24">
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
          <div className="overflow-hidden rounded-2xl">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="block w-full"
              aria-label={TIMETABLE_TEXT.openFullscreenAria}
            >
              {renderTimetablePreview()}
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
            <div className="max-w-full max-h-full" onClick={(event) => event.stopPropagation()}>
              {renderTimetablePreview(true)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
