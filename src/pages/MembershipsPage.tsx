import { Suspense, lazy } from 'react';
import { SectionFallback } from '@/components/SectionFallback';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';
import type { OpenModalHandler } from '@/types/modal';

const Abonements = lazy(() => import('@/sections/Abonements'));

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
