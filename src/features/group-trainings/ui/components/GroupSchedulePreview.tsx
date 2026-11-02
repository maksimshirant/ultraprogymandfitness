import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GROUP_TRAININGS_TEXT, HERO_SCHEDULE_ROWS } from '@/features/group-trainings/model/constants';

interface GroupSchedulePreviewProps {
  expandedScheduleDays: string[];
  toggleScheduleDay: (dayId: string) => void;
}

// Keeps the day toggles and lesson columns aligned at every screen width.
export function GroupSchedulePreview({ expandedScheduleDays, toggleScheduleDay }: GroupSchedulePreviewProps) {
  return (
    <div className="relative">
      <div className="relative">
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Расписание занятий</h2>
        <p className="mt-3 text-sm text-white/65">Выберите день, чтобы посмотреть время занятий и тренеров.</p>

        <div className="mt-7 grid grid-cols-[3rem_minmax(0,1fr)] border-y border-white/15 py-3 text-xs font-medium text-white/60 sm:grid-cols-[5rem_minmax(0,1fr)]">
          <span className="self-center text-center">{GROUP_TRAININGS_TEXT.heroScheduleColumnDay}</span>
          <div className="grid grid-cols-[5.75rem_minmax(0,1fr)] gap-3 px-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:px-5">
            <span>{GROUP_TRAININGS_TEXT.heroScheduleColumnTime}</span>
            <span>{GROUP_TRAININGS_TEXT.heroScheduleColumnDirection}</span>
          </div>
        </div>

        <div>
          <div className="divide-y divide-white/15 border-b border-white/15">
            {HERO_SCHEDULE_ROWS.map((group) => {
              const isDayExpanded = expandedScheduleDays.includes(group.id);

              return (
                <div
                  key={group.id}
                  className="grid grid-cols-[3rem_minmax(0,1fr)] sm:grid-cols-[5rem_minmax(0,1fr)]"
                >
                  <button
                    type="button"
                    aria-expanded={isDayExpanded}
                    aria-controls={`schedule-${group.id}`}
                    onClick={() => toggleScheduleDay(group.id)}
                    className="flex min-h-16 flex-col items-center justify-center gap-2 border-r border-white/15 px-1 py-4 text-center transition-colors sm:px-3 lg:hover:bg-white/[0.04]"
                  >
                    <span className="whitespace-pre-line text-sm font-semibold leading-tight text-white">{group.day}</span>
                    <ChevronDown className={cn('h-4 w-4 text-gray-300 transition-transform duration-300', isDayExpanded && 'rotate-180')} />
                    {group.date ? <span className="text-[11px] text-gray-400 sm:text-xs">{group.date}</span> : null}
                  </button>

                  <div id={`schedule-${group.id}`} className="divide-y divide-white/10">
                    {isDayExpanded ? (
                      group.rows.map((row) => (
                        <div
                          key={row.id}
                          className="grid grid-cols-[5.75rem_minmax(0,1fr)] gap-3 px-3 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:px-5"
                        >
                          <span className="text-xs tabular-nums text-white/70 sm:text-sm">{row.time}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-snug text-white">{row.displayText}</p>
                            {row.displayTrainer ? <p className="mt-1 text-xs text-white/60 sm:text-sm">{row.displayTrainer}</p> : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleScheduleDay(group.id)}
                        aria-expanded={false}
                        aria-controls={`schedule-${group.id}`}
                        className="min-h-16 w-full px-3 py-4 text-left text-sm text-white/60 transition-colors sm:px-5 lg:hover:text-white"
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
