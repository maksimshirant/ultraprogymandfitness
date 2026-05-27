import { Suspense, lazy } from 'react';
import { SectionFallback } from '@/shared/ui/SectionFallback';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';
import type { OpenModalHandler } from '@/features/lead-request/model/types';

const GroupTrainings = lazy(() => import('@/widgets/group-trainings/ui/GroupTrainings'));

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
