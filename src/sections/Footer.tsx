import { Suspense, lazy, useEffect, useState, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useViewportTier } from '@/hooks/useViewportTier';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/seo/siteConfig';

const PrivacyPolicyContent = lazy(async () => {
  const module = await import('@/components/PrivacyPolicyContent');
  return { default: module.PrivacyPolicyContent };
});

const OfferAgreementContent = lazy(async () => {
  const module = await import('@/components/OfferAgreementContent');
  return { default: module.OfferAgreementContent };
});

const FOOTER_ASSETS = {
  logo: `${import.meta.env.BASE_URL}logo.webp`,
  logoAlt: 'Логотип Ultra Pro Gym & Fitness',
} as const;

const FOOTER_NAV_ITEMS = [
  { label: 'Главная', to: '/' },
  { label: 'Расписание', to: '/schedule' },
  { label: 'Тренеры', to: '/trainers' },
  { label: 'Абонементы', to: '/memberships' },
  { label: 'О нас', to: '/contacts' },
] as const;

const FOOTER_TEXT = {
  company: '© 2026 Ultra Pro Gym & Fitness. Все права защищены.',
  scheduleTitle: 'График работы',
  phoneTitle: 'Телефон',
  emailTitle: 'E-mail',
  policyButton: 'Политика конфиденциальности',
  offerButton: 'Договор офферты',
  closePolicyAria: 'Закрыть политику конфиденциальности',
  closeOfferAria: 'Закрыть договор офферты',
  inn: 'ИНН 343521265164',
  ogrnip: 'ОГРНИП 326344300004743',
  email: 'ultrapro.fitness34@yandex.ru',
} as const;

const FOOTER_DOCUMENT_FALLBACK = 'Загрузка документа...';

export default function Footer() {
  const { pathname } = useLocation();
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const viewportTier = useViewportTier();
  const isMobileViewport = viewportTier === 'mobile';

  const handleHomeNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') {
      return;
    }

    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isPolicyOpen && !isOfferOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPolicyOpen(false);
        setIsOfferOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOfferOpen, isPolicyOpen]);

  return (
    <footer className="py-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-10 lg:grid-cols-[minmax(300px,1fr)_minmax(250px,0.8fr)_minmax(180px,0.55fr)] lg:items-start lg:gap-16 xl:gap-20">
          <div className="order-2 space-y-5 pt-2 md:order-1 md:pt-0 lg:order-1">
            <NavLink to="/" className="flex items-center justify-center md:justify-start" end onClick={handleHomeNavigation}>
              <img
                src={FOOTER_ASSETS.logo}
                alt={FOOTER_ASSETS.logoAlt}
                loading="lazy"
                decoding="async"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </NavLink>
            <div className="space-y-2 text-center md:text-left">
              <p className="text-sm text-gray-300">{FOOTER_TEXT.company}</p>
              <p className="text-xs sm:text-sm text-gray-500">{FOOTER_TEXT.inn}</p>
              <p className="text-xs sm:text-sm text-gray-500">{FOOTER_TEXT.ogrnip}</p>
            </div>
            <div className="flex flex-col items-center gap-3 pt-2 md:items-start">
              <button
                type="button"
                onClick={() => setIsPolicyOpen(true)}
                className="text-sm text-gray-400 transition-colors lg:hover:text-white"
              >
                {FOOTER_TEXT.policyButton}
              </button>
              <button
                type="button"
                onClick={() => setIsOfferOpen(true)}
                className="text-sm text-gray-400 transition-colors lg:hover:text-white"
              >
                {FOOTER_TEXT.offerButton}
              </button>
            </div>
          </div>

          <div className="order-1 space-y-4 text-center md:order-2 md:space-y-5 md:text-left lg:order-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{FOOTER_TEXT.scheduleTitle}</p>
                <p className="text-sm text-gray-300">{siteConfig.business.openingHoursText}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{FOOTER_TEXT.phoneTitle}</p>
                <a
                  href={siteConfig.business.phoneHref}
                  className="text-sm text-gray-300 transition-colors lg:hover:text-white"
                >
                  {siteConfig.business.phone}
                </a>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{FOOTER_TEXT.emailTitle}</p>
                <a
                  href={`mailto:${FOOTER_TEXT.email}`}
                  className="text-sm text-gray-300 transition-colors lg:hover:text-white break-all"
                >
                  {FOOTER_TEXT.email}
                </a>
              </div>
            </div>
          </div>

          {!isMobileViewport ? (
            <div className="text-center md:col-span-2 md:border-t md:border-white/5 md:pt-6 lg:order-3 lg:col-span-1 lg:border-t-0 lg:pt-0 lg:justify-self-end lg:text-left">
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-8 lg:flex-col lg:items-start lg:justify-start lg:gap-4">
                {FOOTER_NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={item.to === '/' ? handleHomeNavigation : undefined}
                    className={({ isActive }) =>
                      cn(
                        'relative whitespace-nowrap text-lg md:text-base lg:text-sm',
                        isActive ? 'text-white' : 'text-gray-300 md:hover:text-white'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          ) : null}
        </div>
      </div>

      {isPolicyOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center overflow-hidden p-4 sm:p-6"
          onClick={() => setIsPolicyOpen(false)}
        >
          <div className="document-modal-overlay absolute inset-0 bg-[#05070c]/82 backdrop-blur-md" />
          <div
            className="glass-card modal-surface relative mx-auto my-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-white/10 p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100vh-3rem)] sm:max-h-[calc(100dvh-3rem)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPolicyOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-300 transition-colors lg:hover:bg-white/10 lg:hover:text-white"
              aria-label={FOOTER_TEXT.closePolicyAria}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="document-modal-scroll min-h-0 flex-1 overflow-y-auto pr-2 pt-8 sm:pr-3 sm:pt-10">
              <Suspense fallback={<p className="text-sm text-gray-300">{FOOTER_DOCUMENT_FALLBACK}</p>}>
                <PrivacyPolicyContent />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {isOfferOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center overflow-hidden p-4 sm:p-6"
          onClick={() => setIsOfferOpen(false)}
        >
          <div className="document-modal-overlay absolute inset-0 bg-[#05070c]/82 backdrop-blur-md" />
          <div
            className="glass-card modal-surface relative mx-auto my-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-white/10 p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100vh-3rem)] sm:max-h-[calc(100dvh-3rem)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOfferOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-300 transition-colors lg:hover:bg-white/10 lg:hover:text-white"
              aria-label={FOOTER_TEXT.closeOfferAria}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="document-modal-scroll min-h-0 flex-1 overflow-y-auto pr-2 pt-8 sm:pr-3 sm:pt-10">
              <Suspense fallback={<p className="text-sm text-gray-300">{FOOTER_DOCUMENT_FALLBACK}</p>}>
                <OfferAgreementContent />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
