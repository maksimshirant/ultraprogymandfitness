import { memberships } from '@/content/memberships';
import { cn } from '@/lib/utils';

interface MembershipStepProps {
  isMobile: boolean;
  activeMembershipId?: number;
  onSelect: (membershipId: number) => void;
}

export function MembershipStep({ isMobile, activeMembershipId, onSelect }: MembershipStepProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="grid grid-cols-1">
        {memberships.map((membership) => {
          const isActive = activeMembershipId === membership.id;

          return (
            <button
              key={membership.id}
              type="button"
              onClick={() => onSelect(membership.id)}
              className={cn(
                'booking-option text-left transition-colors',
                isMobile ? 'py-4' : 'py-5',
                isActive && 'booking-option-active'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                {!isMobile ? (
                  <span className="text-xs text-gray-400">
                    {membership.label}
                  </span>
                ) : null}
              </div>
              {isMobile ? (
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={cn(
                      'min-w-0 flex-1 font-medium leading-tight text-white',
                      membership.id === 5 ? 'text-sm whitespace-normal' : 'truncate whitespace-nowrap text-sm'
                    )}
                  >
                    {membership.title}
                  </h3>
                  <p className="shrink-0 text-base font-medium text-[rgb(255,255,255,0.84)]">{membership.price}</p>
                </div>
              ) : (
                <>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <h3 className="text-base font-medium leading-snug">{membership.title}</h3>
                    <p className="shrink-0 text-base font-medium">{membership.price}</p>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
