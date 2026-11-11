import type { ReactNode } from 'react';
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
    <div className={cn('legal-modal-frame fixed inset-0 flex items-center justify-center overflow-hidden p-4 sm:p-6', zIndexClassName)}>
      <div className="document-modal-overlay absolute inset-0 bg-black/75" onClick={onClose} />

      <div
        className={cn(
          'legal-document-modal modal-surface relative mx-auto my-auto flex min-h-0 w-full flex-col overflow-hidden rounded-[6px] p-5 max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100vh-3rem)] sm:max-h-[calc(100dvh-3rem)] sm:p-8',
          maxWidthClassName
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex shrink-0 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="home-text-link z-10 inline-flex min-h-11 items-center text-sm text-gray-300"
            aria-label={closeAriaLabel}
          >
            Закрыть
          </button>
        </div>

        <div className="document-modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2 sm:pr-3">
          {children}
        </div>
      </div>
    </div>
  );
}
