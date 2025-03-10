'use client';

import React, { Suspense } from 'react';
import { HydrationBoundary, QueryClient, QueryClientProvider, DehydratedState } from '@tanstack/react-query';
import MedicineDetailView from '@/components/medicine/MedicineDetailView';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export interface MedicineDetailClientProps {
  medicineId: string;
  dehydratedState: DehydratedState;
}

const queryClient = new QueryClient();

const MedicineDetailClient: React.FC<MedicineDetailClientProps> = ({ medicineId, dehydratedState }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<p>로딩 중...</p>}>
          <ErrorBoundary>
            <MedicineDetailView medicineId={medicineId} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </QueryClientProvider>
  );
};

export default MedicineDetailClient;