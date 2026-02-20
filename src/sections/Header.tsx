import { useState, useEffect } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { SECTION_ROUTE_PATHS } from '@/navigation/sectionRoutes';

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
  { label: 'Фитнес клуб', href: SECTION_ROUTE_PATHS.flors },
  { label: 'Расписание', href: SECTION_ROUTE_PATHS.schedule },
  { label: 'Тренеры', href: SECTION_ROUTE_PATHS.trainers },
  { label: 'Абонементы', href: SECTION_ROUTE_PATHS.subscriptions },
  { label: 'Контакты', href: SECTION_ROUTE_PATHS.contacts },
] as const;

export default function Header({ onOpenModal }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 xl:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href={SECTION_ROUTE_PATHS.home} className="flex items-center group">
            <img
              src={HEADER_ASSETS.logo}
              alt={HEADER_ASSETS.logoAlt}
              loading="eager"
              decoding="async"
              className="h-7 lg:h-8 xl:h-9 w-auto object-contain brightness-0 invert lg:group-hover:opacity-90 transition-opacity"
            />
          </a>
          <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
            {HEADER_NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs xl:text-sm text-gray-300 lg:hover:text-white transition-colors relative group whitespace-nowrap"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F5B800] to-[#D89B00] lg:group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4 sm:gap-5">
            <a
              href={HEADER_TEXT.phoneHref}
              aria-label={HEADER_TEXT.callAria}
              title={HEADER_TEXT.phone}
              className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-white transition-all duration-300 bg-[linear-gradient(135deg,#F5B800_0%,#E2A700_55%,#C98E00_100%)] shadow-[0_4px_20px_rgba(245,184,0,0.4)] lg:hover:-translate-y-0.5 lg:hover:shadow-[0_8px_30px_rgba(245,184,0,0.5)]"
            >
              <Phone className="h-4 w-4" />
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
              className="lg:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/5">
          <nav className="flex flex-col p-4 gap-4">
            {HEADER_NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 lg:hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenModal();
              }}
              className="btn-primary text-white mt-4"
            >
              {HEADER_TEXT.cta}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
