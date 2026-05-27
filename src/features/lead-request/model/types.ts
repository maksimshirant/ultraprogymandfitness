export interface OpenModalRequest {
  topic?: string;
  membershipId?: number;
  trainer?: string;
  groupDirection?: string;
  groupRecommendation?: boolean;
}

export type OpenModalHandler = (request?: OpenModalRequest) => void;

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
