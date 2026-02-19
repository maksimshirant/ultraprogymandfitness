import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { CircleCheck, Loader2, TriangleAlert, X } from 'lucide-react';
import { sendForm } from '@/api/forms';
import { BalancedHeading } from '@/components/typography/BalancedHeading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PrivacyPolicyContent = lazy(async () => {
  const module = await import('@/components/PrivacyPolicyContent');
  return { default: module.PrivacyPolicyContent };
});

const OfferAgreementContent = lazy(async () => {
  const module = await import('@/components/OfferAgreementContent');
  return { default: module.OfferAgreementContent };
});

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledTopic?: string;
  prefilledTrainer?: string;
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
  privacyPrefix: 'Я соглашаюсь с',
  privacyLink: 'Политикой конфиденциальности',
  offerLink: 'Договором офферты',
  submitDefault: 'Отправить',
  submitLoading: 'Отправляем заявку...',
  success: 'Форма отправлена, с вами свяжутся.',
  successHint: 'Окно закроется автоматически.',
  returnToForm: 'Вернуться к форме',
  errorFallback: 'Произошла ошибка, попробуйте позже.',
  errorPrivacy: 'Подтвердите согласие с политикой конфиденциальности.',
  errorPhone: 'Введите номер в формате +7 (999) 999-99-99.',
  errorTopic: 'Выберите тему обращения.',
  errorTrainer: 'Выберите тренера.',
  phoneTitle: 'Формат: +7 (999) 999-99-99',
  messageFallback: 'Заявка без дополнительного комментария',
  mailSubject: 'Новая заявка с сайта Ultra Pro Gym & Fitness',
  mailFromName: 'Ultra Pro Gym & Fitness',
  mailLabelName: 'Имя',
  mailLabelPhone: 'Телефон',
  mailLabelTopic: 'Тема',
  mailLabelTrainer: 'Тренер',
  mailLabelMessage: 'Сообщение',
  closeModalAria: 'Закрыть',
  closePolicyAria: 'Закрыть политику',
  closeOfferAria: 'Закрыть договор офферты',
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
  { value: 'Гузей Александр', label: 'Гузей Александр' },
  { value: 'Белявский Антон', label: 'Белявский Антон' },
  { value: 'Нешпор Анжелика', label: 'Нешпор Анжелика' },
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

const DOCUMENT_FALLBACK_TEXT = 'Загрузка документа...';
const createInitialFormData = (topic = '', trainer = '') => ({
  name: '',
  phone: '',
  topic,
  trainer,
  question: '',
});

export default function Modal({
  isOpen,
  onClose,
  prefilledTopic = '',
  prefilledTrainer = '',
}: ModalProps) {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(prefilledTopic, prefilledTopic === 'personal' ? prefilledTrainer : '')
  );
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resultNotice, setResultNotice] = useState<ResultNotice | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const resetForm = (clearResult = true) => {
    setFormData(createInitialFormData());
    setIsPrivacyAccepted(false);
    setFormError(null);
    if (clearResult) setResultNotice(null);
  };

  const handleModalClose = () => {
    clearCloseTimer();
    setIsSubmitting(false);
    setFormError(null);
    setResultNotice(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPrivacyAccepted) {
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
      const payload = new FormData();
      const selectedTopic =
        TOPIC_OPTIONS.find((topic) => topic.value === formData.topic)?.label ?? formData.topic;
      const selectedTrainer =
        TRAINER_OPTIONS.find((trainer) => trainer.value === formData.trainer)?.label ?? formData.trainer;
      const messageText = [
        `${MODAL_TEXT.mailLabelName}: ${formData.name.trim()}`,
        `${MODAL_TEXT.mailLabelPhone}: ${formData.phone.trim()}`,
        `${MODAL_TEXT.mailLabelTopic}: ${selectedTopic}`,
        ...(selectedTrainer ? [`${MODAL_TEXT.mailLabelTrainer}: ${selectedTrainer}`] : []),
        `${MODAL_TEXT.mailLabelMessage}: ${formData.question.trim() || MODAL_TEXT.messageFallback}`,
      ].join('\n');

      payload.append('name', formData.name.trim());
      payload.append('phone', formData.phone.trim());
      payload.append('topic', selectedTopic);
      payload.append('trainer', selectedTrainer);
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
    setIsPrivacyAccepted(false);
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={resultNotice ? undefined : handleModalClose}
        />

        <div className="relative w-full max-w-md mx-4">
          <div className={`glass-card modal-surface relative ${resultNotice ? 'p-0' : 'p-8'}`}>
            {resultNotice ? (
              <div className="flex h-[70vh] min-h-[420px] max-h-[560px] w-full items-center justify-center px-8 py-10 text-center">
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
                      className="mt-6 w-full rounded-full border border-transparent bg-white px-6 py-3 text-sm font-semibold text-black transition-colors lg:hover:bg-[#F5B800]"
                    >
                      {MODAL_TEXT.returnToForm}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={handleModalClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 lg:hover:text-white transition-colors"
                  aria-label={MODAL_TEXT.closeModalAria}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex justify-center mb-6">
                  <img
                    src={MODAL_ASSETS.logo}
                    alt="Логотип Ultra Pro Gym & Fitness"
                    loading="lazy"
                    decoding="async"
                    className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
                  />
                </div>

                <BalancedHeading as="h2" className="text-1xl font-bold text-white text-center mb-8">
                  {MODAL_TEXT.title}
                </BalancedHeading>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B800] transition-colors"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B800] transition-colors"
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
                        className="w-full h-auto min-h-[3rem] rounded-xl border-white/10 bg-white/5 px-4 py-3 text-white data-[placeholder]:text-gray-500 focus-visible:ring-0 focus-visible:border-[#F5B800] [&_svg]:mr-1 [&>[data-slot=select-value]]:max-w-[calc(100%-1.75rem)] [&>[data-slot=select-value]]:truncate [&>[data-slot=select-value]]:text-left"
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
                          className="w-full h-auto min-h-[3rem] rounded-xl border-white/10 bg-white/5 px-4 py-3 text-white data-[placeholder]:text-gray-500 focus-visible:ring-0 focus-visible:border-[#F5B800] [&_svg]:mr-1 [&>[data-slot=select-value]]:max-w-[calc(100%-1.75rem)] [&>[data-slot=select-value]]:truncate [&>[data-slot=select-value]]:text-left"
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
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B800] transition-colors resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-3 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={isPrivacyAccepted}
                      onChange={(e) => {
                        setIsPrivacyAccepted(e.target.checked);
                        if (formError) setFormError(null);
                      }}
                      className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent accent-[#F5B800]"
                    />
                    <span>
                      {MODAL_TEXT.privacyPrefix}{' '}
                      <button
                        type="button"
                        onClick={() => setIsPrivacyOpen(true)}
                        className="text-[#F5B800] underline lg:hover:text-[#FFD247] transition-colors"
                      >
                        {MODAL_TEXT.privacyLink}
                      </button>
                      {' и '}
                      <button
                        type="button"
                        onClick={() => setIsOfferOpen(true)}
                        className="text-[#F5B800] underline lg:hover:text-[#FFD247] transition-colors"
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
                    className="w-full py-3 font-semibold rounded-full border border-transparent bg-white text-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed lg:hover:bg-[#F5B800]"
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
              </>
            )}
          </div>
        </div>
      </div>

      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsPrivacyOpen(false)}
          />

          <div className="relative w-full max-w-2xl mx-4 glass-card modal-surface p-6">
            <button
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 lg:hover:text-white transition-colors"
              aria-label={MODAL_TEXT.closePolicyAria}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <Suspense fallback={<p className="text-sm text-gray-300">{DOCUMENT_FALLBACK_TEXT}</p>}>
                <PrivacyPolicyContent
                  titleClassName="text-xl font-semibold text-white pr-10 mb-4"
                  textClassName="text-sm text-gray-300"
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {isOfferOpen && (
        <div className="fixed inset-0 z-[111] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsOfferOpen(false)}
          />

          <div className="relative w-full max-w-2xl mx-4 glass-card modal-surface p-6">
            <button
              onClick={() => setIsOfferOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 lg:hover:text-white transition-colors"
              aria-label={MODAL_TEXT.closeOfferAria}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <Suspense fallback={<p className="text-sm text-gray-300">{DOCUMENT_FALLBACK_TEXT}</p>}>
                <OfferAgreementContent
                  titleClassName="text-xl font-semibold text-white pr-10 mb-4"
                  textClassName="text-sm text-gray-300"
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
