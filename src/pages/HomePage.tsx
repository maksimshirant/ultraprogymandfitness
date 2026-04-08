import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import Hero from '@/sections/Hero';
import { SectionFallback } from '@/components/SectionFallback';
import PreviewCard from '@/components/PreviewCard';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';

const Flors = lazy(() => import('@/sections/Flors'));
const TryFree = lazy(() => import('@/sections/TryFree'));
const FAQ = lazy(() => import('@/sections/FAQ'));

interface HomePageProps {
  onOpenModal: (topic?: string | unknown, trainer?: string | unknown) => void;
}

export default function HomePage({ onOpenModal }: HomePageProps) {
  const [shouldRenderFlors, setShouldRenderFlors] = useState(false);
  const florsAnchorRef = useRef<HTMLDivElement>(null);

  const schedulePreviewImage = `${import.meta.env.BASE_URL}floors/floor2/group-workouts/4.jpeg`;
  const trainersPreviewImage = `${import.meta.env.BASE_URL}floors/floor2/crossfit-zone/5.jpg`;
  const membershipsPreviewImage = `${import.meta.env.BASE_URL}floors/floor1/RESEPTION/1.webp`;

  useEffect(() => {
    if (shouldRenderFlors) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      const frameId = requestAnimationFrame(() => {
        setShouldRenderFlors(true);
      });

      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRenderFlors(true);
          observer.disconnect();
        }
      },
      { rootMargin: '140px 0px' }
    );

    const anchor = florsAnchorRef.current;
    if (anchor) {
      observer.observe(anchor);
    }

    return () => observer.disconnect();
  }, [shouldRenderFlors]);

  return (
    <>
      <Seo {...pageSeo.home} />
      <Hero onOpenModal={onOpenModal} />
      <section id="home-previews" className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="hero-glow-layer">
          <div className="hero-glow-top-right" />
          <div className="hero-glow-bottom-left" />
          <div className="hero-glow-center" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-10 md:mb-12">
            <BalancedHeading as="h2" className="section-title text-white">
              <HeadingAccent>Разделы</HeadingAccent>
            </BalancedHeading>
          </div>

          <div className="space-y-8 md:space-y-12 lg:space-y-14">
            <PreviewCard
              imageSrc={schedulePreviewImage}
              title="Групповые занятия"
              buttonLabel="Открыть расписание"
              route="/schedule"
              description="Выберите направление под цель и график. На странице — актуальное расписание и формат занятий."
            />
            <PreviewCard
              imageSrc={trainersPreviewImage}
              title="Тренеры"
              buttonLabel="Выбрать тренера"
              route="/trainers"
              description="Команда специалистов, которые помогут выстроить программу и держать стабильный прогресс."
              reverse
            />
            <PreviewCard
              imageSrc={membershipsPreviewImage}
              title="Абонементы"
              buttonLabel="Выбрать абонементы"
              route="/memberships"
              description="Подберите формат посещения: от быстрого старта до годового плана — с понятными условиями."
            />
          </div>
        </div>
      </section>

      <div ref={florsAnchorRef} className="mt-12 md:mt-16 lg:mt-20">
        {shouldRenderFlors ? (
          <Suspense fallback={<SectionFallback />}>
            <Flors />
          </Suspense>
        ) : (
          <SectionFallback />
        )}
      </div>

      <Suspense fallback={<SectionFallback />}>
        <TryFree onOpenModal={onOpenModal} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FAQ />
      </Suspense>
    </>
  );
}
