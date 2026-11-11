import { useEffect, useRef, useState } from 'react';
import { ChevronsRight } from 'lucide-react';
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
  const bookingButtonRef = useRef<HTMLButtonElement>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  // Starts the recurring attention cue only after the booking button is visible.
  useEffect(() => {
    if (!bookingButtonRef.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setHasEnteredViewport(true);
      observer.disconnect();
    }, { threshold: 0.6 });
    observer.observe(bookingButtonRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="tryfree" className="deferred-section relative overflow-hidden pb-10 scroll-mt-24 md:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-y border-white/20 py-10 md:py-14 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-12">
          <div className="min-w-0">
            <BalancedHeading as="h2" className="max-w-2xl text-3xl font-semibold tracking-tight text-white"><span>{TRY_FREE_TEXT.title}</span></BalancedHeading>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">{TRY_FREE_TEXT.subtitle}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">Возьмите спортивную одежду, чистую сменную обувь, полотенце и воду.</p>
          </div>
          <button
            ref={bookingButtonRef}
            type="button"
            data-cta-visible={hasEnteredViewport}
            onClick={() => onOpenModal({ topic: 'free_trial' })}
            className="hero-cta hero-cta-primary lg:justify-self-end"
          >
            <svg className="hero-cta-shape" viewBox="0 0 340 56" preserveAspectRatio="none" aria-hidden="true"><polygon points="28,1 339,1 339,31 315,55 1,55 1,29" vectorEffect="non-scaling-stroke" /></svg>
            <span className="hero-cta-sheen" aria-hidden="true" />
            <span className="hero-cta-label"><span>{TRY_FREE_TEXT.cta}</span></span>
            <ChevronsRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
