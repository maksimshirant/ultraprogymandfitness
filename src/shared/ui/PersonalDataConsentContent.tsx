import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { PERSONAL_DATA_CONSENT_TEXT, PERSONAL_DATA_CONSENT_TITLE } from '@/content/personalDataConsent';
import { cn } from '@/lib/utils';

interface PersonalDataConsentContentProps {
  className?: string;
  titleClassName?: string;
  textClassName?: string;
}

export function PersonalDataConsentContent({
  className,
  titleClassName,
  textClassName,
}: PersonalDataConsentContentProps) {
  return (
    <div className={className}>
      <BalancedHeading as="h3" className={cn('mb-6 text-[1.35rem] font-medium leading-snug tracking-tight text-[#f3f4f6] sm:text-2xl', titleClassName)}>
        {PERSONAL_DATA_CONSENT_TITLE}
      </BalancedHeading>
      <p className={cn('whitespace-pre-line text-sm leading-[1.8] text-gray-300', textClassName)}>
        {PERSONAL_DATA_CONSENT_TEXT}
      </p>
    </div>
  );
}
