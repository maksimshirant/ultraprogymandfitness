import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';
import { SiVk, SiTelegram } from 'react-icons/si';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useViewportTier } from '@/hooks/useViewportTier';

const CONTACTS_ASSETS = {
  maxIcon: 'https://logo-teka.com/wp-content/uploads/2025/07/max-messenger-sign-logo.svg',
} as const;

const CONTACTS_TEXT = {
  title: 'О нас',
  titleAccent: '',
  pageSubtitle: 'Отзывы гостей о клубе и все способы быстро связаться с нами.',
  reviewsTitle: 'Отзывы',
  reviewsCta: 'Смотреть все отзывы',
  contactsTitle: 'Контакты',
  openMap: 'Открыть карту',
  openMapAria: 'Открыть карту на весь экран',
  closeMapAria: 'Закрыть карту',
  mapFrameTitle: 'Карта: г. Волжский, Профсоюзов 7Б, ТЦ Радуга',
  address: 'г. Волжский, Профсоюзов 7Б, ТЦ Радуга',
  phone: '8(8443) 323-323',
  phoneHref: 'tel:+78443323323',
  schedule: [
    { day: 'Понедельник–Суббота:', time: '07:00–00:00' },
    { day: 'Воскресенье:', time: '07:00–22:00' },
  ],
  vkLabel: 'VK',
  telegramLabel: 'Telegram',
  maxLabel: 'Max',
  reviewsLabel: 'Отзывы',
  vkAria: 'VK',
  telegramAria: 'Telegram',
  maxAria: 'Max',
  reviewsAria: 'Отзывы в Яндекс Картах',
} as const;

const CONTACTS_REVIEWS = [
  {
    author: 'Дмитрий',
    meta: 'Отзыв клиента',
    date: '13 декабря 2024',
    text:
      'Лучший зал города Волжского, хожу практически с его открытия. Тренажеры новые, везде чисто, просторно, нет посторонних запахов. Персонал отзывчивый, всегда придумывают что-то новое. Также посоветую персонального тренера Евгения: он квалифицированный специалист в своем деле.',
  },
  {
    author: 'Екатерина',
    meta: 'Отзыв клиента',
    date: '16 января 2026',
    text:
      'Отличный спортзал. Цены доступные. Тренеры отменные профессионалы, я очень довольна всем. Если вы хотите быть в форме, то идите, не пожалеете.',
  },
  {
    author: 'Анастасия',
    meta: 'Отзыв клиента',
    date: '28 августа 2025',
    text:
      'Отличный зал. Цена абонемента оптимальная, можно взять со скидкой. Раздевалки, душевая, даже сауна имеется. Зал на два этажа с многочисленными и разнообразными тренажерами.',
  },
  {
    author: 'Александр',
    meta: 'Отзыв клиента',
    date: '20 июля 2025',
    text:
      'Отличный тренажерный зал, ходил еще со времен Magma. Приветливые тренеры, хорошие тренажеры. После того как зал разросся на 2 этажа, стало ощутимо больше места и оборудования, люди не толпятся даже вечером.',
  },
  {
    author: 'Андрей',
    meta: 'Отзыв клиента',
    date: '27 мая 2025',
    text:
      'Хочу выразить благодарность сотрудникам зала Ultra Pro, отдельно тренерам Павлу и Евгению: профессионалы в своем деле. Девушки-администраторы всегда улыбчивые и приветливые, цены на абонементы более чем адекватные, а часы работы очень удобные.',
  },
  {
    author: 'Надежда',
    meta: 'Отзыв клиента',
    date: '13 мая 2025',
    text:
      'Отличный зал, профессиональный коллектив. Чисто, свободно, нет посторонних запахов. Тренажеры новые, цены очень приемлемые, расположение удобное.',
  },
] as const;

const CONTACTS_SOCIALS = {
  vk: 'https://vk.com/ultrapro_fitness_vlz',
  telegram: 'https://t.me/ultrapro_fitness_vlz',
  max: 'https://max.ru/join/EBdCAZCx276jxGGS7-tFsXj5KHvwM1QOhP128UvDN1I',
  reviews: 'https://yandex.com/maps/org/ultra_pro/233756976456/reviews/?ll=44.777002%2C48.777976&z=16',
} as const;

const CONTACTS_MAP_QUERY = 'г. Волжский, Профсоюзов 7б, УльтраПро';
const CONTACTS_MAP_SRC = `https://yandex.ru/map-widget/v1/?mode=search&text=${encodeURIComponent(
  CONTACTS_MAP_QUERY
)}&z=17`;

export default function ContactsSection() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const viewportTier = useViewportTier();
  const isMobileViewport = viewportTier === 'mobile';
  const visibleReviewsCount = viewportTier === 'desktop' ? 6 : viewportTier === 'tablet' ? 4 : 2;
  const visibleReviews = CONTACTS_REVIEWS.slice(0, visibleReviewsCount);

  useEffect(() => {
    if (!isMapOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMapOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMapOpen]);

  return (
    <section id="contacts" className="py-14 md:py-16 relative overflow-hidden">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10 md:mb-12">
          <BalancedHeading as="h1" className="section-title text-white">
            <HeadingAccent>{CONTACTS_TEXT.title}</HeadingAccent>
          </BalancedHeading>
          <p className="section-subtitle mx-auto">{CONTACTS_TEXT.pageSubtitle}</p>
        </div>

        <div className="glass-card border border-white/10 p-6 md:p-8">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <BalancedHeading as="h2" className="text-4xl font-bold text-white md:text-5xl">
                <HeadingAccent>{CONTACTS_TEXT.reviewsTitle}</HeadingAccent>
              </BalancedHeading>
            </div>

            {!isMobileViewport ? (
              <a
                href={CONTACTS_SOCIALS.reviews}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition-colors lg:hover:border-white/25 lg:hover:bg-white/10"
                aria-label={CONTACTS_TEXT.reviewsAria}
              >
                {CONTACTS_TEXT.reviewsCta}
              </a>
            ) : null}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleReviews.map((review) => (
              <article
                key={`${review.author}-${review.date}`}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{review.author}</h3>
                    <p className="mt-1 text-sm text-gray-500">{review.meta}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-3.5 w-3.5 fill-[#F5B800] text-[#F5B800] md:h-4 md:w-4" />
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-gray-500 md:text-xs md:tracking-[0.16em]">
                      {review.date}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-8 text-gray-300 md:text-base">{review.text}</p>
              </article>
            ))}
          </div>

          {isMobileViewport ? (
            <div className="mt-6 flex justify-center">
              <a
                href={CONTACTS_SOCIALS.reviews}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition-colors"
                aria-label={CONTACTS_TEXT.reviewsAria}
              >
                {CONTACTS_TEXT.reviewsCta}
              </a>
            </div>
          ) : null}
        </div>

        <div className="glass-card mt-8 border border-white/10 p-6 md:mt-10 md:p-8">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
            <BalancedHeading as="h2" className="text-4xl font-bold text-white md:text-5xl">
              <HeadingAccent>{CONTACTS_TEXT.contactsTitle}</HeadingAccent>
            </BalancedHeading>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch lg:gap-12">
            <div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Адрес</p>
                  <div className="mt-3 text-white">
                    <span className="text-xl leading-tight md:text-[1.75rem] lg:whitespace-nowrap">{CONTACTS_TEXT.address}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Телефон</p>
                  <div className="mt-3 text-white">
                    <a href={CONTACTS_TEXT.phoneHref} className="text-xl md:text-[1.75rem] lg:whitespace-nowrap lg:hover:text-[#F5B800] transition-colors">
                      {CONTACTS_TEXT.phone}
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-500">График</p>
                  <div className="mt-3 space-y-2 text-lg text-white md:text-xl">
                    {CONTACTS_TEXT.schedule.map((slot) => (
                      <p key={slot.day} className="leading-snug">
                        <span className="mr-2 text-gray-400">{slot.day}</span>
                        <span>{slot.time}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={CONTACTS_SOCIALS.vk}
                  className="flex h-12 min-w-[3rem] items-center justify-center gap-2 rounded-full bg-white/5 px-4 text-sm font-semibold text-gray-300 transition-colors lg:hover:bg-[#F5B800] lg:hover:text-black"
                  aria-label={CONTACTS_TEXT.vkAria}
                >
                  <SiVk className="w-4 h-4 text-[#0077FF]" />
                  <span>{CONTACTS_TEXT.vkLabel}</span>
                </a>
                <a
                  href={CONTACTS_SOCIALS.telegram}
                  className="flex h-12 min-w-[3rem] items-center justify-center gap-2 rounded-full bg-white/5 px-4 text-sm font-semibold text-gray-300 transition-colors lg:hover:bg-[#F5B800] lg:hover:text-black"
                  aria-label={CONTACTS_TEXT.telegramAria}
                >
                  <SiTelegram className="w-4 h-4 text-[#26A5E4]" />
                  <span>{CONTACTS_TEXT.telegramLabel}</span>
                </a>
                <a
                  href={CONTACTS_SOCIALS.max}
                  className="flex h-12 min-w-[3rem] items-center justify-center gap-2 rounded-full bg-white/5 px-4 text-sm font-semibold text-gray-300 transition-colors lg:hover:bg-[#F5B800] lg:hover:text-black"
                  aria-label={CONTACTS_TEXT.maxAria}
                >
                  <img
                    src={CONTACTS_ASSETS.maxIcon}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="w-4 h-4 object-contain"
                  />
                  <span>{CONTACTS_TEXT.maxLabel}</span>
                </a>
                <a
                  href={CONTACTS_SOCIALS.reviews}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 items-center justify-center gap-2 rounded-full bg-white/5 px-5 text-sm font-semibold text-gray-300 transition-colors lg:hover:bg-[#F5B800] lg:hover:text-black"
                  aria-label={CONTACTS_TEXT.reviewsAria}
                >
                  <Star className="w-4 h-4 text-[#F5B800] lg:group-hover:text-black transition-colors" />
                  {CONTACTS_TEXT.reviewsLabel}
                </a>
              </div>
            </div>

            <div className="lg:flex">
              <div
                className="relative h-[320px] cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-black/30 sm:h-[400px] lg:h-full lg:flex-1"
                onClick={() => setIsMapOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setIsMapOpen(true);
                  }
                }}
                aria-label={CONTACTS_TEXT.openMapAria}
              >
                <iframe
                  title={CONTACTS_TEXT.mapFrameTitle}
                  src={CONTACTS_MAP_SRC}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full pointer-events-none"
                />
                <div className="absolute bottom-3 right-3 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-xs text-white">
                  {CONTACTS_TEXT.openMap}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                aria-label={CONTACTS_TEXT.closeMapAria}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="mt-3 h-[calc(100%-3.25rem)] rounded-xl overflow-hidden border border-white/10">
              <iframe
                title={CONTACTS_TEXT.mapFrameTitle}
                src={CONTACTS_MAP_SRC}
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
    </section>
  );
}
