import { MODAL_TEXT } from '@/features/contact-request-modal/model/constants';
import type { ResultNotice } from '@/features/contact-request-modal/model/types';

interface ResultStepProps {
  resultNotice: ResultNotice | null;
  onResetError: () => void;
}

export function ResultStep({ resultNotice, onResetError }: ResultStepProps) {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center px-6 py-10 text-center sm:min-h-[420px]">
      <div className="max-w-[24rem]">
        <p className="text-base font-semibold text-white sm:text-lg">{resultNotice?.text}</p>
        {resultNotice?.type === 'success' ? (
          <p className="mt-3 text-sm text-gray-300">{MODAL_TEXT.successHint}</p>
        ) : (
          <button type="button" onClick={onResetError} className="btn-primary mt-6 w-full text-white">
            {MODAL_TEXT.returnToForm}
          </button>
        )}
      </div>
    </div>
  );
}
