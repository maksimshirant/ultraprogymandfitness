import { Loader2 } from 'lucide-react';
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
            {MODAL_TEXT.changeSelection}
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <input
            type="text"
            required
            placeholder={MODAL_TEXT.namePlaceholder}
            value={formData.name}
            onChange={(event) => {
              onSetFormData({ ...formData, name: event.target.value });
              if (formError) onSetFormError(null);
            }}
            className={FORM_FIELD_CLASS}
          />
        </div>

        <div>
          <input
            type="text"
            required
            inputMode="numeric"
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
            <textarea
              ref={questionTextareaRef}
              required
              rows={1}
              placeholder={MODAL_TEXT.questionPlaceholder}
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

        <label className="flex items-start gap-3 text-xs text-gray-300 sm:text-sm">
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
            <button type="button" onClick={onOpenConsent} className="text-white underline underline-offset-4 transition-colors lg:hover:text-gray-200">
              {MODAL_TEXT.consentLink}
            </button>{' '}
            {MODAL_TEXT.consentMiddle}{' '}
            <button type="button" onClick={onOpenPrivacy} className="text-white underline underline-offset-4 transition-colors lg:hover:text-gray-200">
              {MODAL_TEXT.privacyLink}
            </button>
            .
          </span>
        </label>

        {formError ? (
          <p role="alert" className="rounded-xl border border-red-300/35 bg-red-500/15 px-4 py-2 text-sm text-red-100">
            {formError}
          </p>
        ) : null}

        <button type="submit" disabled={isSubmitting} aria-live="polite" className="modal-submit-button btn-primary w-full text-white disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#F5B800]" />
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
