import { Suspense, lazy } from 'react';
import { SectionFallback } from '@/components/SectionFallback';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';
import type { OpenModalHandler } from '@/types/modal';

const Personal = lazy(() => import('@/sections/Personal'));

interface TrainersPageProps {
  onOpenModal: OpenModalHandler;
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
