import { Suspense, lazy, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Announcement from './sections/Announcement';
import AppRoutes from '@/router/AppRoutes';
import { syncStructuredData } from '@/seo/structuredData';

const ALLOWED_MODAL_TOPICS = new Set([
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

const Modal = lazy(() => import('./sections/Modal'));

const FROST_BACKGROUND = {
  avif: `${import.meta.env.BASE_URL}фонмороз.avif`,
  webp: `${import.meta.env.BASE_URL}фонмороз.webp`,
  png: `${import.meta.env.BASE_URL}фонмороз.png`,
} as const;

function App() {
  const { pathname } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPrefilledTopic, setModalPrefilledTopic] = useState('');
  const [modalPrefilledTrainer, setModalPrefilledTrainer] = useState('');
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);

  useEffect(() => {
    syncStructuredData(pathname);
  }, [pathname]);

  useEffect(() => {
    const updateBackgroundOpacity = () => {
      if (pathname !== '/') {
        setBackgroundOpacity(1);
        return;
      }

      const viewportHeight = Math.max(window.innerHeight, 1);
      const fadeStart = viewportHeight * 0.55;
      const fadeEnd = viewportHeight * 1.05;
      const progress = (window.scrollY - fadeStart) / Math.max(fadeEnd - fadeStart, 1);
      const nextOpacity = Math.max(0, Math.min(progress, 1));

      setBackgroundOpacity(nextOpacity);
    };

    updateBackgroundOpacity();
    window.addEventListener('scroll', updateBackgroundOpacity, { passive: true });
    window.addEventListener('resize', updateBackgroundOpacity);

    return () => {
      window.removeEventListener('scroll', updateBackgroundOpacity);
      window.removeEventListener('resize', updateBackgroundOpacity);
    };
  }, [pathname]);

  const openModal = (topic?: string | unknown, trainer?: string | unknown) => {
    const normalizedTopic =
      typeof topic === 'string' && ALLOWED_MODAL_TOPICS.has(topic) ? topic : '';
    const normalizedTrainer =
      normalizedTopic === 'personal' && typeof trainer === 'string' ? trainer : '';
    setModalPrefilledTopic(normalizedTopic);
    setModalPrefilledTrainer(normalizedTrainer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalPrefilledTopic('');
    setModalPrefilledTrainer('');
  };

  const shouldRenderFrostBackground = pathname !== '/' || backgroundOpacity > 0.01;

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        {shouldRenderFrostBackground ? (
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: backgroundOpacity }}
          >
            <picture>
              <source srcSet={FROST_BACKGROUND.avif} type="image/avif" />
              <source srcSet={FROST_BACKGROUND.webp} type="image/webp" />
              <img
                src={FROST_BACKGROUND.png}
                alt=""
                aria-hidden="true"
                decoding="async"
                loading="eager"
                className="h-full w-full object-cover object-center"
              />
            </picture>
          </div>
        ) : null}
        <div
          className="absolute inset-0 bg-[#05060a] transition-opacity duration-700 ease-out"
          style={{ opacity: backgroundOpacity * 0.3 }}
        />
      </div>

      <div className="relative z-10">
        <AppRoutes onOpenModal={openModal} />
        <Announcement isBlocked={isModalOpen} />
      </div>

      {isModalOpen ? (
        <Suspense fallback={null}>
          <Modal
            key={`${modalPrefilledTopic || 'default-modal-topic'}-${modalPrefilledTrainer || 'default-modal-trainer'}`}
            isOpen={isModalOpen}
            onClose={closeModal}
            prefilledTopic={modalPrefilledTopic}
            prefilledTrainer={modalPrefilledTrainer}
          />
        </Suspense>
      ) : null}
    </div>
  );
}

export default App;
