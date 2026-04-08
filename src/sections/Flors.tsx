import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import PublicAssetImage from '@/components/PublicAssetImage';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useViewportTier } from '@/hooks/useViewportTier';
import { cn } from '@/lib/utils';

type FloorId = 'floor1' | 'floor2';

type ZoneConfig = {
  id: string;
  title: string;
  slides: readonly string[];
};

type FloorConfig = {
  id: FloorId;
  label: string;
  subtitle: string;
  zones: readonly ZoneConfig[];
};

const BASE_URL = import.meta.env.BASE_URL;

const FLORS_TEXT = {
  titleAccent: 'Галерея клуба',
  titleSuffix: '',
  chooseFloorAria: 'Выбрать этаж',
  chooseZoneAria: 'Выбрать зону',
  closeViewerAria: 'Закрыть просмотр галереи',
  noPhotos: 'Фотографии этой зоны скоро появятся.',
} as const;

const floorConfigs: readonly FloorConfig[] = [
  {
    id: 'floor1',
    label: '1 этаж',
    subtitle: 'Входная группа, силовой блок и восстановление',
    zones: [
      {
        id: 'gym',
        title: 'Тренажерный зал',
        slides: [
          `${BASE_URL}floors/floor1/GYM/1.webp`,
          `${BASE_URL}floors/floor1/GYM/2.webp`,
          `${BASE_URL}floors/floor1/GYM/3.webp`,
          `${BASE_URL}floors/floor1/GYM/4.webp`,
          `${BASE_URL}floors/floor1/GYM/5.jpg`,
        ],
      },
      {
        id: 'sauna',
        title: 'Сауна',
        slides: [`${BASE_URL}floors/floor1/SAUNA/1.webp`],
      },
      {
        id: 'kids-zone',
        title: 'Детская зона',
        slides: [`${BASE_URL}floors/floor1/KIDS/1.webp`],
      },
    ],
  },
  {
    id: 'floor2',
    label: '2 этаж',
    subtitle: 'Кардио, функциональность и групповые направления',
    zones: [
      {
        id: 'crossfit-zone',
        title: 'Кроссфит зона',
        slides: [
          `${BASE_URL}floors/floor2/crossfit-zone/1.webp`,
          `${BASE_URL}floors/floor2/crossfit-zone/2.webp`,
          `${BASE_URL}floors/floor2/crossfit-zone/3.jpg`,
          `${BASE_URL}floors/floor2/crossfit-zone/4.jpg`,
          `${BASE_URL}floors/floor2/crossfit-zone/5.jpg`,
        ],
      },
      {
        id: 'martial-zone',
        title: 'Зона единоборств',
        slides: [
          `${BASE_URL}floors/floor2/martial-zone/1-v2.jpg`,
          `${BASE_URL}floors/floor2/martial-zone/2-v2.jpg`,
        ],
      },
      {
        id: 'cardio-zone',
        title: 'Кардиозона',
        slides: [
          `${BASE_URL}floors/floor2/cardio/1.jpg`,
          `${BASE_URL}floors/floor2/cardio/2.jpg`,
          `${BASE_URL}floors/floor2/cardio/3.webp`,
          `${BASE_URL}floors/floor2/cardio/4.jpg`,
          `${BASE_URL}floors/floor2/cardio/5.jpg`,
        ],
      },
      {
        id: 'group-workouts',
        title: 'Зона групповых занятий',
        slides: [
          `${BASE_URL}floors/floor2/group-workouts/1.jpg`,
          `${BASE_URL}floors/floor2/group-workouts/2.jpg`,
          `${BASE_URL}floors/floor2/group-workouts/3.webp`,
          `${BASE_URL}floors/floor2/group-workouts/4.jpeg`,
        ],
      },
    ],
  },
] as const;

const defaultFloor = floorConfigs[0];

function getDefaultZoneId(floor: FloorConfig) {
  return floor.zones[0]?.id ?? '';
}

export default function Flors() {
  const [activeFloorId, setActiveFloorId] = useState<FloorId>(defaultFloor.id);
  const [activeZoneId, setActiveZoneId] = useState(getDefaultZoneId(defaultFloor));
  const [viewerSlide, setViewerSlide] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const viewportTier = useViewportTier();
  const isMobileViewport = viewportTier === 'mobile';

  const activeFloor = useMemo(
    () => floorConfigs.find((floor) => floor.id === activeFloorId) ?? defaultFloor,
    [activeFloorId]
  );

  const activeZone = useMemo(
    () => activeFloor.zones.find((zone) => zone.id === activeZoneId) ?? activeFloor.zones[0],
    [activeFloor, activeZoneId]
  );

  const totalSlides = activeZone.slides.length;
  const currentViewerSlide = totalSlides > 0 ? viewerSlide % totalSlides : 0;

  const viewerSwipeHandlers = useSwipeNavigation({
    onNext: () => {
      if (totalSlides < 2) return;
      setViewerSlide((prev) => (prev + 1) % totalSlides);
    },
    onPrev: () => {
      if (totalSlides < 2) return;
      setViewerSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    },
    disabled: totalSlides < 2,
  });

  const selectFloor = (floorId: FloorId) => {
    const nextFloor = floorConfigs.find((floor) => floor.id === floorId) ?? defaultFloor;
    setActiveFloorId(nextFloor.id);
    setActiveZoneId(getDefaultZoneId(nextFloor));
    setViewerSlide(0);
    setIsViewerOpen(false);
    setIsMobileExpanded(false);
  };

  const selectZone = (zoneId: string) => {
    setActiveZoneId(zoneId);
    setViewerSlide(0);
    setIsViewerOpen(false);
    setIsMobileExpanded(false);
  };

  return (
    <section id="flors" className="relative py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <BalancedHeading as="h2" className="section-title text-white">
            <HeadingAccent>{FLORS_TEXT.titleAccent}</HeadingAccent> {FLORS_TEXT.titleSuffix}
          </BalancedHeading>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {floorConfigs.map((floor) => {
            const isActive = floor.id === activeFloorId;

            return (
              <button
                key={floor.id}
                type="button"
                onClick={() => selectFloor(floor.id)}
                aria-label={`${FLORS_TEXT.chooseFloorAria} ${floor.label}`}
                aria-pressed={isActive}
                className={cn(
                  'min-w-[154px] rounded-full border px-5 py-3 text-sm transition-all md:text-base',
                  isActive
                    ? 'border-white/35 bg-white/10 text-white'
                    : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-white/20 hover:text-white'
                )}
              >
                <span className="block font-semibold">{floor.label}</span>
                {!isMobileViewport ? <span className="mt-1 block text-xs text-gray-400">{floor.subtitle}</span> : null}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-6 h-px w-20 bg-white/10" />

        <div className="mt-4 flex flex-wrap justify-center gap-2.5 md:gap-3">
          {activeFloor.zones.map((zone) => {
            const isActive = zone.id === activeZone.id;

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => selectZone(zone.id)}
                aria-label={`${FLORS_TEXT.chooseZoneAria} ${zone.title}`}
                aria-pressed={isActive}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs transition-all md:px-4.5 md:py-2.5 md:text-sm',
                  isActive
                    ? 'border-white/25 bg-white/10 text-white'
                    : 'border-white/8 bg-transparent text-gray-400 hover:border-white/18 hover:text-white'
                )}
              >
                <span className="block font-medium">{zone.title}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-[30px] border border-white/10 bg-[#0a0c11]/92 p-4 sm:p-5">
          <div className="mx-auto mb-5 max-w-5xl">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gray-500">{activeFloor.label}</p>
              <h3 className="mt-2 text-xl font-bold text-white md:text-2xl">{activeZone.title}</h3>
            </div>
          </div>

          {totalSlides > 0 ? (
            <div className="mx-auto max-w-5xl">
              <div
                className={cn(
                  'relative overflow-hidden md:overflow-visible',
                  !isMobileExpanded && totalSlides > 2 && 'max-h-[17rem] md:max-h-none'
                )}
              >
                <div className="club-gallery-grid">
                  {activeZone.slides.map((slide, index) => (
                    <button
                      key={`${activeZone.id}-${index}`}
                      type="button"
                      onClick={() => {
                        setViewerSlide(index);
                        setIsViewerOpen(true);
                      }}
                      className="overflow-hidden rounded-xl border border-white/10 bg-black/30 text-left transition-colors hover:border-white/20"
                      aria-label={`Открыть фото ${index + 1} зоны ${activeZone.title}`}
                    >
                      <div className="aspect-square">
                        <PublicAssetImage
                          src={slide}
                          alt={`${activeZone.title} — фото ${index + 1}`}
                          loading="lazy"
                          fetchPriority="low"
                          variantSuffix="thumb"
                          deferUntilVisible
                          observerRootMargin="120px 0px"
                          pictureClassName="block h-full w-full"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {isMobileViewport && !isMobileExpanded && totalSlides > 2 ? (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0c11] via-[#0a0c11]/88 to-transparent" />
                ) : null}
              </div>

              {isMobileViewport && totalSlides > 2 ? (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsMobileExpanded((prev) => !prev)}
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    {isMobileExpanded ? 'Скрыть часть фото' : 'Показать полностью'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-400">
              {FLORS_TEXT.noPhotos}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent
          showCloseButton={false}
          className="inset-0 h-screen w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-black/95 p-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">{activeZone.title}</DialogTitle>

          <button
            type="button"
            onClick={() => setIsViewerOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
            aria-label={FLORS_TEXT.closeViewerAria}
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <div className="relative h-screen">
            <div className="h-full overflow-hidden bg-black/50" {...viewerSwipeHandlers}>
              <PublicAssetImage
                key={`${activeZone.id}-viewer-${currentViewerSlide}`}
                src={activeZone.slides[currentViewerSlide]}
                alt={`${activeZone.title} — фото ${currentViewerSlide + 1}`}
                loading="lazy"
                pictureClassName="block h-full w-full"
                className="h-full w-full object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (totalSlides < 2) return;
                setViewerSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
              }}
              disabled={totalSlides < 2}
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40 sm:left-3 sm:h-12 sm:w-12"
              aria-label={`Предыдущее фото в просмотре зоны ${activeZone.title}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (totalSlides < 2) return;
                setViewerSlide((prev) => (prev + 1) % totalSlides);
              }}
              disabled={totalSlides < 2}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40 sm:right-3 sm:h-12 sm:w-12"
              aria-label={`Следующее фото в просмотре зоны ${activeZone.title}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
