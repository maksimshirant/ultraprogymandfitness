import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import PublicAssetImage from '@/components/PublicAssetImage';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
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
          `${BASE_URL}floors/floor1/GYM/1.png`,
          `${BASE_URL}floors/floor1/GYM/2.png`,
          `${BASE_URL}floors/floor1/GYM/3.png`,
          `${BASE_URL}floors/floor1/GYM/4.png`,
          `${BASE_URL}floors/floor1/GYM/5.png`,
          `${BASE_URL}floors/floor1/GYM/7.png`,
          `${BASE_URL}floors/floor1/GYM/8.png`,
          `${BASE_URL}floors/floor1/GYM/10.png`,
        ],
      },
      {
        id: 'reseption',
        title: 'Ресепшен',
        slides: [`${BASE_URL}floors/floor1/RESEPTION/1.jpg?v=20260516`],
      },
      {
        id: 'sauna',
        title: 'Сауна',
        slides: [
          `${BASE_URL}floors/floor1/SAUNA/1.webp`,
          `${BASE_URL}floors/floor1/SAUNA/2.png`,
          `${BASE_URL}floors/floor1/SAUNA/3.png`,
          `${BASE_URL}floors/floor1/SAUNA/4.png`,
        ],
      },
      {
        id: 'kids-zone',
        title: 'Детская зона',
        slides: [
          `${BASE_URL}floors/floor1/KIDS/1.webp`,
          `${BASE_URL}floors/floor1/KIDS/2.png`,
          `${BASE_URL}floors/floor1/KIDS/3.png`,
          `${BASE_URL}floors/floor1/KIDS/4.png`,
        ],
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
          `${BASE_URL}floors/floor2/crossfit-zone/2.png`,
          `${BASE_URL}floors/floor2/crossfit-zone/3.png`,
          `${BASE_URL}floors/floor2/crossfit-zone/4.png`,
        ],
      },
      {
        id: 'martial-zone',
        title: 'Зона единоборств',
        slides: [
          `${BASE_URL}floors/floor2/martial-zone/1-v2.jpg`,
          `${BASE_URL}floors/floor2/martial-zone/2.png`,
          `${BASE_URL}floors/floor2/martial-zone/3.png`,
        ],
      },
      {
        id: 'cardio-zone',
        title: 'Кардиозона',
        slides: [
          `${BASE_URL}floors/floor2/cardio/1.jpg`,
          `${BASE_URL}floors/floor2/cardio/2.jpg`,
          `${BASE_URL}floors/floor2/cardio/3.png`,
          `${BASE_URL}floors/floor2/cardio/4.jpg`,
          `${BASE_URL}floors/floor2/cardio/5.png`,
          `${BASE_URL}floors/floor2/cardio/6.png`,
          `${BASE_URL}floors/floor2/cardio/7.png`,
          `${BASE_URL}floors/floor2/cardio/8.png`,
          `${BASE_URL}floors/floor2/cardio/9.png`,
        ],
      },
      {
        id: 'group-workouts',
        title: 'Зона групповых занятий',
        slides: [
          `${BASE_URL}floors/floor2/group-workouts/1.png`,
          `${BASE_URL}floors/floor2/group-workouts/2.png`,
          `${BASE_URL}floors/floor2/group-workouts/3.png`,
          `${BASE_URL}floors/floor2/group-workouts/4.jpeg`,
          `${BASE_URL}floors/floor2/group-workouts/5.jpg`,
          `${BASE_URL}floors/floor2/group-workouts/6.png`,
        ],
      },
    ],
  },
] as const;

const defaultFloor = floorConfigs[0];

// Chooses the first available photo zone on a floor.
function getDefaultZoneId(floor: FloorConfig) {
  return floor.zones[0]?.id ?? '';
}

// Presents real club photos with a large preview and a full-screen viewer.
export default function Flors() {
  const [activeFloorId, setActiveFloorId] = useState<FloorId>(defaultFloor.id);
  const [activeZoneId, setActiveZoneId] = useState(getDefaultZoneId(defaultFloor));
  const [viewerSlide, setViewerSlide] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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

  // Resets photo navigation when the visitor switches zones.
  const selectZone = (floorId: FloorId, zoneId: string) => {
    setActiveFloorId(floorId);
    setActiveZoneId(zoneId);
    setViewerSlide(0);
    setIsViewerOpen(false);
  };

  return (
    <section id="flors" className="deferred-section relative py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 border-t border-white/15 pt-7 md:mb-12">
          <BalancedHeading as="h2" className="text-3xl font-semibold tracking-tight text-white">
            <span>{FLORS_TEXT.titleAccent}</span>
          </BalancedHeading>
          <p className="mt-4 text-sm text-white/60">Два этажа. Выберите зону и рассмотрите её ближе.</p>
        </div>

        <div className="mt-8 space-y-4 md:space-y-5">
          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max gap-4 pr-4">
              {floorConfigs.map((floor, floorIndex) => (
                <div key={floor.id} className={cn('flex items-end gap-2', floorIndex > 0 && 'border-l border-white/10 pl-4')}>
                  <div className="pb-2 pr-1">
                    <span className="block whitespace-nowrap text-xs font-semibold uppercase text-[#F5B800]">{floor.label}</span>
                  </div>

                  {floor.zones.map((zone) => {
                    const isActive = floor.id === activeFloor.id && zone.id === activeZone.id;

                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => selectZone(floor.id, zone.id)}
                        aria-label={FLORS_TEXT.chooseZoneAria + ' ' + zone.title}
                        aria-pressed={isActive}
                        className={cn(
                          'home-text-link border-b-2 px-3 py-3 text-left transition-colors duration-200',
                          isActive
                            ? 'border-[#F5B800] text-white'
                            : 'border-transparent text-gray-400 hover:border-white/30 hover:text-white'
                        )}
                      >
                        <span className="block text-sm font-semibold leading-tight">{zone.title}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {totalSlides > 0 ? (
            <>
              <div>
                <div className="relative overflow-hidden rounded-sm bg-black/40">
                  <button
                    type="button"
                    onClick={() => setIsViewerOpen(true)}
                    className="block w-full text-left"
                    aria-label={'Открыть фото ' + (currentViewerSlide + 1) + ' зоны ' + activeZone.title}
                  >
                    <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9]">
                      <PublicAssetImage
                        key={activeZone.id + '-preview-' + currentViewerSlide}
                        src={activeZone.slides[currentViewerSlide]}
                        alt={activeZone.title + ' - фото ' + (currentViewerSlide + 1)}
                        loading="lazy"
                        fetchPriority="low"
                        sizes="(min-width: 1280px) 1216px, 100vw"
                        variantSuffix="preview"
                        deferUntilVisible
                        observerRootMargin="120px 0px"
                        pictureClassName="block h-full w-full"
                        className="h-full w-full object-contain object-center"
                      />
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/82 via-black/42 to-transparent px-4 pb-4 pt-14 sm:px-5 sm:pb-5">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <span className="block text-lg font-semibold leading-tight text-white md:text-xl">
                            {activeZone.title}
                          </span>
                        </div>
                        <span className="shrink-0 rounded-[0.75rem] border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
                          {currentViewerSlide + 1} / {totalSlides}
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (totalSlides < 2) return;
                      setViewerSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
                    }}
                    disabled={totalSlides < 2}
                    className="hero-slide-control absolute left-3 top-1/2 -translate-y-1/2 disabled:pointer-events-none disabled:opacity-0"
                    aria-label={'Предыдущее фото зоны ' + activeZone.title}
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
                    className="hero-slide-control absolute right-3 top-1/2 -translate-y-1/2 disabled:pointer-events-none disabled:opacity-0"
                    aria-label={'Следующее фото зоны ' + activeZone.title}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto pb-3">
                <div className="flex w-max gap-3">
                  {activeZone.slides.map((slide, index) => (
                    <button
                      key={activeZone.id + '-' + index}
                      type="button"
                      onClick={() => {
                        setViewerSlide(index);
                      }}
                      className={cn('w-28 shrink-0 overflow-hidden rounded-sm border-2 bg-black/30 text-left transition-colors sm:w-36', index === currentViewerSlide ? 'border-[#F5B800]' : 'border-transparent hover:border-white/40')}
                      aria-label={'Показать фото ' + (index + 1) + ' зоны ' + activeZone.title}
                      aria-pressed={index === currentViewerSlide}
                    >
                      <div className="aspect-[3/2]">
                        <PublicAssetImage
                          src={slide}
                          alt={activeZone.title + ' - фото ' + (index + 1)}
                          loading="lazy"
                          fetchPriority="low"
                          sizes="144px"
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
              </div>
            </>
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
            className="hero-slide-control absolute right-4 top-4 z-20 sm:right-6 sm:top-6"
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
                sizes="100vw"
                showPlaceholder={false}
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
              className="hero-slide-control absolute left-2 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed disabled:opacity-40 sm:left-3"
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
              className="hero-slide-control absolute right-2 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed disabled:opacity-40 sm:right-3"
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
