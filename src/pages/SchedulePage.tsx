import { Suspense, lazy } from 'react';
import { SectionFallback } from '@/components/SectionFallback';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';

const Timetable = lazy(() => import('@/sections/Timetable'));

export default function SchedulePage() {
  return (
    <>
      <Seo {...pageSeo.schedule} />
      <Suspense fallback={<SectionFallback />}>
        <Timetable />
      </Suspense>
    </>
  );
}
