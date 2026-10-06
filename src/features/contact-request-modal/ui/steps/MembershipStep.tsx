import { memberships } from '@/content/memberships';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MembershipStepProps {
  isMobile: boolean;
  activeMembershipId?: number;
  onSelect: (membershipId: number) => void;
}

export function MembershipStep({ isMobile, activeMembershipId, onSelect }: MembershipStepProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3', isMobile ? 'gap-2' : 'gap-3')}>
        {memberships.map((membership) => {
          const isActive = activeMembershipId === membership.id;
          const Icon = membership.icon;

          return (
            <button
              key={membership.id}
              type="button"
              onClick={() => onSelect(membership.id)}
              className={cn(
                'rounded-[24px] border text-left transition-all',
                isMobile ? 'p-2.5' : 'p-5 sm:p-6',
                isActive
                  ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
                  : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                {!isMobile ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-gray-200">
                    <Icon className="h-4 w-4 text-[#F5B800]" />
                    {membership.label}
                  </span>
                ) : null}
                {!isMobile ? <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-500" /> : null}
              </div>
              {isMobile ? (
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={cn(
                      'min-w-0 flex-1 font-bold leading-tight text-white',
                      membership.id === 5 ? 'text-sm whitespace-normal' : 'truncate whitespace-nowrap text-sm'
                    )}
                  >
                    {membership.title}
                  </h3>
                  <p className="shrink-0 text-base font-black text-[rgb(255,255,255,0.84)]">{membership.price}</p>
                </div>
              ) : (
                <>
                  <h3 className="mt-4 text-base font-bold leading-tight text-white sm:text-xl">{membership.title}</h3>
                  <p className="mt-2 text-xl font-black text-[rgb(255,255,255,0.84)] sm:text-2xl">{membership.price}</p>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
