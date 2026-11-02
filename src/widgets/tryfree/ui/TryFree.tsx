import { ArrowRight } from 'lucide-react';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import type { OpenModalHandler } from '@/types/modal';

interface TryFreeProps {
  onOpenModal: OpenModalHandler;
}

const TRY_FREE_TEXT = {
  title: 'Первое посещение',
  subtitle:
    'Познакомьтесь с залом и попробуйте оборудование. Первое занятие бесплатно, по предварительной записи.',
  cta: 'Записаться на первое занятие',
} as const;

// Opens the existing free-trial booking form after the club introduction.
export default function TryFree({ onOpenModal }: TryFreeProps) {
  return (
    <section id="tryfree" className="deferred-section relative overflow-hidden pb-10 scroll-mt-24 md:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-y border-white/20 py-10 md:py-14 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-12">
          <div>
            <BalancedHeading as="h2" className="max-w-2xl text-3xl font-semibold tracking-tight text-white">{TRY_FREE_TEXT.title}</BalancedHeading>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">{TRY_FREE_TEXT.subtitle}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">Возьмите спортивную одежду, чистую сменную обувь, полотенце и воду.</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenModal({ topic: 'free_trial' })}
            className="home-action w-full gap-3 px-5 py-3.5 sm:w-auto lg:justify-self-end"
          >
            {TRY_FREE_TEXT.cta}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
