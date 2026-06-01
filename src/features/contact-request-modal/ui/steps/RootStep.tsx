import type { LucideIcon } from 'lucide-react';
import { CompactScenarioButton, ScenarioCard } from '@/features/contact-request-modal/ui/components/ScenarioButtons';

export interface ScenarioOption {
  id: string;
  title: string;
  mobileTitle: string;
  icon: LucideIcon;
}

interface RootStepProps {
  isMobile: boolean;
  primaryOptions: readonly ScenarioOption[];
  secondaryOptions: readonly ScenarioOption[];
  activeTopic: string;
  onScenarioSelect: (scenario: string) => void;
}

export function RootStep({
  isMobile,
  primaryOptions,
  secondaryOptions,
  activeTopic,
  onScenarioSelect,
}: RootStepProps) {
  return (
    <div className={isMobile ? 'mx-auto w-full max-w-4xl space-y-3' : 'mx-auto w-full max-w-4xl space-y-5'}>
      <div className={isMobile ? 'grid grid-cols-1 gap-3 md:grid-cols-2' : 'grid grid-cols-1 gap-3 md:grid-cols-2'}>
        {primaryOptions.map((option) => (
          <ScenarioCard
            key={option.id}
            title={isMobile ? option.mobileTitle : option.title}
            icon={option.icon}
            onClick={() => onScenarioSelect(option.id)}
            isActive={activeTopic === option.id}
            compact={isMobile}
          />
        ))}
      </div>

      <div className={isMobile ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 gap-2'}>
        {secondaryOptions.map((option) => (
          isMobile ? (
            <ScenarioCard
              key={option.id}
              title={option.mobileTitle}
              icon={option.icon}
              onClick={() => onScenarioSelect(option.id)}
              isActive={activeTopic === option.id}
              compact
            />
          ) : (
            <CompactScenarioButton
              key={option.id}
              title={option.title}
              icon={option.icon}
              onClick={() => onScenarioSelect(option.id)}
              isActive={activeTopic === option.id}
            />
          )
        ))}
      </div>
    </div>
  );
}
