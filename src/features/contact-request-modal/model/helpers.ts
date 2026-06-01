import { getMembershipById, getMembershipByTopic, memberships } from '@/content/memberships';
import type { ContactFormData, FlowSelection, FlowStep } from '@/features/contact-request-modal/model/types';

const RU_PHONE_REGEX = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const membershipTopics = new Set(memberships.map((membership) => membership.topicValue));

export const formatRussianPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  const normalized = digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
  const national = normalized.startsWith('7') ? normalized.slice(1, 11) : normalized.slice(0, 10);

  let formatted = '+7';
  if (national.length > 0) formatted += ` (${national.slice(0, 3)}`;
  if (national.length >= 3) formatted += ')';
  if (national.length > 3) formatted += ` ${national.slice(3, 6)}`;
  if (national.length > 6) formatted += `-${national.slice(6, 8)}`;
  if (national.length > 8) formatted += `-${national.slice(8, 10)}`;

  return formatted;
};

export const isValidRussianPhone = (phone: string) => RU_PHONE_REGEX.test(phone);

export const syncTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
  if (!textarea) return;
  textarea.style.height = '0px';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

export const createInitialFormData = (): ContactFormData => ({
  name: '',
  phone: '',
  question: '',
});

export const createEmptySelection = (): FlowSelection => ({
  topic: '',
  membershipId: undefined,
  trainer: '',
  groupDirection: '',
  wantsGroupRecommendation: false,
});

export const isMembershipTopic = (topic: string) =>
  membershipTopics.has(topic as (typeof memberships)[number]['topicValue']);

export const resolveInitialState = (
  prefilledTopic = '',
  prefilledMembershipId?: number,
  prefilledTrainer = '',
  prefilledGroupDirection = '',
  prefilledGroupRecommendation = false
): { step: FlowStep; entryStep: FlowStep; selection: FlowSelection } => {
  const selection = createEmptySelection();
  const normalizedTopic = prefilledTopic.trim();

  if (normalizedTopic === 'membership') {
    return { step: 'membership', entryStep: 'membership', selection };
  }

  if (isMembershipTopic(normalizedTopic)) {
    const membership = getMembershipById(prefilledMembershipId) ?? getMembershipByTopic(normalizedTopic);
    return {
      step: 'contact',
      entryStep: 'contact',
      selection: { ...selection, topic: membership?.topicValue ?? normalizedTopic, membershipId: membership?.id },
    };
  }

  if (normalizedTopic === 'personal') {
    const nextStep: FlowStep = prefilledTrainer ? 'contact' : 'personal';
    return { step: nextStep, entryStep: nextStep, selection: { ...selection, topic: 'personal', trainer: prefilledTrainer } };
  }

  if (normalizedTopic === 'group') {
    if (prefilledGroupRecommendation && !prefilledGroupDirection) {
      return { step: 'contact', entryStep: 'contact', selection: { ...selection, topic: 'group', wantsGroupRecommendation: true } };
    }

    const nextStep: FlowStep = prefilledGroupDirection ? 'contact' : 'group';
    return {
      step: nextStep,
      entryStep: nextStep,
      selection: { ...selection, topic: 'group', groupDirection: prefilledGroupDirection },
    };
  }

  if (normalizedTopic === 'free_trial' || normalizedTopic === 'other') {
    return { step: 'contact', entryStep: 'contact', selection: { ...selection, topic: normalizedTopic } };
  }

  return { step: 'root', entryStep: 'root', selection };
};
