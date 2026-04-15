import { Suspense, lazy, useEffect, useState, type MouseEvent } from 'react';
import { LegalDocumentModal } from '@/components/LegalDocumentModal';
import { NavLink, useLocation } from 'react-router-dom';
import { useViewportTier } from '@/hooks/useViewportTier';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/seo/siteConfig';

const PrivacyPolicyContent = lazy(async () => {
  const module = await import('@/components/PrivacyPolicyContent');
  return { default: module.PrivacyPolicyContent };
});

const PersonalDataConsentContent = lazy(async () => {
  const module = await import('@/components/PersonalDataConsentContent');
  return { default: module.PersonalDataConsentContent };
});

const FOOTER_ASSETS = {
  logo: `${import.meta.env.BASE_URL}logo.webp`,
  logoAlt: 'Логотип Ultra Pro Gym & Fitness',
} as const;

const FOOTER_NAV_ITEMS = [
  { label: 'Главная', to: '/' },
  { label: 'Групповые тренировки', to: '/schedule' },
  { label: 'Тренеры', to: '/trainers' },
  { label: 'Абонементы', to: '/memberships' },
  { label: 'Отзывы и контакты', to: '/contacts' },
] as const;

const FOOTER_TEXT = {
  company: '© 2026 Ultra Pro Gym & Fitness. Все права защищены.',
  scheduleTitle: 'График работы',
  addressTitle: 'Адрес',
  phoneTitle: 'Телефон',
  emailTitle: 'E-mail',
  policyButton: 'Политика обработки персональных данных',
  consentButton: 'Согласие на обработку персональных данных',
  closeDocumentAria: 'Закрыть документ',
  inn: 'ИНН 343521265164',
  ogrnip: 'ОГРНИП 326344300004743',
  email: 'ultrapro.fitness34@yandex.ru',
} as const;

const FOOTER_DOCUMENT_FALLBACK = 'Загрузка документа...';

const FOOTER_OPENING_HOURS_COMPACT = 'Пн-Сб: 07:00–00:00, Вскр: 07:00–22:00';

export default function Footer() {
  const { pathname } = useLocation();
  const [activeDocument, setActiveDocument] = useState<FooterDocument>(null);
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
    if (!activeDocument) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDocument(null);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeDocument]);

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
                onClick={() => setActiveDocument('privacy')}
                className="text-sm text-gray-400 transition-colors lg:hover:text-white"
              >
                {FOOTER_TEXT.policyButton}
              </button>
              <button
                type="button"
                onClick={() => setActiveDocument('consent')}
                className="text-sm text-gray-400 transition-colors lg:hover:text-white"
              >
                {FOOTER_TEXT.consentButton}
              </button>
            </div>
          </div>

          <div className="order-1 space-y-4 text-center md:order-2 md:space-y-5 md:text-left lg:order-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{FOOTER_TEXT.scheduleTitle}</p>
                <p className="text-sm text-gray-300">{FOOTER_OPENING_HOURS_COMPACT}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{FOOTER_TEXT.addressTitle}</p>
                <p className="text-sm text-gray-300">{siteConfig.business.addressText}</p>
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

      <LegalDocumentModal
        isOpen={activeDocument !== null}
        onClose={() => setActiveDocument(null)}
        closeAriaLabel={FOOTER_TEXT.closeDocumentAria}
        zIndexClassName="z-[130]"
      >
        <Suspense fallback={<p className="text-sm text-gray-300">{FOOTER_DOCUMENT_FALLBACK}</p>}>
          {activeDocument === 'privacy' ? <PrivacyPolicyContent /> : null}
          {activeDocument === 'consent' ? <PersonalDataConsentContent /> : null}
        </Suspense>
      </LegalDocumentModal>
    </footer>
  );
}
