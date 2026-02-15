import { PRIVACY_POLICY_TEXT, PRIVACY_POLICY_TITLE } from '@/content/privacyPolicy';
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
      <h3 className={cn('text-2xl font-bold text-white mb-5', titleClassName)}>{PRIVACY_POLICY_TITLE}</h3>
      <p className={cn('whitespace-pre-line text-sm leading-relaxed text-gray-300', textClassName)}>
        {PRIVACY_POLICY_TEXT}
      </p>
    </div>
  );
}
