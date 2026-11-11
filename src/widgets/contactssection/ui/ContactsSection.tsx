import { ArrowUpRight, ChevronsRight } from 'lucide-react';
import { BalancedHeading } from '@/components/typography/BalancedHeading';

const CONTACTS_TEXT = {
  title: 'Отзывы и контакты',
  titleAccent: '',
  pageSubtitle: 'Отзывы гостей о клубе и все способы быстро связаться с нами.',
  reviewsTitle: 'Отзывы',
  reviewsCta: 'Смотреть все отзывы',
  contactsTitle: 'Контакты',
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

const CONTACTS_MAP_LINK = CONTACTS_SOCIALS.reviews.replace('/reviews/', '/');

// Makes visit information easy to find and presents the existing reviews without decorative ratings.
export default function ContactsSection() {
  return (
    <div id="contacts" className="club-page relative overflow-x-clip">
      <header className="club-page-header mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BalancedHeading as="h1" className="club-page-title max-w-5xl"><span>{CONTACTS_TEXT.title}</span></BalancedHeading>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">{CONTACTS_TEXT.pageSubtitle}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <a href={CONTACTS_TEXT.phoneHref} className="hero-cta hero-cta-secondary">
            <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
            <span className="hero-cta-label"><span>Позвонить в клуб</span></span>
            <ChevronsRight aria-hidden="true" />
          </a>
          <a href="#club-reviews" className="hero-cta hero-cta-secondary">
            <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
            <span className="hero-cta-label"><span>Отзывы гостей</span></span>
            <ChevronsRight aria-hidden="true" />
          </a>
        </div>
      </header>

      <section aria-labelledby="club-contacts-title" className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-white/15 pt-7">
            <BalancedHeading as="h2" className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              <span id="club-contacts-title">Адрес и связь</span>
            </BalancedHeading>
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
              <div className="space-y-7 md:space-y-8">
                <div>
                  <h3 className="text-sm font-medium text-white/60">Адрес</h3>
                  <address className="mt-3 max-w-md text-xl font-medium not-italic leading-relaxed text-white md:text-2xl">{CONTACTS_TEXT.address}</address>
                  <a href={CONTACTS_MAP_LINK} target="_blank" rel="noopener noreferrer" className="home-text-link mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-white/80">
                    Открыть в Яндекс Картах<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/60">Телефон</h3>
                  <a href={CONTACTS_TEXT.phoneHref} className="home-text-link mt-2 inline-flex min-h-11 items-center text-2xl font-semibold tracking-tight text-white md:text-3xl">{CONTACTS_TEXT.phone}</a>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/60">График работы</h3>
                  <dl className="mt-3 max-w-md space-y-3 text-sm md:text-base">
                    {CONTACTS_TEXT.schedule.map((slot) => (
                      <div key={slot.day} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <dt className="text-white/75">{slot.day}</dt>
                        <dd className="whitespace-nowrap tabular-nums text-white">{slot.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/60">Мы на связи</h3>
                  <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1">
                    <a href={CONTACTS_SOCIALS.vk} target="_blank" rel="noopener noreferrer" aria-label={CONTACTS_TEXT.vkAria} className="home-text-link inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white">
                      {CONTACTS_TEXT.vkLabel}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a href={CONTACTS_SOCIALS.telegram} target="_blank" rel="noopener noreferrer" aria-label={CONTACTS_TEXT.telegramAria} className="home-text-link inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white">
                      {CONTACTS_TEXT.telegramLabel}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a href={CONTACTS_SOCIALS.max} target="_blank" rel="noopener noreferrer" aria-label={CONTACTS_TEXT.maxAria} className="home-text-link inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white">
                      {CONTACTS_TEXT.maxLabel}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="min-h-[360px] overflow-hidden rounded-sm border border-white/15 bg-black/20 sm:min-h-[440px]">
                <iframe title={CONTACTS_TEXT.mapFrameTitle} src={CONTACTS_MAP_SRC} width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  className="h-[360px] w-full border-0 sm:h-[440px] lg:h-full lg:min-h-[440px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="club-reviews" aria-labelledby="club-reviews-title" className="scroll-mt-28 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-white/15 pt-7">
            <BalancedHeading as="h2" className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              <span id="club-reviews-title">Отзывы гостей</span>
            </BalancedHeading>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">О тренировках, тренерах и атмосфере клуба.</p>
            <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2 md:gap-y-10">
              {CONTACTS_REVIEWS.map((review, index) => (
                <figure key={`${review.author}-${review.date}`} className={`flex flex-col border-t border-white/15 pt-5 ${index >= 4 ? 'hidden lg:flex' : index >= 2 ? 'hidden md:flex' : ''}`}>
                  <blockquote className="text-base leading-[1.8] text-white/85">
                    <p>{review.text}</p>
                  </blockquote>
                  <figcaption className="mt-auto flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 pt-5 text-sm">
                    <span className="font-semibold text-white">{review.author}</span>
                    <span className="text-white/55">{review.date}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <a href={CONTACTS_SOCIALS.reviews} target="_blank" rel="noopener noreferrer" aria-label={CONTACTS_TEXT.reviewsAria} className="hero-cta hero-cta-secondary mt-8 md:mt-10">
              <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
              <span className="hero-cta-label"><span>{CONTACTS_TEXT.reviewsCta}</span></span>
              <ChevronsRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
