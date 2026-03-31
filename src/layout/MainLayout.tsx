import { Suspense, lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/sections/Header';
import ScrollToTop from '@/router/ScrollToTop';

const Footer = lazy(() => import('@/sections/Footer'));

interface MainLayoutProps {
  onOpenModal: () => void;
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
