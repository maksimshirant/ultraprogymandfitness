import { Suspense, lazy, useEffect, useState, type MouseEvent } from 'react';
import { Phone, MapPin, Clock3, X } from 'lucide-react';
import { SiVk, SiTelegram } from 'react-icons/si';

const PrivacyPolicyContent = lazy(async () => {
  const module = await import('@/components/PrivacyPolicyContent');
  return { default: module.PrivacyPolicyContent };
});

const OfferAgreementContent = lazy(async () => {
  const module = await import('@/components/OfferAgreementContent');
  return { default: module.OfferAgreementContent };
});

interface FooterProps {
  onOpenModal: () => void;
}

const FOOTER_ASSETS = {
  logo: `${import.meta.env.BASE_URL}logo.webp`,
} as const;

const FOOTER_TEXT = {
  logoAlt: 'Ultra Pro Gym & Fitness',
  sectionsTitle: 'РАЗДЕЛЫ',
  mapTitle: 'КАРТА',
  openMap: 'Открыть карту',
  openMapAria: 'Открыть карту на весь экран',
  closeMapAria: 'Закрыть карту',
  cta: 'Записаться на тренировку',
  copyright: '© 2026 Ultra Pro Gym & Fitness. Все права защищены.',
  policyButton: 'Политика конфиденциальности',
  offerButton: 'Договор офферты',
  closePolicyAria: 'Закрыть политику конфиденциальности',
  closeOfferAria: 'Закрыть договор офферты',
  mapFrameTitle: 'Карта: г. Волжский, Профсоюзов 7Б, ТЦ Радуга',
  intro:
    'Пространство для регулярных тренировок, восстановления и стабильного прогресса. Выберите удобный формат посещения и начните уже сейчас.',
  address: 'г. Волжский, Профсоюзов 7Б, ТЦ Радуга',
  phone: '8(8443) 323-323',
  phoneHref: 'tel:+78443323323',
  schedule: 'Ежедневно: 07:00 - 23:00',
  vkLabel: 'VK',
  telegramLabel: 'Telegram',
  vkAria: 'VK',
  telegramAria: 'Telegram',
} as const;

const FOOTER_LINKS = [
  { label: 'Галерея', href: '#gallery' },
  { label: 'Тренеры', href: '#trainers' },
  { label: 'Абонементы', href: '#subscriptions' },
  { label: 'Частые вопросы', href: '#faq' },
] as const;

const FOOTER_SOCIALS = {
  vk: 'https://vk.com/ultrapro_fitness_vlz',
  telegram: 'https://t.me/ultrapro_fitness_vlz',
} as const;

const FOOTER_MAP_SRC =
  'https://yandex.ru/map-widget/v1/?mode=search&text=%D0%B3.%20%D0%92%D0%BE%D0%BB%D0%B6%D1%81%D0%BA%D0%B8%D0%B9%2C%20%D0%9F%D1%80%D0%BE%D1%84%D1%81%D0%BE%D1%8E%D0%B7%D0%BE%D0%B2%207%D0%91%2C%20%D0%A2%D0%A6%20%D0%A0%D0%B0%D0%B4%D1%83%D0%B3%D0%B0&z=17';
const FOOTER_DOCUMENT_FALLBACK = 'Загрузка документа...';

const FOOTER_SCROLL_OFFSET = 96;
const FOOTER_SCROLL_RETRY_LIMIT = 25;
const FOOTER_SCROLL_RETRY_DELAY = 120;

export default function Footer({ onOpenModal }: FooterProps) {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (!isPolicyOpen && !isOfferOpen && !isMapOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPolicyOpen(false);
        setIsOfferOpen(false);
        setIsMapOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMapOpen, isOfferOpen, isPolicyOpen]);

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) {
      return;
    }

    event.preventDefault();

    const targetId = href.slice(1);
    window.history.replaceState(null, '', href);

    const scrollToTarget = (attempt = 0) => {
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        if (attempt < FOOTER_SCROLL_RETRY_LIMIT) {
          window.setTimeout(() => scrollToTarget(attempt + 1), FOOTER_SCROLL_RETRY_DELAY);
        }
        return;
      }

      const targetTop =
        targetElement.getBoundingClientRect().top + window.pageYOffset - FOOTER_SCROLL_OFFSET;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: 'smooth',
      });
    };

    scrollToTarget();
  };

  return (
    <footer id="contacts" className="py-16 border-t border-white/5 relative overflow-hidden">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="md:col-span-2">
            <a href="#" className="inline-flex items-center mb-5">
              <img
                src={FOOTER_ASSETS.logo}
                alt={FOOTER_TEXT.logoAlt}
                loading="lazy"
                decoding="async"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </a>

            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              {FOOTER_TEXT.intro}
            </p>

            <div className="mt-6 space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F5B800]" />
                <span>{FOOTER_TEXT.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F5B800]" />
                <a href={FOOTER_TEXT.phoneHref} className="hover:text-white transition-colors">
                  {FOOTER_TEXT.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-[#F5B800]" />
                <span>{FOOTER_TEXT.schedule}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <a
                href={FOOTER_SOCIALS.vk}
                className="h-10 px-4 rounded-full bg-white/5 flex items-center justify-center gap-2 hover:bg-[#F5B800] hover:text-black transition-colors text-sm font-semibold text-gray-300"
                aria-label={FOOTER_TEXT.vkAria}
              >
                <SiVk className="w-4 h-4" />
                {FOOTER_TEXT.vkLabel}
              </a>
              <a
                href={FOOTER_SOCIALS.telegram}
                className="h-10 px-4 rounded-full bg-white/5 flex items-center justify-center gap-2 hover:bg-[#F5B800] hover:text-black transition-colors text-sm font-semibold text-gray-300"
                aria-label={FOOTER_TEXT.telegramAria}
              >
                <SiTelegram className="w-4 h-4" />
                {FOOTER_TEXT.telegramLabel}
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{FOOTER_TEXT.mapTitle}</h4>
            <div
              className="relative rounded-xl overflow-hidden border border-white/10 bg-black/30 h-[220px] cursor-zoom-in"
              onClick={() => setIsMapOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setIsMapOpen(true);
                }
              }}
              aria-label={FOOTER_TEXT.openMapAria}
            >
              <iframe
                title={FOOTER_TEXT.mapFrameTitle}
                src={FOOTER_MAP_SRC}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full pointer-events-none"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 text-xs text-white border border-white/15">
                {FOOTER_TEXT.openMap}
              </div>
            </div>
          </div>

          <div className="md:hidden lg:block">
            <h4 className="text-white font-semibold text-sm mb-4">{FOOTER_TEXT.sectionsTitle}</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    onClick={(event) => handleAnchorClick(event, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <button onClick={onOpenModal} className="btn-primary text-white mt-6 w-full">
              {FOOTER_TEXT.cta}
            </button>
          </div>
        </div>

        <div className="hidden md:flex lg:hidden mt-10 pt-6 border-t border-white/5 items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors text-sm"
                onClick={(event) => handleAnchorClick(event, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button onClick={onOpenModal} className="btn-primary text-white whitespace-nowrap">
            {FOOTER_TEXT.cta}
          </button>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-gray-500 text-sm">{FOOTER_TEXT.copyright}</p>
          <div className="flex items-center flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setIsPolicyOpen(true)}
              className="text-gray-500 text-sm hover:text-white transition-colors text-left sm:text-right"
            >
              {FOOTER_TEXT.policyButton}
            </button>
            <button
              type="button"
              onClick={() => setIsOfferOpen(true)}
              className="text-gray-500 text-sm hover:text-white transition-colors text-left sm:text-right"
            >
              {FOOTER_TEXT.offerButton}
            </button>
          </div>
        </div>
      </div>

      {isPolicyOpen && (
        <div
          className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setIsPolicyOpen(false)}
        >
          <div
            className="relative max-w-3xl mx-auto max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#111117] p-6 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPolicyOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label={FOOTER_TEXT.closePolicyAria}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <Suspense fallback={<p className="text-sm text-gray-300">{FOOTER_DOCUMENT_FALLBACK}</p>}>
              <PrivacyPolicyContent />
            </Suspense>
          </div>
        </div>
      )}

      {isOfferOpen && (
        <div
          className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setIsOfferOpen(false)}
        >
          <div
            className="relative max-w-3xl mx-auto max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#111117] p-6 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOfferOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label={FOOTER_TEXT.closeOfferAria}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <Suspense fallback={<p className="text-sm text-gray-300">{FOOTER_DOCUMENT_FALLBACK}</p>}>
              <OfferAgreementContent />
            </Suspense>
          </div>
        </div>
      )}

      {isMapOpen && (
        <div
          className="fixed inset-0 z-[140] bg-black/90 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setIsMapOpen(false)}
        >
          <div
            className="relative max-w-6xl mx-auto h-[90vh] rounded-2xl border border-white/10 bg-[#111117] p-4 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsMapOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center z-10"
              aria-label={FOOTER_TEXT.closeMapAria}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="h-full rounded-xl overflow-hidden border border-white/10">
              <iframe
                title={FOOTER_TEXT.mapFrameTitle}
                src={FOOTER_MAP_SRC}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
