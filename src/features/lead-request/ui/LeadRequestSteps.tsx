import { type Dispatch, type FormEvent, type RefObject, type SetStateAction } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { groupDirections } from '@/entities/group-direction/model/groupDirections';
import { memberships } from '@/entities/membership/model/memberships';
import { trainers } from '@/entities/trainer/model/trainers';
import {
  formatRussianPhone,
  RU_PHONE_MASK,
  syncTextareaHeight,
} from '@/features/lead-request/model/formState';
import {
  ROOT_PRIMARY_OPTIONS,
  ROOT_SECONDARY_OPTIONS,
  type LeadScenarioId,
} from '@/features/lead-request/model/scenarioOptions';
import type { FlowSelection, ScrollIndicatorState } from '@/features/lead-request/model/types';
import { cn } from '@/shared/lib/utils';
import { CompactScenarioButton, ScenarioCard } from './ScenarioButtons';

type LeadFormData = {
  name: string;
  phone: string;
  question: string;
};

type LeadModalText = {
  changeSelection: string;
  consentLink: string;
  consentMiddle: string;
  consentPrefix: string;
  groupRecommendationCard: string;
  namePlaceholder: string;
  phoneTitle: string;
  privacyLink: string;
  questionPlaceholder: string;
  submitDefault: string;
  submitLoading: string;
};

type SummaryInfo = {
  title: string;
  value: string;
  meta: string;
  note: string;
};

interface ScrollableStepProps {
  isMobile: boolean;
  selection: FlowSelection;
  updateScrollIndicator: (
    element: HTMLDivElement | null,
    setState: Dispatch<SetStateAction<ScrollIndicatorState>>
  ) => void;
}

interface RootStepProps {
  isMobile: boolean;
  onOpenScenario: (scenario: LeadScenarioId) => void;
}

export function RootStep({ isMobile, onOpenScenario }: RootStepProps) {
  return (
    <div className={cn('mx-auto w-full max-w-4xl', isMobile ? 'space-y-3' : 'space-y-5')}>
      <div className={cn('grid grid-cols-1 md:grid-cols-2', isMobile ? 'gap-3' : 'gap-3')}>
        {ROOT_PRIMARY_OPTIONS.map((option) => (
          <ScenarioCard
            key={option.id}
            title={isMobile ? option.mobileTitle : option.title}
            icon={option.icon}
            onClick={() => onOpenScenario(option.id)}
            compact={isMobile}
          />
        ))}
      </div>

      <div className={cn('grid grid-cols-1', isMobile ? 'gap-3' : 'gap-2')}>
        {ROOT_SECONDARY_OPTIONS.map((option) =>
          isMobile ? (
            <ScenarioCard
              key={option.id}
              title={option.mobileTitle}
              icon={option.icon}
              onClick={() => onOpenScenario(option.id)}
              compact
            />
          ) : (
            <CompactScenarioButton
              key={option.id}
              title={option.title}
              icon={option.icon}
              onClick={() => onOpenScenario(option.id)}
            />
          )
        )}
      </div>
    </div>
  );
}

interface MembershipStepProps {
  isMobile: boolean;
  selectedMembershipId?: number;
  onSelectMembership: (membershipId: number) => void;
}

export function MembershipStep({ isMobile, selectedMembershipId, onSelectMembership }: MembershipStepProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3', isMobile ? 'gap-2' : 'gap-3')}>
        {memberships.map((membership) => {
          const Icon = membership.icon;
          const isActive = selectedMembershipId === membership.id;
          const mobileTitle = membership.id === 6 ? 'Разовое' : membership.title;

          return (
            <button
              key={membership.id}
              type="button"
              onClick={() => onSelectMembership(membership.id)}
              className={cn(
                'rounded-[24px] border text-left transition-all',
                isMobile ? 'p-2.5' : 'p-5 sm:p-6',
                isActive
                  ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
                  : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                {!isMobile ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-gray-200">
                    <Icon className="h-4 w-4 text-[#F5B800]" />
                    {membership.label}
                  </span>
                ) : null}
                {!isMobile ? <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-500" /> : null}
              </div>

              {isMobile ? (
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={cn(
                      'min-w-0 flex-1 font-bold leading-tight text-white',
                      membership.id === 5 ? 'text-sm whitespace-normal' : 'truncate whitespace-nowrap text-sm'
                    )}
                  >
                    {mobileTitle}
                  </h3>
                  <p className="shrink-0 text-base font-black text-[rgb(255,255,255,0.84)]">
                    {membership.price}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="mt-4 text-base font-bold leading-tight text-white sm:text-xl">
                    {membership.title}
                  </h3>
                  <p className="mt-2 text-xl font-black text-[rgb(255,255,255,0.84)] sm:text-2xl">
                    {membership.price}
                  </p>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface PersonalStepProps extends ScrollableStepProps {
  personalScrollRef: RefObject<HTMLDivElement | null>;
  personalScrollIndicator: ScrollIndicatorState;
  setPersonalScrollIndicator: Dispatch<SetStateAction<ScrollIndicatorState>>;
  onSelectTrainer: (trainerName: string) => void;
}

export function PersonalStep({
  isMobile,
  selection,
  personalScrollRef,
  personalScrollIndicator,
  setPersonalScrollIndicator,
  updateScrollIndicator,
  onSelectTrainer,
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
          onScroll={
            isMobile ? () => updateScrollIndicator(personalScrollRef.current, setPersonalScrollIndicator) : undefined
          }
        >
          {trainers.filter((trainer) => trainer.category === 'personal').map((trainer) => {
            const isActive = selection.trainer === trainer.name;

            return (
              <button
                key={trainer.id}
                type="button"
                onClick={() => onSelectTrainer(trainer.name)}
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
                      <h3
                        className={cn(
                          'font-semibold leading-tight text-white',
                          isMobile ? 'truncate whitespace-nowrap text-xs' : 'text-sm sm:text-base'
                        )}
                      >
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

interface GroupStepProps extends ScrollableStepProps {
  groupScrollRef: RefObject<HTMLDivElement | null>;
  groupScrollIndicator: ScrollIndicatorState;
  setGroupScrollIndicator: Dispatch<SetStateAction<ScrollIndicatorState>>;
  text: Pick<LeadModalText, 'groupRecommendationCard'>;
  onSelectGroupDirection: (groupDirection: string) => void;
  onRequestGroupRecommendation: () => void;
}

export function GroupStep({
  isMobile,
  selection,
  groupScrollRef,
  groupScrollIndicator,
  setGroupScrollIndicator,
  updateScrollIndicator,
  text,
  onSelectGroupDirection,
  onRequestGroupRecommendation,
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
          onScroll={isMobile ? () => updateScrollIndicator(groupScrollRef.current, setGroupScrollIndicator) : undefined}
        >
          {groupDirections.map((direction) => {
            const isActive = !selection.wantsGroupRecommendation && selection.groupDirection === direction.text;

            return (
              <button
                key={direction.key}
                type="button"
                onClick={() => onSelectGroupDirection(direction.text)}
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
                      <p className="truncate whitespace-nowrap text-xs font-semibold text-white">
                        {direction.text} • {direction.trainer}
                      </p>
                    ) : (
                      <>
                        <h3 className="text-sm font-semibold leading-tight text-white sm:text-base">
                          {direction.text}
                        </h3>
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
        onClick={onRequestGroupRecommendation}
        className={cn(
          'flex w-full items-center justify-between rounded-[20px] border text-left transition-all',
          isMobile ? 'gap-2 p-3' : 'gap-4 p-4',
          selection.topic === 'group' && selection.wantsGroupRecommendation
            ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
            : 'border-[#F5B800]/20 bg-gradient-to-r from-[#F5B800]/10 via-white/[0.03] to-[#D89B00]/10 lg:hover:border-[#F5B800]/35'
        )}
      >
        <p className={cn('font-semibold text-white', isMobile ? 'truncate whitespace-nowrap text-sm' : 'text-sm sm:text-base')}>
          {text.groupRecommendationCard}
        </p>
        {!isMobile ? <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" /> : null}
      </button>
    </div>
  );
}

interface ContactStepProps {
  formData: LeadFormData;
  formError: string | null;
  isPrivacyAccepted: boolean;
  isSubmitting: boolean;
  questionTextareaRef: RefObject<HTMLTextAreaElement | null>;
  selection: FlowSelection;
  summary: SummaryInfo;
  text: LeadModalText;
  setFormData: Dispatch<SetStateAction<LeadFormData>>;
  setFormError: Dispatch<SetStateAction<string | null>>;
  setIsConsentOpen: Dispatch<SetStateAction<boolean>>;
  setIsPrivacyAccepted: Dispatch<SetStateAction<boolean>>;
  setIsPrivacyOpen: Dispatch<SetStateAction<boolean>>;
  onChangeSelection: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function ContactStep({
  formData,
  formError,
  isPrivacyAccepted,
  isSubmitting,
  questionTextareaRef,
  selection,
  summary,
  text,
  setFormData,
  setFormError,
  setIsConsentOpen,
  setIsPrivacyAccepted,
  setIsPrivacyOpen,
  onChangeSelection,
  onSubmit,
}: ContactStepProps) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{summary.title}</p>
            <p className="mt-2 text-lg font-semibold text-white sm:text-xl">{summary.value}</p>
            {summary.meta ? <p className="mt-1 text-sm text-gray-300">{summary.meta}</p> : null}
          </div>
          <button
            type="button"
            onClick={onChangeSelection}
            className="shrink-0 self-center text-sm font-medium text-[#F5B800] transition-colors lg:hover:text-[#FFD351]"
          >
            {text.changeSelection}
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
        <input
          type="text"
          required
          placeholder={text.namePlaceholder}
          value={formData.name}
          onChange={(event) => {
            setFormData({ ...formData, name: event.target.value });
            if (formError) setFormError(null);
          }}
          className={FORM_FIELD_CLASS}
        />

        <input
          type="text"
          required
          inputMode="numeric"
          autoComplete="tel"
          placeholder={RU_PHONE_MASK}
          maxLength={18}
          pattern="^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$"
          title={text.phoneTitle}
          value={formData.phone}
          onChange={(event) => {
            const nextPhone = formatRussianPhone(event.target.value);
            setFormData({ ...formData, phone: nextPhone });
            if (formError) setFormError(null);
          }}
          className={FORM_FIELD_CLASS}
        />

        {selection.topic === 'other' ? (
          <textarea
            ref={questionTextareaRef}
            required
            rows={1}
            placeholder={text.questionPlaceholder}
            value={formData.question}
            onChange={(event) => {
              syncTextareaHeight(event.target);
              setFormData({ ...formData, question: event.target.value });
              if (formError) setFormError(null);
            }}
            className={cn(FORM_FIELD_CLASS, 'resize-none overflow-hidden')}
          />
        ) : null}

        <label className="flex items-start gap-3 text-xs text-gray-300 sm:text-sm">
          <input
            type="checkbox"
            checked={isPrivacyAccepted}
            onChange={(event) => {
              setIsPrivacyAccepted(event.target.checked);
              if (formError) setFormError(null);
            }}
            className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent accent-[#F5B800]"
          />
          <span>
            {text.consentPrefix}{' '}
            <button
              type="button"
              onClick={() => setIsConsentOpen(true)}
              className="text-white underline underline-offset-4 transition-colors lg:hover:text-gray-200"
            >
              {text.consentLink}
            </button>{' '}
            {text.consentMiddle}{' '}
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="text-white underline underline-offset-4 transition-colors lg:hover:text-gray-200"
            >
              {text.privacyLink}
            </button>
            .
          </span>
        </label>

        {formError ? (
          <p role="alert" className="rounded-xl border border-red-300/35 bg-red-500/15 px-4 py-2 text-sm text-red-100">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-live="polite"
          className="btn-primary w-full text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#F5B800]" />
              {text.submitLoading}
            </span>
          ) : (
            text.submitDefault
          )}
        </button>
      </form>
    </div>
  );
}

const FORM_FIELD_CLASS =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-gray-500 transition-colors focus:outline-none focus:border-white/25';
