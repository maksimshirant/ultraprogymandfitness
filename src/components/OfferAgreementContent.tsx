import { OFFER_AGREEMENT_TEXT, OFFER_AGREEMENT_TITLE } from '@/content/offerAgreement';
import { cn } from '@/lib/utils';

interface OfferAgreementContentProps {
  className?: string;
  titleClassName?: string;
  textClassName?: string;
}

export function OfferAgreementContent({
  className,
  titleClassName,
  textClassName,
}: OfferAgreementContentProps) {
  return (
    <div className={className}>
      <h3 className={cn('text-2xl font-bold text-white mb-5', titleClassName)}>{OFFER_AGREEMENT_TITLE}</h3>
      <p className={cn('whitespace-pre-line text-sm leading-relaxed text-gray-300', textClassName)}>
        {OFFER_AGREEMENT_TEXT}
      </p>
    </div>
  );
}
