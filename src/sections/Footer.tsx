import { Suspense, lazy, useEffect, useState } from 'react';
import { Phone, MapPin, Clock3, Star, X } from 'lucide-react';
import { SiVk, SiTelegram } from 'react-icons/si';
import { SECTION_ROUTE_PATHS } from '@/navigation/sectionRoutes';

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
  logoAlt: 'Логотип Ultra Pro Gym & Fitness',
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
  schedule: [
    { day: 'Понедельник–Суббота:', time: '07:00–00:00' },
    { day: 'Воскресенье:', time: '07:00–22:00' },
  ],
  vkLabel: 'VK',
  telegramLabel: 'Telegram',
  reviewsLabel: 'Отзывы',
  vkAria: 'VK',
  telegramAria: 'Telegram',
  reviewsAria: 'Отзывы в Яндекс Картах',
  inn: 'ИНН 343521265164',
  ogrnip: 'ОГРНИП 326344300004743',
} as const;

const FOOTER_LINKS = [
  { label: 'Фитнес клуб', href: SECTION_ROUTE_PATHS.flors },
  { label: 'Тренеры', href: SECTION_ROUTE_PATHS.trainers },
  { label: 'Абонементы', href: SECTION_ROUTE_PATHS.subscriptions },
  { label: 'Частые вопросы', href: SECTION_ROUTE_PATHS.faq },
] as const;

const FOOTER_SOCIALS = {
  vk: 'https://vk.com/ultrapro_fitness_vlz',
  telegram: 'https://t.me/ultrapro_fitness_vlz',
  reviews: 'https://yandex.com/maps/org/ultra_pro/233756976456/reviews/?ll=44.777002%2C48.777976&z=16',
} as const;

const FOOTER_MAP_QUERY = 'г. Волжский, Профсоюзов 7б, УльтраПро';
const FOOTER_MAP_SRC = `https://yandex.ru/map-widget/v1/?mode=search&text=${encodeURIComponent(
  FOOTER_MAP_QUERY
)}&z=17`;
const FOOTER_DOCUMENT_FALLBACK = 'Загрузка документа...';

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
            <a href={SECTION_ROUTE_PATHS.home} className="inline-flex items-center mb-5">
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
                <a href={FOOTER_TEXT.phoneHref} className="lg:hover:text-white transition-colors">
                  {FOOTER_TEXT.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock3 className="w-4 h-4 text-[#F5B800] mt-0.5" />
                <div className="space-y-1">
                  {FOOTER_TEXT.schedule.map((slot) => (
                    <p key={slot.day} className="leading-snug">
                      <span className="text-gray-400 mr-2">{slot.day}</span>
                      <span>{slot.time}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <a
                href={FOOTER_SOCIALS.vk}
                className="h-10 px-4 rounded-full bg-white/5 flex items-center justify-center gap-2 lg:hover:bg-[#F5B800] lg:hover:text-black transition-colors text-sm font-semibold text-gray-300"
                aria-label={FOOTER_TEXT.vkAria}
              >
                <SiVk className="w-4 h-4" />
                {FOOTER_TEXT.vkLabel}
              </a>
              <a
                href={FOOTER_SOCIALS.telegram}
                className="h-10 px-4 rounded-full bg-white/5 flex items-center justify-center gap-2 lg:hover:bg-[#F5B800] lg:hover:text-black transition-colors text-sm font-semibold text-gray-300"
                aria-label={FOOTER_TEXT.telegramAria}
              >
                <SiTelegram className="w-4 h-4" />
                {FOOTER_TEXT.telegramLabel}
              </a>
              <a
                href={FOOTER_SOCIALS.reviews}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 rounded-full bg-white/5 flex items-center justify-center gap-2 lg:hover:bg-[#F5B800] lg:hover:text-black transition-colors text-sm font-semibold text-gray-300"
                aria-label={FOOTER_TEXT.reviewsAria}
              >
                <Star className="w-4 h-4" />
                {FOOTER_TEXT.reviewsLabel}
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
                    className="text-gray-400 lg:hover:text-white transition-colors text-sm"
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
                className="text-gray-400 lg:hover:text-white transition-colors text-sm"
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
              className="text-gray-500 text-sm lg:hover:text-white transition-colors text-left sm:text-right"
            >
              {FOOTER_TEXT.policyButton}
            </button>
            <button
              type="button"
              onClick={() => setIsOfferOpen(true)}
              className="text-gray-500 text-sm lg:hover:text-white transition-colors text-left sm:text-right"
            >
              {FOOTER_TEXT.offerButton}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1 text-gray-500 text-xs sm:text-sm">
          <p>{FOOTER_TEXT.inn}</p>
          <p>{FOOTER_TEXT.ogrnip}</p>
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
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 lg:hover:bg-white/20 transition-colors flex items-center justify-center"
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
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 lg:hover:bg-white/20 transition-colors flex items-center justify-center"
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
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 lg:hover:bg-white/20 transition-colors flex items-center justify-center z-10"
                aria-label={FOOTER_TEXT.closeMapAria}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="mt-3 h-[calc(100%-3.25rem)] rounded-xl overflow-hidden border border-white/10">
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
