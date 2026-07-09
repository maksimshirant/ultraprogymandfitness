import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Phone } from 'lucide-react';
import { zeroRightClassName } from 'react-remove-scroll-bar';
import { NavLink, useLocation } from 'react-router-dom';
import { useViewportTier } from '@/hooks/useViewportTier';
import { cn } from '@/lib/utils';
import type { OpenModalHandler } from '@/types/modal';
import { DesktopScrollNavigation } from './DesktopScrollNavigation';
import { MobileBottomNavigation } from './MobileBottomNavigation';

interface HeaderProps {
  onOpenModal: OpenModalHandler;
}

const HEADER_ASSETS = {
  logo: `${import.meta.env.BASE_URL}logo.webp`,
  logoAlt: 'Логотип Ultra Pro Gym & Fitness',
} as const;

const HEADER_TEXT = {
  cta: 'Записаться на тренировку',
  phone: '8(8443) 323-323',
  phoneHref: 'tel:+78443323323',
  callAria: 'Позвонить в Ultra Pro Gym & Fitness',
} as const;

const HEADER_NAV_ITEMS = [
  { label: 'Главная', to: '/' },
  { label: 'Групповые тренировки', to: '/schedule' },
  { label: 'Тренеры', to: '/trainers' },
  { label: 'Абонементы', to: '/memberships' },
  { label: 'Отзывы и контакты', to: '/contacts' },
] as const;

export default function Header({ onOpenModal }: HeaderProps) {
  const { pathname } = useLocation();
  const [isDesktopBottomNavigationVisible, setIsDesktopBottomNavigationVisible] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const viewportTier = useViewportTier();
  const isDesktopViewport = viewportTier === 'desktop';

  const handleHomeNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') {
      return;
    }

    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let frameId: number | null = null;

    const syncHeaderScrolledState = () => {
      frameId = null;
      const headerElement = headerRef.current;

      if (!headerElement) {
        return;
      }

      const isScrolled = window.scrollY > 0;
      headerElement.classList.toggle('header-scrolled', isScrolled);
      setIsDesktopBottomNavigationVisible((previous) => (previous === isScrolled ? previous : isScrolled));
    };

    const scheduleHeaderSync = () => {
      if (frameId !== null) {
        return;
      }

      frameId = requestAnimationFrame(syncHeaderScrolledState);
    };

    scheduleHeaderSync();
    window.addEventListener('scroll', scheduleHeaderSync, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleHeaderSync);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <>
      <header
        id="site-header"
        ref={headerRef}
        className={cn(
          'site-header fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-transparent transition-[transform,background-color,border-color,backdrop-filter,opacity] duration-500',
          zeroRightClassName,
          isDesktopViewport && isDesktopBottomNavigationVisible && 'pointer-events-none -translate-y-full opacity-0',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:max-lg:px-8 lg:px-5 xl:px-8">
          <div className="flex items-center justify-between h-16 md:max-lg:h-24 lg:h-20">
            <NavLink to="/" className="flex items-center group" end onClick={handleHomeNavigation}>
              <img
                src={HEADER_ASSETS.logo}
                alt={HEADER_ASSETS.logoAlt}
                loading="eager"
                decoding="async"
                className="h-7 w-auto object-contain brightness-0 invert transition-opacity md:max-lg:h-10 lg:h-8 lg:group-hover:opacity-90 xl:h-9"
              />
            </NavLink>
            {isDesktopViewport ? (
              <nav className="flex items-center gap-4 xl:gap-8">
                {HEADER_NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={item.to === '/' ? handleHomeNavigation : undefined}
                    className={({ isActive }) =>
                      cn(
                        'text-xs xl:text-sm transition-colors relative group whitespace-nowrap',
                        isActive ? 'text-white active' : 'text-gray-300 lg:hover:text-white'
                      )
                    }
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-[#F5B800] to-[#D89B00] transition-[width] duration-300 lg:group-hover:w-full group-[.active]:w-full" />
                  </NavLink>
                ))}
              </nav>
            ) : null}
            <div className="flex items-center gap-4 sm:gap-5">
              <a
                href={HEADER_TEXT.phoneHref}
                aria-label={HEADER_TEXT.callAria}
                title={HEADER_TEXT.phone}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F5B800_0%,#E2A700_55%,#C98E00_100%)] text-white shadow-[0_4px_20px_rgba(245,184,0,0.4)] transition-[box-shadow,background-color,color,opacity] duration-300 sm:h-10 sm:w-10 md:max-lg:h-12 md:max-lg:w-12 lg:hover:shadow-[0_8px_30px_rgba(245,184,0,0.5)]"
              >
                <Phone className="h-4 w-4 md:max-lg:h-5 md:max-lg:w-5" />
              </a>
              {isDesktopViewport ? (
                <div>
                  <button

                    type="button"
                    onClick={() => onOpenModal()}
                    className="rounded-full bg-[linear-gradient(135deg,#F5B800_0%,#E2A700_55%,#C98E00_100%)] px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(245,184,0,0.4)] transition-[box-shadow,background-color,color,opacity] duration-300 lg:hover:shadow-[0_8px_30px_rgba(245,184,0,0.5)] xl:px-6 xl:py-3 xl:text-sm"
                  >
                    {HEADER_TEXT.cta}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>
      {!isDesktopViewport ? <MobileBottomNavigation onHomeNavigation={handleHomeNavigation} /> : null}
      {isDesktopViewport ? (
        <DesktopScrollNavigation
          isVisible={isDesktopBottomNavigationVisible}
          onHomeNavigation={handleHomeNavigation}
          onOpenModal={onOpenModal}
        />
      ) : null}
    </>
  );
}
