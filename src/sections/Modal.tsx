
import { Suspense, lazy, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  CircleCheck,
  CreditCard,
  Loader2,
  MessageSquareText,
  Sparkles,
  TriangleAlert,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { sendForm } from '@/api/forms';
import { groupDirections } from '@/content/groupDirections';
import { getMembershipById, getMembershipByTopic, memberships } from '@/content/memberships';
import { trainers } from '@/content/trainers';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const PrivacyPolicyContent = lazy(async () => {
  const module = await import('@/components/PrivacyPolicyContent');
  return { default: module.PrivacyPolicyContent };
});

const PersonalDataConsentContent = lazy(async () => {
  const module = await import('@/components/PersonalDataConsentContent');
  return { default: module.PersonalDataConsentContent };
});

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledTopic?: string;
  prefilledMembershipId?: number;
  prefilledTrainer?: string;
  prefilledGroupDirection?: string;
  prefilledGroupRecommendation?: boolean;
  announcement?: {
    label: string;
    title: string;
    message: readonly string[];
    closeButtonLabel: string;
  };
}

type FlowStep = 'root' | 'membership' | 'personal' | 'group' | 'contact';

type FlowSelection = {
  topic: string;
  membershipId?: number;
  trainer: string;
  groupDirection: string;
  wantsGroupRecommendation: boolean;
};

type ResultNotice = {
  type: 'success' | 'error';
  text: string;
};

const RU_PHONE_MASK = '+7 (___) ___-__-__';
const RU_PHONE_REGEX = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const DOCUMENT_FALLBACK_TEXT = 'Загрузка документа...';

const MODAL_ASSETS = {
  logo: `${import.meta.env.BASE_URL}logo.webp`,
} as const;

const MODAL_TEXT = {

  closeModalAria: 'Закрыть',
  closePolicyAria: 'Закрыть политику',
  closeOfferAria: 'Закрыть договор офферты',
  namePlaceholder: 'Ваше имя',
  phoneTitle: 'Формат: +7 (999) 999-99-99',
  questionPlaceholder: 'Задайте вопрос',
  privacyPrefix: 'Я соглашаюсь с',
  privacyLink: 'Политикой конфиденциальности',
  offerLink: 'Договором офферты',
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

const ROOT_PRIMARY_OPTIONS = [
  {
    id: 'membership',
    title: 'Абонемент',
    mobileTitle: 'Абонемент',
    icon: CreditCard,
  },
  {
    id: 'personal',
    title: 'Персональная тренировка',
    mobileTitle: 'Персональная',
    icon: UserRound,
  },
  {
    id: 'group',
    title: 'Групповые занятия',
    mobileTitle: 'Групповые',
    icon: Users,
  },
  {
    id: 'free_trial',
    title: 'Пробное посещение',
    mobileTitle: 'Пробное посещение',
    icon: Sparkles,
  },
] as const;

const ROOT_SECONDARY_OPTIONS = [
  {
    id: 'other',
    title: 'Другой вопрос',
    mobileTitle: 'Другой вопрос',
    icon: MessageSquareText,
  },
] as const;

const FORM_FIELD_CLASS =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-gray-500 transition-colors focus:outline-none focus:border-white/25';

const membershipTopics = new Set(memberships.map((membership) => membership.topicValue));

const formatRussianPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  const normalized = digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
  const national = normalized.startsWith('7') ? normalized.slice(1, 11) : normalized.slice(0, 10);

  let formatted = '+7';
  if (national.length > 0) {
    formatted += ` (${national.slice(0, 3)}`;
  }
  if (national.length >= 3) {
    formatted += ')';
  }
  if (national.length > 3) {
    formatted += ` ${national.slice(3, 6)}`;
  }
  if (national.length > 6) {
    formatted += `-${national.slice(6, 8)}`;
  }
  if (national.length > 8) {
    formatted += `-${national.slice(8, 10)}`;
  }

  return formatted;
};

const isValidRussianPhone = (phone: string) => RU_PHONE_REGEX.test(phone);

const syncTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
  if (!textarea) {
    return;
  }

  textarea.style.height = '0px';
  textarea.style.height = `${textarea.scrollHeight}px`;
};
type ActiveDocument = 'privacy' | 'consent' | null;

const createInitialFormData = () => ({
  name: '',
  phone: '',
  question: '',
});

const createEmptySelection = (): FlowSelection => ({
  topic: '',
  membershipId: undefined,
  trainer: '',
  groupDirection: '',
  wantsGroupRecommendation: false,
});

const isMembershipTopic = (topic: string) => membershipTopics.has(topic as (typeof memberships)[number]['topicValue']);

const resolveInitialState = (
  prefilledTopic = '',
  prefilledMembershipId?: number,
  prefilledTrainer = '',
  prefilledGroupDirection = '',
  prefilledGroupRecommendation = false
) => {
  const selection = createEmptySelection();
  const normalizedTopic = prefilledTopic.trim();

  if (normalizedTopic === 'membership') {
    return {
      step: 'membership' as FlowStep,
      entryStep: 'membership' as FlowStep,
      selection,
    };
  }

  if (isMembershipTopic(normalizedTopic)) {
    const membership = getMembershipById(prefilledMembershipId) ?? getMembershipByTopic(normalizedTopic);

    return {
      step: 'contact' as FlowStep,
      entryStep: 'contact' as FlowStep,
      selection: {
        ...selection,
        topic: membership?.topicValue ?? normalizedTopic,
        membershipId: membership?.id,
      },
    };
  }

  if (normalizedTopic === 'personal') {
    return {
      step: prefilledTrainer ? ('contact' as FlowStep) : ('personal' as FlowStep),
      entryStep: prefilledTrainer ? ('contact' as FlowStep) : ('personal' as FlowStep),
      selection: {
        ...selection,
        topic: 'personal',
        trainer: prefilledTrainer,
      },
    };
  }

  if (normalizedTopic === 'group') {
    if (prefilledGroupRecommendation && !prefilledGroupDirection) {
      return {
        step: 'contact' as FlowStep,
        entryStep: 'contact' as FlowStep,
        selection: {
          ...selection,
          topic: 'group',
          wantsGroupRecommendation: true,
        },
      };
    }

    return {
      step: prefilledGroupDirection ? ('contact' as FlowStep) : ('group' as FlowStep),
      entryStep: prefilledGroupDirection ? ('contact' as FlowStep) : ('group' as FlowStep),
      selection: {
        ...selection,
        topic: 'group',
        groupDirection: prefilledGroupDirection,
      },
    };
  }

  if (normalizedTopic === 'free_trial' || normalizedTopic === 'other') {
    return {
      step: 'contact' as FlowStep,
      entryStep: 'contact' as FlowStep,
      selection: {
        ...selection,
        topic: normalizedTopic,
      },
    };
  }

  return {
    step: 'root' as FlowStep,
    entryStep: 'root' as FlowStep,
    selection,
  };
};

function ScenarioCard({
  title,
  icon: Icon,
  onClick,
  isActive = false,
  compact = false,
}: {
  title: string;
  icon: typeof CreditCard;
  onClick: () => void;
  isActive?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group rounded-[24px] border text-left transition-all',
        compact ? 'p-3' : 'p-5 sm:p-6',
        isActive
          ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
          : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
      )}
    >
      {compact ? (
        <div className="flex items-center justify-center">
          <h3 className="min-w-0 truncate whitespace-nowrap text-center text-sm font-semibold text-white">
            {title}
          </h3>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#F5B800]">
              <Icon className="h-5 w-5" />
            </span>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 lg:group-hover:translate-x-0.5" />
          </div>
          <h3 className="mt-4 text-base font-semibold leading-tight text-white sm:text-lg">{title}</h3>
        </>
      )}
    </button>
  );
}

function CompactScenarioButton({
  title,
  icon: Icon,
  onClick,
  isActive = false,
}: {
  title: string;
  icon: typeof CreditCard;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all',
        isActive
          ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
          : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#F5B800]">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" />
    </button>
  );
}

function DocumentModal({
  closeAriaLabel,
  onClose,
  children,
}: {
  closeAriaLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[111] flex items-center justify-center overflow-hidden p-4 sm:p-6">
      <div
        className="document-modal-overlay absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        className="glass-card modal-surface relative mx-auto my-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-[30px] p-6 max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100vh-3rem)] sm:max-h-[calc(100dvh-3rem)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 transition-colors lg:hover:text-white"
          aria-label={closeAriaLabel}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="document-modal-scroll min-h-0 flex-1 overflow-y-auto pr-2 pt-8 sm:pr-3 sm:pt-10">
          <Suspense fallback={<p className="text-sm text-gray-300">{DOCUMENT_FALLBACK_TEXT}</p>}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function Modal({
  isOpen,
  onClose,
  prefilledTopic = '',
  prefilledMembershipId,
  prefilledTrainer = '',
  prefilledGroupDirection = '',
  prefilledGroupRecommendation = false,
  announcement,
}: ModalProps) {
  const isMobile = useIsMobile();
  const isAnnouncementMode = Boolean(announcement);

  const closeTimeoutRef = useRef<number | null>(null);
  const questionTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [currentStep, setCurrentStep] = useState<FlowStep>('root');
  const [entryStep, setEntryStep] = useState<FlowStep>('root');
  const [selection, setSelection] = useState<FlowSelection>(createEmptySelection());
  const [formData, setFormData] = useState(createInitialFormData);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resultNotice, setResultNotice] = useState<ResultNotice | null>(null);

  const selectedMembership = useMemo(
    () =>
      getMembershipById(selection.membershipId) ??
      (isMembershipTopic(selection.topic) ? getMembershipByTopic(selection.topic) : undefined),
    [selection.membershipId, selection.topic]
  );
  const selectedGroupDirection = useMemo(
    () => groupDirections.find((direction) => direction.text === selection.groupDirection),
    [selection.groupDirection]
  );

  const clearCloseTimer = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };


  const handleModalClose = () => {
    clearCloseTimer();
    setIsSubmitting(false);
    setFormError(null);
    setResultNotice(null);
    setActiveDocument(null);
    onClose();
  };

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const initialState = resolveInitialState(
      prefilledTopic,
      prefilledMembershipId,
      prefilledTrainer,
      prefilledGroupDirection,
      prefilledGroupRecommendation
    );

    clearCloseTimer();
    setCurrentStep(initialState.step);
    setEntryStep(initialState.entryStep);
    setSelection(initialState.selection);
    setFormData(createInitialFormData());
    setIsPrivacyAccepted(false);
    setIsSubmitting(false);
    setFormError(null);
    setResultNotice(null);
  }, [
    isOpen,
    prefilledGroupDirection,
    prefilledGroupRecommendation,
    prefilledMembershipId,
    prefilledTopic,
    prefilledTrainer,
  ]);

  useEffect(() => {
    if (selection.topic !== 'other') {
      return;
    }

    syncTextareaHeight(questionTextareaRef.current);
  }, [formData.question, selection.topic]);

  if (!isOpen) return null;

  const headerTitle = isAnnouncementMode
    ? announcement?.title ?? MODAL_TEXT.announcementTitle
    : currentStep === 'root'
      ? MODAL_TEXT.rootTitle
      : currentStep === 'membership'
        ? MODAL_TEXT.membershipTitle
        : currentStep === 'personal'
          ? MODAL_TEXT.personalTitle
          : currentStep === 'group'
            ? MODAL_TEXT.groupTitle
            : MODAL_TEXT.contactTitle;

  const headerSubtitle = isAnnouncementMode
    ? announcement?.message[0] ?? ''
    : currentStep === 'root'
      ? MODAL_TEXT.rootSubtitle
      : currentStep === 'membership'
        ? MODAL_TEXT.membershipSubtitle
        : currentStep === 'personal'
          ? MODAL_TEXT.personalSubtitle
          : currentStep === 'group'
            ? MODAL_TEXT.groupSubtitle
            : MODAL_TEXT.contactSubtitle;

  const summary = (() => {
    if (selectedMembership) {
      return {
        title: MODAL_TEXT.summaryMembership,
        value: selectedMembership.title,
        meta: isMobile ? selectedMembership.price : `${selectedMembership.label} • ${selectedMembership.price}`,
        note: selectedMembership.note,
      };
    }

    if (selection.topic === 'personal') {
      return {
        title: MODAL_TEXT.summaryPersonal,
        value: selection.trainer,
        meta: '',
        note: '',
      };
    }

    if (selection.topic === 'group') {
      if (selection.wantsGroupRecommendation) {
        return {
          title: MODAL_TEXT.summaryGroup,
          value: MODAL_TEXT.summaryGroupHelp,
          meta: '',
          note: '',
        };
      }

      return {
        title: MODAL_TEXT.summaryGroup,
        value: selection.groupDirection,
        meta: selectedGroupDirection ? `Тренер: ${selectedGroupDirection.trainer}` : '',
        note: selectedGroupDirection?.shortDescription ?? '',
      };
    }

    if (selection.topic === 'free_trial') {
      return {
        title: MODAL_TEXT.summaryTrial,
        value: 'Первое бесплатное посещение',
        meta: '',
        note: '',
      };
    }

    return {
      title: MODAL_TEXT.summaryOther,
      value: 'Связаться с менеджером',
      meta: '',
      note: '',
    };
  })();

  const topicLabel = (() => {
    if (selectedMembership) {
      return `Хочу приобрести абонемент: ${selectedMembership.title}`;
    }

    if (selection.topic === 'personal') {
      return 'Записаться на тренировку с тренером';
    }

    if (selection.topic === 'group') {
      return selection.wantsGroupRecommendation
        ? 'Записаться на групповые занятия (нужно подобрать направление)'
        : selection.groupDirection
          ? `Записаться на групповые занятия: ${selection.groupDirection}`
          : 'Записаться на групповые занятия';
    }

    if (selection.topic === 'free_trial') {
      return 'Записаться на пробное посещение';
    }

    return 'Другой вопрос';
  })();

  const shellTitle = resultNotice?.type === 'success' ? MODAL_TEXT.success : headerTitle;
  const shellDescription = resultNotice?.type === 'success' ? MODAL_TEXT.successHint : headerSubtitle;
  const canGoBack =
    !isAnnouncementMode && !resultNotice && currentStep !== 'root' && currentStep !== entryStep;

  const resetSelection = () => {
    setSelection(createEmptySelection());
  };

  const openScenario = (scenario: (typeof ROOT_PRIMARY_OPTIONS | typeof ROOT_SECONDARY_OPTIONS)[number]['id']) => {
    setFormError(null);

    if (scenario === 'membership') {
      resetSelection();
      setCurrentStep('membership');
      return;
    }

    if (scenario === 'personal') {
      setSelection({
        ...createEmptySelection(),
        topic: 'personal',
      });
      setCurrentStep('personal');
      return;
    }

    if (scenario === 'group') {
      setSelection({
        ...createEmptySelection(),
        topic: 'group',
      });
      setCurrentStep('group');
      return;
    }

    setSelection({
      ...createEmptySelection(),
      topic: scenario,
    });
    setCurrentStep('contact');
  };

  const handleBack = () => {
    setFormError(null);

    if (currentStep === 'contact') {
      if (selectedMembership) {
        setCurrentStep('membership');
        return;
      }

      if (selection.topic === 'personal') {
        setCurrentStep('personal');
        return;
      }

      if (selection.topic === 'group') {
        setCurrentStep('group');
        return;
      }

      setCurrentStep('root');
      return;
    }

    if (currentStep === 'membership' || currentStep === 'personal' || currentStep === 'group') {
      resetSelection();
      setCurrentStep('root');
    }
  };

  const handleChangeSelection = () => {
    setFormError(null);

    if (selectedMembership) {
      setCurrentStep('membership');
      return;
    }

    if (selection.topic === 'personal') {
      setCurrentStep('personal');
      return;
    }

    if (selection.topic === 'group') {
      setCurrentStep('group');
      return;
    }

    resetSelection();
    setCurrentStep('root');
  };

  const handleMembershipSelect = (membershipId: number) => {
    const membership = getMembershipById(membershipId);
    if (!membership) {
      return;
    }

    setSelection({
      topic: membership.topicValue,
      membershipId: membership.id,
      trainer: '',
      groupDirection: '',
      wantsGroupRecommendation: false,
    });
    setFormError(null);
    setCurrentStep('contact');
  };

  const handleTrainerSelect = (trainerName: string) => {
    setSelection({
      topic: 'personal',
      membershipId: undefined,
      trainer: trainerName,
      groupDirection: '',
      wantsGroupRecommendation: false,
    });
    setFormError(null);
    setCurrentStep('contact');
  };

  const handleGroupDirectionSelect = (groupDirection: string) => {
    setSelection({
      topic: 'group',
      membershipId: undefined,
      trainer: '',
      groupDirection,
      wantsGroupRecommendation: false,
    });
    setFormError(null);
    setCurrentStep('contact');
  };

  const handleGroupRecommendationRequest = () => {
    setSelection({
      topic: 'group',
      membershipId: undefined,
      trainer: '',
      groupDirection: '',
      wantsGroupRecommendation: true,
    });
    setFormError(null);
    setCurrentStep('contact');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConsentAccepted) {
      setFormError(MODAL_TEXT.errorPrivacy);
      return;
    }

    if (!isValidRussianPhone(formData.phone)) {
      setFormError(MODAL_TEXT.errorPhone);
      return;
    }

    if (!selection.topic) {
      setFormError(MODAL_TEXT.errorScenario);
      return;
    }

    if (selection.topic === 'personal' && !selection.trainer) {
      setFormError(MODAL_TEXT.errorTrainer);
      return;
    }

    if (selection.topic === 'other' && !formData.question.trim()) {
      setFormError(MODAL_TEXT.errorQuestion);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setResultNotice(null);

    try {

      const payload = new FormData();
      const questionText = formData.question.trim();
      const detailMessage = questionText || MODAL_TEXT.messageFallback;
      const messageText = [
        `${MODAL_TEXT.mailLabelName}: ${formData.name.trim()}`,
        `${MODAL_TEXT.mailLabelPhone}: ${formData.phone.trim()}`,
        `${MODAL_TEXT.mailLabelTopic}: ${topicLabel}`,
        ...(selectedMembership ? [`${MODAL_TEXT.mailLabelMembership}: ${selectedMembership.title}`] : []),
        ...(selection.trainer ? [`${MODAL_TEXT.mailLabelTrainer}: ${selection.trainer}`] : []),
        ...(selection.groupDirection
          ? [`${MODAL_TEXT.mailLabelGroupDirection}: ${selection.groupDirection}`]
          : []),
        ...(questionText ? [`${MODAL_TEXT.mailLabelQuestion}: ${questionText}`] : []),
        `${MODAL_TEXT.mailLabelMessage}: ${detailMessage}`,
      ].join('\n');

      payload.append('name', formData.name.trim());
      payload.append('phone', formData.phone.trim());
      payload.append('topic', topicLabel);
      payload.append('membership', selectedMembership?.title ?? '');
      payload.append('trainer', selection.trainer);
      payload.append('group_direction', selection.groupDirection);
      payload.append('question', questionText);
      payload.append('message', messageText);
      payload.append('subject', MODAL_TEXT.mailSubject);
      payload.append('from_name', MODAL_TEXT.mailFromName);
      payload.append('botcheck', '');

      const result = await sendForm(payload);

      if (!result.ok) {
        setResultNotice({
          type: 'error',
          text: result.message ?? result.error ?? MODAL_TEXT.errorFallback,
        });
        return;
      }

      setResultNotice({
        type: 'success',
        text: MODAL_TEXT.success,
      });
      setFormData(createInitialFormData());
      setIsPrivacyAccepted(false);
      clearCloseTimer();
      closeTimeoutRef.current = window.setTimeout(() => {
        onClose();
        setResultNotice(null);
      }, 3000);
    } catch {
      setResultNotice({
        type: 'error',
        text: MODAL_TEXT.errorFallback,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRootStep = () => (
    <div className={cn('mx-auto w-full max-w-4xl', isMobile ? 'space-y-3' : 'space-y-5')}>
      <div className={cn('grid grid-cols-1 md:grid-cols-2', isMobile ? 'gap-3' : 'gap-3')}>
        {ROOT_PRIMARY_OPTIONS.map((option) => (
          <ScenarioCard
            key={option.id}
            title={isMobile ? option.mobileTitle : option.title}
            icon={option.icon}
            onClick={() => openScenario(option.id)}
            compact={isMobile}
          />
        ))}
      </div>

      <div className={cn('grid grid-cols-1', isMobile ? 'gap-3' : 'gap-2')}>
        {ROOT_SECONDARY_OPTIONS.map((option) => (
          isMobile ? (
            <ScenarioCard
              key={option.id}
              title={option.mobileTitle}
              icon={option.icon}
              onClick={() => openScenario(option.id)}
              compact
            />
          ) : (
            <CompactScenarioButton
              key={option.id}
              title={option.title}
              icon={option.icon}
              onClick={() => openScenario(option.id)}
            />
          )
        ))}
      </div>
    </div>
  );


  const renderMembershipStep = () => (
    <div className="mx-auto w-full max-w-4xl">
      <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3', isMobile ? 'gap-2' : 'gap-3')}>
        {memberships.map((membership) => {
          const Icon = membership.icon;
          const isActive = selectedMembership?.id === membership.id;
          const mobileTitle = membership.id === 6 ? 'Разовое' : membership.title;

          return (
            <button
              key={membership.id}
              type="button"
              onClick={() => handleMembershipSelect(membership.id)}
              className={cn(
                'rounded-[24px] border text-left transition-all',
                isMobile ? 'p-2.5' : 'p-5 sm:p-6',
                isActive
                  ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
                  : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                {!isMobile ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-gray-200">
                    <Icon className="h-4 w-4 text-[#F5B800]" />
                    {membership.label}
                  </span>
                ) : null}
                {!isMobile ? <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-500" /> : null}
              </div>

              {isMobile ? (
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={cn(
                      'min-w-0 flex-1 font-bold leading-tight text-white',
                      membership.id === 5 ? 'text-sm whitespace-normal' : 'truncate whitespace-nowrap text-sm'
                    )}
                  >
                    {mobileTitle}
                  </h3>
                  <p className="shrink-0 text-base font-black text-[rgb(255,255,255,0.84)]">
                    {membership.price}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="mt-4 text-base font-bold leading-tight text-white sm:text-xl">
                    {membership.title}
                  </h3>
                  <p className="mt-2 text-xl font-black text-[rgb(255,255,255,0.84)] sm:text-2xl">
                    {membership.price}
                  </p>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderPersonalStep = () => (
    <div className="mx-auto w-full max-w-4xl">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {trainers.map((trainer) => {
          const isActive = selection.trainer === trainer.name;

          return (
            <button
              key={trainer.id}
              type="button"
              onClick={() => handleTrainerSelect(trainer.name)}
              className={cn(
                'flex items-center rounded-[20px] border text-left transition-all',
                isMobile ? 'gap-2 p-2.5' : 'gap-3 p-3 sm:gap-4 sm:p-4',
                isActive
                  ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
                  : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
              )}
            >
              {!isMobile ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30 sm:h-14 sm:w-14">
                  {trainer.image ? (
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      loading="lazy"
                      decoding="async"
                      className={cn('h-full w-full object-cover object-center', trainer.imageClassName)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[#F5B800]">
                      {trainer.name.slice(0, 1)}
                    </div>
                  )}
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className={cn('font-semibold leading-tight text-white', isMobile ? 'truncate whitespace-nowrap text-xs' : 'text-sm sm:text-base')}>
                      {trainer.name}
                    </h3>
                  </div>
                  {!isMobile ? <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" /> : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );


  const renderGroupStep = () => (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {groupDirections.map((direction) => {
          const isActive =
            !selection.wantsGroupRecommendation && selection.groupDirection === direction.text;

          return (
            <button
              key={direction.key}
              type="button"
              onClick={() => handleGroupDirectionSelect(direction.text)}
              className={cn(
                'rounded-[20px] border text-left transition-all',
                isMobile ? 'p-3' : 'p-4',
                isActive
                  ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
                  : 'border-white/10 bg-white/[0.03] lg:hover:border-white/20 lg:hover:bg-white/[0.05]'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {isMobile ? (
                    <p className="truncate whitespace-nowrap text-xs font-semibold text-white">
                      {direction.text} • {direction.trainer}
                    </p>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold leading-tight text-white sm:text-base">{direction.text}</h3>
                      <p className="mt-1 text-xs text-gray-400 sm:text-sm">Тренер: {direction.trainer}</p>
                    </>
                  )}
                </div>
                {!isMobile ? <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" /> : null}
              </div>
            </button>
          );
        })}
      </div>


      <button
        type="button"
        onClick={handleGroupRecommendationRequest}
        className={cn(
          'flex w-full items-center justify-between rounded-[20px] border text-left transition-all',
          isMobile ? 'gap-2 p-3' : 'gap-4 p-4',
          selection.topic === 'group' && selection.wantsGroupRecommendation
            ? 'border-[#F5B800]/40 bg-[#F5B800]/10'
            : 'border-[#F5B800]/20 bg-gradient-to-r from-[#F5B800]/10 via-white/[0.03] to-[#D89B00]/10 lg:hover:border-[#F5B800]/35'
        )}
      >
        <p className={cn('font-semibold text-white', isMobile ? 'truncate whitespace-nowrap text-sm' : 'text-sm sm:text-base')}>
          {MODAL_TEXT.groupRecommendationCard}
        </p>
        {!isMobile ? <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" /> : null}
      </button>
    </div>
  );

  const renderContactStep = () => (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{summary.title}</p>
            <p className="mt-2 text-lg font-semibold text-white sm:text-xl">{summary.value}</p>
            {summary.meta ? <p className="mt-1 text-sm text-gray-300">{summary.meta}</p> : null}
          </div>
          <button
            type="button"
            onClick={handleChangeSelection}
            className="shrink-0 self-center text-sm font-medium text-[#F5B800] transition-colors lg:hover:text-[#FFD351]"
          >
            {MODAL_TEXT.changeSelection}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <input
            type="text"
            required
            placeholder={MODAL_TEXT.namePlaceholder}
            value={formData.name}
            onChange={(event) => {
              setFormData({ ...formData, name: event.target.value });
              if (formError) setFormError(null);
            }}
            className={FORM_FIELD_CLASS}
          />
        </div>

        <div>
          <input
            type="text"
            required
            inputMode="numeric"
            autoComplete="tel"
            placeholder={RU_PHONE_MASK}
            maxLength={18}
            pattern="^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$"
            title={MODAL_TEXT.phoneTitle}
            value={formData.phone}
            onChange={(event) => {
              const nextPhone = formatRussianPhone(event.target.value);
              setFormData({ ...formData, phone: nextPhone });
              if (formError) setFormError(null);
            }}
            className={FORM_FIELD_CLASS}
          />
        </div>

        {selection.topic === 'other' ? (
          <div>
            <textarea
              ref={questionTextareaRef}
              required
              rows={1}
              placeholder={MODAL_TEXT.questionPlaceholder}
              value={formData.question}
              onChange={(event) => {
                syncTextareaHeight(event.target);
                setFormData({ ...formData, question: event.target.value });
                if (formError) setFormError(null);
              }}
              className={cn(FORM_FIELD_CLASS, 'resize-none overflow-hidden')}
            />
          </div>
        ) : null}

        <label className="flex items-start gap-3 text-xs text-gray-300 sm:text-sm">
          <input
            type="checkbox"
            checked={isPrivacyAccepted}
            onChange={(event) => {
              setIsPrivacyAccepted(event.target.checked);
              if (formError) setFormError(null);
            }}
            className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent accent-[#F5B800]"
          />
          <span>
            {MODAL_TEXT.privacyPrefix}{' '}
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="text-white underline underline-offset-4 transition-colors lg:hover:text-gray-200"
            >
              {MODAL_TEXT.privacyLink}
            </button>
            {' и '}
            <button
              type="button"
              onClick={() => setIsOfferOpen(true)}
              className="text-white underline underline-offset-4 transition-colors lg:hover:text-gray-200"
            >
              {MODAL_TEXT.offerLink}
            </button>
          </span>
        </label>

        {formError ? (
          <p
            role="alert"
            className="rounded-xl border border-red-300/35 bg-red-500/15 px-4 py-2 text-sm text-red-100"
          >
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-live="polite"
          className="btn-primary w-full text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#F5B800]" />
              {MODAL_TEXT.submitLoading}
            </span>
          ) : (
            MODAL_TEXT.submitDefault
          )}
        </button>
      </form>
    </div>
  );

  const renderResult = () => (
    <div className="flex min-h-[360px] w-full items-center justify-center px-6 py-10 text-center sm:min-h-[420px]">
      <div className="max-w-[24rem]">
        <div className="mb-5 flex justify-center">
          {resultNotice?.type === 'success' ? (
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-500/15 text-emerald-200">
              <CircleCheck className="h-7 w-7" />
            </span>
          ) : (
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-red-300/40 bg-red-500/15 text-red-200">
              <TriangleAlert className="h-7 w-7" />
            </span>
          )}
        </div>
        <p className="text-base font-semibold text-white sm:text-lg">{resultNotice?.text}</p>
        {resultNotice?.type === 'success' ? (
          <p className="mt-3 text-sm text-gray-300">{MODAL_TEXT.successHint}</p>
        ) : (
          <button
            type="button"
            onClick={() => setResultNotice(null)}
            className="btn-primary mt-6 w-full text-white"
          >
            {MODAL_TEXT.returnToForm}
          </button>
        )}
      </div>
    </div>
  );

  const renderAnnouncement = () => {
    if (!announcement) {
      return null;
    }

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <span className="mb-4 inline-flex rounded-full border border-[#F5B800]/30 bg-[#F5B800]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#F5B800]">
          {announcement.label}
        </span>

        <BalancedHeading as="h2" className="text-2xl font-bold text-white">
          {announcement.title}
        </BalancedHeading>

        <div className="mt-5 space-y-3 text-sm leading-6 text-gray-300 sm:text-base">
          {announcement.message.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <button type="button" onClick={handleModalClose} className="btn-primary mt-8 w-full text-white">
          {announcement.closeButtonLabel}
        </button>
      </div>
    );
  };

  const renderFlowBody = () => {
    if (isAnnouncementMode) {
      return renderAnnouncement();
    }

    if (resultNotice) {
      return renderResult();
    }

    return (
      <>
        <div className={cn('border-b border-white/10', isMobile ? 'px-3 py-2.5' : 'px-4 py-3 sm:px-5 sm:py-4')}>
          <div className="relative">
            {canGoBack ? (
              <button
                type="button"
                onClick={handleBack}
                className="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors lg:hover:border-white/20 lg:hover:bg-white/[0.08]"
                aria-label="Назад"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleModalClose}
              className="absolute right-0 top-0 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 transition-colors lg:hover:border-white/20 lg:hover:text-white"
              aria-label={MODAL_TEXT.closeModalAria}
            >
              <X className="h-5 w-5" />
            </button>

            <div className={cn('text-center', isMobile ? 'px-11' : 'px-10')}>
              <div className={cn('inline-flex', isMobile ? 'px-1 py-0.5' : 'px-2 py-1')}>
                <img
                  src={MODAL_ASSETS.logo}
                  alt="Логотип Ultra Pro Gym & Fitness"
                  loading="lazy"
                  decoding="async"
                  className={cn('w-auto object-contain brightness-0 invert', isMobile ? 'h-5' : 'h-6 sm:h-7')}
                />
              </div>

              <BalancedHeading
                as="h2"
                className={cn(
                  'font-bold text-white',
                  isMobile
                    ? currentStep === 'membership'
                      ? 'mt-1 text-sm leading-none whitespace-nowrap'
                      : 'mt-1 text-base'
                    : 'mt-2 text-lg sm:text-xl'
                )}
              >
                {headerTitle}
              </BalancedHeading>
              {headerSubtitle ? (
                <p className={cn('max-w-2xl leading-relaxed text-gray-300', isMobile ? 'mt-1 text-xs' : 'mt-2 text-sm sm:text-base')}>
                  {headerSubtitle}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain', isMobile ? 'px-3 py-2.5' : 'px-4 py-3 sm:px-5 sm:py-4')}>
          {currentStep === 'root'
            ? renderRootStep()
            : currentStep === 'membership'
              ? renderMembershipStep()
              : currentStep === 'personal'
                ? renderPersonalStep()
                : currentStep === 'group'
                  ? renderGroupStep()
                  : renderContactStep()}
        </div>
      </>
    );
  };

  const content = (
    <div
      className={cn(
        'glass-card modal-surface flex min-h-0 max-h-full flex-col overflow-hidden border border-white/10 bg-[#0b0e14]/96 shadow-[0_28px_120px_rgba(0,0,0,0.45)]',
        isAnnouncementMode ? 'justify-center p-6 sm:p-8' : ''
      )}
    >
      {renderFlowBody()}
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(nextOpen) => !nextOpen && handleModalClose()}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            'flex max-h-[calc(100dvh-1.5rem)] min-h-0 flex-col overflow-hidden border-none bg-transparent p-0 shadow-none',
            isMobile && 'w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)]',
            !isMobile &&
              (isAnnouncementMode ? 'sm:max-w-2xl' : currentStep === 'contact' ? 'sm:max-w-xl' : 'sm:max-w-4xl')
          )}
        >
          <DialogTitle className="sr-only">{shellTitle}</DialogTitle>
          <DialogDescription className="sr-only">{shellDescription}</DialogDescription>
          {content}
        </DialogContent>
      </Dialog>

      {isPrivacyOpen ? (
        <DocumentModal
          closeAriaLabel={MODAL_TEXT.closePolicyAria}
          onClose={() => setIsPrivacyOpen(false)}
        >
          <PrivacyPolicyContent
            titleClassName="mb-4 pr-10 text-xl font-semibold text-white"
            textClassName="text-sm text-gray-300"
          />
        </DocumentModal>
      ) : null}

      {isOfferOpen ? (
        <DocumentModal
          closeAriaLabel={MODAL_TEXT.closeOfferAria}
          onClose={() => setIsOfferOpen(false)}
        >
          <OfferAgreementContent
            titleClassName="mb-4 pr-10 text-xl font-semibold text-white"
            textClassName="text-sm text-gray-300"
          />
        </DocumentModal>
      ) : null}
    </>
  );
}
