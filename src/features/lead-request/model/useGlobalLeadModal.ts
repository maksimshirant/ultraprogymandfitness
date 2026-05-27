import { useState } from 'react';
import type { OpenModalRequest } from '@/features/lead-request/model/types';

const ALLOWED_MODAL_TOPICS = new Set([
  'membership',
  'sub_1m',
  'sub_3m',
  'sub_6m',
  'sub_12m',
  'sub_12m_day',
  'sub_once',
  'free_trial',
  'personal',
  'group',
  'massage',
  'fight',
  'cycle',
  'other',
]);

// Keeps the global lead modal prefill state normalized before rendering the feature UI.
export function useGlobalLeadModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPrefilledTopic, setModalPrefilledTopic] = useState('');
  const [modalPrefilledMembershipId, setModalPrefilledMembershipId] = useState<number | undefined>(undefined);
  const [modalPrefilledTrainer, setModalPrefilledTrainer] = useState('');
  const [modalPrefilledGroupDirection, setModalPrefilledGroupDirection] = useState('');
  const [modalPrefilledGroupRecommendation, setModalPrefilledGroupRecommendation] = useState(false);

  const openModal = (request: OpenModalRequest = {}) => {
    const normalizedTopic =
      typeof request.topic === 'string' && ALLOWED_MODAL_TOPICS.has(request.topic)
        ? request.topic
        : '';
    const normalizedMembershipId =
      typeof request.membershipId === 'number' && Number.isFinite(request.membershipId)
        ? request.membershipId
        : undefined;
    const normalizedTrainer =
      normalizedTopic === 'personal' && typeof request.trainer === 'string' ? request.trainer : '';
    const normalizedGroupDirection =
      normalizedTopic === 'group' && typeof request.groupDirection === 'string'
        ? request.groupDirection
        : '';
    const normalizedGroupRecommendation =
      normalizedTopic === 'group' && request.groupRecommendation === true && !normalizedGroupDirection;

    setModalPrefilledTopic(normalizedTopic);
    setModalPrefilledMembershipId(normalizedMembershipId);
    setModalPrefilledTrainer(normalizedTrainer);
    setModalPrefilledGroupDirection(normalizedGroupDirection);
    setModalPrefilledGroupRecommendation(normalizedGroupRecommendation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalPrefilledTopic('');
    setModalPrefilledMembershipId(undefined);
    setModalPrefilledTrainer('');
    setModalPrefilledGroupDirection('');
    setModalPrefilledGroupRecommendation(false);
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    modalPrefilledTopic,
    modalPrefilledMembershipId,
    modalPrefilledTrainer,
    modalPrefilledGroupDirection,
    modalPrefilledGroupRecommendation,
  };
}
