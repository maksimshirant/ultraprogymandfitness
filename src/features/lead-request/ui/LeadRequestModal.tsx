
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from 'react';
import {
  ArrowLeft,
  X,
} from 'lucide-react';
import { sendForm } from '@/features/lead-request/api/sendLeadRequest';
import { groupDirections } from '@/entities/group-direction/model/groupDirections';
import { getMembershipById, getMembershipByTopic } from '@/entities/membership/model/memberships';
import {
  createEmptySelection,
  createInitialFormData,
  isMembershipTopic,
  isValidRussianPhone,
  resolveInitialState,
  syncTextareaHeight,
} from '@/features/lead-request/model/formState';
import type { LeadScenarioId } from '@/features/lead-request/model/scenarioOptions';
import type {
  FlowSelection,
  FlowStep,
  ResultNotice,
  ScrollIndicatorState,
} from '@/features/lead-request/model/types';
import {
  ContactStep,
  GroupStep,
  MembershipStep,
  PersonalStep,
  RootStep,
} from '@/features/lead-request/ui/LeadRequestSteps';
import { AnnouncementBody, ResultView } from '@/features/lead-request/ui/LeadRequestFeedback';
import { LeadRequestLegalDocuments } from '@/features/lead-request/ui/LeadRequestLegalDocuments';
import { BalancedHeading } from '@/shared/ui/typography/BalancedHeading';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/kit/dialog';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';

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

const DOCUMENT_FALLBACK_TEXT = 'Загрузка документа...';

const MODAL_ASSETS = {
  logo: `${import.meta.env.BASE_URL}logo.webp`,
} as const;

const MODAL_TEXT = {
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
  const personalScrollRef = useRef<HTMLDivElement | null>(null);
  const groupScrollRef = useRef<HTMLDivElement | null>(null);
  const [currentStep, setCurrentStep] = useState<FlowStep>('root');
  const [entryStep, setEntryStep] = useState<FlowStep>('root');
  const [selection, setSelection] = useState<FlowSelection>(createEmptySelection());
  const [formData, setFormData] = useState(createInitialFormData);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resultNotice, setResultNotice] = useState<ResultNotice | null>(null);
  const [personalScrollIndicator, setPersonalScrollIndicator] = useState<ScrollIndicatorState>({
    top: 0,
    height: 36,
    visible: false,
  });
  const [groupScrollIndicator, setGroupScrollIndicator] = useState<ScrollIndicatorState>({
    top: 0,
    height: 36,
    visible: false,
  });
  const isLegalDocumentOpen = isPrivacyOpen || isConsentOpen;

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
    setIsPrivacyOpen(false);
    setIsConsentOpen(false);
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
    setIsPrivacyOpen(false);
    setIsConsentOpen(false);
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

  const updateScrollIndicator = (
    element: HTMLDivElement | null,
    setState: Dispatch<SetStateAction<ScrollIndicatorState>>
  ) => {
    if (!element) {
      setState({ top: 0, height: 36, visible: false });
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = element;
    const canScroll = scrollHeight > clientHeight + 1;

    if (!canScroll) {
      setState({ top: 0, height: 36, visible: false });
      return;
    }

    const railHeight = Math.max(clientHeight - 12, 1);
    const ratio = clientHeight / scrollHeight;
    const thumbHeight = Math.max(28, Math.round(railHeight * ratio));
    const maxThumbTop = Math.max(railHeight - thumbHeight, 0);
    const maxScrollTop = Math.max(scrollHeight - clientHeight, 1);
    const thumbTop = Math.round((scrollTop / maxScrollTop) * maxThumbTop);

    setState({ top: thumbTop, height: thumbHeight, visible: true });
  };

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const raf = window.requestAnimationFrame(() => {
      updateScrollIndicator(personalScrollRef.current, setPersonalScrollIndicator);
      updateScrollIndicator(groupScrollRef.current, setGroupScrollIndicator);
    });

    return () => window.cancelAnimationFrame(raf);
  }, [isMobile, isOpen, currentStep]);

  useEffect(() => {
    if (!isLegalDocumentOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPrivacyOpen(false);
        setIsConsentOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLegalDocumentOpen]);

  if (!isOpen && !isLegalDocumentOpen) return null;

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

  const openScenario = (scenario: LeadScenarioId) => {
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

    if (!isPrivacyAccepted) {
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

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        topic: topicLabel,
        topicValue: selection.topic,
        trainer: selection.trainer || undefined,
        trainerValue: selection.trainer || undefined,
        question: questionText || undefined,
        message: messageText,
        consentToPrivacy: isPrivacyAccepted,
        pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        submittedAt: new Date().toISOString(),
        source: 'modal',
      };

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

  const renderFlowBody = () => {
    if (isAnnouncementMode) {
      return announcement ? <AnnouncementBody announcement={announcement} onClose={handleModalClose} /> : null;
    }

    if (resultNotice) {
      return (
        <ResultView
          notice={resultNotice}
          returnToFormLabel={MODAL_TEXT.returnToForm}
          successHint={MODAL_TEXT.successHint}
          onReturnToForm={() => setResultNotice(null)}
        />
      );
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
            ? <RootStep isMobile={isMobile} onOpenScenario={openScenario} />
            : currentStep === 'membership'
              ? (
                <MembershipStep
                  isMobile={isMobile}
                  selectedMembershipId={selectedMembership?.id}
                  onSelectMembership={handleMembershipSelect}
                />
              )
              : currentStep === 'personal'
                ? (
                  <PersonalStep
                    isMobile={isMobile}
                    selection={selection}
                    personalScrollRef={personalScrollRef}
                    personalScrollIndicator={personalScrollIndicator}
                    setPersonalScrollIndicator={setPersonalScrollIndicator}
                    updateScrollIndicator={updateScrollIndicator}
                    onSelectTrainer={handleTrainerSelect}
                  />
                )
                : currentStep === 'group'
                  ? (
                    <GroupStep
                      isMobile={isMobile}
                      selection={selection}
                      groupScrollRef={groupScrollRef}
                      groupScrollIndicator={groupScrollIndicator}
                      setGroupScrollIndicator={setGroupScrollIndicator}
                      updateScrollIndicator={updateScrollIndicator}
                      text={MODAL_TEXT}
                      onSelectGroupDirection={handleGroupDirectionSelect}
                      onRequestGroupRecommendation={handleGroupRecommendationRequest}
                    />
                  )
                  : (
                    <ContactStep
                      formData={formData}
                      formError={formError}
                      isPrivacyAccepted={isPrivacyAccepted}
                      isSubmitting={isSubmitting}
                      questionTextareaRef={questionTextareaRef}
                      selection={selection}
                      summary={summary}
                      text={MODAL_TEXT}
                      setFormData={setFormData}
                      setFormError={setFormError}
                      setIsConsentOpen={setIsConsentOpen}
                      setIsPrivacyAccepted={setIsPrivacyAccepted}
                      setIsPrivacyOpen={setIsPrivacyOpen}
                      onChangeSelection={handleChangeSelection}
                      onSubmit={handleSubmit}
                    />
                  )}
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
      <Dialog
        open={isOpen && !isLegalDocumentOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !isLegalDocumentOpen) {
            handleModalClose();
          }
        }}
      >
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

      <LeadRequestLegalDocuments
        documentFallbackText={DOCUMENT_FALLBACK_TEXT}
        isConsentOpen={isConsentOpen}
        isPrivacyOpen={isPrivacyOpen}
        closeConsentAriaLabel={MODAL_TEXT.closeConsentAria}
        closePrivacyAriaLabel={MODAL_TEXT.closePolicyAria}
        onCloseConsent={() => setIsConsentOpen(false)}
        onClosePrivacy={() => setIsPrivacyOpen(false)}
      />
    </>
  );
}
