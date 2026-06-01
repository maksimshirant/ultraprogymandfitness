import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GROUP_TRAININGS_TEXT, HERO_SCHEDULE_ROWS } from '@/features/group-trainings/model/constants';

interface GroupSchedulePreviewProps {
  expandedScheduleDays: string[];
  toggleScheduleDay: (dayId: string) => void;
}

export function GroupSchedulePreview({ expandedScheduleDays, toggleScheduleDay }: GroupSchedulePreviewProps) {
  return (
    <div className="relative">
      <div className="relative p-3 sm:p-5 lg:px-0 lg:py-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-white sm:text-base">
          <span>{GROUP_TRAININGS_TEXT.heroSchedulePrefix}</span>
          <span className="text-gray-300">{GROUP_TRAININGS_TEXT.heroScheduleLabel}</span>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4 sm:mt-5 sm:pt-5">
          <div className="grid grid-cols-[3.5rem_5.25rem_minmax(0,1fr)] gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 sm:grid-cols-[4.25rem_6.5rem_minmax(0,1fr)] sm:gap-3 sm:px-4 sm:py-3 sm:text-[11px] sm:tracking-[0.18em] lg:grid-cols-[5.5rem_8.75rem_minmax(0,1fr)] lg:px-5 lg:py-3.5">
            <span>{GROUP_TRAININGS_TEXT.heroScheduleColumnDay}</span>
            <span>{GROUP_TRAININGS_TEXT.heroScheduleColumnTime}</span>
            <span>{GROUP_TRAININGS_TEXT.heroScheduleColumnDirection}</span>
          </div>

          <div className="divide-y divide-white/8">
            {HERO_SCHEDULE_ROWS.map((group) => {
              const isDayExpanded = expandedScheduleDays.includes(group.id);

              return (
                <div
                  key={group.id}
                  className="grid grid-cols-[4.75rem_minmax(0,1fr)] sm:grid-cols-[5.5rem_minmax(0,1fr)] lg:grid-cols-[6.5rem_minmax(0,1fr)]"
                >
                  <button
                    type="button"
                    aria-expanded={isDayExpanded}
                    onClick={() => toggleScheduleDay(group.id)}
                    className="flex flex-col items-center justify-center gap-1 border-r border-white/8 bg-white/[0.03] px-2 py-3 text-center transition-colors sm:px-3 sm:py-4 lg:hover:bg-white/[0.06]"
                  >
                    <span className="whitespace-pre-line text-[11px] font-semibold leading-[1.15] text-white sm:text-sm">{group.day}</span>
                    <ChevronDown className={cn('h-4 w-4 text-gray-300 transition-transform duration-300', isDayExpanded && 'rotate-180')} />
                    {group.date ? <span className="text-[11px] text-gray-400 sm:text-xs">{group.date}</span> : null}
                  </button>

                  <div className="divide-y divide-white/8">
                    {isDayExpanded ? (
                      group.rows.map((row) => (
                        <div
                          key={row.id}
                          className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-2 px-3 py-3 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-3 sm:px-4 sm:py-3 lg:grid-cols-[8.75rem_minmax(0,1fr)] lg:px-5 lg:py-3.5"
                        >
                          <span className="text-xs text-gray-300 sm:text-sm">{row.time}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white sm:text-sm lg:text-[0.95rem]">{row.displayText}</p>
                            {row.displayTrainer ? <p className="mt-1 text-[11px] text-gray-400 sm:text-xs lg:text-[0.85rem]">{row.displayTrainer}</p> : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleScheduleDay(group.id)}
                        className="w-full px-3 py-3 text-left text-xs text-gray-400 transition-colors sm:px-4 sm:py-3 sm:text-sm lg:px-5 lg:py-3.5 lg:hover:text-gray-200"
                      >
                        Нажмите, чтобы раскрыть
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
