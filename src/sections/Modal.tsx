import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { CircleCheck, Loader2, TriangleAlert, X } from 'lucide-react';
import { LegalDocumentModal } from '@/components/LegalDocumentModal';
import { sendForm } from '@/api/forms';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  prefilledTrainer?: string;
  announcement?: {
    label: string;
    title: string;
    message: readonly string[];
    closeButtonLabel: string;
  };
}

const RU_PHONE_MASK = '+7 (___) ___-__-__';
const RU_PHONE_REGEX = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const MODAL_ASSETS = {
  logo: `${import.meta.env.BASE_URL}logo.webp`,
} as const;

const MODAL_TEXT = {
  title: 'Заполните форму и мы свяжемся с вами в ближайшее время',
  namePlaceholder: 'Имя',
  topicPlaceholder: 'Какой у вас вопрос?',
  topicAriaLabel: 'Какой у вас вопрос?',
  trainerPlaceholder: 'Выберите тренера',
  trainerAriaLabel: 'Выберите тренера',
  messagePlaceholder: 'Дополнительная информация',
  consentPrefix: 'Нажимая на кнопку "Отправить", я даю',
  consentLink: 'согласие на обработку персональных данных',
  consentMiddle: 'и принимаю',
  privacyLink: 'Политику обработки персональных данных',
  submitDefault: 'Отправить',
  submitLoading: 'Отправляем заявку...',
  success: 'Форма отправлена, с вами свяжутся.',
  successHint: 'Окно закроется автоматически.',
  returnToForm: 'Вернуться к форме',
  errorFallback: 'Произошла ошибка, попробуйте позже.',
  errorPrivacy: 'Подтвердите согласие на обработку персональных данных.',
  errorPhone: 'Введите номер в формате +7 (999) 999-99-99.',
  errorTopic: 'Выберите тему обращения.',
  errorTrainer: 'Выберите тренера.',
  phoneTitle: 'Формат: +7 (999) 999-99-99',
  messageFallback: 'Заявка без дополнительного комментария',
  mailLabelName: 'Имя',
  mailLabelPhone: 'Телефон',
  mailLabelTopic: 'Тема',
  mailLabelTrainer: 'Тренер',
  mailLabelMessage: 'Сообщение',
  closeModalAria: 'Закрыть',
  closeDocumentAria: 'Закрыть документ',
} as const;
const TOPIC_OPTIONS = [
  { value: 'sub_1m', label: 'Хочу приобрести абонемент: 1 месяц' },
  { value: 'sub_3m', label: 'Хочу приобрести абонемент: 3 месяца' },
  { value: 'sub_6m', label: 'Хочу приобрести абонемент: 6 месяцев' },
  { value: 'sub_12m', label: 'Хочу приобрести абонемент: 12 месяцев' },
  { value: 'sub_12m_day', label: 'Хочу приобрести абонемент: 12 месяцев (дневной)' },
  { value: 'sub_once', label: 'Хочу приобрести абонемент: Разовое посещение' },
  { value: 'free_trial', label: 'Записаться на пробную тренировку' },
  { value: 'personal', label: 'Записаться на тренировку с тренером' },
  { value: 'group', label: 'Записаться на групповые занятия' },
  { value: 'massage', label: 'Записаться на массаж' },
  { value: 'other', label: 'Другое' },
] as const;
const TRAINER_OPTIONS = [
  { value: 'Вилков Сергей', label: 'Вилков Сергей' },
  { value: 'Зарубина Юлия', label: 'Зарубина Юлия' },
  { value: 'Моисеев Александр', label: 'Моисеев Александр' },
  { value: 'Ляликов Павел', label: 'Ляликов Павел' },
  { value: 'Хлыновский Евгений', label: 'Хлыновский Евгений' },
  { value: 'Осадчий Ярослав', label: 'Осадчий Ярослав' },
  { value: 'Нешпор Анжелика', label: 'Нешпор Анжелика' },
  { value: 'Вольвач Марк', label: 'Вольвач Марк' },
  { value: 'Гузей Александр', label: 'Гузей Александр' },
  { value: 'Белявский Антон', label: 'Белявский Антон' },
] as const;

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
type ResultNotice = {
  type: 'success' | 'error';
  text: string;
};
type ActiveDocument = 'privacy' | 'consent' | null;

const DOCUMENT_FALLBACK_TEXT = 'Загрузка документа...';
const createInitialFormData = (topic = '', trainer = '') => ({
  name: '',
  phone: '',
  topic,
  trainer,
  question: '',
});
const FORM_FIELD_CLASS =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-gray-500 transition-colors focus:outline-none focus:border-white/25';

export default function Modal({
  isOpen,
  onClose,
  prefilledTopic = '',
  prefilledTrainer = '',
  announcement,
}: ModalProps) {
  const isAnnouncementMode = Boolean(announcement);
  const [formData, setFormData] = useState(() =>
    createInitialFormData(prefilledTopic, prefilledTopic === 'personal' ? prefilledTrainer : '')
  );
  const [isConsentAccepted, setIsConsentAccepted] = useState(false);
  const [activeDocument, setActiveDocument] = useState<ActiveDocument>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resultNotice, setResultNotice] = useState<ResultNotice | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const isPersonalTopic = formData.topic === 'personal';

  const clearCloseTimer = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const resetForm = (clearResult = true) => {
    setFormData(createInitialFormData());
    setIsConsentAccepted(false);
    setFormError(null);
    if (clearResult) setResultNotice(null);
  };

  const handleModalClose = () => {
    clearCloseTimer();
    setIsSubmitting(false);
    setFormError(null);
    setResultNotice(null);
    setActiveDocument(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isConsentAccepted) {
      setFormError(MODAL_TEXT.errorPrivacy);
      return;
    }

    if (!isValidRussianPhone(formData.phone)) {
      setFormError(MODAL_TEXT.errorPhone);
      return;
    }

    if (!formData.topic) {
      setFormError(MODAL_TEXT.errorTopic);
      return;
    }

    if (formData.topic === 'personal' && !formData.trainer) {
      setFormError(MODAL_TEXT.errorTrainer);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setResultNotice(null);

    try {
      const selectedTopic =
        TOPIC_OPTIONS.find((topic) => topic.value === formData.topic)?.label ?? formData.topic;
      const selectedTrainer =
        TRAINER_OPTIONS.find((trainer) => trainer.value === formData.trainer)?.label ?? formData.trainer;
      const questionText = formData.question.trim();
      const messageText = [
        `${MODAL_TEXT.mailLabelName}: ${formData.name.trim()}`,
        `${MODAL_TEXT.mailLabelPhone}: ${formData.phone.trim()}`,
        `${MODAL_TEXT.mailLabelTopic}: ${selectedTopic}`,
        ...(selectedTrainer ? [`${MODAL_TEXT.mailLabelTrainer}: ${selectedTrainer}`] : []),
        `${MODAL_TEXT.mailLabelMessage}: ${questionText || MODAL_TEXT.messageFallback}`,
      ].join('\n');

      const result = await sendForm({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        topic: selectedTopic,
        topicValue: formData.topic,
        trainer: selectedTrainer || undefined,
        trainerValue: formData.trainer || undefined,
        question: questionText,
        message: messageText,
        consentToPrivacy: true,
        pageUrl: window.location.href,
        submittedAt: new Date().toISOString(),
        source: 'site-modal',
      });

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
      resetForm(false);
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

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    clearCloseTimer();
    setIsSubmitting(false);
    setFormError(null);
    setResultNotice(null);
    setIsConsentAccepted(false);
    setActiveDocument(null);
    setFormData(createInitialFormData(prefilledTopic, prefilledTopic === 'personal' ? prefilledTrainer : ''));
  }, [isOpen, prefilledTopic, prefilledTrainer]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarCompensation = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarCompensation > 0) {
      body.style.paddingRight = `${scrollbarCompensation}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-2 sm:items-center sm:p-6">
        <div
          className="document-modal-overlay absolute inset-0 bg-[#05070c]/82 backdrop-blur-md"
          onClick={resultNotice ? undefined : handleModalClose}
        />

        <div className="relative mx-auto my-auto w-full max-w-lg">
          <div
            className={`glass-card modal-surface relative flex flex-col overflow-hidden rounded-[26px] sm:rounded-[30px] border border-white/10 shadow-[0_28px_120px_rgba(0,0,0,0.45)] max-h-[calc(100vh-1rem)] max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100vh-3rem)] sm:max-h-[calc(100dvh-3rem)] ${
              resultNotice ? 'p-0' : isPersonalTopic ? 'p-4 sm:p-6' : 'p-4 sm:p-8'
            }`}
          >
            {isAnnouncementMode && announcement ? (
              <div className="modal-scroll min-h-0 overflow-y-auto pr-1 sm:pr-2">
                <button
                  onClick={handleModalClose}
                  className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center text-gray-300 transition-colors lg:hover:text-white sm:top-4 sm:right-4"
                  aria-label={MODAL_TEXT.closeModalAria}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
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

                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="btn-primary mt-8 w-full text-white"
                  >
                    {announcement.closeButtonLabel}
                  </button>
                </div>
              </div>
            ) : resultNotice ? (
              <div className="flex h-[min(70vh,560px)] min-h-[320px] sm:min-h-[420px] w-full items-center justify-center px-8 py-10 text-center">
                <div className="max-w-[22rem]">
                  <div className="mb-5 flex justify-center">
                    {resultNotice.type === 'success' ? (
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-500/15 text-emerald-200">
                        <CircleCheck className="h-7 w-7" />
                      </span>
                    ) : (
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-red-300/40 bg-red-500/15 text-red-200">
                        <TriangleAlert className="h-7 w-7" />
                      </span>
                    )}
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-white">{resultNotice.text}</p>
                  {resultNotice.type === 'success' ? (
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
            ) : (
              <div className="modal-scroll min-h-0 overflow-y-auto pr-1 sm:pr-2">
                <button
                  onClick={handleModalClose}
                  className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center text-gray-300 transition-colors lg:hover:text-white sm:top-4 sm:right-4"
                  aria-label={MODAL_TEXT.closeModalAria}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className={`flex justify-center ${isPersonalTopic ? 'mb-3 sm:mb-4' : 'mb-4 sm:mb-6'}`}>
                  <div className="inline-flex px-4 py-2 sm:px-5 sm:py-3">
                    <img
                      src={MODAL_ASSETS.logo}
                      alt="Логотип Ultra Pro Gym & Fitness"
                      loading="lazy"
                      decoding="async"
                      className="h-7 w-auto object-contain brightness-0 invert sm:h-9"
                    />
                  </div>
                </div>

                <BalancedHeading
                  as="h2"
                  className={`text-center text-lg font-bold text-white sm:text-2xl ${
                    isPersonalTopic ? 'mb-4 sm:mb-5' : 'mb-5 sm:mb-8'
                  }`}
                >
                  {MODAL_TEXT.title}
                </BalancedHeading>

                <form onSubmit={handleSubmit} className={isPersonalTopic ? 'space-y-2.5 sm:space-y-3' : 'space-y-3 sm:space-y-4'}>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder={MODAL_TEXT.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
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
                      onChange={(e) => {
                        const nextPhone = formatRussianPhone(e.target.value);
                        setFormData({ ...formData, phone: nextPhone });
                        if (formError) setFormError(null);
                      }}
                      className={FORM_FIELD_CLASS}
                    />
                  </div>

                  <div>
                    <Select
                      value={formData.topic || undefined}
                      onValueChange={(nextTopic) => {
                        setFormData({
                          ...formData,
                          topic: nextTopic,
                          trainer: nextTopic === 'personal' ? formData.trainer : '',
                        });
                        if (formError) setFormError(null);
                      }}
                    >
                      <SelectTrigger
                        aria-label={MODAL_TEXT.topicAriaLabel}
                        className="w-full h-auto min-h-[3rem] rounded-2xl border-white/10 bg-white/[0.04] px-4 py-3 text-white data-[placeholder]:text-gray-500 focus-visible:ring-0 focus-visible:border-white/25 [&_svg]:mr-1 [&>[data-slot=select-value]]:max-w-[calc(100%-1.75rem)] [&>[data-slot=select-value]]:truncate [&>[data-slot=select-value]]:text-left"
                      >
                        <SelectValue
                          placeholder={MODAL_TEXT.topicPlaceholder}
                          className="data-[placeholder]:text-gray-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="z-[140] border-white/15 bg-[#111117] text-white max-h-72">
                        {TOPIC_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-white focus:bg-white/10 focus:text-white"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.topic === 'personal' ? (
                    <div>
                      <Select
                        value={formData.trainer || undefined}
                        onValueChange={(nextTrainer) => {
                          setFormData({
                            ...formData,
                            trainer: nextTrainer,
                          });
                          if (formError) setFormError(null);
                        }}
                      >
                        <SelectTrigger
                          aria-label={MODAL_TEXT.trainerAriaLabel}
                          className="w-full h-auto min-h-[3rem] rounded-2xl border-white/10 bg-white/[0.04] px-4 py-3 text-white data-[placeholder]:text-gray-500 focus-visible:ring-0 focus-visible:border-white/25 [&_svg]:mr-1 [&>[data-slot=select-value]]:max-w-[calc(100%-1.75rem)] [&>[data-slot=select-value]]:truncate [&>[data-slot=select-value]]:text-left"
                        >
                          <SelectValue
                            placeholder={MODAL_TEXT.trainerPlaceholder}
                            className="data-[placeholder]:text-gray-500"
                          />
                        </SelectTrigger>
                        <SelectContent className="z-[140] border-white/15 bg-[#111117] text-white max-h-72">
                          {TRAINER_OPTIONS.map((trainer) => (
                            <SelectItem
                              key={trainer.value}
                              value={trainer.value}
                              className="text-white focus:bg-white/10 focus:text-white"
                            >
                              {trainer.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}

                  <div>
                    <textarea
                      placeholder={MODAL_TEXT.messagePlaceholder}
                      value={formData.question}
                      onChange={(e) => {
                        setFormData({ ...formData, question: e.target.value });
                        if (formError) setFormError(null);
                      }}
                      rows={isPersonalTopic ? 2 : 3}
                      className={`${FORM_FIELD_CLASS} resize-none ${isPersonalTopic ? 'min-h-[4.5rem] sm:min-h-[5rem]' : 'min-h-24 sm:min-h-28'}`}
                    />
                  </div>

                  <label className={`flex items-start gap-3 text-xs text-gray-300 sm:text-sm ${isPersonalTopic ? '' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isConsentAccepted}
                      onChange={(e) => {
                        setIsConsentAccepted(e.target.checked);
                        if (formError) setFormError(null);
                      }}
                      className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent accent-[#F5B800]"
                    />
                    <span>
                      {MODAL_TEXT.consentPrefix}{' '}
                      <button
                        type="button"
                        onClick={() => setActiveDocument('consent')}
                        className="text-white underline underline-offset-4 transition-colors lg:hover:text-gray-200"
                      >
                        {MODAL_TEXT.consentLink}
                      </button>{' '}
                      {MODAL_TEXT.consentMiddle}{' '}
                      <button
                        type="button"
                        onClick={() => setActiveDocument('privacy')}
                        className="text-white underline underline-offset-4 transition-colors lg:hover:text-gray-200"
                      >
                        {MODAL_TEXT.privacyLink}
                      </button>
                      .
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
                    className="btn-primary w-full text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#F5B800]" />
                        {MODAL_TEXT.submitLoading}
                      </span>
                    ) : (
                      MODAL_TEXT.submitDefault
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <LegalDocumentModal
        isOpen={activeDocument !== null}
        onClose={() => setActiveDocument(null)}
        closeAriaLabel={MODAL_TEXT.closeDocumentAria}
        maxWidthClassName="max-w-2xl"
      >
        <Suspense fallback={<p className="text-sm text-gray-300">{DOCUMENT_FALLBACK_TEXT}</p>}>
          {activeDocument === 'privacy' ? (
            <PrivacyPolicyContent
              titleClassName="mb-4 pr-10 text-xl font-semibold text-white"
              textClassName="text-sm text-gray-300"
            />
          ) : null}
          {activeDocument === 'consent' ? (
            <PersonalDataConsentContent
              titleClassName="mb-4 pr-10 text-xl font-semibold text-white"
              textClassName="text-sm text-gray-300"
            />
          ) : null}
        </Suspense>
      </LegalDocumentModal>
    </>
  );
}
