import { Check } from 'lucide-react';
import { BalancedHeading, HeadingAccent } from '@/components/typography/BalancedHeading';

interface Trainer {
  id: number;
  name: string;
  experience: string;
  achievements: string[];
  image?: string;
}

interface PersonalProps {
  onOpenModal: (topic?: string) => void;
}

const PERSONAL_TEXT = {
  sectionTitle: 'Персональные',
  sectionTitleAccent: 'тренировки с тренером',
  sectionSubtitle: 'Выберите тренера и запишитесь на персональную тренировку.',
  placeholderPhoto: 'Фото тренера',
  cta: 'Записаться на тренировку',
} as const;

const PERSONAL_ASSETS = {
  sergey: `${import.meta.env.BASE_URL}trainers/sergey.jpg`,
  yulia: `${import.meta.env.BASE_URL}trainers/yulia.jpg`,
  alexander: `${import.meta.env.BASE_URL}trainers/alexander.jpg`,
  pavel: `${import.meta.env.BASE_URL}trainers/pavel.webp`,
  evgeniy: `${import.meta.env.BASE_URL}trainers/evgeniy.jpg`,
  yaroslav: `${import.meta.env.BASE_URL}trainers/yaroslav.jpg`,
} as const;

const trainers: Trainer[] = [
  {
    id: 1,
    name: 'Вилков Сергей',
    experience: 'В спорте более 18 лет. В сфере фитнеса более 11 лет.',
    achievements: [
      'Фитнес-диетолог и нутрициолог',
      'Магистр программы «Теория и методика физической культуры» (ВГПУ)',
      'Пройдены курсы оздоровительного массажа',
      'Пройдены курсы инструктора тренажерного зала',
    ],
    image: PERSONAL_ASSETS.sergey,
  },
  {
    id: 2,
    name: 'Зарубина Юлия',
    experience: 'Опыт работы более 4 лет.',
    achievements: [
      'Высшее образование в сфере физической культуры и спорта',
      'Специализация: набор мышечной массы',
      'Специализация: снижение жирового компонента',
      'Специализация: МФР',
      'Специализация: растяжка',
      'Серебряный призер чемпионата Европы 3×3, бронзовый призер чемпионата Суперлиги-1 по баскетболу',
    ],
    image: PERSONAL_ASSETS.yulia,
  },
  {
    id: 3,
    name: 'Моисеев Александр',
    experience: 'Стаж работы тренером более 7 лет.',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Сертифицированный нутрициолог',
      'Высшее физкультурное образование',
      'Выпускник «FIT-STANDARD» (школа подготовки персональных тренеров)',
    ],
    image: PERSONAL_ASSETS.alexander,
  },
  {
    id: 4,
    name: 'Ляликов Павел',
    experience: 'Профессиональный тренер по бодибилдингу, фитнесу и пауэрлифтингу.',
    achievements: [
      'Выпускник Московской академии бодибилдинга и фитнеса',
      'Инструктор тренажерного зала',
      'Тренер по функциональному тренингу',
      'Повышение квалификации: «Нутрициология и адаптивное питание»',
      'Мастер спорта, рекордсмен России по становой тяге',
      'Мастер спорта, чемпион России и чемпион Европы по пауэрлифтингу',
      'Кандидат в мастера спорта по гиревому спорту',
    ],
    image: PERSONAL_ASSETS.pavel,
  },
  {
    id: 5,
    name: 'Хлыновский Евгений',
    experience: 'Опыт работы тренером более 7 лет.',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Сертификат: инструктор фитнеса и бодибилдинга',
      'Сертификаты: спортивная медицина, диетология, физиология, биохимия, анатомия',
    ],
    image: PERSONAL_ASSETS.evgeniy,
  },
  {
    id: 6,
    name: 'Осадчий Ярослав',
    experience: 'Опыт работы более 3 лет.',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Специализация: силовой тренинг',
      'Специализация: коррекция веса (набор мышечной массы, жиросжигание)',
      'Специализация: функциональный тренинг',
      'Специализация: рекомендации по питанию',
      'Специализация: общая физическая подготовка',
    ],
    image: PERSONAL_ASSETS.yaroslav,
  },
];

export default function Personal({ onOpenModal }: PersonalProps) {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <article
              key={trainer.id}
              className="glass-card border border-white/10 lg:hover:bg-white/5 transition-colors p-0 min-h-[520px] flex flex-col overflow-hidden"
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

              <div className="p-5 pt-4 flex-1 flex flex-col text-left">
                <BalancedHeading as="h3" className="text-2xl font-bold text-white mb-2">
                  {trainer.name}
                </BalancedHeading>
                <p className="text-sm text-gray-300 mb-4">{trainer.experience}</p>

                <ul className="space-y-2 flex-1">
                  {trainer.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F5B800] to-[#D89B00] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-300 leading-relaxed">{achievement}</span>
                    </li>
                  ))}
                </ul>

                <button onClick={() => onOpenModal('personal')} className="btn-primary text-white w-full mt-6">
                  {PERSONAL_TEXT.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
