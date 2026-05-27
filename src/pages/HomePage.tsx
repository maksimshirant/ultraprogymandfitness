import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import Hero from '@/widgets/home-hero/ui/Hero';
import { SectionFallback } from '@/shared/ui/SectionFallback';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';
import type { OpenModalHandler } from '@/features/lead-request/model/types';

const HomePreviews = lazy(() => import('@/widgets/home-previews/ui/HomePreviews'));
const Flors = lazy(() => import('@/widgets/home-floors/ui/Flors'));
const TryFree = lazy(() => import('@/widgets/try-free/ui/TryFree'));
const FAQ = lazy(() => import('@/widgets/faq/ui/FAQ'));

interface HomePageProps {
  onOpenModal: OpenModalHandler;
}

export default function HomePage({ onOpenModal }: HomePageProps) {
  const [shouldRenderFlors, setShouldRenderFlors] = useState(false);
  const florsAnchorRef = useRef<HTMLDivElement>(null);

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

      <Suspense fallback={<SectionFallback />}>
        <HomePreviews />
      </Suspense>

      <div id="flors-anchor" ref={florsAnchorRef} className="mt-12 scroll-mt-24 md:mt-16 lg:mt-20">
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
