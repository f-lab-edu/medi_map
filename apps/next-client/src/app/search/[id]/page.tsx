import React from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { fetchMedicineDetails } from '@/utils/medicineApi';
import { checkFavoriteApi } from '@/utils/medicineFavorites';
import MedicineDetailClient from '@/components/medicineDetail/MedicineDetailClient';

async function getMedicineDetails(medicineId: string) {
  const queryClient = new QueryClient();
  
  // 약품 상세 정보 조회
  await queryClient.prefetchQuery({
    queryKey: ['medicineDetails', medicineId],
    queryFn: () => fetchMedicineDetails(medicineId),
  });

  // 즐겨찾기 상태 조회
  await queryClient.prefetchQuery({
    queryKey: ['favoriteStatus', medicineId],
    queryFn: () => checkFavoriteApi(medicineId),
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