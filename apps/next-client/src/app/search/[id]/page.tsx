import React from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { fetchMedicineDetails } from '@/utils/medicineApi';
import MedicineDetailClient from './MedicineDetailClient';

async function getMedicineDetails(id: string) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['medicineDetails', id],
    queryFn: () => fetchMedicineDetails(id),
  });
  return dehydrate(queryClient);
}

export default async function MedicineDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const medicineId = Array.isArray(id) ? id[0] : id;
  const dehydratedState = await getMedicineDetails(medicineId);

  return (
    <MedicineDetailClient medicineId={medicineId} dehydratedState={dehydratedState} />
  );
}