import type { FormEvent } from 'react';
import type { RefObject } from 'react';
import { FORM_FIELD_CLASS, MODAL_TEXT, RU_PHONE_MASK } from '@/features/contact-request-modal/model/constants';
import { formatRussianPhone, syncTextareaHeight } from '@/features/contact-request-modal/model/helpers';
import type { ContactFormData } from '@/features/contact-request-modal/model/types';
import { cn } from '@/lib/utils';

interface ContactSummary {
  title: string;
  value: string;
  meta?: string;
}

interface ContactStepProps {
  summary: ContactSummary;
  formData: ContactFormData;
  formError: string | null;
  isSubmitting: boolean;
  isPrivacyAccepted: boolean;
  questionTextareaRef: RefObject<HTMLTextAreaElement | null>;
  isOtherTopic: boolean;
  onChangeSelection: () => void;
  onSetFormData: (next: ContactFormData) => void;
  onSetFormError: (next: string | null) => void;
  onSetPrivacyAccepted: (next: boolean) => void;
  onOpenConsent: () => void;
  onOpenPrivacy: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function ContactStep({
  summary,
  formData,
  formError,
  isSubmitting,
  isPrivacyAccepted,
  questionTextareaRef,
  isOtherTopic,
  onChangeSelection,
  onSetFormData,
  onSetFormError,
  onSetPrivacyAccepted,
  onOpenConsent,
  onOpenPrivacy,
  onSubmit,
}: ContactStepProps) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="border-b border-white/15 pb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-400">{summary.title}</p>
            <p className="mt-2 text-base font-medium text-white">{summary.value}</p>
            {summary.meta ? <p className="mt-1 text-sm text-gray-300">{summary.meta}</p> : null}
          </div>
          <button
            type="button"
            onClick={onChangeSelection}
            className="home-text-link shrink-0 self-center text-[#F5B800] lg:hover:text-[#FFD351]"
          >
            {MODAL_TEXT.changeSelection}
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="booking-name" className="mb-2 block text-sm font-medium">Ваше имя</label>
          <input
            id="booking-name"
            autoComplete="name"
            type="text"
            required
            value={formData.name}
            onChange={(event) => {
              onSetFormData({ ...formData, name: event.target.value });
              if (formError) onSetFormError(null);
            }}
            className={FORM_FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="booking-phone" className="mb-2 block text-sm font-medium">Номер телефона</label>
          <input
            id="booking-phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder={RU_PHONE_MASK}
            maxLength={18}
            pattern="^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$"
            title={MODAL_TEXT.phoneTitle}
            value={formData.phone}
            onChange={(event) => {
              const nextPhone = formatRussianPhone(event.target.value);
              onSetFormData({ ...formData, phone: nextPhone });
              if (formError) onSetFormError(null);
            }}
            className={FORM_FIELD_CLASS}
          />
        </div>

        {isOtherTopic ? (
          <div>
            <label htmlFor="booking-question" className="mb-2 block text-sm font-medium">Ваш вопрос</label>
            <textarea
              id="booking-question"
              ref={questionTextareaRef}
              required
              rows={1}
              value={formData.question}
              onChange={(event) => {
                syncTextareaHeight(event.target);
                onSetFormData({ ...formData, question: event.target.value });
                if (formError) onSetFormError(null);
              }}
              className={cn(FORM_FIELD_CLASS, 'resize-none overflow-hidden')}
            />
          </div>
        ) : null}

        <label className="flex items-start gap-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
          <input
            type="checkbox"
            checked={isPrivacyAccepted}
            onChange={(event) => {
              onSetPrivacyAccepted(event.target.checked);
              if (formError) onSetFormError(null);
            }}
            className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent accent-[#F5B800]"
          />
          <span>
            {MODAL_TEXT.consentPrefix}{' '}
            <button type="button" onClick={onOpenConsent} className="home-text-link text-white underline underline-offset-4 lg:hover:text-gray-200">
              {MODAL_TEXT.consentLink}
            </button>{' '}
            {MODAL_TEXT.consentMiddle}{' '}
            <button type="button" onClick={onOpenPrivacy} className="home-text-link text-white underline underline-offset-4 lg:hover:text-gray-200">
              {MODAL_TEXT.privacyLink}
            </button>
            .
          </span>
        </label>

        {formError ? (
          <p role="alert" className="border-l-2 border-red-400 pl-3 text-sm text-red-200">
            {formError}
          </p>
        ) : null}

        <button type="submit" disabled={isSubmitting} aria-live="polite" className="modal-submit-button home-text-link inline-flex w-full items-center justify-center border-0 bg-transparent px-5 py-3.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              {MODAL_TEXT.submitLoading}
            </span>
          ) : (
            MODAL_TEXT.submitDefault
          )}
        </button>
      </form>
    </div>
  );
}
