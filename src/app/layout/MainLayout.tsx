import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/widgets/header/ui/Header';
import ScrollToTop from '@/router/ScrollToTop';
import type { OpenModalHandler } from '@/types/modal';

const Footer = lazy(() => import('@/widgets/footer/ui/Footer'));

interface MainLayoutProps {
  onOpenModal: OpenModalHandler;
}

export default function MainLayout({ onOpenModal }: MainLayoutProps) {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  const [shouldRenderFooter, setShouldRenderFooter] = useState(false);
  const footerAnchorRef = useRef<HTMLDivElement>(null);

  // Keeps the footer chunk out of the startup path until it is near the viewport.
  useEffect(() => {
    if (shouldRenderFooter) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      const frameId = requestAnimationFrame(() => {
        setShouldRenderFooter(true);
      });

      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRenderFooter(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );

    const anchor = footerAnchorRef.current;
    if (anchor) {
      observer.observe(anchor);
    }

    return () => observer.disconnect();
  }, [shouldRenderFooter]);

  return (
    <>
      <ScrollToTop />
      <Header onOpenModal={onOpenModal} />
      <main className={isHomePage ? '' : 'pt-16 lg:pt-20'}>
        <Outlet />
      </main>
      <div ref={footerAnchorRef} className="min-h-32">
        {shouldRenderFooter ? (
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        ) : null}
      </div>
    </>
  );
}
