import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
  Rocket,
  CalendarClock,
  Trophy,
  Crown,
  Sunrise,
  Ticket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { cn } from '@/lib/utils';

const ABONEMENTS_TEXT = {
  sectionTitleAccent: 'Абонементы',
  sectionSubtitle: 'Выберите формат посещения под ваш график и цель.',
  cta: 'Приобрести абонемент',
  showMore: 'Показать больше',
  showLess: 'Скрыть',
  prevAria: 'Предыдущий абонемент',
  nextAria: 'Следующий абонемент',
  selectAriaPrefix: 'Выбрать абонемент',
} as const;

const PREVIEW_MODES_COUNT = 3;

const commonModes = [
  'Тренажерный зал (Площадь 1800м2, 2 этажа, 50+ тренажеров)',
  'Доступ к групповым тренировкам (Оплачиваются отдельно)',
  'Сауна, полотенце, вода',
  'Кроссфит-зона',
  'Кардио-зона',
  'Зона единоборств',
];

const freezeModes = {
  month1: 'Заморозка абонемента 14 дней',
  month3: 'Заморозка абонемента 21 день',
  month6: 'Заморозка абонемента 30 дней',
  year: 'Заморозка абонемента 60 дней',
} as const;

const abonements = [
  {
    id: 1,
    title: '1 месяц',
    price: '2000 Р',
    label: 'Быстрый старт',
    note: 'Оптимально, чтобы познакомиться с клубом и режимом тренировок.',
    icon: Rocket,
    topicValue: 'sub_1m',
    modes: [...commonModes, freezeModes.month1],
  },
  {
    id: 2,
    title: '3 месяц',
    price: '5400 Р',
    label: 'Стабильный ритм',
    note: 'Для тех, кто хочет закрепить привычку и видеть регулярный прогресс.',
    icon: CalendarClock,
    topicValue: 'sub_3m',
    modes: [...commonModes, freezeModes.month3],
  },
  {
    id: 3,
    title: '6 месяцев',
    price: '9000 Р',
    label: 'Системный прогресс',
    note: 'Подходит для долгосрочной работы над силой, формой и выносливостью.',
    icon: Trophy,
    topicValue: 'sub_6m',
    modes: [...commonModes, freezeModes.month6],
  },
  {
    id: 4,
    title: '12 месяцев',
    price: '14400 Р',
    label: 'Максимальный фокус',
    note: 'Годовой план для тех, кто нацелен на устойчивый спортивный результат.',
    icon: Crown,
    topicValue: 'sub_12m',
    modes: [...commonModes, freezeModes.year, '5 гостевых посещений для друзей'],
  },
  {
    id: 5,
    title: '12 месяцев (дневной)',
    price: '10900 Р',
    label: 'Дневной формат',
    note: 'Специальный формат для тренировок в первой половине дня.',
    icon: Sunrise,
    topicValue: 'sub_12m_day',
    modes: [
      'Время посещения: с 7:00 до 16:00',
      commonModes[0],
      commonModes[2],
      commonModes[1],
      commonModes[3],
      commonModes[4],
      commonModes[5],
      freezeModes.year,
      '5 гостевых посещений для друзей',
    ],
  },
  {
    id: 6,
    title: 'Разовое посещение',
    price: '500 Р',
    label: 'Без абонемента',
    note: 'Разовый вход для свободного графика и гибкого посещения.',
    icon: Ticket,
    topicValue: 'sub_once',
    modes: ['Входит все, что и в обычный абонемент'],
  },
  {
    id: 7,
    title: 'ТЕСТ ДРАЙВ',
    price: '1000 Р',
    label: 'Пробный',
    note: 'Недельный абонемент дает возможность попробовать фитнес на себе, оценить комфорт и атмосферу клуба',
    icon: Ticket,
    topicValue: 'sub_once',
    modes: ['Входит все, что и в обычный абонемент'],
  },
];

interface AbonementsProps {
  onOpenModal: (topic?: string) => void;
}

export default function Abonements({ onOpenModal }: AbonementsProps) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [expandedAbonementId, setExpandedAbonementId] = useState<number | null>(null);

  useEffect(() => {
    setExpandedAbonementId(null);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % abonements.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + abonements.length) % abonements.length);
  };

  const getSlideOffset = (index: number) => {
    let offset = index - currentIndex;
    const half = Math.floor(abonements.length / 2);

    if (offset > half) {
      offset -= abonements.length;
    }
    if (offset < -half) {
      offset += abonements.length;
    }

    return offset;
  };

  const swipeHandlers = useSwipeNavigation({
    onNext: nextSlide,
    onPrev: prevSlide,
  });

  return (
    <section id="subscriptions" className="py-10 md:py-14 relative overflow-hidden scroll-mt-24">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <BalancedHeading as="h2" className="section-title text-white">
            <HeadingAccent>{ABONEMENTS_TEXT.sectionTitleAccent}</HeadingAccent>
          </BalancedHeading>
          <p className="section-subtitle mx-auto">
            {ABONEMENTS_TEXT.sectionSubtitle}
          </p>
        </div>

        <div className="relative w-full">
          <button
            onClick={prevSlide}
            className="abonement-control-motion absolute left-0 top-[21rem] z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#111217]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-white/35 hover:bg-[#181a22] md:flex"
            aria-label={ABONEMENTS_TEXT.prevAria}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="abonement-control-motion absolute right-0 top-[21rem] z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#111217]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-white/35 hover:bg-[#181a22] md:flex"
            aria-label={ABONEMENTS_TEXT.nextAria}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div
            className={cn(
              'relative overflow-hidden transition-[height] duration-300 ease-out',
              expandedAbonementId === null
                ? 'h-[620px] sm:h-[610px] md:h-[590px]'
                : 'h-[820px] sm:h-[800px] md:h-[760px]'
            )}
            {...swipeHandlers}
          >
            {abonements.map((abonement, index) => {
              const offset = getSlideOffset(index);
              const Icon = abonement.icon as LucideIcon;
              const isActive = offset === 0;
              const hasHiddenModes = abonement.modes.length > PREVIEW_MODES_COUNT;
              const isExpanded = isActive && expandedAbonementId === abonement.id;

              return (
                <article
                  key={abonement.id}
                  className={`abonement-slide-motion absolute left-1/2 top-12 md:top-16 w-[88%] sm:w-[72%] md:w-[62%] max-w-[30rem] will-change-transform transition-all duration-700 ease-out ${
                    isActive
                      ? 'z-20 -translate-x-1/2 scale-100 opacity-100'
                      : offset === -1
                        ? 'z-10 -translate-x-[122%] scale-92 opacity-35'
                        : offset === 1
                          ? 'z-10 translate-x-[22%] scale-92 opacity-35'
                          : 'z-0 -translate-x-1/2 scale-90 opacity-0 pointer-events-none'
                  }`}
                >
                  <div
                    className={`glass-card p-5 md:p-6 flex flex-col transition-[height] duration-300 ${
                      isActive
                        ? 'abonement-card-active border border-[#F5B800]/30'
                        : 'border border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
                        <Icon className="w-4 h-4 text-[#F5B800]" />
                        <span className="text-xs font-medium tracking-wide text-gray-200">{abonement.label}</span>
                      </div>
                    </div>

                    <BalancedHeading
                      as="h3"
                      className={cn(
                        'font-extrabold text-white leading-tight',
                        abonement.id === 5 ? 'text-[1.55rem] md:text-[1.9rem] whitespace-nowrap' : 'text-3xl md:text-4xl'
                      )}
                    >
                      {abonement.title}
                    </BalancedHeading>

                    <div className="mt-3">
                      <span className="relative inline-flex items-end gap-2">
                        <span className="relative z-10 text-4xl md:text-5xl font-black text-[rgb(255,255,255,0.82)]">
                          {abonement.price}
                        </span>
                        <span className="absolute bottom-1 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F5B800] to-[#D89B00] z-0" />
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mt-4 mb-4">{abonement.note}</p>

                    <div className="relative">
                      <ul
                        className={cn(
                          'space-y-2 overflow-hidden transition-[max-height] duration-300 ease-out',
                          !isExpanded && hasHiddenModes && 'pointer-events-none'
                        )}
                        style={{
                          maxHeight: isExpanded ? '32rem' : '9.5rem',
                          WebkitMaskImage:
                            !isExpanded && hasHiddenModes
                              ? 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 72%, rgba(0, 0, 0, 0) 100%)'
                              : undefined,
                          maskImage:
                            !isExpanded && hasHiddenModes
                              ? 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 72%, rgba(0, 0, 0, 0) 100%)'
                              : undefined,
                        }}
                      >
                        {abonement.modes.map((mode, modeIndex) => (
                          <li key={modeIndex} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F5B800] to-[#D89B00] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-300 leading-relaxed">{mode}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {hasHiddenModes ? (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedAbonementId((prev) => (prev === abonement.id ? null : abonement.id))
                        }
                        disabled={!isActive}
                        aria-expanded={isExpanded}
                        className="mt-3 inline-flex items-center gap-2 self-start text-sm font-medium text-[#F5B800] transition-opacity hover:text-[#FFD351] disabled:pointer-events-none disabled:opacity-45"
                      >
                        <span>{isExpanded ? ABONEMENTS_TEXT.showLess : ABONEMENTS_TEXT.showMore}</span>
                        <ChevronDown
                          className={cn('h-4 w-4 transition-transform duration-300', isExpanded && 'rotate-180')}
                        />
                      </button>
                    ) : null}

                    <button
                      onClick={() => onOpenModal(abonement.topicValue)}
                      disabled={!isActive}
                      className="btn-primary text-white w-full mt-4 disabled:opacity-55 disabled:cursor-not-allowed disabled:pointer-events-none"
                    >
                      {ABONEMENTS_TEXT.cta}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-[0.88125rem] md:mt-[2.0125rem] flex items-center justify-center gap-6 md:gap-3">
            <button
              onClick={prevSlide}
              className="abonement-control-motion flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10 md:hidden"
              aria-label={ABONEMENTS_TEXT.prevAria}
            >
              <ChevronLeft className="w-6 h-6 text-gray-400" />
            </button>

            <div className="flex gap-3 flex-wrap justify-center">
              {abonements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`abonement-control-motion h-1 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-16 bg-gradient-to-r from-[#F5B800] to-[#D89B00]'
                      : 'w-8 bg-white/20'
                  }`}
                  aria-label={`${ABONEMENTS_TEXT.selectAriaPrefix} ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="abonement-control-motion flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10 md:hidden"
              aria-label={ABONEMENTS_TEXT.nextAria}
            >
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
