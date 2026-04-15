const BASE_URL = import.meta.env.BASE_URL;

export type TrainerCategory = 'gym' | 'crossfit' | 'martial';

export interface TrainerProfile {
  id: number;
  name: string;
  role?: string;
  category: TrainerCategory;
  experience: string;
  summary: string;
  achievements: string[];
  image?: string;
  imageClassName?: string;
}

export const trainerCategories = [
  { id: 'gym', label: 'Тренажерный зал' },
  { id: 'crossfit', label: 'Кросс-фит' },
  { id: 'martial', label: 'Единоборства' },
] as const satisfies ReadonlyArray<{ id: TrainerCategory; label: string }>;

const TRAINER_ASSETS = {
  sergey: `${BASE_URL}trainers/sergey.jpg`,
  yulia: `${BASE_URL}trainers/yulia.jpg`,
  alexander: `${BASE_URL}trainers/alexander.jpg`,
  pavel: `${BASE_URL}trainers/pavel.jpg`,
  evgeniy: `${BASE_URL}trainers/evgeniy.jpg`,
  yaroslav: `${BASE_URL}trainers/yaroslav.jpg`,
  saikl: `${BASE_URL}trainers/saikl.jpg`,
  anton: `${BASE_URL}trainers/anton.jpg`,
  angelina: `${BASE_URL}trainers/angelina.jpg`,
  mark: `${BASE_URL}trainers/mark.JPG?v=20260327b`,
} as const;

export const trainers: TrainerProfile[] = [
  {
    id: 1,
    name: 'Вилков Сергей',
    role: 'Старший тренер',
    category: 'gym',
    experience: 'Опыт работы: более 12 лет',
    summary: 'Оздоровительный тренинг, работа с детьми, нутрициология',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Дипломированный специалист по работе с детьми разных возрастных групп',
      'Специалист в области фитнес-диетологии и нутрициологии',
      'Специалист по оздоровительному массажу',
      'Магистр программы «Теория и методика физической культуры» (ВГСПУ)',
    ],
    image: TRAINER_ASSETS.sergey,
  },
  {
    id: 2,
    name: 'Зарубина Юлия',
    category: 'gym',
    experience: 'Опыт работы более 4 лет.',
    summary: 'Набор массы, снижение веса, МФР и растяжка',
    achievements: [
      'Высшее образование в сфере физической культуры и спорта',
      'Дипломированный тренер тренажерного зала',
      'Специализация: набор мышечной массы, снижение жирового компонента, МФР, растяжка',
      'Серебряный призер чемпионата Европы 3×3, бронзовый призер чемпионата Суперлиги-1 по баскетболу',
    ],
    image: TRAINER_ASSETS.yulia,
  },
  {
    id: 3,
    name: 'Моисеев Александр',
    category: 'gym',
    experience: 'Опыт работы: более 8 лет',
    summary: 'Силовой тренинг и сопровождение по нутрициологии',
    achievements: [
      'Высшее образование в сфере физической культуры и спорта',
      'Дипломированный тренер тренажерного зала',
      'Сертифицированный фитнес-нутрициолог',
      'Сертифицированный специалист «Fit-Standart»',
    ],
    image: TRAINER_ASSETS.alexander,
  },
  {
    id: 4,
    name: 'Ляликов Павел',
    category: 'gym',
    experience: 'Опыт работы: более 10 лет',
    summary: 'Функциональный тренинг и адаптивное питание',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Специалист по функциональному тренингу',
      'Специалист по нутрициологии и адаптивному питанию',
      'Мастер спорта, чемпионат России, чемпион Европы по пауэрлифтингу',
      'Кандидат в мастера спорта по гиревому спорту',
    ],
    image: TRAINER_ASSETS.pavel,
  },
  {
    id: 5,
    name: 'Хлыновский Евгений',
    category: 'gym',
    experience: 'Опыт работы: более 9 лет',
    summary: 'Бодибилдинг, спортивная медицина, диетология',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Сертифицированный инструктор по бодибилдингу',
      'Сертификаты: инструктор фитнеса и бодибилдинга, специалист в области спортивной медицины, диетологии, биохимии и физиологии.',
    ],
    image: TRAINER_ASSETS.evgeniy,
  },
  {
    id: 6,
    name: 'Осадчий Ярослав',
    category: 'gym',
    experience: 'Опыт работы: более 3 лет',
    summary: 'Силовой тренинг, коррекция веса и ОФП',
    achievements: [
      'Сертифицированный тренер тренажерного зала',
      'Специализации: силовой тренинг, коррекция веса, функциональный тренинг, ОФП',
    ],
    image: TRAINER_ASSETS.yaroslav,
  },
  {
    id: 7,
    name: 'Нешпор Анжелика',
    category: 'gym',
    experience: 'Опыт работы: 8 лет',
    summary: 'Коррекция осанки и адаптивный фитнес',
    achievements: [
      'Дипломированный тренер тренажерного зала / инструктор групповых программ',
      'Специалист по коррекции осанки',
      'Специалист по адаптивному и функциональному фитнесу',
      'Сертифицированный тренер специальных групп населения',
    ],
    image: TRAINER_ASSETS.angelina,
  },
  {
    id: 8,
    name: 'Вольвач Марк',
    category: 'gym',
    experience: 'Опыт работы: более 2 лет',
    summary: 'Восстановление после травм, коррекция фигуры, бокс',
    achievements: [
      'Сертифицированный тренер по фитнесу',
      'Специализация: восстановление после травм и операций, коррекция фигуры, набор мышечной массы, бокс',
    ],
    image: TRAINER_ASSETS.mark,
    imageClassName: 'scale-[1.12]',
  },
  {
    id: 9,
    name: 'Гузей Александр',
    category: 'crossfit',
    experience: 'Опыт работы: 10 лет',
    summary: 'Кроссфит, сайкл, пауэрлифтинг, адаптивная физкультура',
    achievements: [
      'Сертифицированный инструктор групповых программ',
      'Тренер по адаптивной физической культуре',
      'Тренер по кроссфиту, пауэрлифтингу',
      'Тренер по сайкл',
      'Мастер спорта по АРБ',
      'Организатор сайкл-фестивалей',
    ],
    image: TRAINER_ASSETS.saikl,
  },
  {
    id: 10,
    name: 'Белявский Антон',
    category: 'martial',
    experience: 'Опыт работы: 8 лет',
    summary: 'Кикбоксинг и подготовка по единоборствам',
    achievements: [
      'Дипломированный тренер по единоборствам',
      'Чемпион России по кикбоксингу',
      'Победитель кубка России по кикбоксингу',
      'Профессиональный боец',
    ],
    image: TRAINER_ASSETS.anton,
  },
];

export const getTrainerByName = (name: string) =>
  trainers.find((trainer) => trainer.name === name);
