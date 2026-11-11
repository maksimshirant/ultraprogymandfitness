import type { RefObject } from 'react';
import { groupDirections } from '@/content/groupDirections';
import { MODAL_TEXT } from '@/features/contact-request-modal/model/constants';
import type { FlowSelection, ScrollIndicatorState } from '@/features/contact-request-modal/model/types';
import { cn } from '@/lib/utils';

interface GroupStepProps {
  isMobile: boolean;
  selection: FlowSelection;
  groupScrollRef: RefObject<HTMLDivElement | null>;
  groupScrollIndicator: ScrollIndicatorState;
  onUpdateScroll: () => void;
  onGroupDirectionSelect: (groupDirection: string) => void;
  onGroupRecommendationRequest: () => void;
}

export function GroupStep({
  isMobile,
  selection,
  groupScrollRef,
  groupScrollIndicator,
  onUpdateScroll,
  onGroupDirectionSelect,
  onGroupRecommendationRequest,
}: GroupStepProps) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className={cn('relative', isMobile && 'modal-step-scroll-wrap')}>
        <div
          className={cn(
            'grid grid-cols-1',
            isMobile && 'modal-step-scroll max-h-[48svh] overflow-y-auto pr-3'
          )}
          ref={isMobile ? groupScrollRef : undefined}
          onScroll={isMobile ? onUpdateScroll : undefined}
        >
          {groupDirections.map((direction) => {
            const isActive = !selection.wantsGroupRecommendation && selection.groupDirection === direction.text;

            return (
              <button
                key={direction.key}
                type="button"
                onClick={() => onGroupDirectionSelect(direction.text)}
                className={cn(
                  'booking-option text-left transition-colors',
                  'py-4',
                  isActive && 'booking-option-active'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-medium leading-snug">{direction.text}</h3>
                    <p className="mt-1 text-xs text-gray-400">Тренер: {direction.trainer}</p>
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
                height: `${groupScrollIndicator.height}px`,
                transform: `translateY(${groupScrollIndicator.top}px)`,
                opacity: groupScrollIndicator.visible ? 1 : 0,
              }}
            />
          </span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onGroupRecommendationRequest}
        className={cn(
          'booking-option flex w-full items-center justify-between text-left transition-colors',
          'gap-4 py-4',
          selection.topic === 'group' && selection.wantsGroupRecommendation && 'booking-option-active'
        )}
      >
        <p className="text-sm font-medium leading-snug">
          {MODAL_TEXT.groupRecommendationCard}
        </p>
      </button>
    </div>
  );
}
