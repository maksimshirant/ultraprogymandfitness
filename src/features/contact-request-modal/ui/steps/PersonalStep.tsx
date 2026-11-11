import type { RefObject } from 'react';
import { trainers } from '@/content/trainers';
import PublicAssetImage from '@/components/PublicAssetImage';
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
            'grid grid-cols-1',
            isMobile && 'modal-step-scroll max-h-[48svh] overflow-y-auto pr-3'
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
                  'booking-option flex items-center gap-4 py-4 text-left transition-colors',
                  isActive && 'booking-option-active'
                )}
              >
                {trainer.image ? (
                  <PublicAssetImage
                    src={trainer.image}
                    alt=""
                    loading="lazy"
                    variantSuffix="thumb"
                    sizes="48px"
                    width={48}
                    height={48}
                    pictureClassName="block h-12 w-12 shrink-0 overflow-hidden rounded-full"
                    className={cn('h-full w-full object-cover object-top', trainer.imageClassName)}
                  />
                ) : (
                  <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-base text-gray-300">{trainer.name.slice(0, 1)}</span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base font-medium leading-snug">
                        {trainer.name}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-gray-400">{trainer.summary}</p>
                    </div>
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
