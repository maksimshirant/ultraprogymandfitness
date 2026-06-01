import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { groupDirectionCategories, groupDirections, type GroupDirection } from '@/content/groupDirections';
import type { OpenModalHandler } from '@/types/modal';
import { GROUP_TRAININGS_TEXT } from '@/features/group-trainings/model/constants';
import { DirectionDetails, TrainerAvatar } from '@/features/group-trainings/ui/components/DirectionCardParts';
import { GroupSchedulePreview } from '@/features/group-trainings/ui/components/GroupSchedulePreview';

interface GroupTrainingsProps {
  onOpenModal: OpenModalHandler;
}

export default function GroupTrainingsSection({ onOpenModal }: GroupTrainingsProps) {
  const [expandedScheduleDays, setExpandedScheduleDays] = useState<string[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<GroupDirection | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const toggleScheduleDay = (dayId: string) => {
    setExpandedScheduleDays((prev) => (prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]));
  };

  const openDirectionDetails = (direction: GroupDirection) => {
    setSelectedDirection(direction);
    setIsDetailsModalOpen(true);
  };

  const scrollToDirections = () => {
    document.getElementById('group-directions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToSchedule = () => {
    document.getElementById('group-schedule')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <div className="hero-glow-layer"><div className="hero-glow-top-right" /><div className="hero-glow-bottom-left" /><div className="hero-glow-center" /></div>
        <div className="relative z-30 mx-auto w-full max-w-7xl px-4 pt-24 pb-14 sm:px-6 md:max-lg:flex md:max-lg:min-h-[calc(100svh-13rem)] md:max-lg:flex-col md:max-lg:justify-center md:max-lg:px-10 md:max-lg:pt-32 md:max-lg:pb-20 lg:px-8 lg:pt-32 lg:pb-16">
          <div className="space-y-8 max-md:w-full max-md:max-w-full max-md:space-y-7 md:max-lg:mx-auto md:max-lg:max-w-[min(94vw,860px)] md:max-lg:space-y-11">
            <BalancedHeading as="h1" className="section-title text-white max-md:text-[clamp(2.8rem,10vw,4rem)] max-md:leading-[1.04] md:max-lg:max-w-full md:max-lg:text-[clamp(4rem,8.6vw,5.8rem)] md:max-lg:leading-[0.98] lg:text-[clamp(4.4rem,6vw,6.4rem)] lg:leading-[0.98]">
              <span className="block">{GROUP_TRAININGS_TEXT.heroTitle}</span>
              <span className="block">для {GROUP_TRAININGS_TEXT.heroAccent}</span>
            </BalancedHeading>
            <p className="max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg md:max-lg:max-w-[48rem] md:max-lg:text-[1.45rem] md:max-lg:leading-[1.34] lg:text-xl">{GROUP_TRAININGS_TEXT.heroSubtitle}</p>
            <div className="flex flex-col gap-3 sm:flex-row md:max-lg:gap-4">
              <button type="button" onClick={scrollToSchedule} className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 text-white md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg">{GROUP_TRAININGS_TEXT.heroPrimaryCta}<ArrowRight className="h-4 w-4" /></button>
              <button type="button" onClick={scrollToDirections} className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white transition-colors md:max-lg:px-10 md:max-lg:py-5 md:max-lg:text-lg lg:hover:border-white/30 lg:hover:bg-white/[0.08]">{GROUP_TRAININGS_TEXT.heroSecondaryCta}</button>
            </div>
          </div>
        </div>
      </section>

      <section id="group-schedule" className="relative overflow-hidden scroll-mt-24 pt-2 pb-8 sm:pt-4 sm:pb-10 lg:pt-6 lg:pb-12">
        <div className="hero-glow-layer"><div className="hero-glow-top-right" /><div className="hero-glow-bottom-left" /><div className="hero-glow-center" /></div>
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <GroupSchedulePreview expandedScheduleDays={expandedScheduleDays} toggleScheduleDay={toggleScheduleDay} />
        </div>
      </section>

      <section id="group-directions" className="relative scroll-mt-24 py-10 sm:py-12 lg:py-14">
        <div className="hero-glow-layer"><div className="hero-glow-top-right" /><div className="hero-glow-bottom-left" /><div className="hero-glow-center" /></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center"><BalancedHeading as="h2" className="section-title text-white">{GROUP_TRAININGS_TEXT.sectionTitle} <HeadingAccent>{GROUP_TRAININGS_TEXT.sectionTitleAccent}</HeadingAccent></BalancedHeading></div>
          <div className="mt-10 space-y-12 lg:space-y-14">
            {groupDirectionCategories.map((category) => {
              const directions = groupDirections.filter((direction) => direction.category === category.key);
              return (
                <section key={category.key} className="space-y-6">
                  <div><h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[2.2rem]">{category.title}</h2></div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-3">
                    {directions.map((direction) => (
                      <article key={direction.key} id={direction.key} className="scroll-mt-28 rounded-3xl bg-white/[0.08] px-4 py-4 sm:border sm:border-white/10 sm:bg-[#101117]/90 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
                        <div className="grid grid-cols-[4rem_minmax(0,1fr)] items-start gap-5 sm:grid-cols-[4.75rem_minmax(0,1fr)]">
                          <div className="ml-2 flex justify-center"><TrainerAvatar direction={direction} /></div>
                          <div className="min-w-0 self-center text-left">
                            <h3 className="text-[0.95rem] font-bold leading-tight text-white [overflow-wrap:anywhere] sm:text-lg lg:text-xl">{direction.text}</h3>
                            <p className="mt-1 text-[0.82rem] leading-snug text-gray-200 [overflow-wrap:anywhere] sm:text-sm lg:text-base"><span className="text-[#F5B800]">Тренер:</span> {direction.trainer}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
                          <button type="button" data-action={direction.action} data-booking-action={direction.bookingAction} data-confirm-booking-action={direction.confirmBookingAction} data-group-direction={direction.key} onClick={() => onOpenModal({ topic: 'group', groupDirection: direction.text })} className="inline-flex min-h-9 items-center justify-center rounded-full bg-[#F5B800] px-3.5 py-1.5 text-[0.82rem] font-semibold text-white">Запись на занятие</button>
                          <button type="button" onClick={() => openDirectionDetails(direction)} className="inline-flex min-h-9 items-center justify-center gap-1 text-[0.82rem] font-medium text-[#F5B800]"><span>{GROUP_TRAININGS_TEXT.detailsCta}</span><ArrowRight className="h-3.5 w-3.5" /></button>
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

      <section className="pb-12 sm:pb-14 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="p-6 text-center sm:p-8 lg:p-10">
            <BalancedHeading as="h2" className="section-title text-white">{GROUP_TRAININGS_TEXT.finalTitle}</BalancedHeading>
            <p className="mx-auto mt-4 max-w-3xl text-base text-gray-200 sm:text-lg">{GROUP_TRAININGS_TEXT.finalSubtitle}</p>
            <button type="button" onClick={() => onOpenModal({ topic: 'group', groupRecommendation: true })} className="btn-primary mt-6 w-full px-8 py-4 text-white sm:w-auto sm:min-w-[22rem]">{GROUP_TRAININGS_TEXT.finalCta}</button>
          </div>
        </div>
      </section>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent showCloseButton className="w-[calc(100vw-1rem)] max-h-[calc(100dvh-1.5rem)] max-w-[calc(100vw-1rem)] overflow-y-auto border border-white/10 bg-[#0f121a]/95 p-4 sm:max-w-3xl sm:p-6">
          <div className="px-3 text-center lg:px-0">
            <DialogTitle className="text-lg font-semibold leading-tight text-white sm:text-2xl">{selectedDirection?.text ?? GROUP_TRAININGS_TEXT.detailsCta}</DialogTitle>
          </div>
          <DialogDescription className="sr-only">Подробная информация о выбранном групповом направлении.</DialogDescription>
          {selectedDirection ? (
            <div className="mt-2 sm:mt-3">
              <div className="px-3 text-center lg:px-0">
                <p className="text-sm text-gray-200 sm:text-base"><span className="text-[#F5B800]">Тренер:</span> {selectedDirection.trainer}</p>
              </div>
              <div className="mt-4 sm:mt-5">
                <DirectionDetails direction={selectedDirection} unwrapped />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
