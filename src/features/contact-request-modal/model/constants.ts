import { CreditCard, MessageSquareText, Sparkles, UserRound, Users } from 'lucide-react';

export const RU_PHONE_MASK = '+7 (___) ___-__-__';
export const DOCUMENT_FALLBACK_TEXT = 'Загрузка документа...';

export const MODAL_ASSETS = {
  logo: `${import.meta.env.BASE_URL}logo.webp`,
} as const;

export const MODAL_TEXT = {
  closeModalAria: 'Закрыть',
  closePolicyAria: 'Закрыть политику',
  closeConsentAria: 'Закрыть согласие',
  namePlaceholder: 'Ваше имя',
  phoneTitle: 'Формат: +7 (999) 999-99-99',
  questionPlaceholder: 'Задайте вопрос',
  consentPrefix: 'Нажимая на кнопку "Отправить", я даю',
  consentLink: 'согласие на обработку персональных данных',
  consentMiddle: 'и принимаю',
  privacyLink: 'Политику обработки персональных данных',
  submitDefault: 'Отправить заявку',
  submitLoading: 'Отправляем заявку...',
  success: 'Форма отправлена, с вами свяжутся.',
  successHint: 'Окно закроется автоматически.',
  returnToForm: 'Вернуться к форме',
  errorFallback: 'Произошла ошибка, попробуйте позже.',
  errorPrivacy: 'Подтвердите согласие на обработку персональных данных.',
  errorPhone: 'Введите номер в формате +7 (999) 999-99-99.',
  errorScenario: 'Выберите сценарий записи.',
  errorTrainer: 'Выберите тренера.',
  errorQuestion: 'Введите вопрос для менеджера.',
  changeSelection: 'Изменить',
  summaryMembership: 'Абонемент',
  summaryPersonal: 'Персональная тренировка',
  summaryGroup: 'Групповые занятия',
  summaryTrial: 'Пробное посещение',
  summaryOther: 'Другой вопрос',
  summaryGroupHelp: 'Помощь в подборе направления',
  groupRecommendationCard: 'Помощь в подборе направления',
  contactTitle: 'Оставьте контакты',
  contactSubtitle: '',
  rootTitle: 'Выберите сценарий записи',
  rootSubtitle: '',
  membershipTitle: 'Выберите абонемент',
  membershipSubtitle: '',
  personalTitle: 'Выберите тренера',
  personalSubtitle: '',
  groupTitle: 'Выберите направление',
  groupSubtitle: '',
  announcementTitle: 'Объявление',
  mailSubject: 'Новая заявка с сайта Ultra Pro Gym & Fitness',
  mailFromName: 'Ultra Pro Gym & Fitness',
  mailLabelName: 'Имя',
  mailLabelPhone: 'Телефон',
  mailLabelTopic: 'Тема',
  mailLabelMembership: 'Абонемент',
  mailLabelTrainer: 'Тренер',
  mailLabelGroupDirection: 'Направление',
  mailLabelQuestion: 'Вопрос',
  mailLabelMessage: 'Сообщение',
  messageFallback: 'Заявка без дополнительного комментария',
} as const;

export const ROOT_PRIMARY_OPTIONS = [
  { id: 'membership', title: 'Абонемент', mobileTitle: 'Абонемент', icon: CreditCard },
  { id: 'personal', title: 'Персональная тренировка', mobileTitle: 'Персональная', icon: UserRound },
  { id: 'group', title: 'Групповые занятия', mobileTitle: 'Групповые', icon: Users },
  { id: 'free_trial', title: 'Пробное посещение', mobileTitle: 'Пробное посещение', icon: Sparkles },
] as const;

export const ROOT_SECONDARY_OPTIONS = [
  { id: 'other', title: 'Другой вопрос', mobileTitle: 'Другой вопрос', icon: MessageSquareText },
] as const;

export const FORM_FIELD_CLASS =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-gray-500 transition-colors focus:outline-none focus:border-white/25';
