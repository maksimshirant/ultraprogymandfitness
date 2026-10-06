export interface ModalAnnouncement {
  label: string;
  title: string;
  message: readonly string[];
  closeButtonLabel: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledTopic?: string;
  prefilledMembershipId?: number;
  prefilledTrainer?: string;
  prefilledGroupDirection?: string;
  prefilledGroupRecommendation?: boolean;
  announcement?: ModalAnnouncement;
}

export type FlowStep = 'root' | 'membership' | 'personal' | 'group' | 'contact';

export type FlowSelection = {
  topic: string;
  membershipId?: number;
  trainer: string;
  groupDirection: string;
  wantsGroupRecommendation: boolean;
};

export type ResultNotice = {
  type: 'success' | 'error';
  text: string;
};

export type ScrollIndicatorState = {
  top: number;
  height: number;
  visible: boolean;
};

export type ContactFormData = {
  name: string;
  phone: string;
  question: string;
};
