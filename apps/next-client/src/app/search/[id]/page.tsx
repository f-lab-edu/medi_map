'use client';

import React, { useEffect, useState } from 'react';
import { dehydrate, HydrationBoundary, QueryClient, DehydratedState } from '@tanstack/react-query';
import '@/styles/pages/search/search.scss';
import { fetchMedicineDetails } from '@/utils/medicineApi';
import MedicineDetailView from '@/components/medicine/MedicineDetailView';

export default function MedicineDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const medicineId = Array.isArray(id) ? id[0] : id;

  const [dehydratedState, setDehydratedState] = useState<DehydratedState | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const queryClient = new QueryClient();
      await queryClient.prefetchQuery({
        queryKey: ['medicineDetails', medicineId],
        queryFn: () => fetchMedicineDetails(medicineId),
      });
      setDehydratedState(dehydrate(queryClient));
    };

    fetchData();
  }, [medicineId]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MedicineDetailView medicineId={medicineId} />
    </HydrationBoundary>
  );
}