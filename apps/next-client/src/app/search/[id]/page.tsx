import React from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { fetchMedicineDetails } from '@/utils/medicineApi';
import MedicineDetailClient from '@/components/medicineDetail/MedicineDetailClient';

async function getMedicineDetails(medicineId: string) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['medicineDetails', medicineId],
    queryFn: () => fetchMedicineDetails(medicineId),
  });
  return dehydrate(queryClient);
}

export default async function MedicineDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const dehydratedState = await getMedicineDetails(id);

  return (
    <MedicineDetailClient dehydratedState={dehydratedState} />
  );
}