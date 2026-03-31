import { Suspense, lazy } from 'react';
import { SectionFallback } from '@/components/SectionFallback';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';

const Abonements = lazy(() => import('@/sections/Abonements'));

interface MembershipsPageProps {
  onOpenModal: (topic?: string | unknown, trainer?: string | unknown) => void;
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
