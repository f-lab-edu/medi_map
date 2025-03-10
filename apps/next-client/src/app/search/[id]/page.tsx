'use client';

import React, { Suspense } from 'react';
import '@/styles/pages/search/search.scss';
import MedicineDetailView from '@/components/medicine/MedicineDetailView';

export default function MedicineDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const medicineId = Array.isArray(id) ? id[0] : id;

  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <MedicineDetailView medicineId={medicineId} />
    </Suspense>
  );
}