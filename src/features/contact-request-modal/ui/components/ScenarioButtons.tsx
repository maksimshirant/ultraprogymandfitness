import { ChevronRight, type LucideIcon } from 'lucide-react';
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
  icon: Icon,
  onClick,
  isActive = false,
  compact = false,
}: ScenarioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group rounded-[24px] border text-left transition-all',
        compact ? 'p-3' : 'p-5 sm:p-6',
        isActive
          ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
          : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
      )}
    >
      {compact ? (
        <div className="flex items-center justify-center">
          <h3 className="min-w-0 truncate whitespace-nowrap text-center text-sm font-semibold text-white">{title}</h3>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#F5B800]">
              <Icon className="h-5 w-5" />
            </span>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 lg:group-hover:translate-x-0.5" />
          </div>
          <h3 className="mt-4 text-base font-semibold leading-tight text-white sm:text-lg">{title}</h3>
        </>
      )}
    </button>
  );
}

export function CompactScenarioButton({
  title,
  icon: Icon,
  onClick,
  isActive = false,
}: BaseScenarioButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all',
        isActive
          ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
          : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#F5B800]">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" />
    </button>
  );
}
