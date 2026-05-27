import { CircleCheck, TriangleAlert } from 'lucide-react';
import type { ResultNotice } from '@/features/lead-request/model/types';
import { BalancedHeading } from '@/shared/ui/typography/BalancedHeading';

interface ResultViewProps {
  notice: ResultNotice;
  returnToFormLabel: string;
  successHint: string;
  onReturnToForm: () => void;
}

export function ResultView({ notice, returnToFormLabel, successHint, onReturnToForm }: ResultViewProps) {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center px-6 py-10 text-center sm:min-h-[420px]">
      <div className="max-w-[24rem]">
        <div className="mb-5 flex justify-center">
          {notice.type === 'success' ? (
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-500/15 text-emerald-200">
              <CircleCheck className="h-7 w-7" />
            </span>
          ) : (
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-red-300/40 bg-red-500/15 text-red-200">
              <TriangleAlert className="h-7 w-7" />
            </span>
          )}
        </div>
        <p className="text-base font-semibold text-white sm:text-lg">{notice.text}</p>
        {notice.type === 'success' ? (
          <p className="mt-3 text-sm text-gray-300">{successHint}</p>
        ) : (
          <button type="button" onClick={onReturnToForm} className="btn-primary mt-6 w-full text-white">
            {returnToFormLabel}
          </button>
        )}
      </div>
    </div>
  );
}

interface AnnouncementBodyProps {
  announcement: {
    label: string;
    title: string;
    message: readonly string[];
    closeButtonLabel: string;
  };
  onClose: () => void;
}

export function AnnouncementBody({ announcement, onClose }: AnnouncementBodyProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      <span className="mb-4 inline-flex rounded-full border border-[#F5B800]/30 bg-[#F5B800]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#F5B800]">
        {announcement.label}
      </span>

      <BalancedHeading as="h2" className="text-2xl font-bold text-white">
        {announcement.title}
      </BalancedHeading>

      <div className="mt-5 space-y-3 text-sm leading-6 text-gray-300 sm:text-base">
        {announcement.message.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <button type="button" onClick={onClose} className="btn-primary mt-8 w-full text-white">
        {announcement.closeButtonLabel}
      </button>
    </div>
  );
}
