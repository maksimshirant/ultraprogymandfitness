import { BalancedHeading } from '@/components/typography/BalancedHeading';
import type { ModalAnnouncement } from '@/features/contact-request-modal/model/types';

interface AnnouncementStepProps {
  announcement: ModalAnnouncement;
  onClose: () => void;
}

export function AnnouncementStep({ announcement, onClose }: AnnouncementStepProps) {
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
