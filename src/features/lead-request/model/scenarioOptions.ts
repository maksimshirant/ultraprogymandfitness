import { CreditCard, MessageSquareText, Sparkles, UserRound, Users, type LucideIcon } from 'lucide-react';

export type LeadScenarioId = 'membership' | 'personal' | 'group' | 'free_trial' | 'other';

export type LeadScenarioOption = {
  id: LeadScenarioId;
  title: string;
  mobileTitle: string;
  icon: LucideIcon;
};

export const ROOT_PRIMARY_OPTIONS = [
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
] as const satisfies readonly LeadScenarioOption[];

export const ROOT_SECONDARY_OPTIONS = [
  {
    id: 'other',
    title: 'Другой вопрос',
    mobileTitle: 'Другой вопрос',
    icon: MessageSquareText,
  },
] as const satisfies readonly LeadScenarioOption[];
