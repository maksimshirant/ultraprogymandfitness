import { getMembershipById, getMembershipByTopic, memberships } from '@/entities/membership/model/memberships';
import type { FlowSelection, FlowStep } from '@/features/lead-request/model/types';

export const RU_PHONE_MASK = '+7 (___) ___-__-__';
const RU_PHONE_REGEX = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

const membershipTopics = new Set(memberships.map((membership) => membership.topicValue));

// Formats free-form input into the Russian phone mask used by the lead form.
export const formatRussianPhone = (raw: string) => {
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

// Validates the masked phone string before the lead request is sent.
export const isValidRussianPhone = (phone: string) => RU_PHONE_REGEX.test(phone);

// Keeps an autosized textarea aligned with its current content.
export const syncTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
  if (!textarea) {
    return;
  }

  textarea.style.height = '0px';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

// Creates a clean contact form value object when the modal opens or resets.
export const createInitialFormData = () => ({
  name: '',
  phone: '',
  question: '',
});

// Creates an empty scenario selection without leaking UI defaults into callers.
export const createEmptySelection = (): FlowSelection => ({
  topic: '',
  membershipId: undefined,
  trainer: '',
  groupDirection: '',
  wantsGroupRecommendation: false,
});

export const isMembershipTopic = (topic: string) =>
  membershipTopics.has(topic as (typeof memberships)[number]['topicValue']);

// Resolves external modal prefill props into the first visible flow step and selected values.
export const resolveInitialState = (
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
