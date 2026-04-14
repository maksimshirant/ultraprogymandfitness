import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeAriaLabel: string;
  children: ReactNode;
  zIndexClassName?: string;
  maxWidthClassName?: string;
}

export function LegalDocumentModal({
  isOpen,
  onClose,
  closeAriaLabel,
  children,
  zIndexClassName = 'z-[110]',
  maxWidthClassName = 'max-w-3xl',
}: LegalDocumentModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={cn('fixed inset-0 flex items-center justify-center overflow-hidden p-4 sm:p-6', zIndexClassName)}>
      <div className="document-modal-overlay absolute inset-0 bg-[#05070c]/82 backdrop-blur-md" onClick={onClose} />

      <div
        className={cn(
          'glass-card modal-surface relative mx-auto my-auto flex w-full flex-col overflow-hidden rounded-[30px] border border-white/10 p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100vh-3rem)] sm:max-h-[calc(100dvh-3rem)] sm:p-8',
          maxWidthClassName
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-300 transition-colors lg:hover:bg-white/10 lg:hover:text-white"
          aria-label={closeAriaLabel}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="document-modal-scroll min-h-0 flex-1 overflow-y-auto pr-2 pt-8 sm:pr-3 sm:pt-10">
          {children}
        </div>
      </div>
    </div>
  );
}
