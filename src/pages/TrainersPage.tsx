import { Suspense, lazy } from 'react';
import { SectionFallback } from '@/components/SectionFallback';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';

const Personal = lazy(() => import('@/sections/Personal'));

interface TrainersPageProps {
  onOpenModal: (topic?: string | unknown, trainer?: string | unknown) => void;
}

export default function TrainersPage({ onOpenModal }: TrainersPageProps) {
  return (
    <>
      <Seo {...pageSeo.trainers} />
      <Suspense fallback={<SectionFallback />}>
        <Personal onOpenModal={onOpenModal} />
      </Suspense>
    </>
  );
}
