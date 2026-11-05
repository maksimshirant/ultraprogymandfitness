import { ChevronDown } from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { memberships } from '@/content/memberships';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import type { OpenModalHandler } from '@/types/modal';

const ABONEMENTS_TEXT = {
  heroTitle: 'Абонементы',
  heroSubtitle:
    'Форматы посещения под быстрый старт, стабильный тренировочный ритм и долгий системный прогресс. Сравните условия и выберите удобный режим занятий.',
  heroPrimaryCta: 'Я знаю что мне нужно',
  heroSecondaryCta: 'Показать все абонементы',
  heroScrollHintAria: 'Прокрутить к списку абонементов',
  sectionTitle: '',
  sectionTitleAccent: 'Абонементы',
  sectionSubtitle: 'Выберите формат посещения под ваш график, цель и темп тренировок.',
  cta: 'Приобрести абонемент',
  prevAria: 'Предыдущий абонемент',
  nextAria: 'Следующий абонемент',
  selectAriaPrefix: 'Выбрать абонемент',
} as const;

interface AbonementsProps {
  onOpenModal: OpenModalHandler;
}

// Presents all membership plans together so visitors can compare terms without a carousel.
export default function Abonements({ onOpenModal }: AbonementsProps) {
  const clubCardImage = `${import.meta.env.BASE_URL}mainhero/card`;

  return (
    <div className="club-page relative overflow-x-clip">
      <header className="club-page-hero">
        <div className="club-page-header mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BalancedHeading as="h1" className="club-page-title"><span>{ABONEMENTS_TEXT.heroTitle}</span></BalancedHeading>
        </div>
      </header>

      <section id="subscriptions" aria-label="Список абонементов" className="scroll-mt-28 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
              {memberships.map((abonement) => (
                <article key={abonement.id} className="py-6 md:py-8">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-5 gap-y-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-x-10">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold leading-tight text-white md:text-2xl">{abonement.title}</h2>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">{abonement.note}</p>
                    </div>
                    <p className="whitespace-nowrap text-xl font-semibold tabular-nums tracking-tight text-white md:text-3xl">{abonement.price}</p>
                    <button type="button" onClick={() => onOpenModal({ topic: abonement.topicValue, membershipId: abonement.id })} className="home-secondary-action home-mobile-action col-span-2 w-full gap-3 px-5 py-3 md:col-span-1 md:w-auto">
                      Приобрести
                    </button>
                  </div>
                  {abonement.modes.length > 0 ? (
                    <details className="mt-3">
                      <summary className="home-text-link home-mobile-action flex min-h-11 w-fit cursor-pointer list-none items-center gap-2 text-sm text-white/80 [&::-webkit-details-marker]:hidden">
                        Условия абонемента<ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </summary>
                      <ul className="grid list-disc gap-x-10 gap-y-2 pl-5 pt-3 text-sm leading-relaxed text-white/70 md:grid-cols-2">
                        {abonement.modes.map((mode) => <li key={mode}>{mode}</li>)}
                      </ul>
                    </details>
                  ) : null}
                </article>
              ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/65">* Студентам и людям серебряного возраста — скидка 15%.</p>
          <button type="button" onClick={() => onOpenModal({ topic: 'membership' })} className="home-secondary-action mt-7 w-full gap-3 px-5 py-3.5 sm:w-auto">
            Помочь с выбором
          </button>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccordionPrimitive.Root type="single" collapsible>
            <AccordionPrimitive.Item value="club-card">
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="home-text-link group flex min-h-16 w-full items-center justify-between gap-3 py-5 text-left text-lg font-semibold text-white md:justify-start md:text-2xl">
                  Информация о клубной карте
                  <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
                <div className="grid items-center gap-6 pb-6 pt-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
                  <picture className="block w-full max-w-md">
                    <source type="image/avif" srcSet={`${clubCardImage}-w480.avif 480w, ${clubCardImage}-w768.avif 768w, ${clubCardImage}-w1024.avif 1024w, ${clubCardImage}.avif 1536w`} sizes="(min-width: 640px) 448px, 100vw" />
                    <source type="image/webp" srcSet={`${clubCardImage}-w480.webp 480w, ${clubCardImage}-w768.webp 768w, ${clubCardImage}-w1024.webp 1024w, ${clubCardImage}.webp 1536w`} sizes="(min-width: 640px) 448px, 100vw" />
                    <img src={`${clubCardImage}.webp`} alt="Клубная карта UltraPro Gym & Fitness" width={1536} height={1024} loading="lazy" decoding="async" className="h-auto w-full object-contain" />
                  </picture>
                  <div className="max-w-lg space-y-3 text-sm leading-relaxed text-white/70 md:text-base">
                    <p>Карта является вашим пропуском в фитнес-клуб UltraPro. Берите её с собой при каждом визите. В случае утери или повреждения обратитесь к администратору на ресепшене для восстановления и повторной активации доступа.</p>
                    <p>Стоимость восстановления карты после утери — 500 рублей.</p>
                  </div>
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          </AccordionPrimitive.Root>
        </div>
      </section>
    </div>
  );
}
