import { Suspense, lazy } from 'react';
import { SectionFallback } from '@/shared/ui/SectionFallback';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';
import type { OpenModalHandler } from '@/features/lead-request/model/types';

const Personal = lazy(() => import('@/widgets/trainers/ui/Personal'));

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
