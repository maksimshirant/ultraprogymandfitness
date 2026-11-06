import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsRight, Pause, Play } from 'lucide-react';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import PublicAssetImage from '@/components/PublicAssetImage';
import type { OpenModalHandler } from '@/types/modal';

interface HeroProps {
  onOpenModal: OpenModalHandler;
}


const HERO_TEXT = {
  area: '2 ЭТАЖА / 1800 М²',
  amenities: [
    'Кардиозона / Кроссфит / Единоборства',
    'Сауна / Детская зона / Групповые тренировки',
  ],
  cta: 'Записаться на тренировку',
  galleryCta: 'Посмотреть клуб',
} as const;

const HERO_SLIDES = [
  { src: `${import.meta.env.BASE_URL}sections/hero-gym.png`, mobileSrc: `${import.meta.env.BASE_URL}sections/hero-gym-mobile.png`, label: 'Тренажёрный зал', position: 'center' },
  { src: `${import.meta.env.BASE_URL}sections/hero-cardio.png`, mobileSrc: `${import.meta.env.BASE_URL}sections/hero-cardio-mobile.png`, label: 'Кардиозона', position: 'center' },
  { src: `${import.meta.env.BASE_URL}sections/hero-functional.png`, mobileSrc: `${import.meta.env.BASE_URL}sections/hero-functional-mobile.png`, label: 'Функциональная зона', position: 'center' },
] as const;

// Introduces the club over a controllable slideshow of its existing photos.
export default function Hero({ onOpenModal }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState(() => HERO_SLIDES.map(() => false));
  const [isPaused, setIsPaused] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [isPageVisible, setIsPageVisible] = useState(() =>
    typeof document === 'undefined' || document.visibilityState !== 'hidden',
  );
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroRef = useRef<HTMLElement>(null);

  // Stops automatic movement when the visitor enables reduced motion or hides the tab.
  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Applies a newly enabled reduced-motion preference without overriding manual pause.
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) setIsPaused(true);
    };
    // Avoids advancing slides while the document is in the background.
    const handleVisibilityChange = () => setIsPageVisible(document.visibilityState !== 'hidden');

    motionPreference.addEventListener('change', handleMotionPreference);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      motionPreference.removeEventListener('change', handleMotionPreference);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Suspends the slideshow after the first screen scrolls out of view.
  useEffect(() => {
    if (!heroRef.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsHeroVisible(entry.isIntersecting);
    });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Advances only to a loaded photo and gives every selected frame a full six seconds.
  useEffect(() => {
    if (isPaused || !isPageVisible || !isHeroVisible) return;
    const nextSlide = (activeSlide + 1) % HERO_SLIDES.length;
    if (!loadedSlides[nextSlide]) return;

    const timeoutId = window.setTimeout(() => setActiveSlide(nextSlide), 6000);
    return () => window.clearTimeout(timeoutId);
  }, [activeSlide, loadedSlides, isPaused, isPageVisible, isHeroVisible]);

  // Keeps the current frame visible until a background photo has finished loading.
  const markSlideLoaded = (index: number) => {
    setLoadedSlides((previous) => previous[index]
      ? previous
      : previous.map((isLoaded, slideIndex) => slideIndex === index || isLoaded));
  };

  // Manual selection pauses autoplay so the chosen photo stays on screen.
  const selectSlide = (index: number) => {
    if (!loadedSlides[index]) return;
    setActiveSlide(index);
    setIsPaused(true);
  };

  // Moves visitors directly to the club photo gallery.
  const handleScrollToGallery = () => {
    document.getElementById('flors-anchor')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  };

  return (
    <section ref={heroRef} onFocusCapture={(event) => {
      if (!(event.target instanceof HTMLElement && event.target.closest('[data-slide-autoplay]'))) {
        setIsPaused(true);
      }
    }} aria-label="UltraPro: фотографии клуба" className="home-hero relative flex min-h-[100svh] items-center overflow-hidden bg-[#05060a]">
      <div className="hero-media-layer pointer-events-none absolute inset-0" aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => (index === 0 || loadedSlides[index - 1]) && (
          <div key={slide.src} className="hero-slide absolute inset-0" style={{ opacity: index === activeSlide ? 1 : 0 }}>
            <PublicAssetImage src={slide.src} mobileSrc={slide.mobileSrc} alt="" loading="eager" fetchPriority={index === 0 ? 'high' : 'low'} sizes="(max-aspect-ratio: 1672/941) 178vh, 100vw" showPlaceholder={false} onLoad={() => markSlideLoaded(index)} pictureClassName="block h-full w-full" className="h-full w-full object-cover" style={{ objectPosition: slide.position }} />
          </div>
        ))}
      </div>
      <div className="hero-overlay-layer pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,10,0.68)_0%,rgba(5,6,10,0.4)_45%,rgba(5,6,10,0.08)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05060a] to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-4 pt-28 pb-36 sm:px-6 md:block md:min-h-0 md:pt-36 lg:px-8 lg:pt-36 lg:pb-40">
        <div className="flex w-full flex-1 flex-col md:block">
          <p className="mb-6 text-[clamp(1rem,4.5vw,1.5rem)] font-black leading-[1.08] tracking-[-0.055em] text-[#fff]">
            <span className="block w-[142.857%] origin-left scale-x-[0.7] whitespace-nowrap uppercase">Фитнес-клуб UltraPro в Волжском</span>
          </p>
          <BalancedHeading as="h1" className="text-[min(14vw,12rem)] font-black leading-[1.08] tracking-[-0.055em] text-[#fff]">
            <span className="block w-[142.857%] origin-left scale-x-[0.7] whitespace-nowrap uppercase">ТВОЕ ВРЕМЯ<br />СТАТЬ СИЛЬНЕЕ</span>
          </BalancedHeading>
          <div className="mt-6 max-w-3xl text-[#fff]">
            <p className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">{HERO_TEXT.area}</p>
            <div className="mt-2 text-sm leading-relaxed sm:text-base">
              {HERO_TEXT.amenities.map((amenity) => (
                <p key={amenity}>{amenity}</p>
              ))}
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:gap-7">
            <button type="button" onClick={() => onOpenModal({ topic: 'free_trial' })} className="hero-cta hero-cta-primary">
              <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
              <span className="hero-cta-label"><span>{HERO_TEXT.cta} *</span></span>
              <ChevronsRight aria-hidden="true" />
            </button>
            <button type="button" onClick={handleScrollToGallery} className="hero-cta hero-cta-secondary">
              <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
              <span className="hero-cta-label"><span>{HERO_TEXT.galleryCta}</span></span>
              <ChevronsRight aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 text-sm text-white/70">*Бесплатно, по предварительной записи.</p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-20 z-20 sm:bottom-24 lg:bottom-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-x-4 gap-y-2 px-4 sm:px-6 lg:px-8">
          <div role="group" aria-label="Управление слайд-шоу" className="flex items-center gap-1">
            <button type="button" onClick={() => selectSlide((activeSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} disabled={!loadedSlides[(activeSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length]} aria-label="Предыдущее фото" className="hero-slide-control"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
            <div className="hidden sm:flex">
            {HERO_SLIDES.map((slide, index) => (
              <button key={slide.src} type="button" onClick={() => selectSlide(index)} disabled={!loadedSlides[index]} aria-label={`Фото ${index + 1}: ${slide.label}`} aria-pressed={index === activeSlide} className="hero-slide-control">
                <span className={index === activeSlide ? 'h-0.5 w-5 bg-[#F5B800]' : 'h-0.5 w-5 bg-white/40'} />
              </button>
            ))}
            </div>
            <button type="button" onClick={() => selectSlide((activeSlide + 1) % HERO_SLIDES.length)} disabled={!loadedSlides[(activeSlide + 1) % HERO_SLIDES.length]} aria-label="Следующее фото" className="hero-slide-control"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
            <button type="button" data-slide-autoplay onClick={() => setIsPaused((previous) => !previous)} aria-label={isPaused ? 'Включить автосмену фото' : 'Приостановить автосмену фото'} aria-pressed={!isPaused} className="hero-slide-control">
              {isPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
