import { Suspense, lazy } from 'react';
import { SectionFallback } from '@/shared/ui/SectionFallback';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';
import type { OpenModalHandler } from '@/features/lead-request/model/types';

const Abonements = lazy(() => import('@/widgets/memberships/ui/Abonements'));

interface MembershipsPageProps {
  onOpenModal: OpenModalHandler;
}

export default function MembershipsPage({ onOpenModal }: MembershipsPageProps) {
  return (
    <>
      <Seo {...pageSeo.memberships} />
      <Suspense fallback={<SectionFallback />}>
        <Abonements onOpenModal={onOpenModal} />
      </Suspense>
    </>
  );
}
