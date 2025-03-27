'use client';

import React, { Suspense } from 'react';
import { HydrationBoundary, DehydratedState } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import MedicineDetailView from '@/components/medicine/MedicineDetailView';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export interface MedicineDetailClientProps {
  dehydratedState: DehydratedState;
}

const MedicineDetailClient: React.FC<MedicineDetailClientProps> = ({ dehydratedState }) => {
  const params = useParams();
  const medicineId = params?.id as string;

  return (
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary>
            <MedicineDetailView medicineId={medicineId} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
  );
};

export default MedicineDetailClient;