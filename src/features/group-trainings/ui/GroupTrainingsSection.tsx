import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, ChevronsRight } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { groupDirectionCategories, groupDirections, type GroupDirection } from '@/content/groupDirections';
import type { OpenModalHandler } from '@/types/modal';
import { GROUP_TRAININGS_TEXT } from '@/features/group-trainings/model/constants';
import { DirectionDetails, TrainerAvatar } from '@/features/group-trainings/ui/components/DirectionCardParts';
import { GroupSchedulePreview } from '@/features/group-trainings/ui/components/GroupSchedulePreview';
import PublicAssetImage from '@/components/PublicAssetImage';

interface GroupTrainingsProps {
  onOpenModal: OpenModalHandler;
}

// Presents the weekly schedule and direction catalog in the same visual language as the home page.
export default function GroupTrainingsSection({ onOpenModal }: GroupTrainingsProps) {
  const { hash } = useLocation();
  const [expandedScheduleDays, setExpandedScheduleDays] = useState<string[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<GroupDirection | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Reveals the linked direction and immediately opens its existing description.
  useEffect(() => {
    if (!hash) return;
    const frameId = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
      const direction = groupDirections.find((item) => item.key === hash.slice(1));
      if (direction) {
        setSelectedDirection(direction);
        setIsDetailsModalOpen(true);
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [hash]);

  // Toggles only the selected day without closing other expanded schedule days.
  const toggleScheduleDay = (dayId: string) => {
    setExpandedScheduleDays((prev) => (prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]));
  };

  // Opens the existing direction details without changing the booking payload.
  const openDirectionDetails = (direction: GroupDirection) => {
    setSelectedDirection(direction);
    setIsDetailsModalOpen(true);
  };

  // Moves to the catalog while respecting reduced-motion preferences.
  const scrollToDirections = () => {
    document.getElementById('group-directions')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };

  // Moves to the weekly schedule while respecting reduced-motion preferences.
  const scrollToSchedule = () => {
    document.getElementById('group-schedule')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <div className="club-page relative overflow-x-clip">
      <header className="club-page-hero">
        <div className="hero-media-layer pointer-events-none absolute inset-0" aria-hidden="true">
          <PublicAssetImage src={`${import.meta.env.BASE_URL}sections/hero-group-studio-natural.png`}
            alt="" loading="eager"
            sizes="(max-width: 767px) 1200px, 100vw" showPlaceholder={false} pictureClassName="block h-full w-full"
            className="h-full w-full object-cover object-center" />
        </div>
        <div className="club-page-hero-shade" aria-hidden="true" />
        <div className="club-page-header mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BalancedHeading as="h1" className="club-page-title max-w-4xl"><span>{GROUP_TRAININGS_TEXT.heroTitle}</span></BalancedHeading>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">{GROUP_TRAININGS_TEXT.heroSubtitle}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <button type="button" onClick={scrollToSchedule} className="hero-cta hero-cta-secondary">
              <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
              <span className="hero-cta-label"><span>{GROUP_TRAININGS_TEXT.heroPrimaryCta}</span></span>
              <ChevronsRight aria-hidden="true" />
            </button>
            <button type="button" onClick={scrollToDirections} className="hero-cta hero-cta-secondary">
              <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
              <span className="hero-cta-label"><span>{GROUP_TRAININGS_TEXT.heroSecondaryCta}</span></span>
              <ChevronsRight aria-hidden="true" />
            </button>
          </div>
          <p className="mt-5 text-sm text-white/65">* Групповые занятия оплачиваются отдельно.</p>
        </div>
      </header>

      <section id="group-schedule" className="scroll-mt-28 py-12 md:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <GroupSchedulePreview expandedScheduleDays={expandedScheduleDays} toggleScheduleDay={toggleScheduleDay} />
        </div>
      </section>

      <section id="group-directions" className="scroll-mt-28 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BalancedHeading as="h2" className="border-t border-white/15 pt-7 text-3xl font-semibold tracking-tight text-white md:text-4xl"><span>Направления</span></BalancedHeading>
          <div className="mt-10 space-y-12 md:space-y-16">
            {groupDirectionCategories.map((category) => {
              const directions = groupDirections.filter((direction) => direction.category === category.key);
              return (
                <section key={category.key}>
                  <h3 className="text-xl font-semibold text-white md:text-2xl">{category.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">{category.description}</p>
                  <div className="mt-6 grid grid-cols-1 gap-x-12 md:grid-cols-2">
                    {directions.map((direction) => (
                      <article key={direction.key} id={direction.key} className="flex min-w-0 scroll-mt-28 flex-col border-t border-white/15 py-6 md:py-8">
                        <div className="flex items-center gap-4">
                          <TrainerAvatar direction={direction} />
                          <div className="min-w-0">
                            <h4 className="text-lg font-semibold leading-tight text-white md:text-xl">{direction.text}</h4>
                            <p className="mt-2 text-sm text-white/65">Тренер: {direction.trainer}</p>
                          </div>
                        </div>
                        <p className="mb-5 mt-4 text-sm leading-relaxed text-white/75">{direction.shortDescription}</p>
                        <div className="mt-auto flex items-center gap-4 md:gap-x-5">
                          <button type="button" data-action={direction.action} data-booking-action={direction.bookingAction} data-confirm-booking-action={direction.confirmBookingAction} data-group-direction={direction.key}
                            onClick={() => onOpenModal({ topic: 'group', groupDirection: direction.text })} className="hero-cta hero-cta-primary">
                            <svg className="hero-cta-shape" viewBox="0 0 180 44" preserveAspectRatio="none" aria-hidden="true"><polygon points="20,1 179,1 179,23 159,43 1,43 1,21" vectorEffect="non-scaling-stroke" /></svg>
                            <span className="hero-cta-label"><span>Запись на занятия</span></span>
                            <ChevronsRight aria-hidden="true" />
                          </button>
                          <button type="button" onClick={() => openDirectionDetails(direction)} className="home-text-link inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap text-sm text-white/80">
                            {GROUP_TRAININGS_TEXT.detailsCta}<ArrowRight className="hidden h-4 w-4 md:block" aria-hidden="true" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-white/15 pt-7">
            <BalancedHeading as="h2" className="max-w-3xl text-2xl font-semibold tracking-tight text-white md:text-3xl"><span>{GROUP_TRAININGS_TEXT.finalTitle}</span></BalancedHeading>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">{GROUP_TRAININGS_TEXT.finalSubtitle}</p>
            <button type="button" onClick={() => onOpenModal({ topic: 'group', groupRecommendation: true })} className="hero-cta hero-cta-secondary mt-6">
              <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
              <span className="hero-cta-label"><span>{GROUP_TRAININGS_TEXT.finalCta}</span></span>
              <ChevronsRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent showCloseButton={false} className="direction-details-modal flex max-h-[calc(100dvh-3rem)] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[6px] p-0 sm:max-w-2xl">
          <div className="flex shrink-0 items-start justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6">
            <DialogTitle className="min-w-0 pt-1 text-[1.65rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-3xl">{selectedDirection?.text ?? GROUP_TRAININGS_TEXT.detailsCta}</DialogTitle>
            <DialogClose className="home-text-link inline-flex min-h-11 shrink-0 items-center text-sm text-white/65" aria-label="Закрыть описание направления">Закрыть</DialogClose>
          </div>
          <DialogDescription className="sr-only">{selectedDirection?.shortDescription ?? 'Подробная информация о выбранном групповом направлении.'}</DialogDescription>
          <div className="direction-details-body min-h-0 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-8 sm:pb-8" tabIndex={0} role="region" aria-label="Описание тренировки">
            {selectedDirection ? (
              <>
                <DirectionDetails direction={selectedDirection} unwrapped />
                <div className="mt-7 flex items-center gap-3 border-t border-white/15 pt-5">
                  <TrainerAvatar direction={selectedDirection} />
                  <div>
                    <p className="text-sm text-white/55">Тренер направления</p>
                    <p className="mt-1 text-base font-medium text-white">{selectedDirection.trainer}</p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          {selectedDirection ? (
            <div className="shrink-0 border-t border-white/15 px-5 py-4 sm:px-8 sm:py-5">
              <p className="mb-3 text-sm leading-relaxed text-white/60">* Групповые занятия оплачиваются отдельно.</p>
              <DialogClose asChild>
                <button type="button" onClick={() => onOpenModal({ topic: 'group', groupDirection: selectedDirection.text })} className="hero-cta hero-cta-primary">
                  <svg className="hero-cta-shape" viewBox="0 0 240 48" preserveAspectRatio="none" aria-hidden="true"><polygon points="20,1 239,1 239,27 219,47 1,47 1,21" vectorEffect="non-scaling-stroke" /></svg>
                  <span className="hero-cta-label"><span>Записаться на занятие</span></span>
                  <ChevronsRight aria-hidden="true" />
                </button>
              </DialogClose>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
