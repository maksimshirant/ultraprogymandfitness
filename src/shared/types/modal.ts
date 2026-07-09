export interface OpenModalRequest {
  topic?: string;
  membershipId?: number;
  trainer?: string;
  groupDirection?: string;
  groupRecommendation?: boolean;
}

export type OpenModalHandler = (request?: OpenModalRequest) => void;
