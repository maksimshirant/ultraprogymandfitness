import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { cn } from '@/lib/utils';

interface Trainer {
  id: number;
  name: string;
  role?: string;
  category: TrainerCategory;
  experience: string;
  achievements: string[];
  image?: string;
  imageClassName?: string;
}

type TrainerCategory = 'gym' | 'crossfit' | 'martial';

interface PersonalProps {
  onOpenModal: (topic?: string, trainer?: string) => void;
}

const PERSONAL_TEXT = {
  sectionTitle: '',
  sectionTitleAccent: 'Персональный тренинг',
  sectionSubtitle: 'Выберите тренера и запишитесь на персональную тренировку.',
  placeholderPhoto: 'Фото тренера',
  showMore: 'Подробнее о тренере',
  showLess: 'Скрыть',
  cta: 'Записаться на тренировку',
  prevAria: 'Предыдущий тренер',
  nextAria: 'Следующий тренер',
  selectAriaPrefix: 'Выбрать тренера',
  selectCategoryAria: 'Выбрать категорию тренеров',
} as const;

const trainerCategories = [
  { id: 'gym', label: 'Тренажерный зал' },
  { id: 'crossfit', label: 'Кросс-фит' },
  { id: 'martial', label: 'Единоборства' },
] as const satisfies ReadonlyArray<{ id: TrainerCategory; label: string }>;

const PERSONAL_ASSETS = {
  sergey: `${import.meta.env.BASE_URL}trainers/sergey.jpg`,
  yulia: `${import.meta.env.BASE_URL}trainers/yulia.jpg`,
  alexander: `${import.meta.env.BASE_URL}trainers/alexander.jpg`,
  pavel: `${import.meta.env.BASE_URL}trainers/pavel.jpg`,
  evgeniy: `${import.meta.env.BASE_URL}trainers/evgeniy.jpg`,
  yaroslav: `${import.meta.env.BASE_URL}trainers/yaroslav.jpg`,
  saikl: `${import.meta.env.BASE_URL}trainers/saikl.jpg`,
  anton: `${import.meta.env.BASE_URL}trainers/anton.jpg`,
  angelina: `${import.meta.env.BASE_URL}trainers/angelina.jpg`,
  mark: `${import.meta.env.BASE_URL}trainers/mark.JPG?v=20260327b`,
} as const;

const trainers: Trainer[] = [
  {
    id: 1,
    name: 'Вилков Сергей',
    role: 'Старший тренер',
    category: 'gym',
    experience: 'Опыт работы: более 12 лет',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Дипломированный специалист по работе с детьми разных возрастных групп',
      'Специалист в области фитнес-диетологии и нутрициологии',
      'Специалист по оздоровительному массажу',
      'Магистр программы «Теория и методика физической культуры» (ВГСПУ)',
    ],
    image: PERSONAL_ASSETS.sergey,
  },
  {
    id: 2,
    name: 'Зарубина Юлия',
    category: 'gym',
    experience: 'Опыт работы более 4 лет.',
    achievements: [
      'Высшее образование в сфере физической культуры и спорта',
      'Дипломированный тренер тренажерного зала',
      'Специализация: набор мышечной массы, снижение жирового компонента, МФР, растяжка',
      'Серебряный призер чемпионата Европы 3×3, бронзовый призер чемпионата Суперлиги-1 по баскетболу',
    ],
    image: PERSONAL_ASSETS.yulia,
  },
  {
    id: 3,
    name: 'Моисеев Александр',
    category: 'gym',
    experience: 'Опыт работы: более 8 лет',
    achievements: [
      'Высшее образование в сфере физической культуры и спорта',
      'Дипломированный тренер тренажерного зала',
      'Сертифицированный фитнес-нутрициолог',
      'Сертифицированный специалист «Fit-Standart»',
    ],
    image: PERSONAL_ASSETS.alexander,
  },
  {
    id: 4,
    name: 'Ляликов Павел',
    category: 'gym',
    experience: 'Опыт работы: более 10 лет',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Специалист по функциональному тренингу',
      'Специалист по нутрициологии и адаптивному питанию',
      'Мастер спорта, чемпионат России, чемпион Европы по пауэрлифтингу',
      'Кандидат в мастера спорта по гиревому спорту',
    ],
    image: PERSONAL_ASSETS.pavel,
  },
  {
    id: 5,
    name: 'Хлыновский Евгений',
    category: 'gym',
    experience: 'Опыт работы: более 9 лет',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Сертифицированный инструктор по бодибилдингу',
      'Сертификаты: инструктор фитнеса и бодибилдинга, специалист в области спортивной медицины, диетологии, биохимии и физиологии.',
    ],
    image: PERSONAL_ASSETS.evgeniy,
  },
  {
    id: 6,
    name: 'Осадчий Ярослав',
    category: 'gym',
    experience: 'Опыт работы: более 3 лет',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Специализации: силовой тренинг, коррекция веса, функциональный тренинг, ОФП',
    ],
    image: PERSONAL_ASSETS.yaroslav,
  },
  {
    id: 7,
    name: 'Нешпор Анжелика',
    category: 'gym',
    experience: 'Опыт работы: 8 лет',
    achievements: [
      'Дипломированный тренер тренажерного зала / инструктор групповых программ',
      'Специалист по коррекции осанки',
      'Специалист по адаптивному и функциональному фитнесу',
      'Сертифицированный тренер специальных групп населения',
    ],
    image: PERSONAL_ASSETS.angelina,
  },
  {
    id: 8,
    name: 'Вольвач Марк',
    category: 'gym',
    experience: 'Опыт работы: более 2 лет',
    achievements: [
      'Сертифицированный тренер по фитнесу',
      'Специализация: восстановление после травм и операций, коррекция фигуры, набор мышечной массы, бокс',
    ],
    image: PERSONAL_ASSETS.mark,
    imageClassName: 'scale-[1.12]',
  },
  {
    id: 9,
    name: 'Гузей Александр',
    category: 'crossfit',
    experience: 'Опыт работы: 10 лет',
    achievements: [
      'Сертифицированный инструктор групповых программ',
      'Тренер по адаптивной физической культуре',
      'Тренер по кроссфиту, пауэрлифтингу',
      'Тренер по сайкл',
      'Мастер спорта по АРБ',
      'Организатор сайкл-фестивалей',
    ],
    image: PERSONAL_ASSETS.saikl,
  },
  {
    id: 10,
    name: 'Белявский Антон',
    category: 'martial',
    experience: 'Опыт работы: 8 лет',
    achievements: [
      'Дипломированный тренер по единоборствам',
      'Чемпион России по кикбоксингу',
      'Победитель кубка России по кикбоксингу',
      'Профессиональный боец',
    ],
    image: PERSONAL_ASSETS.anton,
  },
];

function renderAchievement(achievement: string, index: number) {
  const trimmedAchievement = achievement.trim();
  const isSpecializationLine = trimmedAchievement.startsWith('-');
  const isLabelLine = trimmedAchievement.endsWith(':');

  if (isSpecializationLine) {
    return (
      <li key={index} className="pl-6 text-[11px] leading-relaxed text-gray-300 sm:pl-7 sm:text-xs md:pl-8 md:text-sm">
        {achievement}
      </li>
    );
  }

  if (isLabelLine) {
    return (
      <li key={index} className="pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F5B800] sm:text-xs md:text-sm">
        {achievement}
      </li>
    );
  }

  return (
    <li key={index} className="flex items-start gap-3">
      <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F5B800] to-[#D89B00] sm:h-4.5 sm:w-4.5 md:h-5 md:w-5">
        <Check className="h-2.5 w-2.5 text-white md:h-3 md:w-3" />
      </div>
      <span className="text-[11px] leading-relaxed text-gray-300 sm:text-xs md:text-sm">{achievement}</span>
    </li>
  );
}

export default function Personal({ onOpenModal }: PersonalProps) {
  const [activeCategory, setActiveCategory] = useState<TrainerCategory>('gym');
  const [activeTrainerIndex, setActiveTrainerIndex] = useState(0);
  const [expandedTrainerId, setExpandedTrainerId] = useState<number | null>(null);

  const filteredTrainers = useMemo(
    () => trainers.filter((trainer) => trainer.category === activeCategory),
    [activeCategory]
  );

  useEffect(() => {
    setExpandedTrainerId(null);
  }, [activeTrainerIndex]);

  useEffect(() => {
    setActiveTrainerIndex(0);
    setExpandedTrainerId(null);
  }, [activeCategory]);

  const nextSlide = () => {
    setActiveTrainerIndex((prev) => (prev + 1) % filteredTrainers.length);
  };

  const prevSlide = () => {
    setActiveTrainerIndex((prev) => (prev - 1 + filteredTrainers.length) % filteredTrainers.length);
  };

  const swipeHandlers = useSwipeNavigation({
    onNext: nextSlide,
    onPrev: prevSlide,
  });
  const getSlideOffset = (index: number) => {
    let offset = index - activeTrainerIndex;
    const half = Math.floor(filteredTrainers.length / 2);

    if (offset > half) {
      offset -= filteredTrainers.length;
    }
    if (offset < -half) {
      offset += filteredTrainers.length;
    }

    return offset;
  };

  const renderCarouselTrainerCard = (trainer: Trainer, isActive = false, isActionDisabled = false) => {
    const isExpanded = expandedTrainerId === trainer.id;

    return (
      <article
        key={trainer.id}
        className={`glass-card border border-white/10 p-0 flex flex-col overflow-hidden ${
          isActive ? 'trainer-card-active' : ''
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden border-b border-white/10 bg-black/40">
          {trainer.image ? (
            <img
              src={trainer.image}
              alt={trainer.name}
              loading="lazy"
              decoding="async"
              className={cn(
                'absolute inset-0 block h-full w-full object-cover object-center',
                trainer.imageClassName
              )}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A27] via-[#111117] to-[#0A0A0F]">
              <span className="text-6xl font-black leading-none text-[#F5B800] md:text-7xl">
                {String(trainer.id).padStart(2, '0')}
              </span>
              <span className="mt-3 text-xs uppercase tracking-[0.2em] text-gray-300">
                {PERSONAL_TEXT.placeholderPhoto}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col p-5 pt-4 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-white">{trainer.name}</h3>
            {trainer.role ? (
              <span className="inline-flex shrink-0 items-center rounded-full border border-[#F5B800]/30 bg-[#F5B800]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F5B800]">
                {trainer.role}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm text-gray-300">{trainer.experience}</p>

          <button
            type="button"
            onClick={() => setExpandedTrainerId((prev) => (prev === trainer.id ? null : trainer.id))}
            disabled={isActionDisabled}
            aria-expanded={isExpanded}
            className="mt-4 inline-flex items-center gap-2 self-start text-sm font-medium text-[#F5B800] transition-opacity hover:text-[#FFD351] disabled:pointer-events-none disabled:opacity-45"
          >
            <span>{isExpanded ? PERSONAL_TEXT.showLess : PERSONAL_TEXT.showMore}</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', isExpanded && 'rotate-180')} />
          </button>

          {isExpanded ? (
            <ul className="mt-4 space-y-2 pr-1">
              {trainer.achievements.map((achievement, achievementIndex) =>
                renderAchievement(achievement, achievementIndex)
              )}
            </ul>
          ) : null}

          <button
            type="button"
            onClick={() => onOpenModal('personal', trainer.name)}
            disabled={isActionDisabled}
            className="btn-primary mt-5 w-full text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55"
          >
            {PERSONAL_TEXT.cta}
          </button>
        </div>
      </article>
    );
  };

  return (
    <section id="trainers" className="relative overflow-hidden py-14 scroll-mt-24">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <BalancedHeading as="h2" className="section-title text-white">
            {PERSONAL_TEXT.sectionTitle} <HeadingAccent>{PERSONAL_TEXT.sectionTitleAccent}</HeadingAccent>
          </BalancedHeading>
          <p className="section-subtitle mx-auto">{PERSONAL_TEXT.sectionSubtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
          {trainerCategories.map((category) => {
            const isActive = category.id === activeCategory;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                aria-label={`${PERSONAL_TEXT.selectCategoryAria} ${category.label}`}
                aria-pressed={isActive}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs transition-all md:px-4.5 md:py-2.5 md:text-sm',
                  isActive
                    ? 'border-white/25 bg-white/10 text-white'
                    : 'border-white/8 bg-transparent text-gray-400 hover:border-white/18 hover:text-white'
                )}
              >
                <span className="block font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-6 h-px w-20 bg-white/10" />

        <div className="md:hidden">
          <div className="overflow-hidden" {...swipeHandlers}>
            <div
              className="trainer-slide-motion flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeTrainerIndex * 100}%)` }}
            >
              {filteredTrainers.map((trainer) => (
                <div key={trainer.id} className="w-full shrink-0">
                  {renderCarouselTrainerCard(trainer)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative hidden md:-mx-6 md:block lg:hidden">
          <button
            onClick={prevSlide}
            className="trainer-control-motion absolute left-4 top-[18rem] z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#111217]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-white/35 hover:bg-[#181a22] md:flex lg:hidden"
            aria-label={PERSONAL_TEXT.prevAria}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="trainer-control-motion absolute right-4 top-[18rem] z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#111217]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-white/35 hover:bg-[#181a22] md:flex lg:hidden"
            aria-label={PERSONAL_TEXT.nextAria}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          <div
            className={cn(
              'relative overflow-hidden transition-[height] duration-300 ease-out',
              expandedTrainerId === null ? 'h-[760px]' : 'h-[980px]'
            )}
            {...swipeHandlers}
          >
            {filteredTrainers.map((trainer, index) => {
              const offset = getSlideOffset(index);
              const isActive = offset === 0;

              return (
                <article
                  key={trainer.id}
                  className={`trainer-slide-motion absolute left-1/2 top-8 w-[72%] max-w-[24rem] will-change-transform transition-all duration-700 ease-out ${
                    isActive
                      ? 'z-20 -translate-x-1/2 scale-100 opacity-100'
                      : offset === -1
                        ? 'z-10 -translate-x-[124%] scale-92 opacity-35'
                        : offset === 1
                          ? 'z-10 translate-x-[24%] scale-92 opacity-35'
                          : 'z-0 -translate-x-1/2 scale-90 opacity-0 pointer-events-none'
                  }`}
                >
                  {renderCarouselTrainerCard(trainer, isActive, !isActive)}
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-6 lg:hidden md:-mx-6 md:mt-4 md:gap-3">
          <button
            onClick={prevSlide}
            className="trainer-control-motion flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10 md:hidden"
            aria-label={PERSONAL_TEXT.prevAria}
          >
            <ChevronLeft className="h-6 w-6 text-gray-400" />
          </button>

          <div className="flex flex-wrap justify-center gap-3">
            {filteredTrainers.map((trainer, index) => (
              <button
                key={trainer.id}
                onClick={() => setActiveTrainerIndex(index)}
                className={`trainer-control-motion h-1 rounded-full transition-all ${
                  index === activeTrainerIndex
                    ? 'w-16 bg-gradient-to-r from-[#F5B800] to-[#D89B00]'
                    : 'w-8 bg-white/20'
                }`}
                aria-label={`${PERSONAL_TEXT.selectAriaPrefix} ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="trainer-control-motion flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10 md:hidden"
            aria-label={PERSONAL_TEXT.nextAria}
          >
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="hidden space-y-12 lg:block">
          {filteredTrainers.map((trainer) => (
            <article
              key={trainer.id}
              className="min-h-[18.5rem] overflow-hidden rounded-[26px] border border-white/10 bg-[#111217] sm:min-h-[21rem] sm:rounded-[28px] md:min-h-[24rem] lg:min-h-0 lg:rounded-[30px]"
            >
              <div
                className="h-full gap-3 sm:gap-4 md:gap-6 lg:gap-10"
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}
              >
                <div
                  className="flex shrink-0 items-center justify-center"
                  style={{ flex: '0 0 clamp(8.5rem, 34vw, 24rem)' }}
                >
                  <div className="relative h-full w-full max-w-[24rem] overflow-hidden rounded-l-[26px] rounded-r-none border border-white/10 bg-black/40 aspect-[4/5] sm:rounded-l-[28px] lg:rounded-l-[30px]">
                    {trainer.image ? (
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        loading="lazy"
                        decoding="async"
                        className={cn('absolute inset-0 block h-full w-full object-cover object-center', trainer.imageClassName)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A27] via-[#111117] to-[#0A0A0F]">
                        <span className="text-6xl font-black leading-none text-[#F5B800] md:text-7xl">
                          {String(trainer.id).padStart(2, '0')}
                        </span>
                        <span className="mt-3 text-xs uppercase tracking-[0.2em] text-gray-300">
                          {PERSONAL_TEXT.placeholderPhoto}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="flex min-w-0 flex-1 flex-col justify-center px-1.5 py-3 sm:px-2 sm:py-4 md:px-3 md:py-5 lg:px-0 lg:py-2"
                  style={{ flex: '1 1 auto' }}
                >
                  <div className="min-w-0 max-w-none">
                    <div className="flex items-center gap-2">
                      <h3 className="whitespace-nowrap text-[0.95rem] font-extrabold leading-tight text-white sm:text-lg md:text-[1.55rem] lg:text-[2.75rem]">
                        {trainer.name}
                      </h3>
                      {trainer.role ? (
                        <span className="inline-flex shrink-0 items-center rounded-full border border-[#F5B800]/30 bg-[#F5B800]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F5B800] sm:text-[10px] md:text-[11px] lg:text-xs">
                          {trainer.role}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-[11px] leading-snug text-gray-300 sm:text-xs md:text-sm lg:text-base">
                      {trainer.experience}
                    </p>
                  </div>

                  <ul className="mt-2.5 space-y-1.5 pr-1 sm:mt-3 sm:space-y-2 md:mt-4 md:space-y-2.5 lg:mt-5 lg:space-y-3">
                    {trainer.achievements.map((achievement, achievementIndex) =>
                      renderAchievement(achievement, achievementIndex)
                    )}
                  </ul>

                  <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8">
                    <button
                      type="button"
                      onClick={() => onOpenModal('personal', trainer.name)}
                      className="btn-primary w-full px-3 py-2.5 text-[11px] text-white sm:w-full sm:px-4 sm:py-3 sm:text-xs md:w-auto md:px-6 md:text-sm lg:px-7 lg:py-4 lg:text-base"
                    >
                      {PERSONAL_TEXT.cta}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
