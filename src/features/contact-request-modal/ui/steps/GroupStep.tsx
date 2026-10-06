import { ChevronRight } from 'lucide-react';
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
            'grid grid-cols-1 gap-3 md:grid-cols-2',
            isMobile && 'modal-step-scroll max-h-[58svh] overflow-y-auto pr-3'
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
                  'rounded-[20px] border text-left transition-all',
                  isMobile ? 'p-3' : 'p-4',
                  isActive
                    ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
                    : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {isMobile ? (
                      <p className="truncate whitespace-nowrap text-xs font-semibold text-white">{direction.text} • {direction.trainer}</p>
                    ) : (
                      <>
                        <h3 className="text-sm font-semibold leading-tight text-white sm:text-base">{direction.text}</h3>
                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">Тренер: {direction.trainer}</p>
                      </>
                    )}
                  </div>
                  {!isMobile ? <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" /> : null}
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
          'flex w-full items-center justify-between rounded-[20px] border text-left transition-all',
          isMobile ? 'gap-2 p-3' : 'gap-4 p-4',
          selection.topic === 'group' && selection.wantsGroupRecommendation
            ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
            : 'border-[#F5B800]/20 bg-gradient-to-r from-[#F5B800]/10 via-white/[0.03] to-[#D89B00]/10 lg:hover:border-[#F5B800]/35'
        )}
      >
        <p className={cn('font-semibold text-white', isMobile ? 'truncate whitespace-nowrap text-sm' : 'text-sm sm:text-base')}>
          {MODAL_TEXT.groupRecommendationCard}
        </p>
        {!isMobile ? <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" /> : null}
      </button>
    </div>
  );
}
