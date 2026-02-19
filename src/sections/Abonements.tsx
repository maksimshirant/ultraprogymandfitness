import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
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

const ABONEMENTS_TEXT = {
  sectionTitleAccent: 'Абонементы',
  sectionSubtitle: 'Выберите формат посещения под ваш график и цель.',
  cta: 'Приобрести абонемент',
  prevAria: 'Предыдущий абонемент',
  nextAria: 'Следующий абонемент',
  selectAriaPrefix: 'Выбрать абонемент',
} as const;

const commonModes = [
  'Тренажерный зал (Площадь 1800м2, 2 этажа, 50+ тренажеров)',
  'Доступ к групповым тренировкам (Оплачиваются отдельно)',
  'Сауна, полотенце, вода',
  'Кроссфит-зона',
  'Кардио-зона',
  'Зона единоборств',
];

const abonements = [
  {
    id: 1,
    title: '1 месяц',
    price: '2000 Р',
    label: 'Быстрый старт',
    note: 'Оптимально, чтобы познакомиться с клубом и режимом тренировок.',
    icon: Rocket,
    topicValue: 'sub_1m',
    modes: commonModes,
  },
  {
    id: 2,
    title: '3 месяц',
    price: '5400 Р',
    label: 'Стабильный ритм',
    note: 'Для тех, кто хочет закрепить привычку и видеть регулярный прогресс.',
    icon: CalendarClock,
    topicValue: 'sub_3m',
    modes: commonModes,
  },
  {
    id: 3,
    title: '6 месяцев',
    price: '9000 Р',
    label: 'Системный прогресс',
    note: 'Подходит для долгосрочной работы над силой, формой и выносливостью.',
    icon: Trophy,
    topicValue: 'sub_6m',
    modes: commonModes,
  },
  {
    id: 4,
    title: '12 месяцев',
    price: '14400 Р',
    label: 'Максимальный фокус',
    note: 'Годовой план для тех, кто нацелен на устойчивый спортивный результат.',
    icon: Crown,
    topicValue: 'sub_12m',
    modes: [...commonModes,  'Заморозка абонемента 60 дней (На время отпуска или болезни)', '5 гостевых посещений для друзей']
  },
  {
    id: 5,
    title: '12 месяцев (дневной)',
    price: '8900 Р',
    label: 'Дневной формат',
    note: 'Специальный формат для тренировок в первой половине дня.',
    icon: Sunrise,
    topicValue: 'sub_12m_day',
    modes: ['Время посещения: с 7:00 до 16:00', ...commonModes, 'Заморозка абонемента 60 дней (На время отпуска или болезни)',  '5 гостевых посещений для друзей'],
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
  const [currentIndex, setCurrentIndex] = useState(0);

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
          <div className="relative h-[810px] sm:h-[800px] md:h-[770px] overflow-hidden" {...swipeHandlers}>
            {abonements.map((abonement, index) => {
              const offset = getSlideOffset(index);
              const Icon = abonement.icon as LucideIcon;
              const isActive = offset === 0;

              return (
                <article
                  key={abonement.id}
                  className={`abonement-slide-motion absolute top-1/2 left-1/2 w-[88%] sm:w-[72%] md:w-[62%] max-w-[30rem] will-change-transform transition-all duration-700 ease-out ${
                    isActive
                      ? 'z-20 -translate-x-1/2 -translate-y-1/2 scale-100 opacity-100'
                      : offset === -1
                        ? 'z-10 -translate-x-[122%] -translate-y-1/2 scale-92 opacity-35'
                        : offset === 1
                          ? 'z-10 translate-x-[22%] -translate-y-1/2 scale-92 opacity-35'
                          : 'z-0 -translate-x-1/2 -translate-y-1/2 scale-90 opacity-0 pointer-events-none'
                  }`}
                >
                  <div
                    className={`glass-card p-5 md:p-6 h-[660px] md:h-[670px] flex flex-col ${
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

                    <BalancedHeading as="h3" className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                      {abonement.title}
                    </BalancedHeading>

                    <div className="mt-3">
                      <span className="relative inline-flex items-end gap-2">
                        <span className="relative z-10 text-4xl md:text-5xl font-black text-white">
                          {abonement.price}
                        </span>
                        <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-gradient-to-r from-[#F5B800] to-[#D89B00] z-0" />
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mt-4 mb-4">{abonement.note}</p>

                    <ul className="space-y-2 flex-1">
                      {abonement.modes.map((mode, modeIndex) => (
                        <li key={modeIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F5B800] to-[#D89B00] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-300 leading-relaxed">{mode}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => onOpenModal(abonement.topicValue)}
                      className="btn-primary text-white w-full mt-4"
                    >
                      {ABONEMENTS_TEXT.cta}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={prevSlide}
              className="abonement-control-motion w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
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
              className="abonement-control-motion w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
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
