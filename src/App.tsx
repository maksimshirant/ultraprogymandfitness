import { Suspense, lazy, useState } from 'react';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Stats from './sections/Stats';

const Profit = lazy(() => import('./sections/Profit'));
const Flors = lazy(() => import('./sections/Flors'));
const Timetable = lazy(() => import('./sections/Timetable'));
const Personal = lazy(() => import('./sections/Personal'));
const Abonements = lazy(() => import('./sections/Abonements'));
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
  'personal',
  'group',
  'massage',
  'fight',
  'cycle',
  'other',
]);

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

  const openModal = (topic?: string | unknown) => {
    const normalizedTopic =
      typeof topic === 'string' && ALLOWED_MODAL_TOPICS.has(topic) ? topic : '';
    setModalPrefilledTopic(normalizedTopic);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalPrefilledTopic('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <Header onOpenModal={openModal} />
      <main>
        <Hero onOpenModal={openModal} />
        <Stats />
        <Suspense fallback={<SectionFallback />}>
          <Profit />
        </Suspense>
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
          <FAQ />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer onOpenModal={openModal} />
      </Suspense>
      {isModalOpen ? (
        <Suspense fallback={null}>
          <Modal
            key={modalPrefilledTopic || 'default-modal-topic'}
            isOpen={isModalOpen}
            onClose={closeModal}
            prefilledTopic={modalPrefilledTopic}
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
