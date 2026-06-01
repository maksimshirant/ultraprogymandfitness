import { ChevronRight } from 'lucide-react';
import type { RefObject } from 'react';
import { trainers } from '@/content/trainers';
import type { ScrollIndicatorState } from '@/features/contact-request-modal/model/types';
import { cn } from '@/lib/utils';

interface PersonalStepProps {
  isMobile: boolean;
  selectedTrainer: string;
  onTrainerSelect: (trainerName: string) => void;
  personalScrollRef: RefObject<HTMLDivElement | null>;
  personalScrollIndicator: ScrollIndicatorState;
  onUpdateScroll: () => void;
}

export function PersonalStep({
  isMobile,
  selectedTrainer,
  onTrainerSelect,
  personalScrollRef,
  personalScrollIndicator,
  onUpdateScroll,
}: PersonalStepProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className={cn('relative', isMobile && 'modal-step-scroll-wrap')}>
        <div
          className={cn(
            'grid grid-cols-1 gap-3 md:grid-cols-2',
            isMobile && 'modal-step-scroll max-h-[58svh] overflow-y-auto pr-3'
          )}
          ref={isMobile ? personalScrollRef : undefined}
          onScroll={isMobile ? onUpdateScroll : undefined}
        >
          {trainers.filter((trainer) => trainer.category === 'personal').map((trainer) => {
            const isActive = selectedTrainer === trainer.name;

            return (
              <button
                key={trainer.id}
                type="button"
                onClick={() => onTrainerSelect(trainer.name)}
                className={cn(
                  'flex items-center rounded-[20px] border text-left transition-all',
                  isMobile ? 'gap-2 p-2.5' : 'gap-3 p-3 sm:gap-4 sm:p-4',
                  isActive
                    ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
                    : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
                )}
              >
                {!isMobile ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30 sm:h-14 sm:w-14">
                    {trainer.image ? (
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        loading="lazy"
                        decoding="async"
                        className={cn('h-full w-full object-cover object-top', trainer.imageClassName)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[#F5B800]">
                        {trainer.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className={cn('font-semibold leading-tight text-white', isMobile ? 'truncate whitespace-nowrap text-xs' : 'text-sm sm:text-base')}>
                        {trainer.name}
                      </h3>
                    </div>
                    {!isMobile ? <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" /> : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {isMobile ? (
          <span aria-hidden className="modal-step-scroll-rail">
            <span
              className="modal-step-scroll-thumb"
              style={{
                height: `${personalScrollIndicator.height}px`,
                transform: `translateY(${personalScrollIndicator.top}px)`,
                opacity: personalScrollIndicator.visible ? 1 : 0,
              }}
            />
          </span>
        ) : null}
      </div>
    </div>
  );
}
