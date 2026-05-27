import { Suspense, lazy, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from '@/app/router/AppRoutes';
import { FrostBackground } from '@/app/ui/FrostBackground';
import { useGlobalLeadModal } from '@/features/lead-request/model/useGlobalLeadModal';
import Announcement from '@/widgets/site-layout/ui/Announcement';
import { syncStructuredData } from '@/seo/structuredData';

const Modal = lazy(() => import('@/features/lead-request/ui/LeadRequestModal'));

function App() {
  const { pathname } = useLocation();
  const {
    isModalOpen,
    openModal,
    closeModal,
    modalPrefilledTopic,
    modalPrefilledMembershipId,
    modalPrefilledTrainer,
    modalPrefilledGroupDirection,
    modalPrefilledGroupRecommendation,
  } = useGlobalLeadModal();

  useEffect(() => {
    syncStructuredData(pathname);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <FrostBackground pathname={pathname} />

      <div className="relative z-10">
        <AppRoutes onOpenModal={openModal} />
        <Announcement isBlocked={isModalOpen} />
      </div>

      {isModalOpen ? (
        <Suspense fallback={null}>
          <Modal
            key={`${modalPrefilledTopic || 'default-modal-topic'}-${modalPrefilledMembershipId ?? 'default-modal-membership'}-${modalPrefilledTrainer || 'default-modal-trainer'}-${modalPrefilledGroupDirection || 'default-modal-group-direction'}-${modalPrefilledGroupRecommendation ? 'group-recommendation' : 'default-group-recommendation'}`}
            isOpen={isModalOpen}
            onClose={closeModal}
            prefilledTopic={modalPrefilledTopic}
            prefilledMembershipId={modalPrefilledMembershipId}
            prefilledTrainer={modalPrefilledTrainer}
            prefilledGroupDirection={modalPrefilledGroupDirection}
            prefilledGroupRecommendation={modalPrefilledGroupRecommendation}
          />
        </Suspense>
      ) : null}
    </div>
  );
}

export default App;
