import { useState, useEffect, type MouseEvent } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenModal: () => void;
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
  { label: 'Расписание', to: '/schedule' },
  { label: 'Тренеры', to: '/trainers' },
  { label: 'Абонементы', to: '/memberships' },
  { label: 'О нас', to: '/contacts' },
] as const;

export default function Header({ onOpenModal }: HeaderProps) {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleHomeNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') {
      return;
    }

    event.preventDefault();
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Закрыть мобильное меню"
          className="mobile-menu-overlay fixed inset-0 z-40 bg-[#05070c]/58 backdrop-blur-md lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header
        id="site-header"
        className={cn(
          'site-header fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled || isMobileMenuOpen
            ? 'header-scrolled bg-black/72 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
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
            <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
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
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F5B800] to-[#D89B00] lg:group-hover:w-full group-[.active]:w-full transition-all duration-300" />
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-4 sm:gap-5">
              <a
                href={HEADER_TEXT.phoneHref}
                aria-label={HEADER_TEXT.callAria}
                title={HEADER_TEXT.phone}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-300 bg-[linear-gradient(135deg,#F5B800_0%,#E2A700_55%,#C98E00_100%)] shadow-[0_4px_20px_rgba(245,184,0,0.4)] sm:h-10 sm:w-10 md:max-lg:h-12 md:max-lg:w-12 lg:hover:-translate-y-0.5 lg:hover:shadow-[0_8px_30px_rgba(245,184,0,0.5)]"
              >
                <Phone className="h-4 w-4 md:max-lg:h-5 md:max-lg:w-5" />
              </a>
              <div className="hidden lg:block">
                <button
                  onClick={onOpenModal}
                  className="rounded-full font-semibold text-white transition-all duration-300 bg-[linear-gradient(135deg,#F5B800_0%,#E2A700_55%,#C98E00_100%)] shadow-[0_4px_20px_rgba(245,184,0,0.4)] lg:hover:-translate-y-0.5 lg:hover:shadow-[0_8px_30px_rgba(245,184,0,0.5)] px-4 py-2 text-xs xl:px-6 xl:py-3 xl:text-sm"
                >
                  {HEADER_TEXT.cta}
                </button>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white md:max-lg:p-3 lg:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 md:max-lg:h-8 md:max-lg:w-8" />
                ) : (
                  <Menu className="h-6 w-6 md:max-lg:h-8 md:max-lg:w-8" />
                )}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="mobile-menu-surface lg:hidden border-t border-white/10 backdrop-blur-xl">
            <nav className="flex flex-col gap-4 p-4 md:max-lg:gap-6 md:max-lg:px-8 md:max-lg:py-6">
              {HEADER_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={(event) => {
                    if (item.to === '/') {
                      handleHomeNavigation(event);
                      return;
                    }

                    setIsMobileMenuOpen(false);
                  }}
                  className={({ isActive }) =>
                    cn(
                      'py-2 transition-colors md:max-lg:py-3 md:max-lg:text-xl',
                      isActive ? 'text-white active' : 'text-gray-300'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenModal();
                }}
                className="btn-primary mt-4 text-white md:max-lg:mt-6 md:max-lg:px-8 md:max-lg:py-4 md:max-lg:text-lg"
              >
                {HEADER_TEXT.cta}
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
