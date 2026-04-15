import { Suspense, lazy } from 'react';
import { SectionFallback } from '@/components/SectionFallback';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';
import type { OpenModalHandler } from '@/types/modal';

const GroupTrainings = lazy(() => import('@/sections/GroupTrainings'));

interface SchedulePageProps {
  onOpenModal: OpenModalHandler;
}

export default function SchedulePage({ onOpenModal }: SchedulePageProps) {
  return (
    <>
      <Seo {...pageSeo.schedule} />
      <Suspense fallback={<SectionFallback />}>
        <GroupTrainings onOpenModal={onOpenModal} />
      </Suspense>
    </>
  );
}
