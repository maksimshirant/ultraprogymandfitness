import { Suspense, lazy, useEffect, useRef, useState } from 'react';
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
  avif: `${import.meta.env.BASE_URL}frost-bg.avif`,
  webp: `${import.meta.env.BASE_URL}frost-bg.webp`,
  png: `${import.meta.env.BASE_URL}frost-bg.png`,
  avifSrcSet: [
    `${import.meta.env.BASE_URL}frost-bg-w480.avif 480w`,
    `${import.meta.env.BASE_URL}frost-bg-w768.avif 768w`,
    `${import.meta.env.BASE_URL}frost-bg-w1024.avif 1024w`,
    `${import.meta.env.BASE_URL}frost-bg-w1280.avif 1280w`,
    `${import.meta.env.BASE_URL}frost-bg.avif 1881w`,
  ].join(', '),
  webpSrcSet: [
    `${import.meta.env.BASE_URL}frost-bg-w480.webp 480w`,
    `${import.meta.env.BASE_URL}frost-bg-w768.webp 768w`,
    `${import.meta.env.BASE_URL}frost-bg-w1024.webp 1024w`,
    `${import.meta.env.BASE_URL}frost-bg-w1280.webp 1280w`,
    `${import.meta.env.BASE_URL}frost-bg.webp 1881w`,
  ].join(', '),
} as const;

function App() {
  const { pathname } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPrefilledTopic, setModalPrefilledTopic] = useState('');
  const [modalPrefilledTrainer, setModalPrefilledTrainer] = useState('');
  const [shouldRenderFrostBackground, setShouldRenderFrostBackground] = useState(pathname !== '/');
  const frostLayerRef = useRef<HTMLDivElement | null>(null);
  const frostTintLayerRef = useRef<HTMLDivElement | null>(null);
  const frostOpacityRef = useRef(pathname !== '/' ? 1 : 0);
  const hasRenderedFrostBackgroundRef = useRef(pathname !== '/');
  const opacityFrameRef = useRef<number | null>(null);
  const renderFrameRef = useRef<number | null>(null);
  const initialFrostOpacity = pathname !== '/' ? 1 : 0;
  const initialFrostTintOpacity = pathname !== '/' ? 0.3 : 0;

  useEffect(() => {
    syncStructuredData(pathname);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (opacityFrameRef.current !== null) {
        cancelAnimationFrame(opacityFrameRef.current);
      }

      if (renderFrameRef.current !== null) {
        cancelAnimationFrame(renderFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!shouldRenderFrostBackground) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const currentOpacity = frostOpacityRef.current;

      if (frostLayerRef.current) {
        frostLayerRef.current.style.opacity = `${currentOpacity}`;
      }

      if (frostTintLayerRef.current) {
        frostTintLayerRef.current.style.opacity = `${currentOpacity * 0.3}`;
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [shouldRenderFrostBackground]);

  useEffect(() => {
    const mountFrostBackground = () => {
      if (hasRenderedFrostBackgroundRef.current) {
        return;
      }

      hasRenderedFrostBackgroundRef.current = true;

      if (renderFrameRef.current !== null) {
        return;
      }

      renderFrameRef.current = requestAnimationFrame(() => {
        renderFrameRef.current = null;
        setShouldRenderFrostBackground(true);
      });
    };

    const commitFrostOpacity = (nextOpacity: number) => {
      frostOpacityRef.current = nextOpacity;

      if (opacityFrameRef.current !== null) {
        cancelAnimationFrame(opacityFrameRef.current);
      }

      opacityFrameRef.current = requestAnimationFrame(() => {
        opacityFrameRef.current = null;
        const frostLayer = frostLayerRef.current;
        const frostTintLayer = frostTintLayerRef.current;

        if (frostLayer) {
          frostLayer.style.opacity = `${nextOpacity}`;
        }

        if (frostTintLayer) {
          frostTintLayer.style.opacity = `${nextOpacity * 0.3}`;
        }
      });
    };

    if (pathname !== '/') {
      mountFrostBackground();
      commitFrostOpacity(1);
      return;
    }

    let viewportFrameId: number | null = null;

    const updateHomeBackgroundOpacity = () => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      const fadeStart = viewportHeight * 0.55;
      const fadeEnd = viewportHeight * 1.05;
      const progress = (window.scrollY - fadeStart) / Math.max(fadeEnd - fadeStart, 1);
      const nextOpacity = Math.max(0, Math.min(progress, 1));

      if (nextOpacity > 0.01) {
        mountFrostBackground();
      }

      if (hasRenderedFrostBackgroundRef.current) {
        commitFrostOpacity(nextOpacity);
      } else {
        frostOpacityRef.current = nextOpacity;
      }
    };

    const scheduleViewportUpdate = () => {
      if (viewportFrameId !== null) {
        return;
      }

      viewportFrameId = requestAnimationFrame(() => {
        viewportFrameId = null;
        updateHomeBackgroundOpacity();
      });
    };

    updateHomeBackgroundOpacity();
    window.addEventListener('scroll', scheduleViewportUpdate, { passive: true });
    window.addEventListener('resize', scheduleViewportUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleViewportUpdate);
      window.removeEventListener('resize', scheduleViewportUpdate);

      if (viewportFrameId !== null) {
        cancelAnimationFrame(viewportFrameId);
      }
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

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        {shouldRenderFrostBackground ? (
          <div
            ref={frostLayerRef}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: initialFrostOpacity }}
          >
            <picture className="block h-full w-full">
              <source
                type="image/avif"
                srcSet={FROST_BACKGROUND.avifSrcSet}
                sizes="100vw"
              />
              <source
                type="image/webp"
                srcSet={FROST_BACKGROUND.webpSrcSet}
                sizes="100vw"
              />
              <img
                src={FROST_BACKGROUND.png}
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            </picture>
          </div>
        ) : null}
        <div
          ref={frostTintLayerRef}
          className="absolute inset-0 bg-[#05060a] transition-opacity duration-700 ease-out"
          style={{ opacity: initialFrostTintOpacity }}
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
