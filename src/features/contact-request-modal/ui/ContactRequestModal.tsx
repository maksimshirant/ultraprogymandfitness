
import {
  Suspense,
  lazy,
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
import { sendForm } from '@/api/forms';
import { LegalDocumentModal } from '@/components/LegalDocumentModal';
import { groupDirections } from '@/content/groupDirections';
import { getMembershipById, getMembershipByTopic } from '@/content/memberships';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
  DOCUMENT_FALLBACK_TEXT,
  MODAL_ASSETS,
  MODAL_TEXT,
  ROOT_PRIMARY_OPTIONS,
  ROOT_SECONDARY_OPTIONS,
} from '@/features/contact-request-modal/model/constants';
import {
  createEmptySelection,
  createInitialFormData,
  isMembershipTopic,
  isValidRussianPhone,
  resolveInitialState,
  syncTextareaHeight,
} from '@/features/contact-request-modal/model/helpers';
import type {
  FlowSelection,
  FlowStep,
  ModalProps,
  ResultNotice,
  ScrollIndicatorState,
} from '@/features/contact-request-modal/model/types';
import { MembershipStep } from '@/features/contact-request-modal/ui/steps/MembershipStep';
import { AnnouncementStep } from '@/features/contact-request-modal/ui/steps/AnnouncementStep';
import { ContactStep } from '@/features/contact-request-modal/ui/steps/ContactStep';
import { GroupStep } from '@/features/contact-request-modal/ui/steps/GroupStep';
import { PersonalStep } from '@/features/contact-request-modal/ui/steps/PersonalStep';
import { ResultStep } from '@/features/contact-request-modal/ui/steps/ResultStep';
import { RootStep } from '@/features/contact-request-modal/ui/steps/RootStep';
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

  const openScenario = (scenario: string) => {
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

  const renderRootStep = () => (
    <RootStep
      isMobile={isMobile}
      primaryOptions={ROOT_PRIMARY_OPTIONS}
      secondaryOptions={ROOT_SECONDARY_OPTIONS}
      activeTopic={selection.topic}
      onScenarioSelect={openScenario}
    />
  );

  const renderMembershipStep = () => (
    <MembershipStep
      isMobile={isMobile}
      activeMembershipId={selectedMembership?.id}
      onSelect={handleMembershipSelect}
    />
  );

  const renderPersonalStep = () => (
    <PersonalStep
      isMobile={isMobile}
      selectedTrainer={selection.trainer}
      onTrainerSelect={handleTrainerSelect}
      personalScrollRef={personalScrollRef}
      personalScrollIndicator={personalScrollIndicator}
      onUpdateScroll={() => updateScrollIndicator(personalScrollRef.current, setPersonalScrollIndicator)}
    />
  );

  const renderGroupStep = () => (
    <GroupStep
      isMobile={isMobile}
      selection={selection}
      groupScrollRef={groupScrollRef}
      groupScrollIndicator={groupScrollIndicator}
      onUpdateScroll={() => updateScrollIndicator(groupScrollRef.current, setGroupScrollIndicator)}
      onGroupDirectionSelect={handleGroupDirectionSelect}
      onGroupRecommendationRequest={handleGroupRecommendationRequest}
    />
  );

  const renderContactStep = () => (
    <ContactStep
      summary={summary}
      formData={formData}
      formError={formError}
      isSubmitting={isSubmitting}
      isPrivacyAccepted={isPrivacyAccepted}
      questionTextareaRef={questionTextareaRef}
      isOtherTopic={selection.topic === 'other'}
      onChangeSelection={handleChangeSelection}
      onSetFormData={setFormData}
      onSetFormError={setFormError}
      onSetPrivacyAccepted={setIsPrivacyAccepted}
      onOpenConsent={() => setIsConsentOpen(true)}
      onOpenPrivacy={() => setIsPrivacyOpen(true)}
      onSubmit={handleSubmit}
    />
  );

  const renderResult = () => <ResultStep resultNotice={resultNotice} onResetError={() => setResultNotice(null)} />;
  const renderAnnouncement = () => {
    if (!announcement) {
      return null;
    }
    return <AnnouncementStep announcement={announcement} onClose={handleModalClose} />;
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
        'glass-card modal-surface flex min-h-0 max-h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/20',
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
            !isMobile && 'max-lg:w-[calc(100vw-2rem)] max-lg:max-w-[calc(100vw-2rem)]',
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
        <LegalDocumentModal
          isOpen={isPrivacyOpen}
          closeAriaLabel={MODAL_TEXT.closePolicyAria}
          onClose={() => setIsPrivacyOpen(false)}
          zIndexClassName="z-[111]"
          maxWidthClassName="max-w-2xl"
        >
          <Suspense fallback={<p className="text-sm text-gray-300">{DOCUMENT_FALLBACK_TEXT}</p>}>
            <PrivacyPolicyContent
              titleClassName="mb-4 pr-10 text-xl font-semibold text-white"
              textClassName="text-sm text-gray-300"
            />
          </Suspense>
        </LegalDocumentModal>
      ) : null}

      {isConsentOpen ? (
        <LegalDocumentModal
          isOpen={isConsentOpen}
          closeAriaLabel={MODAL_TEXT.closeConsentAria}
          onClose={() => setIsConsentOpen(false)}
          zIndexClassName="z-[111]"
          maxWidthClassName="max-w-2xl"
        >
          <Suspense fallback={<p className="text-sm text-gray-300">{DOCUMENT_FALLBACK_TEXT}</p>}>
            <PersonalDataConsentContent
              titleClassName="mb-4 pr-10 text-xl font-semibold text-white"
              textClassName="text-sm text-gray-300"
            />
          </Suspense>
        </LegalDocumentModal>
      ) : null}
    </>
  );
}




