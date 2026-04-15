const BASE_URL = import.meta.env.BASE_URL;
const GROUP_DIRECTION_BADGE = 'Групповое направление';

const TRAINER_AVATARS = {
  Александр: `${BASE_URL}trainers/saikl.jpg`,
  Анжелика: `${BASE_URL}trainers/angelina.jpg`,
  Антон: `${BASE_URL}trainers/anton.jpg`,
  Юлия: `${BASE_URL}trainers/yulia.jpg`,
} as const;

export type GroupDirectionCategory = 'active' | 'recovery' | 'kids';

export interface GroupDirection {
  key: string;
  text: string;
  trainer: string;
  shortDescription: string;
  benefits: string[];
  category: GroupDirectionCategory;
  badge: string;
  status: string;
  trainerAvatar?: string;
  trainerAvatarPosition?: string;
  description: string;
  action: string;
  bookingAction: string;
  confirmBookingAction: string;
}

export const groupDirectionCategories = [
  {
    key: 'active',
    title: 'Активные тренировки',
    description: 'Силовые и динамичные форматы для тех, кто хочет работать на тонус, выносливость и интенсивность.',
  },
  {
    key: 'recovery',
    title: 'Восстановление и здоровье',
    description: 'Бережные направления для подвижности, осанки, восстановления и комфортного укрепления тела.',
  },
  {
    key: 'kids',
    title: 'Детские тренировки',
    description: 'Форматы для физического развития ребенка в безопасной и поддерживающей атмосфере.',
  },
] as const;

export const groupDirections: GroupDirection[] = [
  {
    key: 'crossfit',
    text: 'Кроссфит',
    trainer: 'Александр',
    shortDescription: 'Высокоинтенсивный формат для силы, выносливости и уверенной работы со всем телом.',
    benefits: ['силовая выносливость', 'мощность', 'комплексная нагрузка'],
    category: 'active',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Высокая интенсивность',
    trainerAvatar: TRAINER_AVATARS.Александр,
    trainerAvatarPosition: '50% 14%',
    description:
      'Кроссфит сочетает силовые упражнения, кардио-нагрузку и функциональные связки для развития силы, выносливости и общей физической формы.\n\nФормат подходит тем, кто любит динамику, хочет быстрее прогрессировать и получать мощную тренировочную нагрузку в группе.\n\nЗанятия проводит тренер Александр, который следит за техникой, масштабирует нагрузку под уровень подготовки и помогает безопасно расти от тренировки к тренировке.',
    action: 'group_direction:crossfit',
    bookingAction: 'group_booking_request:crossfit',
    confirmBookingAction: 'group_booking_confirm:crossfit',
  },
  {
    key: 'martial_arts',
    text: 'Единоборства',
    trainer: 'Антон',
    shortDescription: 'Силовые и скоростные тренировки для развития уверенности, реакции и общей выносливости.',
    benefits: ['выносливость', 'координация', 'реакция'],
    category: 'active',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Интенсивный формат',
    trainerAvatar: TRAINER_AVATARS.Антон,
    trainerAvatarPosition: '50% 18%',
    description:
      'Единоборства — это сила, скорость и уверенность в себе.\n\nТренировки проходят под руководством тренера Антона. Занятия помогают развить выносливость, координацию, реакцию и укрепить всё тело. Подходят как начинающим, так и тем, кто хочет повысить уровень подготовки и улучшить физическую форму.',
    action: 'group_direction:martial_arts',
    bookingAction: 'group_booking_request:martial_arts',
    confirmBookingAction: 'group_booking_confirm:martial_arts',
  },
  {
    key: 'lfk',
    text: 'ЛФК',
    trainer: 'Александр',
    shortDescription: 'Мягкий восстановительный формат для подвижности, осанки и снижения дискомфорта в теле.',
    benefits: ['подвижность', 'осанка', 'снижение дискомфорта'],
    category: 'recovery',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Восстановительный формат',
    trainerAvatar: TRAINER_AVATARS.Александр,
    trainerAvatarPosition: '50% 14%',
    description:
      'ЛФК (лечебная физическая культура) — это тренировки, направленные на восстановление подвижности, укрепление мышц и улучшение общего состояния организма.\n\nЗанятия помогают снизить болевые ощущения в спине и суставах, улучшить осанку и повысить уровень повседневной активности. Подходят людям с разным уровнем подготовки.\n\nТренировки проводит тренер Александр, который подбирает упражнения с учётом индивидуальных особенностей и помогает безопасно укреплять организм.',
    action: 'group_direction:lfk',
    bookingAction: 'group_booking_request:lfk',
    confirmBookingAction: 'group_booking_confirm:lfk',
  },
  {
    key: 'glute_pump',
    text: 'Ягодичный памп',
    trainer: 'Анжелика',
    shortDescription: 'Тренировка с акцентом на ягодицы и ноги для тонуса, силы и заметной проработки низа тела.',
    benefits: ['ягодицы и ноги', 'тонус', 'сила нижней части тела'],
    category: 'active',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Акцент на ягодицы',
    trainerAvatar: TRAINER_AVATARS.Анжелика,
    trainerAvatarPosition: '50% 18%',
    description:
      'Ягодичный памп — это тренировка, направленная на укрепление мышц ягодиц и ног, улучшение тонуса и формирование красивого силуэта.\n\nЗанятия помогают повысить силу нижней части тела, улучшить выносливость и сделать тренировки максимально эффективными за счёт правильно подобранных упражнений.\n\nТренер Анжелика внимательно контролирует технику выполнения и помогает добиться заметного результата уже в процессе регулярных тренировок.',
    action: 'group_direction:glute_pump',
    bookingAction: 'group_booking_request:glute_pump',
    confirmBookingAction: 'group_booking_confirm:glute_pump',
  },
  {
    key: 'kids_martial_arts',
    text: 'Единоборства (дети)',
    trainer: 'Антон',
    shortDescription: 'Детские занятия для силы, дисциплины и координации в безопасной и поддерживающей среде.',
    benefits: ['дисциплина', 'координация', 'уверенность'],
    category: 'kids',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Для детей',
    trainerAvatar: TRAINER_AVATARS.Антон,
    trainerAvatarPosition: '50% 18%',
    description:
      'Детские занятия по единоборствам направлены на развитие силы, координации, дисциплины и уверенности в себе.\n\nТренировки помогают улучшить физическую подготовку ребёнка, развивают реакцию, внимание и умение работать в команде. Занятия проходят в безопасной и поддерживающей атмосфере.\n\nТренер Антон уделяет внимание каждому участнику и помогает детям развиваться физически и психологически через регулярные тренировки.',
    action: 'group_direction:kids_martial_arts',
    bookingAction: 'group_booking_request:kids_martial_arts',
    confirmBookingAction: 'group_booking_confirm:kids_martial_arts',
  },
  {
    key: 'circuit_strength',
    text: 'Круговая силовая',
    trainer: 'Юлия',
    shortDescription: 'Интенсивный круговой формат для силовой выносливости и комплексной нагрузки на всё тело.',
    benefits: ['всё тело', 'силовая выносливость', 'интенсивный темп'],
    category: 'active',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Интенсивный формат',
    trainerAvatar: TRAINER_AVATARS.Юлия,
    trainerAvatarPosition: '68% 18%',
    description:
      'Круговая силовая тренировка — это интенсивный формат занятий, направленный на укрепление всех основных групп мышц и развитие выносливости.\n\nУпражнения выполняются по кругу с чередованием нагрузок, что позволяет эффективно проработать всё тело за одну тренировку.\n\nТренер Юлия контролирует технику выполнения упражнений и помогает подобрать комфортный уровень нагрузки для стабильного прогресса.',
    action: 'group_direction:circuit_strength',
    bookingAction: 'group_booking_request:circuit_strength',
    confirmBookingAction: 'group_booking_confirm:circuit_strength',
  },
  {
    key: 'cycle',
    text: 'Сайкл',
    trainer: 'Александр',
    shortDescription: 'Кардио-формат на велотренажёрах для выносливости, тонуса и мощной работы в темпе группы.',
    benefits: ['кардио-нагрузка', 'выносливость', 'энергичный темп'],
    category: 'active',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Кардио-формат',
    trainerAvatar: TRAINER_AVATARS.Александр,
    trainerAvatarPosition: '50% 14%',
    description:
      'Сайкл — это энергичная групповая тренировка на велотренажёрах, которая помогает развить выносливость, укрепить ноги и получить интенсивную кардио-нагрузку.\n\nФормат подходит тем, кто любит ритм, хочет сжигать калории и работать в драйвовой атмосфере группы.\n\nТренер Александр задаёт темп, помогает распределять усилия и делает тренировку понятной как для новичков, так и для тех, кто уже любит интенсивное кардио.',
    action: 'group_direction:cycle',
    bookingAction: 'group_booking_request:cycle',
    confirmBookingAction: 'group_booking_confirm:cycle',
  },
  {
    key: 'functional_training',
    text: 'Функциональный тренинг',
    trainer: 'Виктория',
    shortDescription: 'Комплексные упражнения для силы, координации и общей физической подготовки в понятном темпе.',
    benefits: ['сила', 'координация', 'общая физподготовка'],
    category: 'active',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Подходит новичкам',
    description:
      'Функциональный тренинг — это комплексные упражнения для развития силы, выносливости, координации и общей физической подготовки.\n\nТренировки направлены на укрепление всего тела, улучшение подвижности суставов и повышение уровня ежедневной активности. Подходят как новичкам, так и тем, кто хочет повысить эффективность своих занятий.\n\nЗанятия проводит тренер Виктория — внимательный специалист, который помогает безопасно освоить технику упражнений и добиться стабильного прогресса.',
    action: 'group_direction:functional_training',
    bookingAction: 'group_booking_request:functional_training',
    confirmBookingAction: 'group_booking_confirm:functional_training',
  },
  {
    key: 'stretching',
    text: 'Стретчинг',
    trainer: 'Виктория',
    shortDescription: 'Спокойный формат для гибкости, расслабления мышц и более комфортного движения в повседневной жизни.',
    benefits: ['гибкость', 'подвижность суставов', 'снятие напряжения'],
    category: 'recovery',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Восстановительный формат',
    description:
      'Стретчинг — это тренировки, направленные на развитие гибкости, улучшение подвижности суставов и снятие мышечного напряжения.\n\nЗанятия помогают восстановиться после силовых нагрузок, улучшить осанку и общее самочувствие, а также снизить уровень стресса.\n\nТренер Виктория помогает выполнять упражнения правильно и безопасно, постепенно увеличивая гибкость и комфорт движения.',
    action: 'group_direction:stretching',
    bookingAction: 'group_booking_request:stretching',
    confirmBookingAction: 'group_booking_confirm:stretching',
  },
  {
    key: 'smart_fitness',
    text: 'Умный фитнес',
    trainer: 'Анжелика',
    shortDescription: 'Продуманный формат для тонуса, подвижности и безопасной нагрузки с вниманием к технике.',
    benefits: ['контроль техники', 'мягкая нагрузка', 'тонус всего тела'],
    category: 'recovery',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Комфортный формат',
    trainerAvatar: TRAINER_AVATARS.Анжелика,
    trainerAvatarPosition: '50% 18%',
    description:
      'Умный фитнес — это формат тренировок с акцентом на грамотную технику, безопасную нагрузку и постепенное укрепление всего тела.\n\nПодходит тем, кто хочет тренироваться осознанно, улучшать самочувствие, поддерживать тонус и двигаться без перегрузки.\n\nЗанятия проводит тренер Анжелика, помогая выстроить понятную, аккуратную и эффективную работу в комфортном темпе.',
    action: 'group_direction:smart_fitness',
    bookingAction: 'group_booking_request:smart_fitness',
    confirmBookingAction: 'group_booking_confirm:smart_fitness',
  },
  {
    key: 'afk',
    text: 'АФК',
    trainer: 'Александр',
    shortDescription: 'Адаптивный формат для мягкого укрепления организма, восстановления подвижности и самочувствия.',
    benefits: ['мягкое укрепление', 'восстановление подвижности', 'улучшение самочувствия'],
    category: 'recovery',
    badge: GROUP_DIRECTION_BADGE,
    status: 'Восстановительный формат',
    trainerAvatar: TRAINER_AVATARS.Александр,
    trainerAvatarPosition: '50% 14%',
    description:
      'АФК (адаптивная физическая культура) — это занятия, направленные на укрепление здоровья, восстановление подвижности и улучшение общего физического состояния.\n\nТренировки подходят людям с разным уровнем подготовки, а также тем, кому важно мягкое и безопасное укрепление организма.\n\nЗанятия проводит тренер Александр, который подбирает нагрузку индивидуально с учётом особенностей участников и помогает постепенно улучшать физическую форму и самочувствие.',
    action: 'group_direction:afk',
    bookingAction: 'group_booking_request:afk',
    confirmBookingAction: 'group_booking_confirm:afk',
  },
];

export const groupDirectionRecommendations = [
  {
    goal: 'Укрепить тело и повысить выносливость',
    directions: ['functional_training', 'circuit_strength'],
  },
  {
    goal: 'Скорректировать осанку',
    directions: ['lfk', 'afk'],
  },
  {
    goal: 'Развить гибкость',
    directions: ['stretching'],
  },
  {
    goal: 'Физическое развитие ребёнка',
    directions: ['kids_martial_arts'],
  },
] as const;
