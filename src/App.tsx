import { Suspense, lazy, useEffect, useState } from 'react';
import Header from './sections/Header';
import Hero from './sections/Hero';
import { getSectionIdFromPathname } from '@/navigation/sectionRoutes';


const Flors = lazy(() => import('./sections/Flors'));
const Timetable = lazy(() => import('./sections/Timetable'));
const Personal = lazy(() => import('./sections/Personal'));
const Abonements = lazy(() => import('./sections/Abonements'));
const TryFree = lazy(() => import('./sections/TryFree'));
const FAQ = lazy(() => import('./sections/FAQ'));
const Footer = lazy(() => import('./sections/Footer'));
const Modal = lazy(() => import('./sections/Modal'));
const VideoModal = lazy(() => import('./sections/VideoModal'));

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

const SECTION_SCROLL_OFFSET = 96;
const SECTION_SCROLL_RETRY_LIMIT = 25;
const SECTION_SCROLL_RETRY_DELAY = 120;

function SectionFallback() {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-48 rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse" />
      </div>
    </section>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [modalPrefilledTopic, setModalPrefilledTopic] = useState('');
  const [modalPrefilledTrainer, setModalPrefilledTrainer] = useState('');

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

  useEffect(() => {
    const sectionFromPath = getSectionIdFromPathname(window.location.pathname);
    const sectionFromHash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
    const targetId = sectionFromPath ?? sectionFromHash;

    if (!targetId) {
      return;
    }

    const targetHash = `#${targetId}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${targetHash}`);
    }

    const scrollToTarget = (attempt = 0) => {
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        if (attempt < SECTION_SCROLL_RETRY_LIMIT) {
          window.setTimeout(() => scrollToTarget(attempt + 1), SECTION_SCROLL_RETRY_DELAY);
        }
        return;
      }

      const targetTop =
        targetElement.getBoundingClientRect().top + window.pageYOffset - SECTION_SCROLL_OFFSET;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: 'smooth',
      });
    };

    scrollToTarget();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <Header onOpenModal={openModal} />
      <main>
        <Hero onOpenModal={openModal} />
        <Suspense fallback={<SectionFallback />}>
          <Flors />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Timetable />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Personal onOpenModal={openModal} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Abonements onOpenModal={openModal} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <TryFree onOpenModal={openModal} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FAQ />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer onOpenModal={openModal} />
      </Suspense>
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
      {isVideoOpen ? (
        <Suspense fallback={null}>
          <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
        </Suspense>
      ) : null}
    </div>
  );
}

export default App;
