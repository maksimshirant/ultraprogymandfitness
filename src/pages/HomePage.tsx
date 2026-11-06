import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import Hero from '@/widgets/hero/ui/Hero';
import { SectionFallback } from '@/components/SectionFallback';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronsRight } from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import PublicAssetImage from '@/components/PublicAssetImage';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { trainers } from '@/content/trainers';
import { memberships } from '@/content/memberships';
import { groupDirections } from '@/content/groupDirections';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';
import type { OpenModalHandler } from '@/types/modal';

const Flors = lazy(() => import('@/widgets/flors/ui/Flors'));
const TryFree = lazy(() => import('@/widgets/tryfree/ui/TryFree'));
const FAQ = lazy(() => import('@/widgets/faq/ui/FAQ'));

interface HomePageProps {
  onOpenModal: OpenModalHandler;
}

// Introduces the club, its existing team and membership options.
export default function HomePage({ onOpenModal }: HomePageProps) {
  const [shouldRenderFlors, setShouldRenderFlors] = useState(false);
  const [shouldRenderLowerSections, setShouldRenderLowerSections] = useState(false);
  const florsAnchorRef = useRef<HTMLDivElement>(null);
  const lowerSectionsAnchorRef = useRef<HTMLDivElement>(null);


  const groupTrainingsBackground = `${import.meta.env.BASE_URL}sections/hero-group-studio-natural.png`;
  const clubCardImage = `${import.meta.env.BASE_URL}mainhero/card`;
  const featuredDirections = groupDirections.filter((direction) => ['pilates', 'cycle'].includes(direction.key));
  const featuredTrainers = trainers.filter((trainer) => trainer.id === 1 || trainer.id === 18);
  const previewMemberships = memberships.filter((membership) => [1, 2, 4].includes(membership.id));

  useEffect(() => {
    if (shouldRenderFlors) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      const frameId = requestAnimationFrame(() => {
        setShouldRenderFlors(true);
      });

      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRenderFlors(true);
          observer.disconnect();
        }
      },
      { rootMargin: '140px 0px' }
    );

    const anchor = florsAnchorRef.current;
    if (anchor) {
      observer.observe(anchor);
    }

    return () => observer.disconnect();
  }, [shouldRenderFlors]);

  // Loads the CTA and FAQ only when the visitor approaches the lower page area.
  useEffect(() => {
    if (shouldRenderLowerSections) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      const frameId = requestAnimationFrame(() => {
        setShouldRenderLowerSections(true);
      });

      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRenderLowerSections(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );

    const anchor = lowerSectionsAnchorRef.current;
    if (anchor) {
      observer.observe(anchor);
    }

    return () => observer.disconnect();
  }, [shouldRenderLowerSections]);

  return (
    <>
      <Seo {...pageSeo.home} />
      <Hero onOpenModal={onOpenModal} />
      <section id="home-previews" className="home-editorial relative isolate overflow-hidden bg-[#101114] py-16 md:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full" aria-hidden="true">
          <PublicAssetImage src={groupTrainingsBackground} alt="" loading="lazy" sizes="(max-width: 767px) 1200px, 100vw" showPlaceholder={false} pictureClassName="block h-full w-full" className="h-full w-full object-cover object-center opacity-75" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.2),rgba(10,10,15,0.4)_65%,#0a0a0f)]" />
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 px-4 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
          <div className="order-1 mb-10 min-w-0 md:mb-12">
              <BalancedHeading as="h2" className="text-3xl font-semibold tracking-tight text-white md:text-4xl"><span>Групповые тренировки</span></BalancedHeading>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80">Пилатес, сайкл, единоборства и другие направления.</p>
          </div>
          <div className="order-2 grid gap-8 md:order-3 md:col-span-2 md:grid-cols-2 md:gap-12">
            {featuredDirections.map((direction) => (
              <article key={direction.key} className="max-w-md">
                  <BalancedHeading as="h3" className="text-xl font-bold leading-tight text-white sm:text-2xl">{direction.text}</BalancedHeading>
                  <p className="mt-3 text-base leading-relaxed text-white/80">{direction.shortDescription}</p>
                  <Link to={`/schedule#${direction.key}`} className="home-text-link mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white">О направлении<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
          <Link to="/schedule#group-schedule" className="hero-cta hero-cta-secondary order-3 mt-8 justify-self-start md:order-4 md:col-span-2">
            <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
            <span className="hero-cta-label"><span>Расписание занятий</span></span>
            <ChevronsRight aria-hidden="true" />
          </Link>
          <Link to="/schedule#group-directions" className="hero-cta hero-cta-secondary order-4 mt-3 justify-self-start md:order-2 md:mb-12 md:mt-0 md:justify-self-end">
            <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
            <span className="hero-cta-label"><span>Все направления</span></span>
            <ChevronsRight aria-hidden="true" />
          </Link>
          <p className="order-5 mt-4 text-sm leading-relaxed text-white/60 md:col-span-2">* Групповые занятия оплачиваются отдельно.</p>
        </div>
      </section>

      <section id="home-memberships" className="home-editorial relative py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-20 lg:px-8">
            <div className="contents md:block md:min-w-0">
              <div className="order-1">
              <BalancedHeading as="h2" className="mb-6 text-3xl font-semibold tracking-tight text-white"><span>Абонементы</span></BalancedHeading>
              <p className="text-base leading-relaxed text-white/70">Доступ к тренажёрному залу, кардио, кроссфит-зоне и сауне.</p>
              </div>

              <AccordionPrimitive.Root type="single" collapsible className="order-3 text-sm leading-relaxed text-white/70 md:mt-4">
                <AccordionPrimitive.Item value="club-card">
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger className="home-text-link home-mobile-action group inline-flex min-h-11 items-center gap-3 py-2 text-left text-sm font-normal">
                      Информация о клубной карте
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
                    <div className="pb-2 pt-3">
                      <picture className="mb-4 block w-full max-w-sm">
                        <source type="image/avif" srcSet={`${clubCardImage}-w480.avif 480w, ${clubCardImage}-w768.avif 768w, ${clubCardImage}-w1024.avif 1024w, ${clubCardImage}.avif 1536w`} sizes="(min-width: 640px) 384px, 100vw" />
                        <source type="image/webp" srcSet={`${clubCardImage}-w480.webp 480w, ${clubCardImage}-w768.webp 768w, ${clubCardImage}-w1024.webp 1024w, ${clubCardImage}.webp 1536w`} sizes="(min-width: 640px) 384px, 100vw" />
                        <img src={`${clubCardImage}.webp`} alt="Клубная карта UltraPro Gym & Fitness" width={1536} height={1024} loading="lazy" decoding="async" className="h-auto w-full object-contain" />
                      </picture>
                      <p>Карта является вашим пропуском в фитнес-клуб UltraPro. Берите её с собой при каждом визите. В случае утери или повреждения обратитесь к администратору на ресепшене для восстановления и повторной активации доступа.</p>
                      <p className="mt-3">Стоимость восстановления карты после утери — 500 рублей.</p>
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              </AccordionPrimitive.Root>
            </div>
            <div className="order-2 md:order-none">
              <table className="w-full text-left text-sm text-white">
                <caption className="sr-only">Стоимость абонементов UltraPro</caption>
                <thead><tr className="border-b border-white/20 text-white/60"><th scope="col" className="pb-3 pr-4 font-normal">Срок</th><th scope="col" className="pb-3 pr-4 font-normal">Стоимость</th><th scope="col"><span className="sr-only">Оформление</span></th></tr></thead>
                <tbody>
                  {previewMemberships.map((membership) => (
                    <tr key={membership.id} className="border-b border-white/15">
                      <th scope="row" className="py-4 pr-4 font-medium">{membership.title}</th>
                      <td className="py-4 pr-4 whitespace-nowrap">{membership.price}</td>
                      <td className="py-2 text-right"><button type="button" onClick={() => onOpenModal({ topic: membership.topicValue, membershipId: membership.id })} className="home-text-link min-h-11 font-semibold">Приобрести</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link to="/memberships" className="home-text-link home-mobile-action mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-white">Все абонементы и условия<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
        </div>
      </section>

      <section id="home-trainers" className="home-editorial relative pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 border-t border-white/15 pt-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-x-5">
            <div className="order-1 mb-8">
              <div>
                <BalancedHeading as="h2" className="text-3xl font-semibold tracking-tight text-white"><span>Тренеры</span></BalancedHeading>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">Персональные тренировки с опытными специалистами по силовой подготовке, оздоровительному тренингу и фитнес-диетологии.</p>
              </div>
            </div>
            <div className="order-2 grid gap-8 md:order-3 md:col-span-2 md:grid-cols-2 md:gap-12">
              {featuredTrainers.map((trainer) => (
                <article key={trainer.id} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] items-end gap-5 sm:gap-7">
                  {trainer.image ? (
                    <Link to="/trainers" className="home-photo-link block overflow-hidden rounded-sm" aria-label={`Познакомиться с тренером ${trainer.name}`}>
                      <PublicAssetImage src={trainer.image} alt={trainer.name} loading="lazy" variantSuffix="preview" sizes="(min-width: 768px) 22vw, 42vw" pictureClassName="block aspect-[3/4]" className="h-full w-full object-cover object-top" />
                    </Link>
                  ) : null}
                  <div className="pb-1">
                    <BalancedHeading as="h3" className="text-xl font-bold leading-tight text-white sm:text-2xl">{trainer.name}</BalancedHeading>
                    <p className="mt-2 text-sm text-white/70">{trainer.role ?? 'Персональный тренер'}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{trainer.summary}</p>
                    <p className="mt-3 text-sm text-white/60">{trainer.experience}</p>
                    <button type="button" onClick={() => onOpenModal({ topic: 'personal', trainer: trainer.name })} className="home-text-link mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white">Запись</button>
                  </div>
                </article>
              ))}
            </div>
            <p className="order-3 mt-8 text-sm leading-relaxed text-white/60 md:order-4 md:col-span-2">* На индивидуальную тренировку необходимо записаться заранее. Занятия оплачиваются отдельно.</p>
            <Link to="/trainers" className="hero-cta hero-cta-secondary order-4 mt-6 md:order-2 md:mb-8 md:mt-0 md:justify-self-end">
              <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
              <span className="hero-cta-label"><span>Все тренеры</span></span>
              <ChevronsRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>


      <div id="flors-anchor" ref={florsAnchorRef} className="scroll-mt-24">
        {shouldRenderFlors ? (
          <Suspense fallback={<SectionFallback />}>
            <Flors />
          </Suspense>
        ) : (
          <SectionFallback />
        )}
      </div>

      <div ref={lowerSectionsAnchorRef} className="home-editorial relative">
        {shouldRenderLowerSections ? (
          <>
            <Suspense fallback={<SectionFallback />}>
              <TryFree onOpenModal={onOpenModal} />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <FAQ />
            </Suspense>
          </>
        ) : (
          <>
            <SectionFallback />
            <SectionFallback />
          </>
        )}
      </div>
    </>
  );
}
