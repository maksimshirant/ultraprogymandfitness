import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageFallback } from '@/shared/ui/PageFallback';
import MainLayout from '@/app/layouts/MainLayout';
import type { OpenModalHandler } from '@/features/lead-request/model/types';

const HomePage = lazy(() => import('@/pages/HomePage'));
const SchedulePage = lazy(() => import('@/pages/SchedulePage'));
const TrainersPage = lazy(() => import('@/pages/TrainersPage'));
const MembershipsPage = lazy(() => import('@/pages/MembershipsPage'));
const ContactsPage = lazy(() => import('@/pages/ContactsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

interface AppRoutesProps {
  onOpenModal: OpenModalHandler;
}

export default function AppRoutes({ onOpenModal }: AppRoutesProps) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<MainLayout onOpenModal={onOpenModal} />}>
          <Route path="/" element={<HomePage onOpenModal={onOpenModal} />} />
          <Route path="/schedule" element={<SchedulePage onOpenModal={onOpenModal} />} />
          <Route path="/trainers" element={<TrainersPage onOpenModal={onOpenModal} />} />
          <Route path="/memberships" element={<MembershipsPage onOpenModal={onOpenModal} />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
