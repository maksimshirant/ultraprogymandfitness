import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseScenarioButtonProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
}

interface ScenarioCardProps extends BaseScenarioButtonProps {
  compact?: boolean;
}

export function ScenarioCard({
  title,
  onClick,
  isActive = false,
  compact = false,
}: ScenarioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'booking-option text-left transition-colors',
        compact ? 'py-4' : 'py-5',
        isActive && 'booking-option-active'
      )}
    >
      <h3 className="text-base font-medium leading-snug">{title}</h3>
    </button>
  );
}

export function CompactScenarioButton({
  title,
  onClick,
  isActive = false,
}: BaseScenarioButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'booking-option py-4 text-left transition-colors',
        isActive && 'booking-option-active'
      )}
    >
      <p className="text-base font-medium">{title}</p>
    </button>
  );
}
