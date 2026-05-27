import { Suspense, lazy } from 'react';
import { LegalDocumentModal } from '@/shared/ui/LegalDocumentModal';

const PrivacyPolicyContent = lazy(async () => {
  const module = await import('@/shared/ui/PrivacyPolicyContent');
  return { default: module.PrivacyPolicyContent };
});

const PersonalDataConsentContent = lazy(async () => {
  const module = await import('@/shared/ui/PersonalDataConsentContent');
  return { default: module.PersonalDataConsentContent };
});

interface LeadRequestLegalDocumentsProps {
  documentFallbackText: string;
  isConsentOpen: boolean;
  isPrivacyOpen: boolean;
  closeConsentAriaLabel: string;
  closePrivacyAriaLabel: string;
  onCloseConsent: () => void;
  onClosePrivacy: () => void;
}

export function LeadRequestLegalDocuments({
  documentFallbackText,
  isConsentOpen,
  isPrivacyOpen,
  closeConsentAriaLabel,
  closePrivacyAriaLabel,
  onCloseConsent,
  onClosePrivacy,
}: LeadRequestLegalDocumentsProps) {
  return (
    <>
      {isPrivacyOpen ? (
        <LegalDocumentModal
          isOpen={isPrivacyOpen}
          closeAriaLabel={closePrivacyAriaLabel}
          onClose={onClosePrivacy}
          zIndexClassName="z-[111]"
          maxWidthClassName="max-w-2xl"
        >
          <Suspense fallback={<p className="text-sm text-gray-300">{documentFallbackText}</p>}>
            <PrivacyPolicyContent
              titleClassName="mb-4 pr-10 text-xl font-semibold text-white"
              textClassName="text-sm text-gray-300"
            />
          </Suspense>
        </LegalDocumentModal>
      ) : null}

      {isConsentOpen ? (
        <LegalDocumentModal
          isOpen={isConsentOpen}
          closeAriaLabel={closeConsentAriaLabel}
          onClose={onCloseConsent}
          zIndexClassName="z-[111]"
          maxWidthClassName="max-w-2xl"
        >
          <Suspense fallback={<p className="text-sm text-gray-300">{documentFallbackText}</p>}>
            <PersonalDataConsentContent
              titleClassName="mb-4 pr-10 text-xl font-semibold text-white"
              textClassName="text-sm text-gray-300"
            />
          </Suspense>
        </LegalDocumentModal>
      ) : null}
    </>
  );
}
