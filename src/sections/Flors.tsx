import { useMemo, useState } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Users,
  Waves,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';

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
  titleSuffix: '— чтобы каждая цель имела своё пространство',
  subtitle: 'От силовых тренировок до функционального тренинга и восстановления.',
  categoryHintFallback: 'Тут будет описание выбранной зоны. Пока тестовый текст-заглушка.',
  slideWord: 'Слайд',
  closeViewerAria: 'Закрыть просмотр галереи',
} as const;

const FLOOR_CATEGORY_HINTS: Record<string, string> = {
  gym: 'Тут кипит железо, растут цифры в рабочих весах и появляется уверенность в каждом движении.',
  sauna: 'Тепло, пауза и восстановление: место, где мышцы благодарят вас после нагрузки.',
  'kids-zone': 'Небольшая территория энергии и улыбок, пока взрослые спокойно закрывают тренировочный план.',
  'fitness-bar': 'Точка перезагрузки: вода, протеин, перекус и короткая пауза между подходами.',
  'crossfit-zone': 'Интенсивный ритм, функциональные связки и характер, который становится сильнее с каждой сессией.',
  'group-workouts': 'Музыка, темп и команда: здесь легко держать дисциплину и не терять мотивацию.',
  // Временно скрыто. Вернуть при запуске категории "Массаж".
  // massage: 'Зона, где тело отпускает напряжение, а восстановление становится частью прогресса.',
  'martial-zone': 'Скорость, техника и концентрация: пространство для ударной работы и уверенного контроля.',
  'cardio-zone': 'Ровный пульс, выносливость и дыхание: километры, которые работают на ваш результат.',
};

const FLOOR_PHOTO_SLIDES: Record<string, string[]> = {
  gym: [
    `${import.meta.env.BASE_URL}floors/floor1/GYM/1.webp`,
    `${import.meta.env.BASE_URL}floors/floor1/GYM/2.webp`,
    `${import.meta.env.BASE_URL}floors/floor1/GYM/3.webp`,
    `${import.meta.env.BASE_URL}floors/floor1/GYM/4.webp`,
    `${import.meta.env.BASE_URL}floors/floor1/GYM/5.jpg`,
  ],
  sauna: [
    `${import.meta.env.BASE_URL}floors/floor1/SAUNA/1.webp`,
  ],
  'kids-zone': [
    `${import.meta.env.BASE_URL}floors/floor1/KIDS/1.webp`,
  ],
  'fitness-bar': [
    `${import.meta.env.BASE_URL}floors/floor1/RESEPTION/1.webp`,
  ],
  'crossfit-zone': [
    `${import.meta.env.BASE_URL}floors/floor2/crossfit-zone/1.webp`,
    `${import.meta.env.BASE_URL}floors/floor2/crossfit-zone/2.webp`,
    `${import.meta.env.BASE_URL}floors/floor2/crossfit-zone/3.jpg`,
    `${import.meta.env.BASE_URL}floors/floor2/crossfit-zone/4.jpg`,
    `${import.meta.env.BASE_URL}floors/floor2/crossfit-zone/5.jpg`,
  ],
  'group-workouts': [
    `${import.meta.env.BASE_URL}floors/floor2/group-workouts/1.jpg`,
    `${import.meta.env.BASE_URL}floors/floor2/group-workouts/2.jpg`,
    `${import.meta.env.BASE_URL}floors/floor2/group-workouts/3.webp`,
  ],
  // Временно скрыто. Вернуть при запуске категории "Массаж".
  // massage: [
  //   `${import.meta.env.BASE_URL}floors/floor1/SAUNA/1.webp`,
  // ],
  'martial-zone': [
    `${import.meta.env.BASE_URL}floors/floor2/martial-zone/1-v2.jpg`,
    `${import.meta.env.BASE_URL}floors/floor2/martial-zone/2-v2.jpg`,
  ],
  'cardio-zone': [
    `${import.meta.env.BASE_URL}floors/floor2/cardio/1.jpg`,
    `${import.meta.env.BASE_URL}floors/floor2/cardio/2.jpg`,
    `${import.meta.env.BASE_URL}floors/floor2/cardio/3.webp`,
    `${import.meta.env.BASE_URL}floors/floor2/cardio/4.jpg`,
    `${import.meta.env.BASE_URL}floors/floor2/cardio/5.jpg`,
  ],
};

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
  const uploadedSlides = FLOOR_PHOTO_SLIDES[category.id];
  if (uploadedSlides && uploadedSlides.length > 0) {
    return uploadedSlides;
  }

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
      // Временно скрыто. Вернуть при запуске категории "Массаж".
      // {
      //   id: 'massage',
      //   label: 'Массаж',
      //   icon: Hand,
      //   paletteIndex: 6,
      // },
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

function getFloorDefaultCategoryId(floor: FloorConfig) {
  const withUploadedPhotos = floor.categories.find((category) => {
    const slides = FLOOR_PHOTO_SLIDES[category.id];
    return Boolean(slides && slides.length > 0);
  });

  return withUploadedPhotos?.id ?? floor.categories[0].id;
}

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
  const viewerImage = activeSlides[currentViewerSlide];

  const selectFloor = (floor: FloorConfig) => {
    const nextCategoryId = getFloorDefaultCategoryId(floor);
    setActiveFloorId(floor.id);
    setActiveCategoryId(nextCategoryId);
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

  const getGallerySlideOffset = (index: number) => {
    if (totalSlides < 2) {
      return 0;
    }

    let offset = index - currentSlide;
    const half = Math.floor(totalSlides / 2);

    if (offset > half) {
      offset -= totalSlides;
    }
    if (offset < -half) {
      offset += totalSlides;
    }

    return offset;
  };

  const mainSwipeHandlers = useSwipeNavigation({
    onNext: nextMainSlide,
    onPrev: prevMainSlide,
    disabled: totalSlides < 2,
  });

  const viewerSwipeHandlers = useSwipeNavigation({
    onNext: nextViewerSlide,
    onPrev: prevViewerSlide,
    disabled: totalSlides < 2,
  });
  const activeCategoryHint =
    FLOOR_CATEGORY_HINTS[activeCategory.id] ?? FLORS_TEXT.categoryHintFallback;

  return (
    <section id="flors" className="py-15 relative overflow-hidden">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10 md:mb-12">
          <BalancedHeading as="h2" className="section-title text-white">
            <HeadingAccent>{FLORS_TEXT.titleAccent}</HeadingAccent> {FLORS_TEXT.titleSuffix}
          </BalancedHeading>
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
                    : 'lg:hover:border-white/20 lg:hover:bg-white/[0.04]'
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
                      : 'bg-white/5 text-gray-300 border border-white/10 lg:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 md:mt-5 mx-auto w-full max-w-3xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.06] via-white/[0.035] to-white/[0.02] px-4 py-4 md:px-6 md:py-5">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#F5B800] via-[#E2A700] to-[#C98E00]" />
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#F5B800]/10 blur-2xl" />
              <p className="text-[11px] md:text-xs font-semibold tracking-[0.14em] uppercase text-[#F5B800]">
                Фокус зоны
              </p>
              <p className="mt-2 text-center text-sm md:text-base text-gray-200 leading-relaxed">
                {activeCategoryHint}
              </p>
            </div>
          </div>

          <div className="relative mt-4 md:mt-5 mx-auto w-full max-w-4xl">
            <div
              className="relative h-[420px] sm:h-[480px] md:h-[560px] lg:h-[620px] overflow-hidden"
              {...mainSwipeHandlers}
            >
              {activeSlides.map((slide, index) => {
                const offset = getGallerySlideOffset(index);
                const isActive = offset === 0;

                return (
                  <button
                    key={`${activeCategory.id}-${index}`}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        openViewer();
                        return;
                      }
                      setActiveSlide(index);
                    }}
                    aria-label={
                      isActive
                        ? `Открыть в полноэкранном режиме: ${activeCategory.label}, фото ${index + 1}`
                        : `Показать фото ${index + 1} категории ${activeCategory.label}`
                    }
                    className={`flors-slide-motion absolute top-1/2 left-1/2 h-[96%] w-[68%] sm:w-[62%] md:w-[54%] lg:w-[48%] rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-lg transition-all duration-700 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] ${
                      isActive
                        ? 'z-20 -translate-x-1/2 -translate-y-1/2 scale-100 opacity-100'
                        : offset === -1
                          ? 'z-10 -translate-x-[118%] -translate-y-1/2 scale-90 opacity-35'
                          : offset === 1
                            ? 'z-10 translate-x-[18%] -translate-y-1/2 scale-90 opacity-35'
                            : 'z-0 -translate-x-1/2 -translate-y-1/2 scale-85 opacity-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide}
                      alt={`${activeCategory.label} — фото ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 mt-6">
              <button
                type="button"
                onClick={prevMainSlide}
                disabled={totalSlides < 2}
                aria-label={`Предыдущее фото категории ${activeCategory.label}`}
                className="flors-control-motion w-12 h-12 rounded-full bg-white/5 lg:hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6 text-gray-400" />
              </button>

              <div className="flex gap-3 flex-wrap justify-center">
                {activeSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`flors-control-motion h-1 rounded-full transition-all ${
                      index === currentSlide
                        ? 'w-16 bg-gradient-to-r from-[#F5B800] to-[#D89B00]'
                        : 'w-8 bg-white/20'
                    }`}
                    aria-label={`Выбрать фото ${index + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextMainSlide}
                disabled={totalSlides < 2}
                aria-label={`Следующее фото категории ${activeCategory.label}`}
                className="flors-control-motion w-12 h-12 rounded-full bg-white/5 lg:hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <p className="mt-3 text-center text-xs sm:text-sm text-gray-300">
              {currentSlide + 1} / {totalSlides}
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-0 left-0 h-screen w-screen max-w-none sm:max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-black/95 p-2 sm:p-4"
        >
          <DialogTitle className="sr-only">{activeCategory.label}</DialogTitle>
          <button
            type="button"
            onClick={() => setIsViewerOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 lg:hover:bg-white/20 transition-colors flex items-center justify-center z-20"
            aria-label={FLORS_TEXT.closeViewerAria}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="relative h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)]">
            <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-black/50" {...viewerSwipeHandlers}>
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
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/65 border border-white/20 text-white transition lg:hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={nextViewerSlide}
              disabled={totalSlides < 2}
              aria-label={`Следующее фото в просмотре категории ${activeCategory.label}`}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/65 border border-white/20 text-white transition lg:hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B800] flex items-center justify-center"
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
