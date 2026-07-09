import type { MouseEvent } from 'react';
import { CalendarDays, CreditCard, House, MapPinned, UsersRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MOBILE_NAV_ITEMS = [
  { label: 'Главная', to: '/', icon: House },
  { label: 'Расписание', to: '/schedule', icon: CalendarDays },
  { label: 'Тренеры', to: '/trainers', icon: UsersRound },
  { label: 'Абонементы', to: '/memberships', icon: CreditCard },
  { label: 'Контакты', to: '/contacts', icon: MapPinned },
] as const;

interface MobileBottomNavigationProps {
  onHomeNavigation: (event: MouseEvent<HTMLAnchorElement>) => void;
  isVisible?: boolean;
}

export function MobileBottomNavigation({ onHomeNavigation, isVisible = true }: MobileBottomNavigationProps) {
  return (
    <nav
      aria-label="Основная навигация"
      className={cn(
        'fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-[1.75rem] border border-white/20 bg-white/[0.12] p-1.5 shadow-[0_16px_46px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-2xl transition-[transform,opacity] duration-500 ease-out md:bottom-5 md:max-w-2xl md:p-2',
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
      )}
    >
      <div className="grid grid-cols-5 gap-1">
        {MOBILE_NAV_ITEMS.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={to === '/' ? onHomeNavigation : undefined}
            className={({ isActive }) =>
              cn(
                'relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-[1.25rem] px-1 py-1.5 text-[10px] font-semibold text-gray-300 transition-colors md:min-h-16 md:text-xs',
                isActive
                  ? 'bg-white/[0.16] text-[#F5B800] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                  : 'text-gray-300'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={isActive ? 2.3 : 1.8} />
                <span className="max-w-full truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
