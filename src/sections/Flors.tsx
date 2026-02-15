import { useMemo, useState } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Hand,
  Users,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

type FloorId = 'floor1' | 'floor2';

type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  paletteIndex: number;
};

type FloorConfig = {
  id: FloorId;
  label: string;
  subtitle: string;
  categories: Category[];
};

const FLORS_TEXT = {
  titleAccent: 'Два полноценных этажа',
  titleSuffix: ', где каждая зона отвечает своей цели',
  subtitle: 'от силовых тренировок до функционального тренинга и восстановления.',
  slideWord: 'Слайд',
} as const;

const mockPalette = [
  { bg: '#1E293B', accent: '#F5B800' },
  { bg: '#0F766E', accent: '#22D3EE' },
  { bg: '#4C1D95', accent: '#A78BFA' },
  { bg: '#7C2D12', accent: '#FB923C' },
  { bg: '#14532D', accent: '#4ADE80' },
  { bg: '#1D4ED8', accent: '#60A5FA' },
  { bg: '#831843', accent: '#F472B6' },
  { bg: '#155E75', accent: '#67E8F9' },
  { bg: '#713F12', accent: '#FACC15' },
];

function createMockImage(label: string, slideNumber: number, paletteIndex: number) {
  const palette = mockPalette[paletteIndex % mockPalette.length];
  const safeLabel = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg}" />
      <stop offset="100%" stop-color="#0B0B12" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#g)" />
  <rect x="70" y="70" width="1460" height="760" rx="28" fill="none" stroke="${palette.accent}" stroke-width="8" stroke-opacity="0.45" />
  <text x="800" y="355" text-anchor="middle" font-family="Inter, sans-serif" font-size="86" fill="#FFFFFF" font-weight="700">${safeLabel}</text>
  <text x="800" y="505" text-anchor="middle" font-family="Inter, sans-serif" font-size="248" fill="${palette.accent}" font-weight="800">${slideNumber}</text>
  <text x="800" y="610" text-anchor="middle" font-family="Inter, sans-serif" font-size="42" fill="#E5E7EB" opacity="0.95">${FLORS_TEXT.slideWord} ${slideNumber}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createMockSlides(label: string, paletteIndex: number) {
  return [1, 2, 3].map((slideNumber) => createMockImage(label, slideNumber, paletteIndex));
}

const categorySlidesCache = new Map<string, string[]>();

function getCategorySlides(category: Category) {
  const cacheKey = `${category.id}-${category.paletteIndex}-${category.label}`;
  const fromCache = categorySlidesCache.get(cacheKey);
  if (fromCache) {
    return fromCache;
  }

  const generatedSlides = createMockSlides(category.label, category.paletteIndex);
  categorySlidesCache.set(cacheKey, generatedSlides);
  return generatedSlides;
}

const floorConfigs: FloorConfig[] = [
  {
    id: 'floor1',
    label: 'Этаж 1',
    subtitle: 'Силовые форматы и восстановление',
    categories: [
      {
        id: 'gym',
        label: 'Тренажерный зал',
        icon: Dumbbell,
        paletteIndex: 0,
      },
      {
        id: 'sauna',
        label: 'Сауна',
        icon: Waves,
        paletteIndex: 1,
      },
      {
        id: 'kids-zone',
        label: 'Детская зона',
        icon: Users,
        paletteIndex: 2,
      },
      {
        id: 'fitness-bar',
        label: 'Фитнес-бар',
        icon: Activity,
        paletteIndex: 3,
      },
    ],
  },
  {
    id: 'floor2',
    label: 'Этаж 2',
    subtitle: 'Функциональные форматы и восстановление',
    categories: [
      {
        id: 'crossfit-zone',
        label: 'Кроссфит зона',
        icon: Zap,
        paletteIndex: 4,
      },
      {
        id: 'group-workouts',
        label: 'Групповые тренировки',
        icon: Users,
        paletteIndex: 5,
      },
      {
        id: 'massage',
        label: 'Массаж',
        icon: Hand,
        paletteIndex: 6,
      },
      {
        id: 'martial-zone',
        label: 'Зона единоборств',
        icon: Dumbbell,
        paletteIndex: 7,
      },
      {
        id: 'cardio-zone',
        label: 'Кардио зона',
        icon: Activity,
        paletteIndex: 8,
      },
    ],
  },
];

const defaultFloor = floorConfigs[0];

export default function Flors() {
  const [activeFloorId, setActiveFloorId] = useState<FloorId>(defaultFloor.id);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(defaultFloor.categories[0].id);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerSlide, setViewerSlide] = useState(0);

  const activeFloor = useMemo(
    () => floorConfigs.find((floor) => floor.id === activeFloorId) ?? defaultFloor,
    [activeFloorId]
  );
  const activeCategory = useMemo(
    () => activeFloor.categories.find((category) => category.id === activeCategoryId) ?? activeFloor.categories[0],
    [activeCategoryId, activeFloor]
  );
  const activeSlides = useMemo(() => getCategorySlides(activeCategory), [activeCategory]);
  const totalSlides = activeSlides.length;
  const currentSlide = totalSlides > 0 ? activeSlide % totalSlides : 0;
  const currentViewerSlide = totalSlides > 0 ? viewerSlide % totalSlides : 0;
  const currentImage = activeSlides[currentSlide];
  const viewerImage = activeSlides[currentViewerSlide];

  const selectFloor = (floor: FloorConfig) => {
    setActiveFloorId(floor.id);
    setActiveCategoryId(floor.categories[0].id);
    setActiveSlide(0);
    setViewerSlide(0);
    setIsViewerOpen(false);
  };

  const selectCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setActiveSlide(0);
    setViewerSlide(0);
    setIsViewerOpen(false);
  };

  const prevMainSlide = () => {
    if (totalSlides < 2) return;
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextMainSlide = () => {
    if (totalSlides < 2) return;
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const openViewer = () => {
    setViewerSlide(currentSlide);
    setIsViewerOpen(true);
  };

  const prevViewerSlide = () => {
    if (totalSlides < 2) return;
    setViewerSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextViewerSlide = () => {
    if (totalSlides < 2) return;
    setViewerSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section id="flors" className="py-15 relative overflow-hidden">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="section-title text-white">
            <span className="relative inline-block">
              <span className="relative z-10">{FLORS_TEXT.titleAccent}</span>
              <span className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 md:h-2.5 lg:h-3 bg-gradient-to-r from-[#F5B800] to-[#D89B00] -z-0" />
            </span>
            {FLORS_TEXT.titleSuffix}
          </h2>
          <p className="section-subtitle mx-auto">
            {FLORS_TEXT.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {floorConfigs.map((floor) => {
            const isActive = floor.id === activeFloorId;

            return (
              <button
                key={floor.id}
                type="button"
                onClick={() => selectFloor(floor)}
                aria-pressed={isActive}
                aria-label={`Выбрать ${floor.label}`}
                className={`glass-card text-left p-4 md:p-5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] ${
                  isActive
                    ? 'border-[#F5B800]/70 bg-gradient-to-r from-[#F5B800]/20 to-[#D89B00]/15'
                    : 'hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <p className="text-lg md:text-xl font-bold text-white">{floor.label}</p>
                <p className="mt-1 text-sm text-gray-300">{floor.subtitle}</p>
              </button>
            );
          })}
        </div>

        <div id="gallery" className="mt-6 md:mt-8 glass-card p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {activeFloor.categories.map((category) => {
              const Icon = category.icon;
              const isActive = category.id === activeCategory.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  aria-pressed={isActive}
                  aria-label={`Показать категорию ${category.label}`}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] ${
                    isActive
                      ? 'border-[#F5B800]/70 bg-gradient-to-r from-[#F5B800]/20 to-[#D89B00]/15 text-white'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative mt-4 md:mt-5 mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <button
                type="button"
                onClick={openViewer}
                className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800]"
                aria-label={`Открыть в полноэкранном режиме: ${activeCategory.label}, фото ${currentSlide + 1}`}
              >
                <div className="aspect-[5/4] sm:aspect-[16/10] lg:aspect-[16/8]">
                  <img
                    key={`${activeCategory.id}-${currentSlide}`}
                    src={currentImage}
                    alt={`${activeCategory.label} — фото ${currentSlide + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>

              <button
                type="button"
                onClick={prevMainSlide}
                disabled={totalSlides < 2}
                aria-label={`Предыдущее фото категории ${activeCategory.label}`}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/55 border border-white/20 text-white transition hover:bg-black/70 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={nextMainSlide}
                disabled={totalSlides < 2}
                aria-label={`Следующее фото категории ${activeCategory.label}`}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/55 border border-white/20 text-white transition hover:bg-black/70 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-3 text-center text-xs sm:text-sm text-gray-300">
              {currentSlide + 1} / {totalSlides}
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="top-0 left-0 h-screen w-screen max-w-none sm:max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-black/95 p-2 sm:p-4">
          <DialogTitle className="sr-only">{activeCategory.label}</DialogTitle>
          <div className="relative h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)]">
            <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-black/50">
              <img
                key={`${activeCategory.id}-viewer-${currentViewerSlide}`}
                src={viewerImage}
                alt={`${activeCategory.label} — фото ${currentViewerSlide + 1}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>

            <button
              type="button"
              onClick={prevViewerSlide}
              disabled={totalSlides < 2}
              aria-label={`Предыдущее фото в просмотре категории ${activeCategory.label}`}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/65 border border-white/20 text-white transition hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={nextViewerSlide}
              disabled={totalSlides < 2}
              aria-label={`Следующее фото в просмотре категории ${activeCategory.label}`}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/65 border border-white/20 text-white transition hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <p className="mt-3 text-center text-xs sm:text-sm text-gray-300">
              {currentViewerSlide + 1} / {totalSlides}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
