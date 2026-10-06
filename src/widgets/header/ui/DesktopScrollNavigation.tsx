import type { MouseEvent } from 'react';
import { CalendarDays, CalendarPlus, CreditCard, House, MapPinned, Phone, UsersRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { OpenModalHandler } from '@/types/modal';

const DESKTOP_NAV_ITEMS = [
  { label: 'Главная', to: '/', icon: House },
  { label: 'Расписание', to: '/schedule', icon: CalendarDays },
  { label: 'Тренеры', to: '/trainers', icon: UsersRound },
  { label: 'Абонементы', to: '/memberships', icon: CreditCard },
  { label: 'Контакты', to: '/contacts', icon: MapPinned },
] as const;

interface DesktopScrollNavigationProps {
  isVisible: boolean;
  onHomeNavigation: (event: MouseEvent<HTMLAnchorElement>) => void;
  onOpenModal: OpenModalHandler;
}

export function DesktopScrollNavigation({
  isVisible,
  onHomeNavigation,
  onOpenModal,
}: DesktopScrollNavigationProps) {
  return (
    <nav
      aria-label="Основная навигация"
      className={cn(
        'fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-1 rounded-[1.75rem] border border-white/20 bg-white/[0.12] p-2 shadow-[0_16px_46px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-2xl transition-[transform,opacity] duration-500 ease-out',
        isVisible ? '-translate-y-0 opacity-100' : 'pointer-events-none -translate-y-8 opacity-0'
      )}
    >
      {DESKTOP_NAV_ITEMS.map(({ icon: Icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={to === '/' ? onHomeNavigation : undefined}
          className={({ isActive }) =>
            cn(
              'flex min-h-14 min-w-[4.75rem] flex-col items-center justify-center gap-1 rounded-[1.25rem] px-2 py-1.5 text-[10px] font-semibold transition-colors xl:min-w-[5.25rem] xl:text-xs',
              isActive ? 'bg-white/[0.16] text-[#F5B800] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]' : 'text-gray-300 hover:bg-white/[0.07] hover:text-white'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.3 : 1.8} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
      <span className="mx-1 h-10 w-px bg-white/15" aria-hidden="true" />
      <a
        href="tel:+78443323323"
        className="inline-flex h-11 items-center gap-2 rounded-[1.1rem] px-3 text-xs font-semibold text-white transition-colors hover:bg-white/[0.1] xl:px-4"
      >
        <Phone className="h-4 w-4 text-[#F5B800]" />
        Позвонить
      </a>
      <button
        type="button"
        onClick={() => onOpenModal()}
        className="inline-flex h-11 items-center gap-2 rounded-[1.1rem] px-3 text-xs font-semibold text-white transition-colors hover:bg-white/[0.1] xl:px-4"
      >
        <CalendarPlus className="h-4 w-4 text-[#F5B800]" />
        Записаться
      </button>
    </nav>
  );
}
