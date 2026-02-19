import { useState } from 'react';
import { Dumbbell, Zap, Users, Waves } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';

const ZONES_TEXT = {
  titleStart: 'Пространство клуба организовано так, чтобы каждая зона',
  titleAccent: 'усиливала',
  titleEnd: 'ваш результат.',
  subtitle: 'Выбирайте формат тренировки под своё настроение и цель.',
} as const;

const zones = [
  {
    id: 1,
    name: 'Тренажерный зал',
    icon: Dumbbell,
    content: 'Просторный тренажёрный зал с современным оборудованием для силовых и кардиотренировок. Здесь удобно работать и над набором мышечной массы, и над снижением веса, и над общим тонусом: от базовых упражнений до изолирующих движений. Продуманная расстановка тренажёров и инвентаря помогает тренироваться комфортно и без очередей.',
  },
  {
    id: 2,
    name: 'Кроссфит-пространство',
    icon: Zap,
    content: 'Отдельная кроссфит-зона, организованная с акцентом на безопасность и функциональность. Она расположена на отдельном этаже, поэтому ничто не отвлекает от работы и не пересекается с основным тренажёрным залом. Площадка оснащена всем необходимым инвентарём для функциональных тренировок: для силы, выносливости, координации и работы со своим весом.',
  },
  {
    id: 3,
    name: 'Зона групповых занятий',
    icon: Users,
    content: 'Отдельный зал для групповых занятий — отдельная комфортная «комната», адаптированная именно под групповой формат. Удобное пространство, хорошая вентиляция и оснащение позволяют сосредоточиться на технике и темпе. Групповые тренировки подходят тем, кому важны структура, разнообразие и мотивация тренироваться в команде.',
  },
  {
    id: 4,
    name: 'Сауна',
    icon: Waves,
    content: 'Сауна — это эффективный способ восстановления после тренировки. Кратковременное тепловое воздействие помогает расслабить мышцы, улучшить кровообращение и снизить ощущение мышечной усталости. Исследования показывают, что регулярное использование сауны может способствовать улучшению выносливости и положительно влиять на сердечно-сосудистую систему при сочетании с физическими нагрузками. Это не просто отдых, а часть грамотного восстановления организма после тренировки.',
  },
];

export default function Zones() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextZone = () => {
    setCurrentIndex((prev) => (prev + 1) % zones.length);
  };

  const prevZone = () => {
    setCurrentIndex((prev) => (prev - 1 + zones.length) % zones.length);
  };

  const getZoneOffset = (index: number) => {
    let offset = index - currentIndex;
    const half = zones.length / 2;

    if (offset > half) offset -= zones.length;
    if (offset < -half) offset += zones.length;

    return offset;
  };

  const swipeHandlers = useSwipeNavigation({
    onNext: nextZone,
    onPrev: prevZone,
  });

  return (
    <section id="zones" className="py-20 relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F5B800]/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <BalancedHeading as="h2" className="section-title text-white">
              {ZONES_TEXT.titleStart}{' '}
              <HeadingAccent>{ZONES_TEXT.titleAccent}</HeadingAccent> {ZONES_TEXT.titleEnd}
            </BalancedHeading>
            <p className="section-subtitle">
              {ZONES_TEXT.subtitle}
            </p>
          </div>
          <div className="relative">
            <div className="relative h-[340px] md:h-[380px] overflow-hidden" {...swipeHandlers}>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0a0a0f] to-transparent z-20" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0a0f] to-transparent z-20" />

              {zones.map((zone, index) => {
                const offset = getZoneOffset(index);
                return (
                <div
                  key={zone.id}
                  className={`absolute left-0 right-0 top-1/2 will-change-transform transition-all duration-700 ease-out ${
                    offset === 0
                      ? 'z-10 -translate-y-1/2 scale-100 opacity-100'
                      : offset === -1
                        ? 'z-0 -translate-y-[165%] scale-90 opacity-35'
                        : offset === 1
                          ? 'z-0 translate-y-[65%] scale-90 opacity-35'
                          : 'z-0 -translate-y-1/2 scale-[0.85] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="glass-card py-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F5B800] to-[#D89B00] flex items-center justify-center flex-shrink-0">
                        <zone.icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{zone.name}</span>
                        </div>
                        <p
                          className="mt-2 text-gray-300 text-sm leading-relaxed"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {zone.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={prevZone}
                className="p-2 rounded-full bg-white/5 lg:hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex gap-2">
                {zones.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'w-8 bg-gradient-to-r from-[#F5B800] to-[#D89B00]'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextZone}
                className="p-2 rounded-full bg-white/5 lg:hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
