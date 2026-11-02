import { PRIVACY_POLICY_TEXT, PRIVACY_POLICY_TITLE } from '@/content/privacyPolicy';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { cn } from '@/lib/utils';

interface PrivacyPolicyContentProps {
  className?: string;
  titleClassName?: string;
  textClassName?: string;
}

export function PrivacyPolicyContent({
  className,
  titleClassName,
  textClassName,
}: PrivacyPolicyContentProps) {
  return (
    <div className={className}>
      <BalancedHeading as="h3" className={cn('mb-6 text-[1.35rem] font-medium leading-snug tracking-tight text-[#f3f4f6] sm:text-2xl', titleClassName)}>
        {PRIVACY_POLICY_TITLE}
      </BalancedHeading>
      <p className={cn('whitespace-pre-line text-sm leading-[1.8] text-gray-300', textClassName)}>
        {PRIVACY_POLICY_TEXT}
      </p>
    </div>
  );
}
