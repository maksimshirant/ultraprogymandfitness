import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';

interface TryFreeProps {
  onOpenModal: (topic?: string) => void;
}

const TRY_FREE_TEXT = {
  title: 'Попробуйте бесплатно',
  subtitle:
    'Проверьте формат, атмосферу и оборудование лично. Первое посещение абсолютно бесплатно.',
  cta: 'Записаться на пробную тренировку',
} as const;

export default function TryFree({ onOpenModal }: TryFreeProps) {
  return (
    <section id="tryfree" className="pb-10 md:pb-14 relative overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card border border-[#F5B800]/20 bg-gradient-to-r from-[#F5B800]/12 via-white/[0.04] to-[#D89B00]/12 p-6 md:p-8 text-center">
          <BalancedHeading as="h2" className="section-title text-white">
            <HeadingAccent>{TRY_FREE_TEXT.title}</HeadingAccent>
          </BalancedHeading>
          <p className="mt-4 text-base md:text-lg text-gray-200 max-w-3xl mx-auto">
            {TRY_FREE_TEXT.subtitle}
          </p>
          <button
            onClick={() => onOpenModal('free_trial')}
            className="btn-primary text-white mt-6 w-full sm:w-auto sm:min-w-[22rem] text-base md:text-lg py-4 px-8"
          >
            {TRY_FREE_TEXT.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
