import { useState } from 'react';
import { Check } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';

interface Trainer {
  id: number;
  name: string;
  role?: string;
  experience: string;
  achievements: string[];
  image?: string;
}

interface PersonalProps {
  onOpenModal: (topic?: string, trainer?: string) => void;
}

const PERSONAL_TEXT = {
  sectionTitle: '',
  sectionTitleAccent: 'Персональный тренинг',
  sectionSubtitle: 'Выберите тренера и запишитесь на персональную тренировку.',
  placeholderPhoto: 'Фото тренера',
  cta: 'Записаться на тренировку',
  prevAria: 'Предыдущий тренер',
  nextAria: 'Следующий тренер',
  selectAriaPrefix: 'Выбрать тренера',
} as const;

const PERSONAL_ASSETS = {
  sergey: `${import.meta.env.BASE_URL}trainers/sergey.jpg`,
  yulia: `${import.meta.env.BASE_URL}trainers/yulia.jpg`,
  alexander: `${import.meta.env.BASE_URL}trainers/alexander.jpg`,
  pavel: `${import.meta.env.BASE_URL}trainers/pavel.jpg`,
  evgeniy: `${import.meta.env.BASE_URL}trainers/evgeniy.jpg`,
  yaroslav: `${import.meta.env.BASE_URL}trainers/yaroslav.jpg`,
  saikl: `${import.meta.env.BASE_URL}trainers/saikl.jpg`,
  anton: `${import.meta.env.BASE_URL}trainers/anton.jpg`,
} as const;

const trainers: Trainer[] = [
  {
    id: 1,
    name: 'Вилков Сергей',
    role: 'Старший тренер',
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
    experience: 'Опыт работы более 4 лет.',
    achievements: [
      'Высшее образование в сфере физической культуры и спорта',
      'Дипломированный тренер тренажерного зала',
      'Специализация:',
      '- набор мышечной массы',
      '- снижение жирового компонента',
      '- МФР',
      '- растяжка',
      'Серебряный призер чемпионата Европы 3×3, бронзовый призер чемпионата Суперлиги-1 по баскетболу',
    ],
    image: PERSONAL_ASSETS.yulia,
  },
  {
    id: 3,
    name: 'Моисеев Александр',
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
    experience: 'Опыт работы: более 3 лет',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Специализации: силовой тренинг, коррекция веса, функциональный тренинг, ОФП',
    ],
    image: PERSONAL_ASSETS.yaroslav,
  },
  {
    id: 7,
    name: 'Гузей Александр',
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
    id: 8,
    name: 'Белявский Антон',
    experience: 'Опыт работы: 8 лет',
    achievements: [
      'Дипломированный тренер по единоборствам',
      'Чемпион России по кикбоксингу',
      'Победитель кубка России по кикбоксингу',
      'Профессиональный боец',
    ],
    image: PERSONAL_ASSETS.anton,
  },
  {
    id: 9,
    name: 'Нешпор Анжелика',
    experience: 'Опыт работы: 8 лет',
    achievements: [
      'Дипломированный тренер тренажерного зала / инструктор групповых программ',
      'Специалист по коррекции осанки',
      'Специалист по адаптивному и функциональному фитнесу',
      'Сертифицированный тренер специальных групп населения',
    ],
  },
];

export default function Personal({ onOpenModal }: PersonalProps) {
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const nextMobileSlide = () => {
    setMobileActiveIndex((prev) => (prev + 1) % trainers.length);
  };

  const prevMobileSlide = () => {
    setMobileActiveIndex((prev) => (prev - 1 + trainers.length) % trainers.length);
  };

  const mobileSwipeHandlers = useSwipeNavigation({
    onNext: nextMobileSlide,
    onPrev: prevMobileSlide,
  });

  const renderTrainerCard = (trainer: Trainer) => (
    <article
      key={trainer.id}
      className="glass-card border border-white/10 lg:hover:bg-white/5 transition-colors p-0 flex flex-col overflow-hidden min-h-[520px]"
    >
      <div className="rounded-lg overflow-hidden m-4 mb-0 aspect-[4/5] border border-white/10 bg-black/40 flex items-center justify-center">
        {trainer.image ? (
          <img
            src={trainer.image}
            alt={trainer.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1A1A27] via-[#111117] to-[#0A0A0F] flex flex-col items-center justify-center">
            <span className="text-6xl md:text-7xl font-black text-[#F5B800] leading-none">
              {String(trainer.id).padStart(2, '0')}
            </span>
            <span className="mt-3 text-xs tracking-[0.2em] uppercase text-gray-300">
              {PERSONAL_TEXT.placeholderPhoto}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 pt-4 h-[360px] md:h-[340px] flex flex-col text-left">
        <BalancedHeading as="h3" className="text-2xl font-bold text-white mb-2">
          {trainer.name}
        </BalancedHeading>
        {trainer.role ? (
          <p className="text-sm text-gray-400 mb-2">{trainer.role}</p>
        ) : null}
        <p className="text-sm text-gray-300 mb-4">{trainer.experience}</p>

        <ul className="space-y-2 flex-1 overflow-y-auto pr-1">
          {trainer.achievements.map((achievement, index) => {
            const trimmedAchievement = achievement.trim();
            const isSpecializationLine = trimmedAchievement.startsWith('-');

            if (isSpecializationLine) {
              return (
                <li key={index} className="pl-8 text-sm text-gray-300 leading-relaxed">
                  {achievement}
                </li>
              );
            }

            return (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F5B800] to-[#D89B00] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-gray-300 leading-relaxed">{achievement}</span>
              </li>
            );
          })}
        </ul>

        <button onClick={() => onOpenModal('personal', trainer.name)} className="btn-primary text-white w-full mt-6">
          {PERSONAL_TEXT.cta}
        </button>
      </div>
    </article>
  );

  return (
    <section id="trainers" className="py-14 relative overflow-hidden scroll-mt-24">
      <div className="hero-glow-layer">
        <div className="hero-glow-top-right" />
        <div className="hero-glow-bottom-left" />
        <div className="hero-glow-center" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <BalancedHeading as="h2" className="section-title text-white">
            {PERSONAL_TEXT.sectionTitle}{' '}
            <HeadingAccent>{PERSONAL_TEXT.sectionTitleAccent}</HeadingAccent>
          </BalancedHeading>
          <p className="section-subtitle mx-auto">{PERSONAL_TEXT.sectionSubtitle}</p>
        </div>

        <div className="md:hidden">
          <div className="overflow-hidden" {...mobileSwipeHandlers}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${mobileActiveIndex * 100}%)` }}
            >
              {trainers.map((trainer) => (
                <div key={trainer.id} className="w-full shrink-0">
                  {renderTrainerCard(trainer)}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={prevMobileSlide}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label={PERSONAL_TEXT.prevAria}
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-3 flex-wrap justify-center">
              {trainers.map((trainer, index) => (
                <button
                  key={trainer.id}
                  onClick={() => setMobileActiveIndex(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === mobileActiveIndex
                      ? 'w-16 bg-gradient-to-r from-[#F5B800] to-[#D89B00]'
                      : 'w-8 bg-white/20'
                  }`}
                  aria-label={`${PERSONAL_TEXT.selectAriaPrefix} ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextMobileSlide}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label={PERSONAL_TEXT.nextAria}
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => renderTrainerCard(trainer))}
        </div>
      </div>
    </section>
  );
}
