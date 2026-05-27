import { Suspense, lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/widgets/site-layout/ui/Header';
import ScrollToTop from '@/app/router/ScrollToTop';
import type { OpenModalHandler } from '@/features/lead-request/model/types';

const Footer = lazy(() => import('@/widgets/site-layout/ui/Footer'));

interface MainLayoutProps {
  onOpenModal: OpenModalHandler;
}

export default function MainLayout({ onOpenModal }: MainLayoutProps) {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  return (
    <>
      <ScrollToTop />
      <Header onOpenModal={onOpenModal} />
      <main className={isHomePage ? '' : 'pt-16 lg:pt-20'}>
        <Outlet />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
